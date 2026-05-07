import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const STATUS_LABEL = {
  approved: { text: 'Aprobado',  color: '#10B981', bg: 'rgba(16,185,129,.1)' },
  pending:  { text: 'Pendiente', color: '#F59E0B', bg: 'rgba(245,158,11,.1)' },
  rejected: { text: 'Rechazado', color: '#EF4444', bg: 'rgba(239,68,68,.1)'  },
  cancelled:{ text: 'Cancelado', color: '#6B7280', bg: 'rgba(107,114,128,.1)'},
}

const BREADCRUMBS = {
  perfil: 'Perfil',
  productos: 'Mis productos',
  carrito: 'Carrito',
  configuracion: 'Configuración',
}

export function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [purchasesLoading, setPurchasesLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('perfil')
  const [toast, setToast] = useState({ visible: false, msg: '' })
  const [profileForm, setProfileForm] = useState({ nombre: '', apellido: '', tel: '', pais: 'Chile', empresa: '' })
  const location = useLocation()
  const statusParam = new URLSearchParams(location.search).get('status')

  // Load purchases
  useEffect(() => {
    if (!user) return
    supabase
      .from('purchases')
      .select('*, products(name, tagline)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPurchases(data || [])
        setPurchasesLoading(false)
      })
  }, [user])

  // Pre-fill profile form
  useEffect(() => {
    if (!user) return
    const fullName = user.user_metadata?.full_name || ''
    const parts = fullName.trim().split(' ')
    setProfileForm(f => ({
      ...f,
      nombre: parts[0] || '',
      apellido: parts.slice(1).join(' ') || '',
    }))
  }, [user])

  const showToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2800)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0A0C16', color:'#F8F6F2' }}>
      Cargando...
    </div>
  )

  if (!user) return <Navigate to="/" replace />

  const initials = (user.user_metadata?.full_name || user.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
  const firstName = displayName.split(' ')[0]

  const memberSince = new Date(user.created_at).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long'
  })

  const activeProducts = purchases.filter(p => p.status === 'approved').length

  return (
    <div className="kba-layout">

      {/* ─── SIDEBAR ─── */}
      <aside className="kba-sidebar">
        <div className="kba-sidebar-brand">
          <div className="kba-brand-dot"><span>K</span></div>
          <span className="kba-brand-name">KoBa Studio</span>
        </div>

        <div className="kba-sidebar-user">
          <div className="kba-user-avatar">{initials}</div>
          <div className="kba-user-info">
            <h4>{displayName}</h4>
            <p title={user.email}>{user.email}</p>
            <span className="kba-status-badge">Activo</span>
          </div>
        </div>

        <nav className="kba-sidebar-nav">
          <span className="kba-nav-label">Mi cuenta</span>

          <button className={`kba-nav-item${activeTab === 'perfil' ? ' active' : ''}`} onClick={() => setActiveTab('perfil')}>
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Perfil
          </button>

          <button className={`kba-nav-item${activeTab === 'productos' ? ' active' : ''}`} onClick={() => setActiveTab('productos')}>
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
              <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
            </svg>
            Mis productos
          </button>

          <button className={`kba-nav-item${activeTab === 'carrito' ? ' active' : ''}`} onClick={() => setActiveTab('carrito')}>
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Carrito
          </button>

          <span className="kba-nav-label" style={{marginTop:'8px'}}>KoBa</span>

          <Link to="/servicios" className="kba-nav-item">
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            Ver servicios
          </Link>

          <Link to="/proceso" className="kba-nav-item">
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Nuestro proceso
          </Link>

          <Link to="/contacto" className="kba-nav-item">
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Soporte
          </Link>

          <button
            className={`kba-nav-item${activeTab === 'configuracion' ? ' active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            <svg className="kba-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuración
          </button>
        </nav>

        <div className="kba-sidebar-footer">
          <button className="kba-logout-btn" onClick={signOut}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="kba-main">

        {/* Topbar */}
        <header className="kba-topbar">
          <div className="kba-topbar-path">
            KBA · <span>{BREADCRUMBS[activeTab] || activeTab}</span>
          </div>
          <div className="kba-topbar-right">
            <button className="kba-icon-btn" title="Notificaciones">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="kba-icon-btn" title="Ayuda">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
            <Link to="/" className="kba-icon-btn" title="Volver al inicio">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="kba-content">

          {/* Status banners */}
          {statusParam === 'success' && (
            <div className="dash-status-banner success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <p>¡Pago aprobado! Tu producto ya está activo.</p>
            </div>
          )}
          {statusParam === 'pending' && (
            <div className="dash-status-banner pending">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p>Pago pendiente de confirmación. Te avisamos por email.</p>
            </div>
          )}

          {/* Page header */}
          <div className="kba-page-header">
            <p className="kba-page-eyebrow">KBA · Mi cuenta</p>
            <h1 className="kba-page-title">Hola, <span className="kba-accent">{firstName}.</span></h1>
          </div>

          {/* Tabs */}
          <div className="kba-tabs">
            <button className={`kba-tab${activeTab === 'perfil' ? ' active' : ''}`} onClick={() => setActiveTab('perfil')}>
              <span className="kba-tab-dot"></span> Perfil
            </button>
            <button className={`kba-tab${activeTab === 'productos' ? ' active' : ''}`} onClick={() => setActiveTab('productos')}>
              Mis productos
            </button>
            <button className={`kba-tab${activeTab === 'carrito' ? ' active' : ''}`} onClick={() => setActiveTab('carrito')}>
              Carrito
            </button>
            <button className={`kba-tab${activeTab === 'configuracion' ? ' active' : ''}`} onClick={() => setActiveTab('configuracion')}>
              Configuración
            </button>
          </div>

          {/* ── PERFIL PANEL ── */}
          {activeTab === 'perfil' && (
            <div className="kba-panel">
              <div className="kba-profile-grid">

                {/* Avatar card */}
                <div className="kba-card">
                  <div className="kba-card-label">KBA-USR · Identidad</div>
                  <div className="kba-avatar-area">
                    <div className="kba-big-avatar">{initials}</div>
                    <div>
                      <div className="kba-avatar-name">{displayName}</div>
                      <div className="kba-avatar-email">{user.email}</div>
                    </div>
                    <div className="kba-meta-list">
                      <div className="kba-meta-row">
                        <span className="kba-meta-key">Miembro desde</span>
                        <span className="kba-meta-val">{memberSince}</span>
                      </div>
                      <div className="kba-meta-row">
                        <span className="kba-meta-key">Plan</span>
                        <span className="kba-meta-val">Starter</span>
                      </div>
                      <div className="kba-meta-row">
                        <span className="kba-meta-key">Estado</span>
                        <span className="kba-meta-val" style={{color:'#10B981'}}>Activo</span>
                      </div>
                      <div className="kba-meta-row">
                        <span className="kba-meta-key">Productos</span>
                        <span className="kba-meta-val">{purchasesLoading ? '—' : `${activeProducts} activos`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form card */}
                <div className="kba-card">
                  <div className="kba-card-label">KBA-001 · Datos personales</div>
                  <div className="kba-form-grid">
                    <div className="kba-form-row">
                      <div className="kba-field">
                        <label htmlFor="f-nombre">Nombre</label>
                        <input
                          id="f-nombre" type="text"
                          value={profileForm.nombre}
                          onChange={e => setProfileForm(f => ({...f, nombre: e.target.value}))}
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div className="kba-field">
                        <label htmlFor="f-apellido">Apellido</label>
                        <input
                          id="f-apellido" type="text"
                          value={profileForm.apellido}
                          onChange={e => setProfileForm(f => ({...f, apellido: e.target.value}))}
                          placeholder="Tu apellido"
                        />
                      </div>
                    </div>
                    <div className="kba-field">
                      <label htmlFor="f-email">Correo electrónico</label>
                      <input id="f-email" type="email" value={user.email} disabled />
                      <span className="kba-field-hint">El correo no puede modificarse directamente. Contacta soporte.</span>
                    </div>
                    <div className="kba-form-row">
                      <div className="kba-field">
                        <label htmlFor="f-tel">Teléfono</label>
                        <input
                          id="f-tel" type="tel"
                          value={profileForm.tel}
                          onChange={e => setProfileForm(f => ({...f, tel: e.target.value}))}
                          placeholder="+56 9 XXXX XXXX"
                        />
                      </div>
                      <div className="kba-field">
                        <label htmlFor="f-pais">País</label>
                        <select
                          id="f-pais"
                          value={profileForm.pais}
                          onChange={e => setProfileForm(f => ({...f, pais: e.target.value}))}
                        >
                          <option>Chile</option>
                          <option>Argentina</option>
                          <option>Colombia</option>
                          <option>México</option>
                          <option>España</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                    <div className="kba-field">
                      <label htmlFor="f-empresa">Empresa u organización</label>
                      <input
                        id="f-empresa" type="text"
                        value={profileForm.empresa}
                        onChange={e => setProfileForm(f => ({...f, empresa: e.target.value}))}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                  <div className="kba-form-actions">
                    <button className="kba-btn kba-btn-ghost" onClick={() => showToast('Cambios descartados')}>Cancelar</button>
                    <button className="kba-btn kba-btn-primary" onClick={() => showToast('Perfil actualizado correctamente')}>Guardar cambios</button>
                  </div>
                </div>

                {/* Security card (full width) */}
                <div className="kba-card kba-card-full">
                  <div className="kba-security-head">
                    <div className="kba-card-label" style={{margin:0}}>KBA-002 · Seguridad</div>
                    <button className="kba-btn kba-btn-ghost kba-btn-sm" onClick={() => showToast('Función próximamente disponible')}>Cambiar contraseña</button>
                  </div>
                  <div className="kba-security-grid">
                    <div className="kba-security-item">
                      <div className="kba-security-label">Última sesión</div>
                      <div className="kba-security-val">Hoy</div>
                      <div className="kba-security-sub">Sesión activa</div>
                    </div>
                    <div className="kba-security-item">
                      <div className="kba-security-label">Contraseña</div>
                      <div className="kba-security-val">••••••••••</div>
                      <div className="kba-security-sub">Protegida</div>
                    </div>
                    <div className="kba-security-item">
                      <div className="kba-security-label">2FA</div>
                      <div className="kba-security-val" style={{color:'#3A3D4A'}}>No activado</div>
                      <button className="kba-security-link" onClick={() => showToast('Función próximamente disponible')}>Activar →</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── PRODUCTOS PANEL ── */}
          {activeTab === 'productos' && (
            <div className="kba-panel">
              <div className="kba-products-header">
                <h3 className="kba-products-title">Mis productos activos</h3>
                <Link to="/productos" className="kba-btn kba-btn-accent">Ver catálogo →</Link>
              </div>

              {purchasesLoading ? (
                <p style={{color:'#6B6A6A', fontSize:'14px'}}>Cargando...</p>
              ) : purchases.length === 0 ? (
                <div className="kba-empty-state">
                  <div className="kba-empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A3D4A" strokeWidth="1.6">
                      <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
                      <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
                    </svg>
                  </div>
                  <p>Todavía no tenés productos activos.</p>
                  <Link to="/productos" className="kba-btn kba-btn-primary">Explorar productos →</Link>
                </div>
              ) : (
                <div className="kba-purchase-list">
                  {purchases.map(p => {
                    const s = STATUS_LABEL[p.status] || STATUS_LABEL.pending
                    return (
                      <div key={p.id} className="kba-purchase-row">
                        <div className="kba-purchase-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
                            <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
                          </svg>
                        </div>
                        <div className="kba-purchase-info">
                          <div className="kba-purchase-name">{p.products?.name || p.product_id}</div>
                          <div className="kba-purchase-date">
                            {new Date(p.created_at).toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' })}
                          </div>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'16px', flexShrink:0}}>
                          {p.amount_usd && <span className="kba-purchase-amount">${p.amount_usd} USD</span>}
                          <span className="kba-purchase-status" style={{background:s.bg, color:s.color}}>{s.text}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div style={{marginTop:'40px'}}>
                <div className="kba-suggestions-label">También podría interesarte</div>
                <div className="kba-products-grid">
                  <div className="kba-product-card">
                    <div className="kba-product-code">KBA-003 · Automatización</div>
                    <div className="kba-product-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    </div>
                    <div className="kba-product-name">Flujos automatizados</div>
                    <div className="kba-product-desc">Conecta tus herramientas y elimina el trabajo manual repetitivo con flujos inteligentes.</div>
                    <div className="kba-product-footer">
                      <div className="kba-product-price">$89 <span>/ mes</span></div>
                      <button className="kba-btn kba-btn-ghost kba-btn-sm" onClick={() => showToast('Próximamente disponible')}>Agregar →</button>
                    </div>
                  </div>
                  <div className="kba-product-card">
                    <div className="kba-product-code">KBA-004 · SaaS a medida</div>
                    <div className="kba-product-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
                        <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
                      </svg>
                    </div>
                    <div className="kba-product-name">App a medida</div>
                    <div className="kba-product-desc">Desarrollamos el software exacto que tu operación necesita, sin compromisos genéricos.</div>
                    <div className="kba-product-footer">
                      <div className="kba-product-price">$299 <span>/ proyecto</span></div>
                      <button className="kba-btn kba-btn-ghost kba-btn-sm" onClick={() => showToast('Solicitud enviada')}>Consultar →</button>
                    </div>
                  </div>
                  <div className="kba-product-card">
                    <div className="kba-product-code">KBA-005 · Diagnóstico</div>
                    <div className="kba-product-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <div className="kba-product-name">Diagnóstico operacional</div>
                    <div className="kba-product-desc">Auditamos tu operación y entregamos un mapa de mejoras con ROI estimado.</div>
                    <div className="kba-product-footer">
                      <div className="kba-product-price">$149 <span>único</span></div>
                      <button className="kba-btn kba-btn-ghost kba-btn-sm" onClick={() => showToast('Próximamente disponible')}>Agregar →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CARRITO PANEL ── */}
          {activeTab === 'carrito' && (
            <div className="kba-panel">
              <div className="kba-cart-layout">
                <div>
                  <div className="kba-cart-title">Tu carrito está vacío</div>
                  <div className="kba-empty-state">
                    <div className="kba-empty-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A3D4A" strokeWidth="1.6">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                    </div>
                    <p>No hay productos en tu carrito.</p>
                    <button className="kba-btn kba-btn-ghost" onClick={() => setActiveTab('productos')}>← Explorar productos</button>
                  </div>
                </div>

                <div className="kba-summary-card">
                  <div className="kba-card-label">KBA · Resumen</div>
                  <div className="kba-summary-title">Resumen del pedido</div>
                  <div className="kba-summary-total">
                    <span className="kba-summary-total-label">Total</span>
                    <span className="kba-summary-total-amount">$0</span>
                  </div>
                  <div className="kba-promo-input">
                    <input type="text" placeholder="Código promocional" />
                    <button onClick={() => showToast('Código no válido')}>Aplicar</button>
                  </div>
                  <button
                    className="kba-btn kba-btn-primary"
                    style={{width:'100%', padding:'13px', fontSize:'15px', borderRadius:'10px', justifyContent:'center'}}
                    onClick={() => showToast('Agrega productos primero')}
                  >
                    Ir a pagar →
                  </button>
                  <p className="kba-payment-note">Pago seguro · SSL · Soporte incluido</p>
                </div>
              </div>
            </div>
          )}

          {/* ── CONFIGURACIÓN PANEL ── */}
          {activeTab === 'configuracion' && (
            <div className="kba-panel">
              <div className="kba-settings-sections">

                {/* Notificaciones */}
                <div className="kba-settings-section">
                  <div className="kba-settings-section-header">
                    <span className="kba-settings-title">Notificaciones</span>
                  </div>
                  <div className="kba-settings-body">
                    {[
                      { label: 'Correos de producto',            sub: 'Actualizaciones y noticias sobre tus productos activos',  on: true  },
                      { label: 'Alertas de facturación',         sub: 'Recordatorios de pago y renovaciones próximas',           on: true  },
                      { label: 'Newsletter de KoBa',             sub: 'Tips, recursos y casos de éxito cada dos semanas',         on: false },
                      { label: 'Nuevos servicios y lanzamientos',sub: 'Sé el primero en conocer productos nuevos',               on: false },
                    ].map(row => (
                      <div key={row.label} className="kba-settings-row">
                        <div className="kba-settings-row-info">
                          <h5>{row.label}</h5>
                          <p>{row.sub}</p>
                        </div>
                        <label className="kba-toggle">
                          <input type="checkbox" defaultChecked={row.on} onChange={() => showToast('Preferencias actualizadas')} />
                          <span className="kba-toggle-track"></span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacidad */}
                <div className="kba-settings-section">
                  <div className="kba-settings-section-header">
                    <span className="kba-settings-title">Privacidad y datos</span>
                  </div>
                  <div className="kba-settings-body">
                    <div className="kba-settings-row">
                      <div className="kba-settings-row-info">
                        <h5>Análisis de uso</h5>
                        <p>Ayudanos a mejorar enviando datos anónimos de uso</p>
                      </div>
                      <label className="kba-toggle">
                        <input type="checkbox" defaultChecked onChange={() => showToast('Preferencias actualizadas')} />
                        <span className="kba-toggle-track"></span>
                      </label>
                    </div>
                    <div className="kba-settings-row">
                      <div className="kba-settings-row-info">
                        <h5>Descargar mis datos</h5>
                        <p>Exporta toda la información asociada a tu cuenta</p>
                      </div>
                      <button className="kba-btn kba-btn-ghost kba-btn-sm" onClick={() => showToast('Preparando exportación...')}>Descargar</button>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="kba-settings-section kba-danger-zone">
                  <div className="kba-settings-section-header">
                    <span className="kba-settings-title kba-danger-title">Zona peligrosa</span>
                  </div>
                  <div className="kba-settings-body">
                    <div className="kba-settings-row">
                      <div className="kba-settings-row-info">
                        <h5>Cerrar sesión en todos los dispositivos</h5>
                        <p>Finaliza todas las sesiones activas en otros dispositivos</p>
                      </div>
                      <button className="kba-btn-danger" onClick={() => { signOut(); showToast('Sesiones cerradas') }}>Cerrar todas</button>
                    </div>
                    <div className="kba-settings-row">
                      <div className="kba-settings-row-info">
                        <h5>Eliminar cuenta</h5>
                        <p>Esta acción es irreversible. Se borrarán todos tus datos permanentemente.</p>
                      </div>
                      <button className="kba-btn-danger" onClick={() => showToast('Contacta a soporte para eliminar tu cuenta')}>Eliminar cuenta</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>{/* /kba-content */}
      </main>

      {/* Toast */}
      <div className={`kba-toast${toast.visible ? ' show' : ''}`}>
        <span className="kba-toast-dot"></span>
        <span>{toast.msg}</span>
      </div>

    </div>
  )
}
