import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const STATUS_LABEL = {
  approved: { text: 'Aprobado',  color: '#10B981', bg: 'rgba(16,185,129,.1)' },
  pending:  { text: 'Pendiente', color: '#F59E0B', bg: 'rgba(245,158,11,.1)' },
  rejected: { text: 'Rechazado', color: '#EF4444', bg: 'rgba(239,68,68,.1)'  },
  cancelled:{ text: 'Cancelado', color: '#6B7280', bg: 'rgba(107,114,128,.1)'},
}

export function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [purchasesLoading, setPurchasesLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const curDotRef = useRef(null)
  const curRingRef = useRef(null)
  const location = useLocation()
  const statusParam = new URLSearchParams(location.search).get('status')

  // Lerp cursor
  useEffect(() => {
    const dot = curDotRef.current
    const ring = curRingRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let dx = mx, dy = my, rx = mx, ry = my, rafId
    const lerp = (a, b, t) => a + (b - a) * t
    const loop = () => {
      dx = lerp(dx, mx, 0.15); dy = lerp(dy, my, 0.15)
      rx = lerp(rx, mx, 0.07); ry = lerp(ry, my, 0.07)
      if (dot)  { dot.style.left  = dx + 'px'; dot.style.top  = dy + 'px' }
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px' }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    const onMove = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'))
    })
    return () => { cancelAnimationFrame(rafId); document.removeEventListener('mousemove', onMove) }
  }, [])

  // Nav scroll
  useEffect(() => {
    const nav = document.getElementById('nav')
    const handleScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cargar compras
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

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0A0C16', color:'#F8F6F2' }}>
      Cargando...
    </div>
  )

  if (!user) return <Navigate to="/" replace />

  const initials = (user.user_metadata?.full_name || user.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const memberSince = new Date(user.created_at).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long'
  })

  return (
    <>
      <div id="cur-dot"  ref={curDotRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>

      {/* Navbar */}
      <nav id="nav" className="scrolled">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" style={{opacity:1,transform:'none'}}>KoBa Studio</Link>
          <ul className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}>
            <li><Link to="/servicios"  onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso"    onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
            <li><Link to="/productos"  onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
            <li><Link to="/contacto"   onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
          </ul>
          <button
            className="nav-btn"
            onClick={signOut}
            style={{background:'transparent',border:'1px solid rgba(248,246,242,.15)',color:'#A8A49F'}}
          >
            Cerrar sesión
          </button>
          <button className={`nav-hamburger${mobileMenuOpen ? ' active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className="dash-layout">

        {/* Banner de estado (post-pago) */}
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

        {/* Header de perfil */}
        <div className="dash-header">
          <div className="dash-avatar">{initials}</div>
          <div>
            <h1 className="dash-welcome">
              {user.user_metadata?.full_name
                ? `Hola, ${user.user_metadata.full_name.split(' ')[0]}`
                : 'Mi cuenta'}
            </h1>
            <p className="dash-meta">{user.email} · Miembro desde {memberSince}</p>
          </div>
        </div>

        {/* Grid */}
        <div className="dash-grid">

          {/* Compras */}
          <div className="dash-card dash-card-wide">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Mis productos</h2>
              <Link to="/productos" className="dash-card-link">Ver catálogo →</Link>
            </div>

            {purchasesLoading ? (
              <p className="dash-empty">Cargando...</p>
            ) : purchases.length === 0 ? (
              <div className="dash-empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#3A3D4A',marginBottom:'16px'}}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <p className="dash-empty">Todavía no tenés productos activos.</p>
                <Link to="/productos" className="submit-btn" style={{marginTop:'16px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 24px',fontSize:'14px'}}>
                  Explorar productos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            ) : (
              <div className="dash-purchases-list">
                {purchases.map(p => {
                  const s = STATUS_LABEL[p.status] || STATUS_LABEL.pending
                  return (
                    <div key={p.id} className="dash-purchase-row">
                      <div className="dash-purchase-info">
                        <p className="dash-purchase-name">{p.products?.name || p.product_id}</p>
                        <p className="dash-purchase-date">
                          {new Date(p.created_at).toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' })}
                        </p>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                        {p.amount_usd && (
                          <span className="dash-purchase-amount">${p.amount_usd} USD/mes</span>
                        )}
                        <span className="dash-purchase-status" style={{background:s.bg,color:s.color}}>
                          {s.text}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="dash-card">
            <h2 className="dash-card-title">Perfil</h2>
            <div className="dash-profile-rows">
              <div className="dash-profile-row">
                <span className="dash-profile-label">Email</span>
                <span className="dash-profile-value">{user.email}</span>
              </div>
              {user.user_metadata?.full_name && (
                <div className="dash-profile-row">
                  <span className="dash-profile-label">Nombre</span>
                  <span className="dash-profile-value">{user.user_metadata.full_name}</span>
                </div>
              )}
              <div className="dash-profile-row">
                <span className="dash-profile-label">Miembro desde</span>
                <span className="dash-profile-value">{memberSince}</span>
              </div>
              <div className="dash-profile-row">
                <span className="dash-profile-label">Estado</span>
                <span className="dash-profile-value" style={{color:'#10B981'}}>Activo</span>
              </div>
            </div>
          </div>

          {/* Acceso rápido */}
          <div className="dash-card">
            <h2 className="dash-card-title">Acceso rápido</h2>
            <div className="dash-quick-links">
              <Link to="/servicios" className="dash-quick-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
                Ver servicios
              </Link>
              <Link to="/proceso" className="dash-quick-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Nuestro proceso
              </Link>
              <Link to="/contacto" className="dash-quick-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Contactar soporte
              </Link>
              <button className="dash-quick-link" onClick={signOut}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Cerrar sesión
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer id="footer" style={{background:'#0A0C16',borderTop:'1px solid #1A1D26',padding:'40px 48px',color:'#F8F6F2'}}>
        <div className="footer-grid">
          <div className="footer-top">
            <Link to="/" className="f-logo">KoBa Studio</Link>
            <ul className="f-nav">
              <li><Link to="/servicios">Servicios</Link></li>
              <li><Link to="/proceso">Proceso</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p className="f-copy">© 2025 KoBa Studio</p>
          </div>
        </div>
      </footer>
    </>
  )
}
