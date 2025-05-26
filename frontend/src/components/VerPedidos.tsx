import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import flecha from "../assets/flecha.webp";
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
    const { id: clientaId } = useParams();
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
                </div>
            </div>

            {pedidos.map((pedido) => (
            <div key={pedido.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#222222",
                    border: "2px solid #2E2E2E",
                    borderRadius: "20px",
                    color: "white",
                    marginLeft: "3%",
                    marginRight: "3%",
                    marginBottom: "1%"
                }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "10px",
                    marginLeft: "20px",

                }}>
                    <p style={{fontWeight: "100"}}> Fecha | {pedido.fecha.split("T")[0]}</p>
                </div>
                <Link style={{listStyle: "none"}} to={`/pedidoadmin/${pedido.id}`}>
                        <button style={{marginRight: "10px", padding: "10%", borderRadius: "10px", display: "flex", backgroundColor: "#D6ED6A", color: "black", border: "none"}}>Ver pedidos</button>
                </Link>
            </div>
            ))}

        </>

    );


}
export default VerPedidos;


  
