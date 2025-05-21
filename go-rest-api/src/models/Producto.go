package models

import (
	"database/sql"

	"github.com/marielaquintanarr/go-rest-api/src/database"
)

type Producto struct {
	Id     int     `json:"id"`
	Nombre string  `json:"nombre"`
	Precio float64 `json:"precio"`
}

// insertar
func InsertProducto(nombre string, precio float64) (Producto, bool) {
	db := database.GetConnection()

	var producto_id int
	err := db.QueryRow("INSERT INTO PRODUCTO(nombre, precio) VALUES ($1, $2) RETURNING id", nombre, precio).Scan(&producto_id)

	if err != nil {
		if err == sql.ErrNoRows {
			return Producto{}, false
		}
		return Producto{}, false
	}
	return Producto{producto_id, nombre, precio}, true
}

// ver todos
func GetProducto() ([]Producto, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT * FROM PRODUCTO")

	if err != nil {
		return []Producto{}, false
	}

	var productos []Producto
	var id int
	var nombre string
	var precio float64

	for rows.Next() {
		rows.Scan(&id, &nombre, &precio)
		productos = append(productos, Producto{id, nombre, precio})
	}

	return productos, true
}
