"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";


type ProductoDetalle = {
  productoId: number;
  cantidad: number;
  subtotal: number;
};

interface Clienta {
  nombre: string;
  apellido: string;
}

type Devolucion = {
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

export default function CrearDevolucion() {
  const { id: clientaId } = useParams();
  const [clienta, setClienta] = useState<Clienta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productos, setProductos] =  useState<Producto[]>([]);
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
    

  const [devolucion, setDevolucion] = useState<Devolucion>({
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
    setDevolucion(prev => ({
      ...prev,
      [name]: name === 'clientaId' ? parseInt(value) : value
    }));
  };

  const handleProductoChange = (
    index: number,
    field: keyof ProductoDetalle,
    value: string | number
  ) => {
    const nuevosProductos = [...devolucion.productos];
    nuevosProductos[index][field] =
      field === 'productoId' || field === 'cantidad' || field === 'subtotal'
        ? Number(value)
        : value as never;
    setDevolucion(prev => ({ ...prev, productos: nuevosProductos }));
  };

  const agregarProducto = () => {
    setDevolucion(prev => ({
      ...prev,
      productos: [...prev.productos, { productoId: 0, cantidad: 0, subtotal: 0 }]
    }));
  };

  const eliminarProducto = (index: number) => {
    setDevolucion(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors([]);

    const total = devolucion.productos.reduce(
      (acc, prod) => acc + prod.cantidad * prod.subtotal, 0
    );

    const fechaSolo = devolucion.fecha.split("T")[0];

    const devolucionConTotal = { ...devolucion, total, fechaSolo};

    try {
      const response = await fetch('http://localhost:8080/api/devolucion/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(devolucionConTotal)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Devolucion creada exitosamente');
        setDevolucion({
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

  

  return (
    <form style={{ color: "white" }} onSubmit={handleSubmit}>
      <div style={{ marginLeft: "3%", marginRight: "3%", marginBottom: "2%", marginTop: "3%" }}>
        <h2>Crear Devolucion</h2>
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
            value={devolucion.fecha.split("T")[0]} 
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
          Crear Devolucion
        </button>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Cantidad</th>
              <th style={thStyle}>Producto</th>
              <th style={thStyle}>Precio Unitario</th>
              <th style={thStyle}>Subtotal</th>
              <th style={thStyle}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {devolucion.productos.map((producto, index) => (
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
          value={devolucion.notas}
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
