import { useState } from "react";

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
      setMensaje(`Clienta creada`);
      setForm({ nombre: '', apellido: '' });
    } else {
      setMensaje(`Errores: ${data.errors.join(', ')}`);
    }
  };

  return (
    <div style={{backgroundColor: "#161616", color: "white",  margin: "3%"}}>
      <h2 style={{fontSize: "3rem"}}>Crear Clienta</h2>
      <div style={{backgroundColor: "#2E2E2E", width: "100%", height: "2px", display: "flex", flexDirection: "column", marginTop: "1px"}}></div>
        <form style={{display: "flex", flexDirection: "column",  marginTop: "2%"}} onSubmit={handleSubmit}>
            <button style={{backgroundColor: "#D6ED6A", width: "10%", color: "black", padding: "1%", borderRadius: "10px", border: "none", fontSize: "1rem", alignSelf: "end", textAlign: "center"}} type="submit">Crear Clienta </button>
            <div style={{display: "flex", flexDirection: "column", marginTop: "2%", gap: "20px",}}>
                <input
                    style={{padding: "1%", backgroundColor: "#222222", border: "2px solid #2E2E2E", borderRadius: "10px", color: "white", fontSize: "1rem"}} 
                    type="text"
                    name="nombre"
                    value={form.nombre} 
                    placeholder="Nombre" 
                    onChange={handleChange}
                    required
                />
                <input 
                    style={{padding: "1%", backgroundColor: "#222222", border: "2px solid #2E2E2E", borderRadius: "10px", color: "white", fontSize: "1rem"}} 
                    type="text"
                    name="apellido"
                    value={form.apellido} 
                    placeholder="Apellido" 
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
