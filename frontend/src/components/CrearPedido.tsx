"use client"

import React, { useState, useEffect } from 'react';
const clientaId = localStorage.getItem("clientaId");

type ProductoDetalle = {
  productoId: number;
  cantidad: number;
  subtotal: number;
};

interface Clienta {
  nombre: string;
  apellido: string;
}

type Pedido = {
  fecha: string;
  clientaId: number;
  notas: string;
  productos: ProductoDetalle[];
};

export default function CrearPedido() {
  const [clienta, setClienta] = useState<Clienta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
          fetch(`http://localhost:8080/api/nombrebyid/${clientaId}`)
              .then((res) => res.json())
              .then((data) => {
                  if (!data.success) {
                      setError("La API respondió con un error.");
                      console.error("Error en la respuesta de la API:", data.errors);
                      setClienta(null);
                      return;
                  }
      
                  setClienta(data.data[0]);  
              })
              .catch((error) => {
                  console.error("Error al obtener la clienta:", error);
                  setError("No se pudo obtener la clienta.");
              });
      }, []);

  const [pedido, setPedido] = useState<Pedido>({
    fecha: '',
    clientaId: parseInt(clientaId ?? '0'),
    notas: '',
    productos: [{ productoId: 0, cantidad: 0, subtotal: 0 }],
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPedido(prev => ({
      ...prev,
      [name]: name === 'clientaId' ? parseInt(value) : value
    }));
  };

  const handleProductoChange = (
    index: number,
    field: keyof ProductoDetalle,
    value: string | number
  ) => {
    const nuevosProductos = [...pedido.productos];
    nuevosProductos[index][field] =
      field === 'productoId' || field === 'cantidad' || field === 'subtotal'
        ? Number(value)
        : value as never;
    setPedido(prev => ({ ...prev, productos: nuevosProductos }));
  };

  const agregarProducto = () => {
    setPedido(prev => ({
      ...prev,
      productos: [...prev.productos, { productoId: 0, cantidad: 0, subtotal: 0 }]
    }));
  };

  const eliminarProducto = (index: number) => {
    setPedido(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors([]);

    const total = pedido.productos.reduce(
      (acc, prod) => acc + prod.cantidad * prod.subtotal, 0
    );

    const fechaSolo = pedido.fecha.split("T")[0];

    const pedidoConTotal = { ...pedido, total};

    try {
      const response = await fetch('http://localhost:8080/api/pedidos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoConTotal)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('✅ Pedido creado exitosamente');
        setPedido({
          fecha: '',
          clientaId: 0,
          notas: '',
          productos: [{ productoId: 0, cantidad: 0, subtotal: 0 }]
        });
      } else {
        setErrors(data.errors || ['Ocurrió un error.']);
      }
    } catch (error) {
      setErrors(['Error']);
    }
  };

  const tableContainerStyle = {
    borderRadius: "20px",
    color: "#fff",
    marginLeft: "3%",
    marginRight: "3%",
    marginTop: "1%"
  };

  const tableStyle = {
    borderCollapse: "collapse" as const,
    width: "100%",
    backgroundColor: "#222222",
    borderColor: "#2E2E2E",
    color: "#fff",
    borderRadius: "10px",
    overflow: "hidden" as const,
  };

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left" as const,
    border: "1px solid #333",
    backgroundColor: "#121212",
    fontWeight: 500,
    fontSize: "16px",
  };

  

  return (
    <form style={{ color: "white" }} onSubmit={handleSubmit}>
      <div style={{ marginLeft: "3%", marginRight: "3%", marginBottom: "2%", marginTop: "3%" }}>
        <h2>Crear Pedido</h2>
        <div style={{ backgroundColor: "#2E2E2E", width: "100%", height: "2px", marginTop: "10px" }}></div>
      </div>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, index) => <li key={index}>{err}</li>)}
        </ul>
      )}

      <div style={{ marginLeft: "3%", marginRight: "3%", color: "white", display: "flex", gap: "2%" }}>
        {clienta && <p>{clienta.nombre} {clienta.apellido}</p>}
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
        <button
          type="submit"
          style={{
            padding: "10px",
            width: "10%",
            borderRadius: "10px"
          }}
        >
          Crear Pedido
        </button>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Cantidad</th>
              <th style={thStyle}>Producto ID</th>
              <th style={thStyle}>Precio Unitario</th>
              <th style={thStyle}>Subtotal</th>
              <th style={thStyle}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedido.productos.map((producto, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={producto.productoId}
                    onChange={(e) => handleProductoChange(index, 'productoId', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={producto.subtotal}
                    step="0.01"
                    onChange={(e) => handleProductoChange(index, 'subtotal', e.target.value)}
                    required
                  />
                </td>
                <td>
                  {(producto.cantidad * producto.subtotal).toFixed(2)}
                </td>
                <td>
                  <button type="button" onClick={() => eliminarProducto(index)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "1rem" }}>
          <button type="button" onClick={agregarProducto}>➕ Agregar Producto</button>
        </div>
      </div>

      <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "2%" }}>
        <p style={{ color: "white" }}>Comentarios:</p>
        <textarea
          name="notas"
          value={pedido.notas}
          onChange={handleChange}
          style={{
            width: "100%",
            backgroundColor: "#222222",
            borderColor: "#2E2E2E",
            color: "white",
            borderRadius: "10px"
          }}
        />
      </div>
    </form>
  );
}
