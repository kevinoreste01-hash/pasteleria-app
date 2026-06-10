import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const INGREDIENTES_INICIALES = [
  { id: 1, nombre: 'Harina 0000', precio: 850, unidad: 'kg' },
  { id: 2, nombre: 'Harina integral', precio: 1100, unidad: 'kg' },
  { id: 3, nombre: 'Harina de almendras', precio: 4200, unidad: 'kg' },
  { id: 4, nombre: 'Azúcar', precio: 950, unidad: 'kg' },
  { id: 5, nombre: 'Azúcar impalpable', precio: 1200, unidad: 'kg' },
  { id: 6, nombre: 'Manteca', precio: 3400, unidad: 'kg' },
  { id: 7, nombre: 'Huevos', precio: 180, unidad: 'unidad' },
  { id: 8, nombre: 'Leche', precio: 650, unidad: 'l' },
  { id: 9, nombre: 'Crema de leche', precio: 2100, unidad: 'l' },
  { id: 10, nombre: 'Cacao en polvo', precio: 3200, unidad: 'kg' },
  { id: 11, nombre: 'Chocolate cobertura', precio: 5800, unidad: 'kg' },
  { id: 12, nombre: 'Vainilla', precio: 800, unidad: 'l' },
  { id: 13, nombre: 'Polvo para hornear', precio: 1500, unidad: 'kg' },
  { id: 14, nombre: 'Bicarbonato', precio: 900, unidad: 'kg' },
  { id: 15, nombre: 'Sal', precio: 300, unidad: 'kg' },
  { id: 16, nombre: 'Dulce de leche', precio: 2800, unidad: 'kg' },
  { id: 17, nombre: 'Queso crema', precio: 3100, unidad: 'kg' },
  { id: 18, nombre: 'Limón', precio: 150, unidad: 'unidad' },
  { id: 19, nombre: 'Maicena', precio: 1100, unidad: 'kg' },
  { id: 20, nombre: 'Mermelada', precio: 2200, unidad: 'kg' },
]

export function AppProvider({ children }) {
  const [ingredientes, setIngredientes] = useState(() => {
    const guardados = localStorage.getItem('ingredientes')
    return guardados ? JSON.parse(guardados) : INGREDIENTES_INICIALES
  })

  const [recetas, setRecetas] = useState(() => {
    const guardadas = localStorage.getItem('recetas')
    return guardadas ? JSON.parse(guardadas) : []
  })

  useEffect(() => {
    localStorage.setItem('ingredientes', JSON.stringify(ingredientes))
  }, [ingredientes])

  useEffect(() => {
    localStorage.setItem('recetas', JSON.stringify(recetas))
  }, [recetas])

  function agregarIngrediente(ingrediente) {
    const nuevo = { ...ingrediente, id: Date.now() }
    setIngredientes(prev => [...prev, nuevo])
  }

  function editarIngrediente(id, datos) {
    setIngredientes(prev => prev.map(i => i.id === id ? { ...i, ...datos } : i))
  }

  function eliminarIngrediente(id) {
    setIngredientes(prev => prev.filter(i => i.id !== id))
  }

  function guardarReceta(receta) {
    const nueva = { ...receta, id: Date.now() }
    setRecetas(prev => [nueva, ...prev])
  }

  function editarReceta(id, datos) {
    setRecetas(prev => prev.map(r => r.id === id ? { ...r, ...datos } : r))
  }

  function eliminarReceta(id) {
    setRecetas(prev => prev.filter(r => r.id !== id))
  }

  return (
    <AppContext.Provider value={{
      ingredientes, recetas,
      agregarIngrediente, editarIngrediente, eliminarIngrediente,
      guardarReceta, editarReceta, eliminarReceta
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}