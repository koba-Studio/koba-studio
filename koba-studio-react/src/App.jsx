import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AuthModal } from './components/AuthModal'
import { Landing } from './pages/Landing'
import { Productos } from './pages/Productos'
import { Servicios } from './pages/Servicios'
import { Proceso } from './pages/Proceso'
import { Contacto } from './pages/Contacto'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Modal global — se abre desde cualquier página via AuthContext */}
        <AuthModal />
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/proceso"   element={<Proceso />} />
          <Route path="/contacto"  element={<Contacto />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
