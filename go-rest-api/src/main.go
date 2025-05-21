package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/marielaquintanarr/go-rest-api/src/api"
)

func main() {
	port := "8080"

	router := mux.NewRouter()
	apiRouter := router.PathPrefix("/api/").Subrouter()
	apiRouter.HandleFunc("/getfechasbyclienta/{id}", api.GetFechabyClienta).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/clientas/crear", api.CreateClienta).Methods("POST", "OPTIONS")
	apiRouter.HandleFunc("/clientas", api.GetClienta).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/pedidos/crear", api.CreatePedido).Methods("POST", "OPTIONS")
	apiRouter.HandleFunc("/pedidos", api.GetPedidos).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/producto/crear", api.CreateProducto).Methods("POST", "OPTIONS")
	apiRouter.HandleFunc("/productos", api.GetProducto).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/devolucion/crear", api.CreateDevolucion).Methods("POST", "OPTIONS")
	apiRouter.HandleFunc("/devoluciones", api.GetDevoluciones).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/abono/crear", api.CreateAbonos).Methods("POST", "OPTIONS")
	apiRouter.HandleFunc("/pedidobyid/{id}", api.GetFechaPedidobyId).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/pedidofechabyclienta/{id}", api.GetFechaPedidobyClientas).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/nombrebyid/{id}", api.GetNombrebyClientas).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/fechabyid/{id}", api.GetFechaPedidobyId).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/getpedidoid/{id}", api.GetPedidosbyId).Methods("GET", "OPTIONS")
	apiRouter.HandleFunc("/eliminarpedido/{id}", api.DeletePedidoById).Methods("DELETE", "OPTIONS")
	apiRouter.HandleFunc("/actualizarpedido", api.UpdatePedidos).Methods("PUT", "OPTIONS")

	handlerWithCORS := api.EnableCORS(router)

	fmt.Printf("Server running on port %s\n", port)
	http.ListenAndServe(":"+port, handlerWithCORS)
}
