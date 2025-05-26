import { useState } from "react";

interface Producto {
    nombre: string;
    precio: number;
}
  
interface APIResponse {
    success: boolean;
    data: Producto[];
    errors: string[];
}

const CrearProducto: React.FC = () => {
  const [form, setForm] = useState<Producto>({ nombre: '', precio: 0 });
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "precio" ? parseFloat(value) : value
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/producto/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data: APIResponse = await res.json();

    if (data.success) {
      setMensaje(`Producto creado`);
      setForm({ nombre: '', precio: 0 });
    } else {
      setMensaje(`Errores: ${data.errors.join(', ')}`);
    }
  };

  return (
    <div style={{backgroundColor: "#161616", color: "white",  margin: "3%"}}>
      <h2 style={{fontSize: "3rem"}}>Crear Producto</h2>
      <div style={{backgroundColor: "#2E2E2E", width: "100%", height: "2px", display: "flex", flexDirection: "column", marginTop: "1px"}}></div>
        <form style={{display: "flex", flexDirection: "column",  marginTop: "2%"}} onSubmit={handleSubmit}>
            <button style={{backgroundColor: "#D6ED6A", width: "10%", color: "black", padding: "1%", borderRadius: "10px", border: "none", fontSize: "1rem", alignSelf: "end", textAlign: "center"}} type="submit">Crear Producto </button>
            <div style={{display: "flex", flexDirection: "column", marginTop: "2%", gap: "20px",}}>
                <input
                    style={{padding: "1%", backgroundColor: "#222222", border: "2px solid #2E2E2E", borderRadius: "10px", color: "white", fontSize: "1rem"}} 
                    type="text"
                    name="nombre"
                    value={form.nombre} 
                    placeholder="Nombre del producto" 
                    onChange={handleChange}
                    required
                />
                <input 
                    style={{padding: "1%", backgroundColor: "#222222", border: "2px solid #2E2E2E", borderRadius: "10px", color: "white", fontSize: "1rem"}} 
                    type="number"
                    name="precio"
                    value={form.precio} 
                    placeholder="Precio del producto" 
                    onChange={handleChange}
                    required
                />
            </div>
        </form>
        {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CrearProducto;
