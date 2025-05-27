import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/search-icon.webp";
import arrow from "../assets/blackarrow.png";

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
        fetch("https://notas-backend.onrender.com/api/clientas")
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
                <h2 style={{color: "white", fontSize: "3rem", padding: "none", margin: "none"}}>Home</h2>
                <div style={{
                    backgroundColor: "#2E2E2E",
                    height: "2px",
                }}></div>
            </div>
            <div style={{
                display: "flex",
                marginRight: "5%",
                justifyContent: "flex-end",
                marginTop: "2%",
                gap: "15px"
            }}>
                <Link style={{textDecoration: "none"}} to="/clientaform">
                    <button style={{
                        padding: "10%",
                        width: "180px",
                        backgroundColor: "#D6ED6A",
                        borderRadius: "20px",
                        border: "none",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                    }}>Crear clienta</button>
                </Link> 
                <Link style={{textDecoration: "none"}} to="/crearproducto">
                    <button style={{
                        padding: "10%",
                        width: "180px",
                        backgroundColor: "#161616",
                        borderRadius: "20px",
                        border: "2px solid white",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                    }}>
                        Crear Producto
                    </button>
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
                        fontSize: "2rem",
                        width: "100vw",
                        color: "white",
                        textAlign: "left",
                        padding: "1%"
                    }}
                ></input>
                <button style={{
                    borderRadius: "10px",
                    backgroundColor: "#D6ED6A",
                    border: "none",
                    width: "5%"
                }}><img style={{
                    width: "50%"
                }} src={logo} alt="logo"></img> </button>
            </div>
            {clientasFiltradas.map((clienta) => (
                <Link style={{textDecoration: "none"}} to={`/menuclienta/${clienta.id}`}>
                    <div key={clienta.id} style={{
                    display: "flex",
                    paddingLeft: "10%", 
                    paddingRight: "10%",
                    gap: "1%",
                    marginBottom: "1%"
                }}>
                    <div
                        style={{
                            backgroundColor: "#222222",
                            border: "2px solid #2E2E2E",
                            borderRadius: "10px",
                            height: "35px",
                            width: "100vw",
                            color: "white",
                            textAlign: "left",
                            padding: "1%",
                            fontSize: "2rem",
                            listStyle: "none",
                            textDecoration: "none"
                        }}
                    >{clienta.nombre} {clienta.apellido}</div>
                    <button style={{
                        borderRadius: "10px",
                        backgroundColor: "#D6ED6A",
                        border: "none",
                        width: "5%"
                    }}><img style={{
                        width: "50%"
                    }} src={arrow} alt="arrow"></img> </button>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ClientasList;
