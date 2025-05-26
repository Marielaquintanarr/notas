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

type Devolucion2 struct {
	Id        int        `json:"id"`
	Fecha     string     `json:"fecha"`
	Notas     string     `json:"notas"`
	Total     float64    `json:"total"`
	Productos []Producto `json:"productos"`
}

type DevolucionDetalle struct {
	Id           int     `json:"id"`
	DevolucionId int     `json:"pedidoId"`
	ProductoId   int     `json:"productoId"`
	Cantidad     int     `json:"cantidad"`
	Subtotal     float64 `json:"subtotal"`
}

// crear devolucion
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
func GetDevoluciones() ([]Devolucion, bool) {
	db := database.GetConnection()

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

// fechas
func GetDevolucionesbyClientaId(id int) ([]Devolucion2, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha FROM DEVOLUCION2 WHERE clientaid = $1", id)
	if err != nil {
		fmt.Println("Error en query:", err)
		return []Devolucion2{}, false
	}
	defer rows.Close()

	var devoluciones []Devolucion2

	for rows.Next() {
		var devolucion Devolucion2
		err := rows.Scan(&devolucion.Id, &devolucion.Fecha)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}
		devoluciones = append(devoluciones, devolucion)
	}

	if len(devoluciones) == 0 {
		fmt.Println("No se encontro la devolucion con la clienta clientaId:", id)
		return []Devolucion2{}, false
	}

	return devoluciones, true
}

// pedido admin
func GetDevolucionInfobyId(id int) ([]Devolucion, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha, clientaId, total, notas FROM DEVOLUCION2 where id = $1", id)
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

func UpdateDevolucion(devolucion Devolucion) (Devolucion, bool, error) {
	db := database.GetConnection()

	// actualizar devolucion
	_, err := db.Exec(`
		UPDATE DEVOLUCION2
		SET fecha = $1, clientaId = $2, total = $3, notas = $4
		WHERE id = $5
	`, devolucion.Fecha, devolucion.ClientaId, devolucion.Total, devolucion.Notas, devolucion.Id)

	if err != nil {
		fmt.Println("Error al actualizar la devolución:", err)
		return Devolucion{}, false, err
	}

	// eliminar detalles de devolucion
	_, err = db.Exec(`
		DELETE FROM DEVOLUCION_DETALLE
		WHERE devolucionId = $1
	`, devolucion.Id)

	if err != nil {
		fmt.Println("Error al eliminar detalles de la devolucion:", err)
		return Devolucion{}, false, err
	}

	// insertar detalles
	for _, producto := range devolucion.Productos {
		_, err := db.Exec(`
			INSERT INTO DEVOLUCION_DETALLE (devolucionId, productoId, cantidad, subtotal)
			VALUES ($1, $2, $3, $4)
		`, devolucion.Id, producto.ProductoId, producto.Cantidad, producto.Subtotal)

		if err != nil {
			fmt.Println("Error al insertar producto en detalle:", err)
			return Devolucion{}, false, err
		}
	}

	return devolucion, true, nil
}

func DeleteDevolucion(id int) ([]Devolucion, bool) {
	db := database.GetConnection()

	// eliminar detalles
	_, err := db.Exec(`
		DELETE FROM DEVOLUCION_DETALLE WHERE devolucionId = $1
	`, id)

	if err != nil {
		fmt.Println("Error al eliminar detalles de la devolucion:", err)
		return nil, false
	}

	_, err = db.Exec(`
		DELETE FROM DEVOLUCION2 WHERE id = $1
	`, id)

	if err != nil {
		fmt.Println("Error al eliminar la devolucion:", err)
		return nil, false
	}

	// Obtener lista actualizada de pedidos
	rows, err := db.Query(`
		SELECT id, fecha, clientaId, total, notas
		FROM DEVOLUCION2
	`)
	if err != nil {
		fmt.Println("Error al recuperar devolucion:", err)
		return nil, false
	}
	defer rows.Close()

	var devoluciones []Devolucion
	for rows.Next() {
		var d Devolucion
		err := rows.Scan(&d.Id, &d.Fecha, &d.ClientaId, &d.Total, &d.Notas)
		if err != nil {
			return nil, false
		}
		devoluciones = append(devoluciones, d)
	}

	return devoluciones, true

}
