import React, { useState } from 'react';

interface Clienta {
  nombre: string;
  apellido: string;
}

interface APIResponse {
  success: boolean;
  data: Clienta[];
  errors: string[];
}

const ClientaForm: React.FC = () => {
  const [form, setForm] = useState<Clienta>({ nombre: '', apellido: '' });
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/clientas/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data: APIResponse = await res.json();

    if (data.success) {
      setMensaje(`Clienta creada: ${data.data[0].nombre} ${data.data[0].apellido}`);
      setForm({ nombre: '', apellido: '' });
    } else {
      setMensaje(`Errores: ${data.errors.join(', ')}`);
    }
  };

  return (
    <div style={{backgroundColor: "#161616", color: "white", padding: "none", margin: "none"}}>
      <h2>Crear Clienta</h2>
      <div style={{backgroundColor: "#2E2E2E", width: "100vw", height: "2px", display: "flex", flexDirection: "column", marginTop: "10px"}}></div>
      <form style={{display: "flex", flexDirection: "column",  marginTop: "5%", marginLeft: "10%", marginRight: "10%"}} onSubmit={handleSubmit}>
        <button style={{backgroundColor: "#D6ED6A", width: "15%", color: "black", padding: "1%", borderRadius: "10px", border: "none", fontSize: "20%", alignSelf: "end", textAlign: "center"}} type="submit">Crear Clienta </button>
        <div style={{marginTop: "5%"}}>
            <label style={{fontSize: "20%"}}>Nombre:</label>
            <input
                style={{backgroundColor: "#222222", borderRadius: "20px", borderColor: "#2E2E2E", color: "white", width: "80%", height: "30px"}}
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
          />
        </div>
        <div style={{marginTop: "2%"}}>
          <label style={{fontSize: "20%"}}>Apellido:</label>
          <input
            style={{backgroundColor: "#222222", borderRadius: "20px", borderColor: "#2E2E2E", color: "white",  width: "80%", height: "30px"}}
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </div>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default ClientaForm;
