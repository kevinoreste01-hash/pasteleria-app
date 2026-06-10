import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Recetas() {
  const navigate = useNavigate()
  const { recetas, eliminarReceta } = useApp()
  const [expandida, setExpandida] = useState(null)

  function toggleExpandir(id) {
    setExpandida(prev => prev === id ? null : id)
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('/')}><ArrowLeft size={18} /></button>
        <p style={s.headerTitle}>Mis recetas</p>
      </div>

      <div style={s.body}>
        {recetas.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyText}>Todavía no tenés recetas guardadas</p>
            <button style={s.btnPrimary} onClick={() => navigate('/nueva-receta')}>Crear primera receta</button>
          </div>
        ) : (
          recetas.map(receta => (
            <div key={receta.id} style={s.card}>
              <div style={s.cardHeader} onClick={() => toggleExpandir(receta.id)}>
                <div style={s.cardInfo}>
                  <p style={s.cardNombre}>{receta.nombre}</p>
                  <p style={s.cardSub}>{receta.ingredientes.length} ingredientes · {receta.ganancia}% ganancia</p>
                </div>
                <div style={s.cardRight}>
                  <p style={s.cardPrecio}>${receta.precioVenta.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                  {expandida === receta.id ? <ChevronUp size={16} color="#6B6358" /> : <ChevronDown size={16} color="#6B6358" />}
                </div>
              </div>

              {expandida === receta.id && (
                <div style={s.detalle}>
                  <div style={s.detalleRow}>
                    <span style={s.detalleLabel}>Costo ingredientes</span>
                    <span style={s.detalleValor}>${receta.costoTotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div style={s.detalleRow}>
                    <span style={s.detalleLabel}>Ganancia ({receta.ganancia}%)</span>
                    <span style={s.detalleValor}>${(receta.precioVenta - receta.costoTotal).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                  </div>

                  <div style={s.separator} />

                  <p style={s.subLabel}>Desglose de ingredientes</p>
                  {receta.ingredientes.map(item => (
                    <div key={item.id} style={s.itemRow}>
                      <span style={s.itemNombre}>{item.nombre}</span>
                      <span style={s.itemDetalle}>{item.cantidad} {item.unidad} · ${item.costo.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                    </div>
                  ))}

                  <div style={s.separator} />

                  <div style={s.precioDestacado}>
                    <span style={s.precioLabel}>Precio de venta sugerido</span>
                    <span style={s.precioValor}>${receta.precioVenta.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <button style={s.btnEliminar} onClick={() => eliminarReceta(receta.id)}>
                    <Trash2 size={14} /> Eliminar receta
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {recetas.length > 0 && (
        <button style={s.btnFloat} onClick={() => navigate('/nueva-receta')}>+ Nueva receta</button>
      )}
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#141210', padding: '0 0 80px', maxWidth: 480, margin: '0 auto' },
  header: { background: '#1C1916', padding: '16px 20px', borderBottom: '0.5px solid #2E2A26', display: 'flex', alignItems: 'center', gap: 12 },
  back: { background: 'none', border: 'none', color: '#A09080', cursor: 'pointer', padding: 0, display: 'flex' },
  headerTitle: { fontSize: 15, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  body: { padding: '16px' },
  empty: { textAlign: 'center', padding: '48px 0' },
  emptyText: { fontSize: 14, color: '#6B6358', marginBottom: 20 },
  card: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  cardHeader: { padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 14, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  cardSub: { fontSize: 11, color: '#6B6358', margin: '3px 0 0' },
  cardRight: { display: 'flex', alignItems: 'center', gap: 8 },
  cardPrecio: { fontSize: 15, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  detalle: { padding: '0 16px 16px', borderTop: '0.5px solid #2E2A26' },
  detalleRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #2E2A26' },
  detalleLabel: { fontSize: 12, color: '#6B6358' },
  detalleValor: { fontSize: 12, color: '#A09080' },
  separator: { borderTop: '0.5px solid #2E2A26', margin: '10px 0' },
  subLabel: { fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6358', margin: '0 0 8px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' },
  itemNombre: { fontSize: 12, color: '#A09080' },
  itemDetalle: { fontSize: 12, color: '#6B6358' },
  precioDestacado: { background: '#F0EAD8', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  precioLabel: { fontSize: 12, color: '#6B6358' },
  precioValor: { fontSize: 20, fontWeight: 500, color: '#141210' },
  btnEliminar: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'none', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px', fontSize: 13, color: '#6B6358', cursor: 'pointer' },
  btnPrimary: { padding: '12px 24px', background: '#F0EAD8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#141210', cursor: 'pointer' },
  btnFloat: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#F0EAD8', border: 'none', borderRadius: 24, padding: '12px 28px', fontSize: 14, fontWeight: 500, color: '#141210', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
}