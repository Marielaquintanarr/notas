package models

import (
	"database/sql"

	"github.com/marielaquintanarr/go-rest-api/src/database"
)

type AbonoClienta struct {
	Id            int     `json:"id"`
	Fecha         string  `json:"fecha"`
	ClientaNombre string  `json:"clientaNombre"`
	ProductoId    int     `json:"productoId"`
	Abono         float64 `json:"abono"`
	Total         float64 `json:"total"`
	PedidoId      int     `json:"pedidoId"`
	DevolucionId  int     `json:"devolucionId"`
	Notas         string  `json:"notas"`
}

type Abono struct {
	Id          int     `json:"id"`
	Fecha       string  `json:"fecha"`
	Monto       float64 `json:"monto"`
	Comentarios string  `json:"comentarios"`
	PedidoId    int     `json:"pedidoId"`
}

// insertar
func InsertarAbono(fecha string, monto float64, comentarios string, pedidoId int) (Abono, bool) {
	db := database.GetConnection()

	var abono_id int
	err := db.QueryRow("INSERT INTO ABONOS2(fecha, monto, comentarios, pedidoId) VALUES ($1, $2, $3, $4) RETURNING id", fecha, monto, comentarios, pedidoId).Scan(&abono_id)

	if err != nil {
		if err == sql.ErrNoRows {
			return Abono{}, false
		}
		return Abono{}, false
	}
	return Abono{abono_id, fecha, monto, comentarios, pedidoId}, true
}
