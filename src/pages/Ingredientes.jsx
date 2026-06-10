import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const UNIDADES = ['kg', 'g', 'l', 'ml', 'unidad']

export default function Ingredientes() {
  const navigate = useNavigate()
  const { ingredientes, agregarIngrediente, editarIngrediente, eliminarIngrediente } = useApp()
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [editData, setEditData] = useState({})
  const [agregando, setAgregando] = useState(false)
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', unidad: 'kg' })

  const filtrados = ingredientes.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function iniciarEdicion(ing) {
    setEditandoId(ing.id)
    setEditData({ nombre: ing.nombre, precio: ing.precio, unidad: ing.unidad })
  }

  function confirmarEdicion() {
    editarIngrediente(editandoId, {
      nombre: editData.nombre,
      precio: parseFloat(editData.precio),
      unidad: editData.unidad
    })
    setEditandoId(null)
  }

  function confirmarNuevo() {
    if (!nuevo.nombre || !nuevo.precio) return
    agregarIngrediente({
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      unidad: nuevo.unidad
    })
    setNuevo({ nombre: '', precio: '', unidad: 'kg' })
    setAgregando(false)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        <p style={s.headerTitle}>Ingredientes</p>
      </div>

      <div style={s.searchWrap}>
        <input
          style={s.search}
          placeholder="Buscar ingrediente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div style={s.list}>
        {agregando && (
          <div style={s.editCard}>
            <input style={s.input} placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
            <div style={s.row}>
              <input style={{ ...s.input, flex: 1 }} placeholder="Precio por unidad" type="number" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
              <select style={s.select} value={nuevo.unidad} onChange={e => setNuevo({ ...nuevo, unidad: e.target.value })}>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div style={s.row}>
              <button style={s.btnConfirm} onClick={confirmarNuevo}><Check size={16} /></button>
              <button style={s.btnCancel} onClick={() => setAgregando(false)}><X size={16} /></button>
            </div>
          </div>
        )}

        {filtrados.map(ing => (
          <div key={ing.id} style={s.card}>
            {editandoId === ing.id ? (
              <div style={{ width: '100%' }}>
                <input style={s.input} value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} />
                <div style={s.row}>
                  <input style={{ ...s.input, flex: 1 }} type="number" value={editData.precio} onChange={e => setEditData({ ...editData, precio: e.target.value })} />
                  <select style={s.select} value={editData.unidad} onChange={e => setEditData({ ...editData, unidad: e.target.value })}>
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div style={s.row}>
                  <button style={s.btnConfirm} onClick={confirmarEdicion}><Check size={16} /></button>
                  <button style={s.btnCancel} onClick={() => setEditandoId(null)}><X size={16} /></button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p style={s.cardTitle}>{ing.nombre}</p>
                  <p style={s.cardSub}>${ing.precio.toLocaleString('es-AR')} / {ing.unidad}</p>
                </div>
                <div style={s.actions}>
                  <button style={s.iconBtn} onClick={() => iniciarEdicion(ing)}><Pencil size={15} /></button>
                  <button style={s.iconBtn} onClick={() => eliminarIngrediente(ing.id)}><Trash2 size={15} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button style={s.btnPrimary} onClick={() => setAgregando(true)}>
        <Plus size={18} /> Agregar ingrediente
      </button>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#141210', padding: '0 0 32px', maxWidth: 480, margin: '0 auto' },
  header: { background: '#1C1916', padding: '16px 20px', borderBottom: '0.5px solid #2E2A26', display: 'flex', alignItems: 'center', gap: 12 },
  back: { background: 'none', border: 'none', color: '#A09080', cursor: 'pointer', padding: 0, display: 'flex' },
  headerTitle: { fontSize: 15, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  searchWrap: { padding: '12px 16px', borderBottom: '0.5px solid #2E2A26' },
  search: { width: '100%', background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#F0EAD8', outline: 'none', boxSizing: 'border-box' },
  list: { padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  card: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  editCard: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  cardSub: { fontSize: 11, color: '#6B6358', margin: '3px 0 0' },
  actions: { display: 'flex', gap: 8 },
  iconBtn: { background: 'none', border: 'none', color: '#6B6358', cursor: 'pointer', padding: 4, display: 'flex' },
  input: { width: '100%', background: '#141210', border: '0.5px solid #2E2A26', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#F0EAD8', outline: 'none', boxSizing: 'border-box' },
  select: { background: '#141210', border: '0.5px solid #2E2A26', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#F0EAD8', outline: 'none' },
  row: { display: 'flex', gap: 8 },
  btnConfirm: { flex: 1, background: '#F0EAD8', border: 'none', borderRadius: 8, padding: '8px', color: '#141210', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnCancel: { flex: 1, background: '#2E2A26', border: 'none', borderRadius: 8, padding: '8px', color: '#A09080', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 'calc(100% - 32px)', margin: '0 16px', padding: 14, background: '#F0EAD8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#141210', cursor: 'pointer' },
}