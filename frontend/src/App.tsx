import './App.css'
import "./components/ClientaForm"
import Home from './components/Home'
import CrearPedido from './components/CrearPedido'
import VerDevoluciones from './components/VerDevoluciones'
import VerPedidos from './components/VerPedidos'
import CrearDevolucion from './components/CrearDevolucion'
import ClientaForm from './components/ClientaForm'
import MenuClientas from './components/MenuClientas'
import VerDetallesDevolucion from './components/DevolucionAdmin'
import VerDetallesPedido from './components/PedidoAdmin'
import AnotarAbono from './components/AnotarAbono'
import PedidoAdmin from './components/PedidoAdmin'
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter> 
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="pedidoadmin" element={<PedidoAdmin />} />
          <Route path="clientaform" element={<ClientaForm />} />
          <Route path="menuclienta" element={<MenuClientas />} />
          <Route path="crearpedido" element={<CrearPedido />} />
          <Route path="verdevoluciones" element={<VerDevoluciones />} />
          <Route path="verpedidos" element={<VerPedidos />} />
          <Route path="creardevolucion" element={<CrearDevolucion />} />
          <Route path="devoluciondetalles" element={<VerDetallesDevolucion />} />
          <Route path='pedidodetalles'element={<VerDetallesPedido />} />
          <Route path='anotarabono' element={<AnotarAbono />} />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App
