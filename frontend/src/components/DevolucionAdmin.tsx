"use client";

import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import tache from "../assets/X.png";

type ProductoDetalle = {
    productoId: number;
    cantidad: number;
    subtotal: number;
};

type Producto = {
    id: number;
    nombre: string;
    precio: number;
};

type Devolucion = {
    id: number;
    fecha: string;
    clientaId: number;
    notas: string;
    productos: ProductoDetalle[];
};

export default function DevolucionAdmin() {
    const { id: devolucionId } = useParams();
    const [devolucion, setDevolucion] = useState<Devolucion | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchDevolucion = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/devolucionbyid/${devolucionId}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setDevolucion(data.data[0]);
            } else {
            setError("Devolución no encontrada");
            }
        } catch (e) {
            setError("Error al cargar la devolución");
        }
        };

        fetchDevolucion();
    }, [devolucionId]);


    const handleUpdateDevolucion = async () => {
        if (!devolucion) return;
    
        const total = devolucion.productos.reduce(
        (acc, prod) => acc + prod.cantidad * prod.subtotal,
        0
        );
        const devolucionConTotal = { ...devolucion, total };
    
        try {
        const res = await fetch("http://localhost:8080/api/actualizardevolucion", {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(devolucionConTotal)
        });
    
        const data = await res.json();
        if (data.success) {
            setSuccessMessage("Devolucion actualizada exitosamente");
        } else {
            setError("Error al actualizar la devolucion");
        }
        } catch (e) {
        setError("Error al actualizar la devolucion");
        }
    };

    const handleEliminarDevolucion = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/eliminardevolucion/${devolucionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
            setDevolucion(data.data[0]);
            } else {
            setError("Devolucion no encontrada");
            }
            } catch (e) {
            setError("Error al eliminar la devolucion");
            }
        };
    

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (devolucion) {
        setDevolucion((prev) =>
            prev
            ? {
                ...prev,
                [name]: name === "clientaId" ? parseInt(value) : value,
                }
            : null
        );
        }
    };

    const handleProductoChange = (
        index: number,
        field: keyof ProductoDetalle,
        value: string | number
    ) => {
        if (!devolucion) return;
        const nuevosProductos = [...devolucion.productos];
        nuevosProductos[index][field] = Number(value);
        setDevolucion((prev) => prev ? { ...prev, productos: nuevosProductos } : null);
    };

    const agregarProducto = () => {
        if (!devolucion) return;
        setDevolucion((prev) =>
        prev
            ? {
                ...prev,
                productos: [
                ...prev.productos,
                { productoId: 0, cantidad: 0, subtotal: 0 },
                ],
            }
            : null
        );
    };

    const eliminarProducto = (index: number) => {
        if (!devolucion) return;
        setDevolucion((prev) =>
        prev
            ? {
                ...prev,
                productos: prev.productos.filter((_, i) => i !== index),
            }
            : null
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!devolucion) return;

        const total = devolucion.productos.reduce(
        (acc, prod) => acc + prod.cantidad * prod.subtotal,
        0
        );

        const pedidoConTotal = { ...devolucion, total };
        try {
        const response = await fetch(
            `http://localhost:8080/api/devolucionbyid/${devolucionId}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pedidoConTotal),
            }
        );

        const data = await response.json();

        if (data.success) {
            setSuccessMessage("Pedido actualizado exitosamente");
        } else {
            setError("Error al actualizar el pedido");
        }
        } catch (error) {
        setError("Error.");
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8080/api/productos`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    setError("La API respondió con un error.");
                    console.error("Error en la respuesta de la API:", data.errors);
                    return;
                }
                setProductos(data.data); 
            })
            .catch((error) => {
                console.error("Error al obtener el producto:", error);
                setError("No se pudo obtener el producto.");
            });
    }, []);
    
    

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!devolucion) return <p style={{ color: "white" }}>Cargando pedido...</p>;

    return (
        <form style={{ color: "white" }} onSubmit={handleSubmit}>
            <div style={{
                margin: "3%",
            }}>
               
                <div>
                    <h1 style={{color: "white"}}>Información de Devolución {devolucionId}</h1>
                </div>
                <div style={{
                    backgroundColor: "#2E2E2E",
                    height: "2px",
                }}></div>
                <div style={{
                    marginTop: "1%"
                }}>
                </div>
            </div>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <div style={{ display: "flex", gap: "2%", margin: "3%"}}>
            <input
            type="number"
            name="clientaId"
            value={devolucion.clientaId}
            onChange={handleChange}
            style={{
                width: "30%",
                backgroundColor: "#222",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                border: "2px solid #2E2E2E"
            }}
            />
            <input
                type="date"
                name="fecha"
                value={devolucion.fecha.split("T")[0]} 
                onChange={handleChange}
                style={{
                    width: "30%",
                    border: "2px solid #2E2E2E",
                    backgroundColor: "#222",
                    color: "white",
                    borderRadius: "10px",
                    padding: "10px",
                }}
            />
            <Link to={`/verdevoluciones/${devolucion.clientaId}`}>
                <button
                    onClick={handleUpdateDevolucion}
                    type="submit"
                    style={{ width: "75%", padding: "10px", borderRadius: "10px", backgroundColor: "#D6ED6A", border: "none" }}
                >
                Guardar Cambios
                </button>
            </Link>
            <Link to={`/verdevoluciones/${devolucion.clientaId}`}>
                <button onClick={handleEliminarDevolucion} style={{ width: "75%", padding: "10px", borderRadius: "10px", backgroundColor: "#FF0000", border: "none" }}>Eliminar pedido</button>
            </Link>
        </div>

        <div style={{ margin: "3%" }}>
            <table style={{ width: "100%", color: "white", backgroundColor: "#222", border: "2px solid #2E2E2E", padding: "15px", borderRadius: "10px"}}>
            <thead>
                <tr>
                <th>Cantidad</th>
                <th>Producto ID</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {devolucion.productos.map((producto, index) => (
                <tr key={index}>
                    <td style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", flexDirection: "column"}}>
                    <input
                        style={{padding: "10px", backgroundColor: "#222", border: "none", textAlign: "center",display: "flex", justifyContent: "center", alignItems: "center", color: "white"}}
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) =>
                        handleProductoChange(index, "cantidad", e.target.value)
                        }
                    />
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <select
                        value={producto.productoId}
                        onChange={(e) => handleProductoChange(index, "productoId", e.target.value)}
                        style={{
                            padding: "10px",
                            backgroundColor: "#222",
                            color: "white",
                            border: "none",
                            borderRadius: "5px"
                        }}
                        >
                        {productos.map((p) => (
                            <option value={p.id} key={p.id}>
                            {p.nombre}
                            </option>
                        ))}
                    </select>
                    </td>
                    <td style={{textAlign: "center", verticalAlign: "middle"}}>
                    <input
                        type="number"
                        style={{
                            padding: "10px",
                            backgroundColor: "#222",
                            border: "none",
                            textAlign: "center",
                            color: "white",
                            borderRadius: "5px"
                          }}
                        value={producto.subtotal}
                        step="1.00"
                        onChange={(e) =>
                        handleProductoChange(index, "subtotal", e.target.value)
                        }
                    />
                    </td>
                    <td style={{textAlign: "center", verticalAlign: "middle"}}>{(producto.cantidad * producto.subtotal).toFixed(2)}</td>
                    <td style={{textAlign: "center", verticalAlign: "middle"}}>
                    <button style={{backgroundColor: "red", border: "none", borderRadius: "5px", alignContent: "center"}} type="button" onClick={() => eliminarProducto(index)}>
                        <img src={tache} alt="tache" style={{width: "50%" }}></img>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            <button
            type="button"
            onClick={agregarProducto}
            style={{ marginTop: "1rem", padding: "0.5%", borderRadius: "10px", backgroundColor: "white"}}
            >
            ➕ Agregar Producto
            </button>
        </div>

        <div style={{ margin: "3%" }}>
            <label>Notas:</label>
            <textarea
            name="notas"
            value={devolucion.notas}
            onChange={handleChange}
            style={{
                width: "100%",
                marginTop: "1%",
                backgroundColor: "#222",
                color: "white",
                borderRadius: "10px",
                border: "2px solid #2E2E2E"
            }}
            />
        </div>
        </form>
    );
}
