package models

import (
	"fmt"

	"github.com/marielaquintanarr/go-rest-api/src/database"
)

type Devolucion struct {
	Id        int               `json:"id"`
	Fecha     string            `json:"fecha"`
	ClientaId int               `json:"clientaId"`
	Total     float64           `json:"total"`
	Notas     string            `json:"notas"`
	Productos []ProductoDetalle `json:"productos"`
}

type DevolucionDetalle struct {
	Id           int     `json:"id"`
	DevolucionId int     `json:"pedidoId"`
	ProductoId   int     `json:"productoId"`
	Cantidad     int     `json:"cantidad"`
	Subtotal     float64 `json:"subtotal"`
}

// crear devolcuion
func InsertDevolucion(devolucion Devolucion) (Devolucion, bool, error) {
	db := database.GetConnection()

	var devolucionId int
	err := db.QueryRow(`
		INSERT INTO DEVOLUCION2 (fecha, clientaId, total, notas)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, devolucion.Fecha, devolucion.ClientaId, devolucion.Total, devolucion.Notas).Scan(&devolucionId)

	if err != nil {
		fmt.Println("Error al insertar devolucion:", err)
		return Devolucion{}, false, err
	}

	for _, producto := range devolucion.Productos {
		_, err := db.Exec(`
			INSERT INTO DEVOLUCION_DETALLE (devolucionId, productoId, cantidad, subtotal)
			VALUES ($1, $2, $3, $4)
		`, devolucionId, producto.ProductoId, producto.Cantidad, producto.Subtotal)

		if err != nil {
			fmt.Println("Error al insertar producto en detalle:", err)
			return Devolucion{}, false, err
		}
	}

	devolucion.Id = devolucionId
	return devolucion, true, nil
}

// obtener todas las devoluciones
func GetDevolucion() ([]Devolucion, bool) {
	db := database.GetConnection()

	// 1. Obtener todos los pedidos
	rows, err := db.Query("SELECT id, fecha, clientaId, total, notas FROM DEVOLUCION2")
	if err != nil {
		return nil, false
	}
	defer rows.Close()

	var devoluciones []Devolucion

	for rows.Next() {
		var devolucion Devolucion
		err := rows.Scan(&devolucion.Id, &devolucion.Fecha, &devolucion.ClientaId, &devolucion.Total, &devolucion.Notas)
		if err != nil {
			return nil, false
		}

		// Obtener detalles de la devolucion
		detalleRows, err := db.Query(`
			SELECT productoId, cantidad, subtotal
			FROM DEVOLUCION_DETALLE
			WHERE devolucionId = $1
		`, devolucion.Id)

		if err != nil {
			return nil, false
		}

		var detalles []ProductoDetalle
		for detalleRows.Next() {
			var detalle ProductoDetalle
			err := detalleRows.Scan(&detalle.ProductoId, &detalle.Cantidad, &detalle.Subtotal)
			if err != nil {
				detalleRows.Close()
				return nil, false
			}
			detalles = append(detalles, detalle)
		}
		detalleRows.Close()

		devolucion.Productos = detalles
		devoluciones = append(devoluciones, devolucion)
	}

	return devoluciones, true
}
