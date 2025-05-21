import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
type ProductoDetalle = {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  };
  
  type Devolucion = {
    id: number;
    fecha: string;
    clientaId: number;
    notas: string;
    productos: ProductoDetalle[];
  };
  

function VerDevoluciones(){
    const [devoluciones, setDevolucion] = useState<Devolucion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/devoluciones")
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    setError("La API respondió con un error.");
                    console.error("Error en la respuesta de la API:", data.errors);
                    setDevolucion([]);
                    setLoading(false);
                    return;
                }
    
                setDevolucion(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener devoluciones:", error);
                setError("No se pudo obtener las devoluciones.");
                setLoading(false);
            });
    }, []); 

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return(
        <>
            <div style={{
                margin: "3%",
            }}>
                <h1 style={{color: "white"}}>Filtrar Devoluciones</h1>
                <div style={{
                    backgroundColor: "#2E2E2E",
                    height: "2px",
                }}></div>
                <div style={{
                    marginTop: "1%"
                }}>
                    <label style={{
                        color: "white"
                    }}>Fecha: </label>
                    <input 
                        type="date"
                    />
                </div>
            </div>
            {devoluciones.map((devolucion) => (
                <div key={devolucion.id}
                    style={{
                        backgroundColor: "#222222",
                        borderColor: "#2E2E2E",
                        color: "white",
                        padding: "2%",
                        margin: "3%",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >
                    <p> Fecha | {devolucion.fecha}</p>
                    <Link to={"/devoluciondetalles"}>
                        <button>Ver Devolucion</button>
                    </Link>
                </div>

            ))}

        </>

    );


}
export default VerDevoluciones;


  
