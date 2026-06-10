import { useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingBasket, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Inicio() {
  const navigate = useNavigate()
  const { recetas, ingredientes } = useApp()

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.headerTitle}>🧁 Pastelería</p>
        <p style={s.headerSub}>Calculá el precio de tus recetas</p>
      </div>

      <div style={s.tabs}>
        <button style={s.tabActive} onClick={() => navigate('/recetas')}>
          <BookOpen size={20} />
          <span>Recetas</span>
        </button>
        <button style={s.tab} onClick={() => navigate('/ingredientes')}>
          <ShoppingBasket size={20} />
          <span>Ingredientes</span>
        </button>
      </div>

      <div style={s.section}>
        <p style={s.sectionLabel}>Recetas recientes</p>

        {recetas.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyText}>Todavía no tenés recetas guardadas</p>
          </div>
        ) : (
          recetas.slice(0, 5).map(receta => (
            <div key={receta.id} style={s.card}>
              <div>
                <p style={s.cardTitle}>{receta.nombre}</p>
                <p style={s.cardSub}>{receta.ingredientes.length} ingredientes</p>
              </div>
              <p style={s.cardPrice}>${receta.precioVenta.toLocaleString('es-AR')}</p>
            </div>
          ))
        )}
      </div>

      <button style={s.btnPrimary} onClick={() => navigate('/nueva-receta')}>
        <Plus size={18} /> Nueva receta
      </button>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#141210', padding: '0 0 32px', maxWidth: 480, margin: '0 auto' },
  header: { background: '#1C1916', padding: '24px 20px 16px', borderBottom: '0.5px solid #2E2A26' },
  headerTitle: { fontSize: 18, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  headerSub: { fontSize: 13, color: '#6B6358', margin: '4px 0 0' },
  tabs: { display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '0.5px solid #2E2A26' },
  tabActive: { flex: 1, background: '#F0EAD8', border: 'none', borderRadius: 10, padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#141210', cursor: 'pointer' },
  tab: { flex: 1, background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#A09080', cursor: 'pointer' },
  section: { padding: '16px' },
  sectionLabel: { fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6358', marginBottom: 10 },
  card: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  cardSub: { fontSize: 11, color: '#6B6358', margin: '3px 0 0' },
  cardPrice: { fontSize: 15, fontWeight: 500, color: '#F0EAD8', margin: 0 },
  empty: { background: '#1C1916', border: '0.5px solid #2E2A26', borderRadius: 10, padding: '24px', textAlign: 'center' },
  emptyText: { fontSize: 13, color: '#6B6358', margin: 0 },
  btnPrimary: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 'calc(100% - 32px)', margin: '0 16px', padding: 14, background: '#F0EAD8', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#141210', cursor: 'pointer' },
}