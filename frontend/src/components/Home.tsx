import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/search-icon.webp";
import flecha from "../assets/flecha.webp";
import flecha2 from "../assets/flechaderecha.png";

interface Clienta {
    id: number;
    nombre: string;
    apellido: string;
}
  
function ClientasList() {
    const [filtro, setFiltro] = useState("");
    const [clientas, setClientas] = useState<Clienta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clientasFiltradas = clientas.filter((clienta) =>
        `${clienta.nombre} ${clienta.apellido}`.toLowerCase().includes(filtro.toLowerCase())
      );      


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
                display: "flex",
                marginRight: "5%",
                justifyContent: "flex-end",
                marginTop: "2%"
            }}>
                <Link to="/clientaform">
                    <button style={{
                        padding: "10%",
                        width: "180px",
                        backgroundColor: "#1C32FF",
                        borderRadius: "20px",
                        border: "none",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                    }}>Crear clienta <img src={flecha2} alt="flecha"></img></button>
                </Link> 
            </div>
            <div style={{
                display: "flex",
                paddingLeft: "10%", 
                paddingRight: "10%",
                paddingBottom: "3%",
                paddingTop: "2%",
                gap: "1%"
            }}>
                <button style={{
                    borderRadius: "10px",
                    backgroundColor: "#D6ED6A",
                    border: "none",
                    width: "5%"
                }}><img style={{
                    width: "50%"
                }} src={logo} alt="logo"></img> </button>
                <input 
                    name="search"
                    type="text"
                    placeholder="Buscar clienta"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{
                        backgroundColor: "#5D5D5D",
                        borderColor: "white",
                        borderRadius: "10px",
                        height: "35px",
                        width: "100vw",
                        color: "white",
                        textAlign: "left",
                        padding: "1%"
                    }}
                ></input>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "30px", paddingLeft: "10%", paddingRight: "10%"}}>
                {clientasFiltradas.map((clienta) => (
                    <div style={{
                        backgroundColor: "#222222",
                        borderColor: "#2E2E2E",
                        borderRadius: "20px",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",

                    }} key={clienta.id}>
                        <div style={{ display: "flex",  alignItems: "center" }}>
                            <div
                                style={{
                                    padding: "10%"
                                }}
                            ><p>{clienta.nombre} {clienta.apellido}</p>
                            </div>
                            <div
                                style={{
                                }}
                            >
                            <Link to={`/menuclienta/${clienta.id}`}>
                                <button style={{
                                    padding: "1%",
                                    borderRadius: "10px",
                                    backgroundColor: "#D6ED6A",
                                }}><img style={{
                                    width: "50px"
                                }} src={flecha} alt="flecha"></img></button>
                            </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientasList;
