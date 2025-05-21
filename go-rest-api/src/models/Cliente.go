package models

import (
	"database/sql"
	"fmt"

	"github.com/marielaquintanarr/go-rest-api/src/database"
)

type Clientas struct {
	Id       int    `json:"id"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
}

func Insert(nombre string, apellido string) (Clientas, bool) {
	db := database.GetConnection()

	var cliente_id int
	err := db.QueryRow("INSERT INTO clientas(nombre, apellido) VALUES($1, $2) RETURNING id", nombre, apellido).Scan(&cliente_id)

	if err != nil {
		if err == sql.ErrNoRows {
			return Clientas{}, false
		}
		return Clientas{}, false
	}

	return Clientas{cliente_id, nombre, apellido}, true
}

func Get() ([]Clientas, bool) {
	db := database.GetConnection()
	rows, err := db.Query("SELECT * FROM clientas")
	if err != nil {
		return nil, false
	}

	var clientas []Clientas
	var id int
	var nombre, apellido string

	for rows.Next() {
		rows.Scan(&id, &nombre, &apellido)
		clientas = append(clientas, Clientas{id, nombre, apellido})
	}

	return clientas, true
}

func GetClientaById(id int) ([]Clientas, bool) {
	db := database.GetConnection()

	rows, err := db.Query("SELECT nombre, apellido FROM clientas WHERE id = $1", id)
	if err != nil {
		fmt.Println("Error en query:", err)
		return []Clientas{}, false
	}
	defer rows.Close()

	var clientas []Clientas

	for rows.Next() {
		var clienta Clientas
		err := rows.Scan(&clienta.Nombre, &clienta.Apellido)
		if err != nil {
			fmt.Println("Error en Scan:", err)
			continue
		}
		clientas = append(clientas, clienta)
	}

	if len(clientas) == 0 {
		fmt.Println("No se encontro el nombre clientaId:", id)
		return []Clientas{}, false
	}

	return clientas, true
}
