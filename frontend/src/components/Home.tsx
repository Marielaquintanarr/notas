import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Clienta {
    id: number;
    nombre: string;
    apellido: string;
}
  
function ClientasList() {
    const [clientas, setClientas] = useState<Clienta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetch("http://localhost:8080/api/clientas")
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    setError("La API respondió con un error.");
                    console.error("Error en la respuesta de la API:", data.errors);
                    setClientas([]);
                    setLoading(false);
                    return;
                }
    
                setClientas(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener clientas:", error);
                setError("No se pudo obtener la lista de clientas.");
                setLoading(false);
            });
    }, []);    

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;


    return (
        <div>
            <div style={{
                marginLeft: "5%",
                marginRight: "5%",
                display: "flex",
                flexDirection: "column"
            }}>
                <h2 style={{color: "white", fontSize: "40px", padding: "none", margin: "none"}}>Clientas</h2>
                <div style={{
                    backgroundColor: "#2E2E2E",
                    height: "2px",
                }}></div>
            </div>
            <div style={{
                justifyContent: "right"
            }}>
                <Link to="/clientaform">
                    <button style={{

                    }}>Crear clienta</button>
                </Link> 
            </div>
            <div style={{
                display: "flex",
                paddingLeft: "10%", 
                paddingRight: "10%",
                paddingBottom: "3%",
                paddingTop: "3%",
                gap: "1%"
            }}>
                <input 
                    name="search"
                    type="text"
                    style={{
                        backgroundColor: "#5D5D5D",
                        borderColor: "white",
                        borderRadius: "10px",
                        height: "35px",
                        width: "100vw",
                        color: "white",
                        textAlign: "left",
                        padding: "1px"
                    }}
                ></input>
                <button style={{
                    borderRadius: "10px",
                    backgroundColor: "#D6ED6A",
                    border: "none"
                }}>search</button>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "30px", paddingLeft: "10%", paddingRight: "10%"}}>
                {clientas.map((clienta) => (
                    <div style={{
                        backgroundColor: "#222222",
                        borderColor: "#2E2E2E",
                        borderRadius: "20px",
                        color: "white",
                        display: "flex"

                    }} key={clienta.id}>
                        <div style={{ display: "flex",  alignItems: "center" }}>
                            <p>{clienta.nombre} {clienta.apellido}</p>
                            <button onClick={() => {
                                localStorage.setItem("clientaId", clienta.id.toString());
                            }}>
                                <Link to="/menuclienta">go</Link>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientasList;
