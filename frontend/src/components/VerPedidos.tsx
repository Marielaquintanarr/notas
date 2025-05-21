import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
const clientaId = localStorage.getItem("clientaId");

type ProductoDetalle = {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
};
  
type Pedido = {
    id: number;
    fecha: string;
    clientaId: number;
    notas: string;
    productos: ProductoDetalle[];
};

type Clienta = {
    id: number;
    nombre: string;
    apellido: string;
}
  
function VerPedidos(){
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [clienta, setClienta] = useState<Clienta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/getfechasbyclienta/${clientaId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    setError("La API respondió con un error.");
                    console.error("Error en la respuesta de la API:", data.errors);
                    setPedidos([]);
                    setLoading(false);
                    return;
                }
    
                setPedidos(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener pedidos:", error);
                setError("No se pudo obtener los pedidos.");
                setLoading(false);
            });
    }, []); 

    useEffect(() => {
            fetch(`http://localhost:8080/api/nombrebyid/${clientaId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.success) {
                        setError("La API respondió con un error.");
                        console.error("Error en la respuesta de la API:", data.errors);
                        setClienta(null);
                        setLoading(false);
                        return;
                    }
        
                    setClienta(data.data[0]);  
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error al obtener la clienta:", error);
                    setError("No se pudo obtener la clienta.");
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
                {clienta && (
                    <div>
                        <h1 style={{color: "white"}}>Filtrar Pedidos de {clienta.nombre} {clienta.apellido}</h1>
                    </div>
                )}
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
            
            {pedidos.map((pedido) => (
                <div key={pedido.id}
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
                    <p> Fecha | {pedido.fecha}</p>
                   <button onClick={() => {localStorage.setItem("pedidoId", pedido.id.toString());
                    }}>
                        <Link to="/pedidoadmin">go</Link>
                    </button>
                </div>
            ))}

        </>

    );


}
export default VerPedidos;


  
