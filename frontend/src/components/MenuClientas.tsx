import {Link} from "react-router-dom";
import React, { useEffect, useState } from "react";

type Clienta = {
    id: number;
    nombre: string;
    apellido: string;
}

const clientaId = localStorage.getItem("clientaId");

function MenuClientas() {
    const [clienta, setClienta] = useState<Clienta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    

    return(
        <>
            {clienta && (
            <div>
                <p style={{
                    color: "white"
                }}>{clienta.nombre} {clienta.apellido}</p>
            </div>
            )}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                padding: "10%",
                color: "white"
            }}>
                <div style={{
                    display: "flex",
                    backgroundColor: "#5D5D5D",
                    borderColor: "white",
                    borderRadius: "20px",
                    padding: "10px"
                }}>
                    <p>Ver Pedidos</p>       
                    <Link to={"/verpedidos"}>
                        <button>GO</button>
                    </Link>
                </div>
                <div style={{
                    display: "flex",
                    backgroundColor: "#5D5D5D",
                    borderColor: "white",
                    borderRadius: "20px",
                    padding: "10px"
                }}>
                    <p>Hacer Pedidos</p>
                    <Link to={"/crearpedido"}>
                        <button>GO</button>
                    </Link>
                </div>
                <div style={{
                    display: "flex",
                    backgroundColor: "#5D5D5D",
                    borderColor: "white",
                    borderRadius: "20px",
                    padding: "10px"
                }}>
                    <p>Ver Devoluciones</p>
                    <Link to={"/verdevoluciones"}>
                        <button>GO</button>
                    </Link>
                </div>
                <div style={{
                    display: "flex",
                    backgroundColor: "#5D5D5D",
                    borderColor: "white",
                    borderRadius: "20px",
                    padding: "10px"
                }}>
                    <p>Hacer Devoluciones</p>
                    <Link to={"/creardevolucion"}>
                        <button>GO</button>
                    </Link>
                </div>
            </div>

        </>
    )

}
export default MenuClientas;