package models

import (
	"fmt"

	"github.com/marielaquintanarr/go-rest-api/src/database"
)

type ProductoPedido struct {
	Nombre   string  `json:"nombre"`
	Precio   float64 `json:"precio"`
	Cantidad int     `json:"cantidad"`
	Subtotal float64 `json:"subtotal"`
}
type PedidoProducto struct {
	Nombre   string  `json:"nombre"`
	Precio   float64 `json:"precio"`
	Cantidad int     `json:"cantidad"`
	Subtotal float64 `json:"subtotal"`
}

type PedidoSimple struct {
	Fecha     string           `json:"fecha"`
	Notas     string           `json:"notas"`
	Total     float64          `json:"total"`
	Productos []PedidoProducto `json:"productos"`
}

type PedidoCliente struct {
	NombreCliente   string         `json:"nombre_cliente"`
	ApellidoCliente string         `json:"apellido_cliente"`
	Pedidos         []PedidoSimple `json:"pedidos"`
}

type Pedido2 struct {
	Fecha     string     `json:"fecha"`
	Notas     string     `json:"notas"`
	Total     float64    `json:"total"`
	Productos []Producto `json:"productos"`
}

type Pedido3 struct {
	Id        int        `json:"id"`
	Fecha     string     `json:"fecha"`
	Notas     string     `json:"notas"`
	Total     float64    `json:"total"`
	Productos []Producto `json:"productos"`
}

type Pedido4 struct {
	Id        int               `json:"id"`
	Fecha     string            `json:"fecha"`
	ClientaId int               `json:"clientaId"`
	Total     float64           `json:"total"`
	Notas     string            `json:"notas"`
	Productos []ProductoDetalle `json:"productos"`
}

type Pedido struct {
	Id        int               `json:"id"`
	Fecha     string            `json:"fecha"`
	ClientaId int               `json:"clientaId"`
	Total     float64           `json:"total"`
	Notas     string            `json:"notas"`
	Productos []ProductoDetalle `json:"productos"`
}

type ProductoDetalle struct {
	Id         int     `json:"id"`
	PedidoId   int     `json:"pedidoId"`
	ProductoId int     `json:"productoId"`
	Cantidad   int     `json:"cantidad"`
	Subtotal   float64 `json:"subtotal"`
}

func InsertPedido(pedido Pedido) (Pedido, bool, error) {
	db := database.GetConnection()

	var pedidoId int
	err := db.QueryRow(`
		INSERT INTO PEDIDO2 (fecha, clientaId, total, notas)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, pedido.Fecha, pedido.ClientaId, pedido.Total, pedido.Notas).Scan(&pedidoId)

	if err != nil {
		fmt.Println("Error al insertar pedido:", err)
		return Pedido{}, false, err
	}

	for _, producto := range pedido.Productos {
		_, err := db.Exec(`
			INSERT INTO PEDIDO_DETALLE (pedidoId, productoId, cantidad, subtotal)
			VALUES ($1, $2, $3, $4)
		`, pedidoId, producto.ProductoId, producto.Cantidad, producto.Subtotal)

		if err != nil {
			fmt.Println("Error al insertar producto en detalle:", err)
			return Pedido{}, false, err
		}
	}

	pedido.Id = pedidoId
	return pedido, true, nil
}

func GetPedido() ([]Pedido, bool) {
	db := database.GetConnection()

	// 1. Obtener todos los pedidos
	rows, err := db.Query("SELECT id, fecha, clientaId, total, notas FROM PEDIDO2")
	if err != nil {
		return nil, false
	}
	defer rows.Close()

	var pedidos []Pedido

	for rows.Next() {
		var pedido Pedido
		err := rows.Scan(&pedido.Id, &pedido.Fecha, &pedido.ClientaId, &pedido.Total, &pedido.Notas)
		if err != nil {
			return nil, false
		}

		// 2. Obtener los detalles del pedido
		detalleRows, err := db.Query(`
			SELECT productoId, cantidad, subtotal
			FROM PEDIDO_DETALLE
			WHERE pedidoId = $1
		`, pedido.Id)

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

		pedido.Productos = detalles
		pedidos = append(pedidos, pedido)
	}

	return pedidos, true
}

func DeletePedido(id int) ([]Pedido, bool) {
	db := database.GetConnection()

	// eliminar detalles
	_, err := db.Exec(`
		DELETE FROM PEDIDO_DETALLE WHERE pedidoId = $1
	`, id)

	if err != nil {
		fmt.Println("Error al eliminar detalles del pedido:", err)
		return nil, false
	}

	_, err = db.Exec(`
		DELETE FROM pedido2 WHERE id = $1
	`, id)

	if err != nil {
		fmt.Println("Error al eliminar el pedido:", err)
		return nil, false
	}

	// Obtener lista actualizada de pedidos
	rows, err := db.Query(`
		SELECT id, fecha, clientaId, total, notas
		FROM pedido2
	`)
	if err != nil {
		fmt.Println("Error al recuperar pedidos:", err)
		return nil, false
	}
	defer rows.Close()

	var pedidos []Pedido
	for rows.Next() {
		var p Pedido
		err := rows.Scan(&p.Id, &p.Fecha, &p.ClientaId, &p.Total, &p.Notas)
		if err != nil {
			return nil, false
		}
		pedidos = append(pedidos, p)
	}

	return pedidos, true

}

func UpdatePedido(pedido Pedido) (Pedido, bool, error) {
	db := database.GetConnection()

	// actualizar pedido
	_, err := db.Exec(`
		UPDATE PEDIDO2
		SET fecha = $1, clientaId = $2, total = $3, notas = $4
		WHERE id = $5
	`, pedido.Fecha, pedido.ClientaId, pedido.Total, pedido.Notas, pedido.Id)

	if err != nil {
		fmt.Println("Error al actualizar pedido:", err)
		return Pedido{}, false, err
	}

	// eliminar detalles de pedido
	_, err = db.Exec(`
		DELETE FROM PEDIDO_DETALLE
		WHERE pedidoId = $1
	`, pedido.Id)

	if err != nil {
		fmt.Println("Error al eliminar detalles del pedido:", err)
		return Pedido{}, false, err
	}

	// insertar detalles
	for _, producto := range pedido.Productos {
		_, err := db.Exec(`
			INSERT INTO PEDIDO_DETALLE (pedidoId, productoId, cantidad, subtotal)
			VALUES ($1, $2, $3, $4)
		`, pedido.Id, producto.ProductoId, producto.Cantidad, producto.Subtotal)

		if err != nil {
			fmt.Println("Error al insertar producto en detalle:", err)
			return Pedido{}, false, err
		}
	}

	return pedido, true, nil
}

// pedidos por id
func GetPedidobyPedidoId(id int) (PedidoCliente, bool) {
	db := database.GetConnection()

	rows, err := db.Query(`
		select c.nombre, c.apellido, pd.cantidad, p2.nombre, p2.precio, pd.cantidad*p2.precio as total, p.notas  from pedido2 p 
		join pedido_detalle pd 
		on pd.pedidoid = p.id
		join clientas c 
		on c.id = p.clientaid
		join producto p2 
		on p2.id = pd.productoid
		where p.id = $1
	`, id)
	if err != nil {
		fmt.Println("Error en query:", err)
		return PedidoCliente{}, false
	}
	defer rows.Close()

	var cliente PedidoCliente
	pedidosMap := make(map[string]*PedidoSimple)

	for rows.Next() {
		var nombre, apellido, productoNombre, notas, fecha string
		var total, precio, subtotal float64
		var cantidad int

		err := rows.Scan(&nombre, &apellido, &cantidad, &nombre, &precio, &total, &notas)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}

		if cliente.NombreCliente == "" {
			cliente.NombreCliente = nombre
			cliente.ApellidoCliente = apellido
		}

		pedido, exists := pedidosMap[fecha]
		if !exists {
			pedido = &PedidoSimple{
				Fecha: fecha,
				Notas: notas,
				Total: total,
			}
			pedidosMap[fecha] = pedido
		}

		pedido.Productos = append(pedido.Productos, PedidoProducto{
			Nombre:   productoNombre,
			Precio:   precio,
			Cantidad: cantidad,
			Subtotal: subtotal,
		})
	}

	if len(pedidosMap) == 0 {
		return PedidoCliente{}, false
	}

	for _, pedido := range pedidosMap {
		cliente.Pedidos = append(cliente.Pedidos, *pedido)
	}

	return cliente, true
}

// fechas pedidos por id clientas
func GetFechaPedidobyClientaId(clientaId int) (PedidoCliente, bool) {
	db := database.GetConnection()

	rows, err := db.Query(`
		SELECT p.fecha
		FROM pedido2 p
		JOIN pedido_detalle pd ON pd.pedidoid = p.id
		JOIN clientas c ON c.id = p.clientaid
		JOIN producto p2 ON p2.id = pd.productoid
		WHERE c.id = $1
		ORDER BY p.fecha;
	`, clientaId)
	if err != nil {
		fmt.Println("Error en query:", err)
		return PedidoCliente{}, false
	}
	defer rows.Close()

	var cliente PedidoCliente
	pedidosMap := make(map[string]*PedidoSimple)

	for rows.Next() {
		var nombre, apellido, productoNombre, notas, fecha string
		var total, precio, subtotal float64
		var cantidad int

		err := rows.Scan(&fecha)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}

		if cliente.NombreCliente == "" {
			cliente.NombreCliente = nombre
			cliente.ApellidoCliente = apellido
		}

		pedido, exists := pedidosMap[fecha]
		if !exists {
			pedido = &PedidoSimple{
				Fecha: fecha,
				Notas: notas,
				Total: total,
			}
			pedidosMap[fecha] = pedido
		}

		pedido.Productos = append(pedido.Productos, PedidoProducto{
			Nombre:   productoNombre,
			Precio:   precio,
			Cantidad: cantidad,
			Subtotal: subtotal,
		})
	}

	if len(pedidosMap) == 0 {
		return PedidoCliente{}, false
	}

	for _, pedido := range pedidosMap {
		cliente.Pedidos = append(cliente.Pedidos, *pedido)
	}

	return cliente, true
}

func GetPedidobyClienta(id int) ([]Pedido3, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha FROM PEDIDO2 where id = $1", id)
	if err != nil {
		return nil, false
	}
	defer rows.Close()

	var pedidos []Pedido3

	for rows.Next() {
		var pedido Pedido3
		err := rows.Scan(&pedido.Id, &pedido.Fecha)
		if err != nil {
			return nil, false
		}
		pedidos = append(pedidos, pedido)
	}

	return pedidos, true
}

func GetPedidobyId(id int) ([]Pedido3, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha FROM PEDIDO2 WHERE id = $1", id)
	if err != nil {
		fmt.Println("Error en query:", err)
		return []Pedido3{}, false
	}
	defer rows.Close()

	var pedidos []Pedido3

	for rows.Next() {
		var pedido Pedido3
		err := rows.Scan(&pedido.Id, &pedido.Fecha)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}
		pedidos = append(pedidos, pedido)
	}

	if len(pedidos) == 0 {
		fmt.Println("No se encontro el pedido con id:", id)
		return []Pedido3{}, false
	}

	return pedidos, true
}

func GetPedidosbyClientaId(id int) ([]Pedido3, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha FROM PEDIDO2 WHERE clientaid = $1", id)
	if err != nil {
		fmt.Println("Error en query:", err)
		return []Pedido3{}, false
	}
	defer rows.Close()

	var pedidos []Pedido3

	for rows.Next() {
		var pedido Pedido3
		err := rows.Scan(&pedido.Id, &pedido.Fecha)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}
		pedidos = append(pedidos, pedido)
	}

	if len(pedidos) == 0 {
		fmt.Println("No se encontro el pedido con la clienta clientaId:", id)
		return []Pedido3{}, false
	}

	return pedidos, true
}

func GetPedidoInfobyId(id int) ([]Pedido, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT id, fecha, clientaId, total, notas FROM PEDIDO2 where id = $1", id)
	if err != nil {
		return nil, false
	}
	defer rows.Close()

	var pedidos []Pedido

	for rows.Next() {
		var pedido Pedido
		err := rows.Scan(&pedido.Id, &pedido.Fecha, &pedido.ClientaId, &pedido.Total, &pedido.Notas)
		if err != nil {
			return nil, false
		}

		// 2. Obtener los detalles del pedido
		detalleRows, err := db.Query(`
			SELECT productoId, cantidad, subtotal
			FROM PEDIDO_DETALLE
			WHERE pedidoId = $1
		`, pedido.Id)

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

		pedido.Productos = detalles
		pedidos = append(pedidos, pedido)
	}

	return pedidos, true
}
