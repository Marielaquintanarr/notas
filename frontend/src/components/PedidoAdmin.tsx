"use client";

import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

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

export default function PedidoAdmin() {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const pedidoId = localStorage.getItem("pedidoId");

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
      <h2 style={{ margin: "3%" }}>Editar Pedido #{pedidoId}</h2>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <div style={{ display: "flex", gap: "2%", margin: "3%" }}>
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
          }}
        />
        <input
            type="date"
            name="fecha"
            value={pedido.fecha.split("T")[0]} 
            onChange={handleChange}
            style={{
                width: "30%",
                backgroundColor: "#222",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
            }}
        />

        <button style={{ width: "15%", padding: "10px", borderRadius: "10px" }} onClick={() => {
            localStorage.setItem("clientaId", pedido.id.toString());
            }}>
            <Link to="/anotarabono">Anotar Abono</Link>
        </button>
        <Link to={"/verpedidos"}>
            <button
                onClick={handleUpdatePedido}
                type="submit"
                style={{ width: "15%", padding: "10px", borderRadius: "10px" }}
            >
            Guardar Cambios
            </button>
        </Link>
        <Link to={"/verpedidos"}>
            <button onClick={handleEliminarPedido} style={{ width: "15%", padding: "10px", borderRadius: "10px" }}>Eliminar pedido</button>
        </Link>
      </div>

      <div style={{ margin: "3%" }}>
        <table style={{ width: "100%", color: "white", backgroundColor: "#222" }}>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Producto ID</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedido.productos.map((producto, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleProductoChange(index, "cantidad", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={producto.productoId}
                    onChange={(e) =>
                      handleProductoChange(index, "productoId", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={producto.subtotal}
                    step="0.01"
                    onChange={(e) =>
                      handleProductoChange(index, "subtotal", e.target.value)
                    }
                  />
                </td>
                <td>{(producto.cantidad * producto.subtotal).toFixed(2)}</td>
                <td>
                  <button type="button" onClick={() => eliminarProducto(index)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={agregarProducto}
          style={{ marginTop: "1rem" }}
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
            backgroundColor: "#222",
            color: "white",
            borderRadius: "10px",
          }}
        />
      </div>
    </form>
  );
}
