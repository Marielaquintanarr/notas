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
import DevolucionAdmin from './components/DevolucionAdmin'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CrearProducto from './components/CrearProducto'

function App() {
  return (
    <>
      <BrowserRouter> 
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="devolucionadmin/:id" element={<DevolucionAdmin />} />
          <Route path="pedidoadmin/:id" element={<PedidoAdmin />} />
          <Route path="clientaform" element={<ClientaForm />} />
          <Route path='crearproducto' element={<CrearProducto />} />
          <Route path="menuclienta/:id" element={<MenuClientas />} />
          <Route path="crearpedido/:id" element={<CrearPedido />} />
          <Route path="verdevoluciones/:id" element={<VerDevoluciones />} />
          <Route path="verpedidos/:id" element={<VerPedidos />} />
          <Route path="creardevolucion/:id" element={<CrearDevolucion />} />
          <Route path="devoluciondetalles" element={<VerDetallesDevolucion />} />
          <Route path='pedidodetalles'element={<VerDetallesPedido />} />
          <Route path='anotarabono/:id' element={<AnotarAbono />} />

        </Routes>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App
