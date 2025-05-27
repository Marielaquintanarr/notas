package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/marielaquintanarr/go-rest-api/src/helpers"
	"github.com/marielaquintanarr/go-rest-api/src/models"
)

type Data struct {
	Success bool              `json:"success"`
	Data    []models.Clientas `json:"data"`
	Errors  []string          `json:"errors"`
}

type PedidosData struct {
	Success bool            `json:"success"`
	Data    []models.Pedido `json:"data"`
	Errors  []string        `json:"errors"`
}

type PedidosData3 struct {
	Success bool             `json:"success"`
	Data    []models.Pedido3 `json:"data"`
	Errors  []string         `json:"errors"`
}

type DevolucionData2 struct {
	Success bool                 `json:"success"`
	Data    []models.Devolucion2 `json:"data"`
	Errors  []string             `json:"errors"`
}
type PedidosData4 struct {
	Success bool             `json:"success"`
	Data    []models.Pedido4 `json:"data"`
	Errors  []string         `json:"errors"`
}

type PedidosData2 struct {
	Success bool                   `json:"success"`
	Data    []models.PedidoCliente `json:"data"`
	Errors  []string               `json:"errors"`
}

type ProductoData struct {
	Success bool              `json:"success"`
	Data    []models.Producto `json:"data"`
	Errors  []string          `json:"errors"`
}

type DevolucionData struct {
	Success bool                `json:"success"`
	Data    []models.Devolucion `json:"data"`
	Errors  []string            `json:"errors"`
}

type AbonoData struct {
	Success bool           `json:"success"`
	Data    []models.Abono `json:"data"`
	Errors  []string       `json:"errors"`
}

func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Permitir solo los orígenes específicos que necesitas
		if origin == "http://localhost:5173" || origin == "https://marielaquintanarr.github.io" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, DELETE, GET, PUT, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// clientas
func CreateClienta(w http.ResponseWriter, req *http.Request) {
	bodyClienta, success := helpers.DecodeBody(req)
	if success != true {
		http.Error(w, "could not decode body", http.StatusBadRequest)
		return
	}

	var data Data = Data{Errors: make([]string, 0)}
	bodyClienta.Nombre = strings.TrimSpace(bodyClienta.Nombre)
	bodyClienta.Apellido = strings.TrimSpace(bodyClienta.Apellido)

	if !helpers.IsValidNombre(bodyClienta.Nombre) {
		data.Success = false
		data.Errors = append(data.Errors, "nombre inválido")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	if !helpers.IsValidApellido(bodyClienta.Apellido) {
		data.Success = false
		data.Errors = append(data.Errors, "apellido inválido")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	clienta, success := models.Insert(bodyClienta.Nombre, bodyClienta.Apellido)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo crear la clienta")
	} else {
		data.Success = true
		data.Data = append(data.Data, clienta)
	}

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
	return
}

func GetClienta(w http.ResponseWriter, req *http.Request) {
	var data Data

	clientas, success := models.Get()
	if success != true {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las clientas")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = clientas

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)

}

// pedidos
func CreatePedido(w http.ResponseWriter, req *http.Request) {
	bodyPedido, success := helpers.DecodeBodyPedido(req)
	if !success {
		http.Error(w, "No se pudo decodificar el cuerpo del pedido", http.StatusBadRequest)
		return
	}

	var data PedidosData = PedidosData{Errors: make([]string, 0)}
	bodyPedido.Fecha = strings.TrimSpace(bodyPedido.Fecha)
	bodyPedido.Notas = strings.TrimSpace(bodyPedido.Notas)

	if !helpers.IsValidFecha(bodyPedido.Fecha) {
		data.Success = false
		data.Errors = append(data.Errors, "fecha inválida")
		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	pedido, success, err := models.InsertPedido(bodyPedido)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo crear el pedido")

		// Mostrar el error específico en consola y también en el JSON
		if err != nil {
			fmt.Println("ERROR:", err)
			data.Errors = append(data.Errors, err.Error())
		}
	} else {
		data.Success = true
		data.Data = append(data.Data, pedido)
	}

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func GetPedidos(w http.ResponseWriter, req *http.Request) {
	var data PedidosData

	pedidos, success := models.GetPedido()
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar los pedidos")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = pedidos

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func UpdatePedidos(w http.ResponseWriter, r *http.Request) {
	var pedido models.Pedido
	err := json.NewDecoder(r.Body).Decode(&pedido)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	pedidoActualizado, ok, err := models.UpdatePedido(pedido)
	if err != nil || !ok {
		http.Error(w, "Error al actualizar pedido", http.StatusInternalServerError)
		return
	}

	response := struct {
		Success bool          `json:"success"`
		Data    models.Pedido `json:"data"`
	}{
		Success: true,
		Data:    pedidoActualizado,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeletePedidoById(w http.ResponseWriter, req *http.Request) {
	var data PedidosData
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	pedidos, success := models.DeletePedido(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo eliminar el pedido")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = pedidos

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

// producto
func CreateProducto(w http.ResponseWriter, req *http.Request) {
	bodyProducto, success := helpers.DecodeBodyProducto(req)
	if success != true {
		http.Error(w, "could not decode body", http.StatusBadRequest)
		return
	}

	var data ProductoData = ProductoData{Errors: make([]string, 0)}
	bodyProducto.Nombre = strings.TrimSpace(bodyProducto.Nombre)

	if !helpers.IsValidNombre(bodyProducto.Nombre) {
		data.Success = false
		data.Errors = append(data.Errors, "nombre inválido")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	producto, success := models.InsertProducto(bodyProducto.Nombre, bodyProducto.Precio)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo crear el producto")
	} else {
		data.Success = true
		data.Data = append(data.Data, producto)
	}

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
	return
}

func GetProducto(w http.ResponseWriter, req *http.Request) {
	var data ProductoData
	productos, success := models.GetProducto()
	if success != true {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar los productos")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}
	data.Success = true
	data.Data = productos

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

// Devoluciones
func CreateDevolucion(w http.ResponseWriter, req *http.Request) {
	bodyDevolucion, success := helpers.DecodeBodyDevolucion(req)
	if !success {
		http.Error(w, "No se pudo decodificar el cuerpo de la devolucion", http.StatusBadRequest)
		return
	}

	var data DevolucionData = DevolucionData{Errors: make([]string, 0)}
	bodyDevolucion.Fecha = strings.TrimSpace(bodyDevolucion.Fecha)
	bodyDevolucion.Notas = strings.TrimSpace(bodyDevolucion.Notas)

	if !helpers.IsValidFecha(bodyDevolucion.Fecha) {
		data.Success = false
		data.Errors = append(data.Errors, "fecha inválida")
		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	devolucion, success, err := models.InsertDevolucion(bodyDevolucion)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo crear la devolucion")

		if err != nil {
			fmt.Println("ERROR:", err)
			data.Errors = append(data.Errors, err.Error())
		}
	} else {
		data.Success = true
		data.Data = append(data.Data, devolucion)
	}

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}
func GetDevoluciones(w http.ResponseWriter, req *http.Request) {
	var data DevolucionData

	devoluciones, success := models.GetDevoluciones()
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las devoluciones")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = devoluciones

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

// abonos
func CreateAbonos(w http.ResponseWriter, req *http.Request) {
	bodyAbono, success := helpers.DecodeBodyAbono(req)
	if success != true {
		http.Error(w, "could not decode body", http.StatusBadRequest)
		return
	}

	var data AbonoData = AbonoData{Errors: make([]string, 0)}
	bodyAbono.Fecha = strings.TrimSpace(bodyAbono.Fecha)

	if !helpers.IsValidFecha(bodyAbono.Fecha) {
		data.Success = false
		data.Errors = append(data.Errors, "fecha inválida")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	abono, success := models.InsertarAbono(bodyAbono.Fecha, bodyAbono.Monto, bodyAbono.Comentarios, bodyAbono.PedidoId)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo crear el producto")
	} else {
		data.Success = true
		data.Data = append(data.Data, abono)
	}

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
	return
}

func GetFechaPedidobyId(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data PedidosData3
	pedidos, success := models.GetPedidobyId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las fechas por id")

		jsonData, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
		return
	}

	data.Success = true
	data.Data = pedidos

	jsonData, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetFechaPedidobyClientas(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data PedidosData2
	pedidos, success := models.GetFechaPedidobyClientaId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar los abonos por id")

		jsonData, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
		return
	}

	data.Success = true
	data.Data = []models.PedidoCliente{pedidos}

	jsonData, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetNombrebyClientas(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data Data
	clientas, success := models.GetClientaById(id)

	if success != true {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las clientas")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = clientas

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func GetFechabyClienta(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data PedidosData3
	pedidos, success := models.GetPedidosbyClientaId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las fechas por id")

		jsonData, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
		return
	}

	data.Success = true
	data.Data = pedidos

	jsonData, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetPedidosbyId(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}
	var data PedidosData

	pedidos, success := models.GetPedidoInfobyId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar los pedidos")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = pedidos

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func GetFechaDevolucionbyId(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data DevolucionData2
	pedidos, success := models.GetDevolucionesbyClientaId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las fechas por id")

		jsonData, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
		return
	}

	data.Success = true
	data.Data = pedidos

	jsonData, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetDevolucionbyId(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}
	var data DevolucionData

	devoluciones, success := models.GetDevolucionInfobyId(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar las devoluciones")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = devoluciones

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func UpdateDevoluciones(w http.ResponseWriter, r *http.Request) {
	var devolucion models.Devolucion
	err := json.NewDecoder(r.Body).Decode(&devolucion)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	devolucionActualizada, ok, err := models.UpdateDevolucion(devolucion)
	if err != nil || !ok {
		http.Error(w, "Error al actualizar devolucion", http.StatusInternalServerError)
		return
	}

	response := struct {
		Success bool              `json:"success"`
		Data    models.Devolucion `json:"data"`
	}{
		Success: true,
		Data:    devolucionActualizada,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func DeleteDevolucionById(w http.ResponseWriter, req *http.Request) {
	var data DevolucionData
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	devoluciones, success := models.DeleteDevolucion(id)
	if !success {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudo eliminar la devolucion")

		json, _ := json.Marshal(data)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = devoluciones

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}

func GetProductosById(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var data ProductoData
	productos, success := models.GetProductobyId(id)

	if success != true {
		data.Success = false
		data.Errors = append(data.Errors, "no se pudieron cargar los productos por Id")

		json, _ := json.Marshal(data)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(json)
		return
	}

	data.Success = true
	data.Data = productos

	json, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(json)
}
