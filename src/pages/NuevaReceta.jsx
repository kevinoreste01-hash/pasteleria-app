import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const UNIDADES = ['kg', 'g', 'l', 'ml', 'unidad']

function calcularCostoParcial(ingrediente, cantidad, unidad) {
  if (!cantidad || !ingrediente) return 0
  const cant = parseFloat(cantidad)
  if (isNaN(cant)) return 0

  const conversiones = {
    'kg': { 'kg': 1, 'g': 0.001 },
    'l': { 'l': 1, 'ml': 0.001 },
    'unidad': { 'unidad': 1 },
  }

  const base = ingrediente.unidad
  const factor = conversiones[base]?.[unidad] ?? 1
  return ingrediente.precio * cant * factor
}

export default function NuevaReceta() {
  const navigate = useNavigate()
  const { ingredientes, guardarReceta } = useApp()
  const [nombre, setNombre] = useState('')
  const [ganancia, setGanancia] = useState('60')
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [cantidad, setCantidad] = useState('')
  const [unidad, setUnidad] = useState('g')
  const [items, setItems] = useState([])

  const sugerencias = busqueda.length > 0
    ? ingredientes.filter(i => i.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
    : []

  function elegirIngrediente(ing) {
    setSeleccionado(ing)
    setBusqueda(ing.nombre)
    setUnidad(ing.unidad === 'kg' ? 'g' : ing.unidad === 'l' ? 'ml' : ing.unidad)
    setCantidad('')
  }

  function agregarItem() {
    if (!seleccionado || !cantidad) return
    const costo = calcularCostoParcial(seleccionado, cantidad, unidad)
    setItems(prev => [...prev, {
      id: Date.now(),
      ingredienteId: seleccionado.id,
      nombre: seleccionado.nombre,
      cantidad: parseFloat(cantidad),
      unidad,
      costo
    }])
    setSeleccionado(null)
    setBusqueda('')
    setCantidad('')
  }

  function eliminarItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const costoTotal = items.reduce((acc, i) => acc + i.costo, 0)
  const precioVenta = costoTotal * (1 + parseFloat(ganancia || 0) / 100)
  const costoParcial = calcularCostoParcial(seleccionado, cantidad, unidad)

  function calcular() {
    if (!nombre || items.length === 0) return
    guardarReceta({
      nombre,
      ganancia: parseFloat(ganancia),
      ingredientes: items,
      costoTotal,
      precioVenta
    })
    navigate('/recetas')
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}><ArrowLeft size={18} /></button>
        <p style={s.headerTitle}>Nueva receta</p>
      </div>

      <div style={s.body}>
        <p style={s.label}>Nombre de la receta</p>
        <input style={s.input} placeholder="Ej: Torta de vainilla" value={nombre} onChange={e => setNombre(e.target.value)} />

        <p style={s.label}>Ganancia deseada</p>
        <div style={s.gananciWrap}>
          <input style={{ ...s.input, flex: 1 }} type="number" value={ganancia} onChange={e => setGanancia(e.target.value)} />
          <span style={s.pct}>%</span>
        </div>

        <p style={s.labelSection}>Agregar ingrediente</p>

        <div style={{ position: 'relative' }}>
          <div style={s.searchWrap}>
            <Search size={14} color="#6B6358" />
            <input
              style={s.searchInput}
              placeholder="Buscar ingrediente..."
              value={busqueda}
              onChange={e => { setBusqueda(e.target.value); setSeleccionado(null) }}
            />
          </div>
          {sugerencias.length > 0 && !seleccionado && (
            <div style={s.dropdown}>
              {sugerencias.map(ing => (
                <div key={ing.id} style={s.dropdownItem} onClick={() => elegirIngrediente(ing)}>
                  <span style={s.dropNombre}>{ing.nombre}</span>
                  <span style={s.dropPrecio}>${ing.precio.toLocaleString('es-AR')} / {ing.unidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {seleccionado && (
          <div style={s.selectedCard}>
            <div style={s.selectedHeader}>
              <p style={s.selectedNombre}>{seleccionado.nombre}</p>
              <p style={s.selectedPrecio}>${seleccionado.precio.toLocaleString('es-AR')} / {seleccionado.unidad}</p>
            </div>
            <p style={s.label}>Cantidad</p>
            <div style={s.row}>
              <input style={{ ...s.input, flex: 2 }} type="number" placeholder="0" value={cantidad} onChange={e => setCantidad(e.target.value)} />
              <select style={s.select} value={unidad} onChange={e => setUnidad(e.target.value)}>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {cantidad > 0 && (
              <div style={s.costoParcial}>
                <span style={s.costoLabel}>Costo parcial</span>
                <span style={s.costoValor}>${costoParcial.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <button style={s.btnAdd} onClick={agregarItem}>
              <Plus size={16} /> Agregar a la receta
            </button>
          </div>
        )}

        {items.length > 0 && (
          <>
            <p style={s.labelSection}>Ingredientes agregados</p>
            {items.map(item => (
              <div key={item.id} style={s.itemCard}>
                <div>
                  <p style={s.itemNombre}>{item.nombre}</p>
                  <p style={s.itemSub}>{item.cantidad} {item.unidad} · ${item.costo.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                </div>
                <button style={s.iconBtn} onClick={() => eliminarItem(item.id)}><Trash2 size={15} /></button>
              </div>
            ))}
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Costo total</span>
              <span style={s.totalValor}>${costoTotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
            </div>
            <button style={s.btnPrimary} onClick={calcular}>Calcular precio</button>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#141210', padding: '0 0 48px', maxWidth: 480, margin: '0 auto' },
  header: { background: '#1C1916', padding: '16px 20px', borderBottom: '0.5px solid #2E2A26', display: 'flex', alignItems: 'center', gap: 12 },
  back: { background: 'none', border: 'none', color: '#A09080', cursor: 'pointer', padding: 0, display: 'flex' },
  headerTitle: { fontSize: 15, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  body: { padding: '16px' },
  label: { fontSize: 11, color: '#6B6358', margin: '0 0 6px' },
  labelSection: { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6358', margin: '16px 0 8px' },
  input: { width: '100%', background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#F0EAD8', outline: 'none', boxSizing: 'border-box', marginBottom: 12 },
  gananciWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  pct: { fontSize: 14, color: '#6B6358', marginBottom: 12 },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 8, background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px 12px', marginBottom: 4 },
  searchInput: { flex: 1, background: 'none', border: 'none', fontSize: 14, color: '#F0EAD8', outline: 'none' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, zIndex: 10, overflow: 'hidden' },
  dropdownItem: { padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '0.5px solid #2E2A26' },
  dropNombre: { fontSize: 13, color: '#F0EAD8' },
  dropPrecio: { fontSize: 11, color: '#6B6358' },
  selectedCard: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '12px 14px', marginTop: 8, marginBottom: 4 },
  selectedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  selectedNombre: { fontSize: 13, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  selectedPrecio: { fontSize: 11, color: '#6B6358', margin: 0 },
  row: { display: 'flex', gap: 8 },
  select: { background: '#141210', border: '0.5px solid #2E2A26', borderRadius: 8, padding: '10px 10px', fontSize: 13, color: '#F0EAD8', outline: 'none', marginBottom: 12 },
  costoParcial: { background: '#2E2A26', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  costoLabel: { fontSize: 12, color: '#A09080' },
  costoValor: { fontSize: 12, fontWeight: 500, color: '#F0EAD8' },
  btnAdd: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#F0EAD8', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 500, color: '#141210', cursor: 'pointer' },
  itemCard: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemNombre: { fontSize: 13, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  itemSub: { fontSize: 11, color: '#6B6358', margin: '2px 0 0' },
  iconBtn: { background: 'none', border: 'none', color: '#6B6358', cursor: 'pointer', padding: 4, display: 'flex' },
  totalRow: { background: '#2E2A26', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 13, color: '#A09080' },
  totalValor: { fontSize: 13, fontWeight: 500, color: '#F0EAD8' },
  btnPrimary: { width: '100%', padding: 14, background: '#F0EAD8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#141210', cursor: 'pointer' },
}