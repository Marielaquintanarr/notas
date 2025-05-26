"use client";

import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import tache from "../assets/X.png";

type ProductoDetalle = {
    productoId: number;
    cantidad: number;
    subtotal: number;
};

type Pedido = {
    id: number;
    fecha: string;
    clientaId: number;
    notas: string;
    productos: ProductoDetalle[];
};

type Producto = {
    id: number;
    nombre: string;
    precio: number;
  }


export default function PedidoAdmin() {
    const { id: pedidoId } = useParams();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);

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

    useEffect(() => {
        const fetchPedido = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/getpedidoid/${pedidoId}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
            setPedido(data.data[0]);
            } else {
            setError("Pedido no encontrado");
            }
        } catch (e) {
            setError("Error al cargar el pedido");
        }
        };

        fetchPedido();
    }, [pedidoId]);

    const handleUpdatePedido = async () => {
        if (!pedido) return;
    
        const total = pedido.productos.reduce(
        (acc, prod) => acc + prod.cantidad * prod.subtotal,
        0
        );
        const pedidoConTotal = { ...pedido, total };
    
        try {
        const res = await fetch("http://localhost:8080/api/actualizarpedido", {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoConTotal)
        });
    
        const data = await res.json();
        if (data.success) {
            setSuccessMessage("Pedido actualizado exitosamente");
        } else {
            setError("Error al actualizar el pedido");
        }
        } catch (e) {
        setError("Error al actualizar el pedido");
        }
    };
    


    const handleEliminarPedido = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/eliminarpedido/${pedidoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
            setPedido(data.data[0]);
            } else {
            setError("Pedido no encontrado");
            }
            } catch (e) {
            setError("Error al eliminar el pedido");
            }
        };
    

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (pedido) {
        setPedido((prev) =>
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
        if (!pedido) return;
        const nuevosProductos = [...pedido.productos];
        nuevosProductos[index][field] = Number(value);
        setPedido((prev) => prev ? { ...prev, productos: nuevosProductos } : null);
    };

    const agregarProducto = () => {
        if (!pedido) return;
        setPedido((prev) =>
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
        if (!pedido) return;
        setPedido((prev) =>
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
        if (!pedido) return;

        const total = pedido.productos.reduce(
        (acc, prod) => acc + prod.cantidad * prod.subtotal,
        0
        );

        const pedidoConTotal = { ...pedido, total };

        try {
        const response = await fetch(
            `http://localhost:8080/api/getpedidoid/${pedidoId}`,
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

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!pedido) return <p style={{ color: "white" }}>Cargando pedido...</p>;

    return (
        <form style={{ color: "white" }} onSubmit={handleSubmit}>
            <div style={{
                margin: "3%",
            }}>
               
                <div>
                    <h1 style={{color: "white"}}>Información de Pedido {pedidoId}</h1>
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
            value={pedido.clientaId}
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
                value={pedido.fecha.split("T")[0]} 
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

            <Link to={`/anotarabono/${pedidoId}`}>
                <button 
                style={{ width: "75%", padding: "10px", borderRadius: "10px" }}
                >Anotar abonos</button>
            </Link>
            <Link to={`/verpedidos/${pedido.clientaId}`}>
                <button
                    onClick={handleUpdatePedido}
                    type="submit"
                    style={{ width: "75%", padding: "10px", borderRadius: "10px", backgroundColor: "#D6ED6A", border: "none" }}
                >
                Guardar Cambios
                </button>
            </Link>
            <Link to={`/verpedidos/${pedido.clientaId}`}>
                <button onClick={handleEliminarPedido} style={{ width: "75%", padding: "10px", borderRadius: "10px", backgroundColor: "#FF0000", border: "none" }}>Eliminar pedido</button>
            </Link>
        </div>

        <div style={{ margin: "3%" }}>
            <table style={{ width: "100%", color: "white", backgroundColor: "#222", border: "2px solid #2E2E2E", padding: "15px", borderRadius: "10px"}}>
            <thead>
                <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {pedido.productos.map((producto, index) => (
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
                    <td style={{textAlign: "center", verticalAlign: "middle"}}>
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
                        <option value="">Selecciona un producto</option>
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
            value={pedido.notas}
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
