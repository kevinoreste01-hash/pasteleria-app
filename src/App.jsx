import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Ingredientes from './pages/Ingredientes'
import NuevaReceta from './pages/NuevaReceta'
import Recetas from './pages/Recetas'
import { AppProvider } from './context/AppContext.jsx'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/nueva-receta" element={<NuevaReceta />} />
          <Route path="/recetas" element={<Recetas />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App