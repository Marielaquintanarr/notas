import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Abono {
  fecha: string;
  monto: number;
  comentarios: string;
  pedidoId: number;
}

interface APIResponse {
  success: boolean;
  data: Abono[];
  errors: string[];
}

const AnotarAbono: React.FC = () => {
  const { id: pedidoId } = useParams();
  const [form, setForm] = useState<Abono>({ fecha: '', monto: 0, comentarios: '', pedidoId: parseInt(pedidoId ?? '0') });
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/abono/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data: APIResponse = await res.json();
    const navigate = useNavigate();

    if (data.success) {
      setMensaje(`Abono creado`);
      navigate(`/pedidoadmin/${pedidoId}`);
      setForm({ fecha: '', monto: 0, comentarios: '', pedidoId: parseInt(pedidoId ?? '0') });
    } else {
      setMensaje(`Errores: ${data.errors.join(', ')}`);
    }
  };

  return (
    <div style={{
      marginLeft: "5%",
      marginRight: "5%",
      color: "white"
    }}>
      <h1 >Anotar Abono</h1>
      <div style={{ backgroundColor: "#2E2E2E", width: "100vw", height: "2px", display: "flex", flexDirection: "column" }}></div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "5%", width: "100%" }}>
          <div style={{ display: "flex", width: "45%", gap: "5%" }}>
            <p>Monto abonado: </p>
            <input
              type="number"
              placeholder='$0.00'
              name="monto"
              value={form.monto}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: "flex", width: "45%", gap: "5%" }}>
            <input
              type='date'
              placeholder='fecha'
              name='fecha'
              value={form.fecha}
              onChange={handleChange}
              required
            />
              <button type="submit">Guardar Abono</button>

          </div>
        </div>
        <p>Comentarios: </p>
        <textarea
          name='comentarios'
          value={form.comentarios}
          onChange={handleChange}
        ></textarea>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </div>
  );
};

export default AnotarAbono;
