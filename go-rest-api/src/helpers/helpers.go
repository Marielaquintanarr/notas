package helpers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/marielaquintanarr/go-rest-api/src/models"
)

func DecodeBody(req *http.Request) (models.Clientas, bool) {
	var clientas models.Clientas
	err := json.NewDecoder(req.Body).Decode(&clientas)
	if err != nil {
		return models.Clientas{}, false
	}
	return clientas, true
}

func DecodeBodyPedido(r *http.Request) (models.Pedido, bool) {
	var pedido models.Pedido
	err := json.NewDecoder(r.Body).Decode(&pedido)
	if err != nil {
		return models.Pedido{}, false
	}
	return pedido, true
}

func DecodeBodyProducto(req *http.Request) (models.Producto, bool) {
	var productos models.Producto
	err := json.NewDecoder(req.Body).Decode(&productos)
	if err != nil {
		return models.Producto{}, false
	}
	return productos, true
}

func DecodeBodyDevolucion(req *http.Request) (models.Devolucion, bool) {
	var devoluciones models.Devolucion
	err := json.NewDecoder(req.Body).Decode(&devoluciones)
	if err != nil {
		return models.Devolucion{}, false
	}
	return devoluciones, true
}

func DecodeBodyAbono(req *http.Request) (models.Abono, bool) {
	var abonos models.Abono
	err := json.NewDecoder(req.Body).Decode(&abonos)
	if err != nil {
		return models.Abono{}, false
	}
	return abonos, true
}

func IsValidNombre(nombre string) bool {
	nom := strings.TrimSpace(nombre)
	if len(nom) == 0 {
		return false
	}
	return true
}

func IsValidApellido(apellido string) bool {
	apel := strings.TrimSpace(apellido)
	if len(apel) == 0 {
		return false
	}
	return true
}

func IsValidFecha(fecha string) bool {
	fec := strings.TrimSpace(fecha)
	if len(fec) == 0 {
		return false
	}
	return true
}
