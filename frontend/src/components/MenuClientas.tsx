import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import eye from "../assets/Eye.png";
import edit from "../assets/Edit.png";

type Clienta = {
    id: number;
    nombre: string;
    apellido: string;
}


function MenuClientas() {
    const { id: clientaId } = useParams();
    const [clienta, setClienta] = useState<Clienta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientaId) return;
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
    }, [clientaId]);
    

    return(
        <>
            {clienta && (
                <div style={{
                    marginLeft: "5%",
                    marginRight: "5%",
                    marginTop:"2%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                <h2 style={{color: "white", fontSize: "3rem", padding: "none", margin: "none"}}>{clienta.nombre} {clienta.apellido}</h2>
                <div style={{
                    backgroundColor: "#2E2E2E",
                    height: "2px",
                }}></div>
            </div>
            )}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                marginTop: "2%",
                marginLeft: "5%",
                marginRight: "5%",
                color: "white",
            }}>
                <Link style={{textDecoration: "none"}} to={`/verpedidos/${clientaId}`}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#5D5D5D",
                        border: "2px solid white",
                        borderRadius: "20px",
                        width: "100%",
                        color: "white",
                    }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px"
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            width: "45px",
                            height: "45px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <img
                                src={eye}
                                alt="ojo"
                                style={{ width: "22px", height: "22px"}}
                            />
                        </div>
                        <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>Ver pedidos</p>
                    </div>
                    </div>
                </Link>
                <Link style={{textDecoration: "none"}} to={`/crearpedido/${clientaId}`}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#5D5D5D",
                        border: "2px solid white",
                        borderRadius: "20px",
                        width: "100%",
                        color: "white"
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            padding: "10px"
                        }}>
                            <div style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <img
                                    src={edit}
                                    alt="edit"
                                    style={{ width: "22px", height: "22px"}}
                                />
                            </div>
                            <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>Hacer Pedido</p>
                        </div>
                    </div>
                </Link>

                <Link style={{textDecoration: "none"}} to={`/verdevoluciones/${clientaId}`}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#5D5D5D",
                        border: "2px solid white",
                        borderRadius: "20px",
                        width: "100%",
                        color: "white"
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            padding: "10px"
                        }}>
                            <div style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <img
                                    src={eye}
                                    alt="ojo"
                                    style={{ width: "22px", height: "22px"}}
                                />
                            </div>
                            <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem"}}>Ver devoluciones</p>
                        </div>
                    </div>
                </Link>

                <Link style={{textDecoration: "none"}} to={`/creardevolucion/${clientaId}`}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#5D5D5D",
                        border: "2px solid white",
                        borderRadius: "20px",
                        width: "100%",
                        color: "white"
                    }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px"
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            width: "45px",
                            height: "45px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <img
                                src={edit}
                                alt="edit"
                                style={{ width: "22px", height: "22px"}}
                            />
                        </div>
                        <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>Hacer Devolucion</p>
                    </div>
                    </div>
                </Link>
                {loading && <p>{loading}</p>}
                {error && <p>{error}</p>}
            </div>

        </>
    )

}
export default MenuClientas;