import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const G = { background:'linear-gradient(135deg,#0EA5E9,#10B981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }

export function Servicios() {
  const { user, openModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const curDotRef = useRef(null)
  const curRingRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('page-servicios')
    return () => document.body.classList.remove('page-servicios')
  }, [])

  useEffect(() => {
    const nav = document.getElementById('nav')
    const handleScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    setTimeout(() => document.getElementById('nl')?.classList.add('in'), 100)
    ;['nl1','nl2','nl3','nl4'].forEach((id, i) =>
      setTimeout(() => document.getElementById(id)?.classList.add('in'), 250 + i * 100)
    )
    setTimeout(() => document.getElementById('nb')?.classList.add('in'), 650)
    document.querySelectorAll('.page-hero-headline .word-inner').forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), 300 + i * 90)
    })
    setTimeout(() => document.getElementById('phs')?.classList.add('in'), 200)
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const d = parseInt(e.target.style.transitionDelay) || 0
        setTimeout(() => e.target.classList.add('in'), d)
        io.unobserve(e.target)
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.wa').forEach(el => io.observe(el))
    return () => { window.removeEventListener('scroll', handleScroll); io.disconnect() }
  }, [])

  useEffect(() => {
    const dot = curDotRef.current
    const ring = curRingRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let dx = mx, dy = my, rx = mx, ry = my, rafId
    const lerp = (a, b, t) => a + (b - a) * t
    const loop = () => {
      dx = lerp(dx, mx, 0.15); dy = lerp(dy, my, 0.15)
      rx = lerp(rx, mx, 0.07); ry = lerp(ry, my, 0.07)
      if (dot) { dot.style.left = dx + 'px'; dot.style.top = dy + 'px' }
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
    document.addEventListener('mousedown', () => {
      document.body.classList.add('cc')
      setTimeout(() => document.body.classList.remove('cc'), 180)
    })
    return () => { cancelAnimationFrame(rafId); document.removeEventListener('mousemove', onMove) }
  }, [])

  return (
    <>
      <div id="cur-dot" ref={curDotRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>

      <nav id="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" id="nl">KoBa Studio</Link>
          <ul className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}>
            <li><Link to="/servicios" id="nl1" className="active" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso" id="nl2" onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
            <li><Link to="/productos" id="nl3" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
            <li><Link to="/contacto" id="nl4" onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
          </ul>
          {user
            ? <Link to="/dashboard" className="nav-btn" id="nb">Mi cuenta</Link>
            : <button className="nav-btn" id="nb" onClick={openModal}>Iniciar sesión</button>
          }
          <button className={`nav-hamburger${mobileMenuOpen ? ' active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <header className="page-hero">
        <p className="page-hero-eyebrow wa">KBA · Servicios</p>
        <h1 className="page-hero-headline" id="ph">
          <span className="word"><span className="word-inner">Software</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'80ms'}}>que</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'160ms'}}>trabaja</span></span>
          <br style={{lineHeight:1}} />
          <span className="word"><span className="word-inner" style={{transitionDelay:'240ms',...G}}>para</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'320ms'}}>ti.</span></span>
        </h1>
        <p className="page-hero-sub" id="phs">
          Tres áreas de especialización. Un único objetivo: que tu operación funcione mejor mañana que hoy.
        </p>
      </header>

      <div className="marquee-bar">
        <div className="mq-track">
          <span className="mq-item">Diagnóstico</span><span className="mq-dot">◆</span>
          <span className="mq-item">Automatización</span><span className="mq-dot">◆</span>
          <span className="mq-item">Integraciones</span><span className="mq-dot">◆</span>
          <span className="mq-item">SaaS a medida</span><span className="mq-dot">◆</span>
          <span className="mq-item">Flujos sin fricción</span><span className="mq-dot">◆</span>
          <span className="mq-item">Diagnóstico</span><span className="mq-dot">◆</span>
          <span className="mq-item">Automatización</span><span className="mq-dot">◆</span>
          <span className="mq-item">Integraciones</span><span className="mq-dot">◆</span>
          <span className="mq-item">SaaS a medida</span><span className="mq-dot">◆</span>
          <span className="mq-item">Flujos sin fricción</span><span className="mq-dot">◆</span>
        </div>
      </div>

      <div style={{paddingTop:'80px'}}>
        <div className="services-grid">
          <div className="service-card wa">
            <div className="service-card-num"><div className="service-card-num-dot"></div>KBA-001 · Strategy</div>
            <svg className="service-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{stroke:'url(#g1)'}}>
              <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#10B981"/></linearGradient></defs>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3 className="service-title">Diagnóstico<br/>& Estrategia</h3>
            <p className="service-desc">Analizamos tu operación actual, identificamos <strong style={G}>fricciones costosas</strong> y diseñamos un roadmap de automatización realista.</p>
            <ul className="service-list">
              <li><span className="s-dash">—</span>Workshop de descubrimiento</li>
              <li><span className="s-dash">—</span>Mapeo de procesos</li>
              <li><span className="s-dash">—</span>Análisis de herramientas existentes</li>
              <li><span className="s-dash">—</span>Roadmap priorizado</li>
            </ul>
            <span className="service-tag">Sin costo inicial</span>
          </div>

          <div className="service-card wa" style={{transitionDelay:'100ms'}}>
            <div className="service-card-num"><div className="service-card-num-dot"></div>KBA-002 · Design</div>
            <svg className="service-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{stroke:'url(#g2)'}}>
              <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#10B981"/></linearGradient></defs>
              <rect x="2" y="3" width="8" height="8" rx="1"/><rect x="14" y="3" width="8" height="8" rx="1"/><rect x="2" y="13" width="8" height="8" rx="1"/><rect x="14" y="13" width="8" height="8" rx="1"/>
            </svg>
            <h3 className="service-title">Diseño de<br/>Producto</h3>
            <p className="service-desc">Arquitectura de información, flujos de usuario y <strong style={G}>sistema de diseño</strong> para tu software.</p>
            <ul className="service-list">
              <li><span className="s-dash">—</span>UX / UI a medida</li>
              <li><span className="s-dash">—</span>Sistema de diseño propio</li>
              <li><span className="s-dash">—</span>Prototipo interactivo</li>
              <li><span className="s-dash">—</span>Revisiones ilimitadas</li>
            </ul>
            <span className="service-tag">2 semanas</span>
          </div>

          <div className="service-card wide wa" style={{transitionDelay:'200ms'}}>
            <div>
              <div className="service-card-num"><div className="service-card-num-dot"></div>KBA-003 · Build & Run</div>
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{stroke:'url(#g3)'}}>
                <defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#10B981"/></linearGradient></defs>
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              <h3 className="service-title">Desarrollo<br/>& Entrega</h3>
              <p className="service-desc">Construcción del software con sprints de dos semanas, <strong style={G}>integraciones con tu stack</strong> actual y soporte post-lanzamiento.</p>
              <span className="service-tag">El servicio principal</span>
            </div>
            <ul className="service-list">
              <li><span className="s-dash">—</span>Desarrollo ágil por sprints</li>
              <li><span className="s-dash">—</span>Integraciones con APIs y sistemas existentes</li>
              <li><span className="s-dash">—</span>Testing exhaustivo antes de cada entrega</li>
              <li><span className="s-dash">—</span>Código documentado sin deuda técnica</li>
              <li><span className="s-dash">—</span>Despliegue en tu infraestructura</li>
              <li><span className="s-dash">—</span>Soporte 30 días post-lanzamiento</li>
              <li><span className="s-dash">—</span>Capacitación del equipo incluida</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="compare-section">
        <p className="compare-eyebrow wa">KoBa vs. Software genérico</p>
        <table className="compare-table wa" style={{transitionDelay:'100ms'}}>
          <thead>
            <tr>
              <th>Característica</th>
              <th className="gold">KoBa Studio</th>
              <th>Software genérico</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Adaptado a tu operación</td><td><span className="check">✓</span></td><td><span className="cross">✗</span></td></tr>
            <tr><td>Sin funciones que no usarás</td><td><span className="check">✓</span></td><td><span className="cross">✗</span></td></tr>
            <tr><td>Integraciones con tu stack</td><td><span className="check">✓</span></td><td>Parcial</td></tr>
            <tr><td>Precio predecible</td><td><span className="check">✓</span></td><td>Varía</td></tr>
            <tr><td>Soporte directo con el equipo</td><td><span className="check">✓</span></td><td><span className="cross">✗</span></td></tr>
            <tr><td>Código propiedad tuya</td><td><span className="check">✓</span></td><td><span className="cross">✗</span></td></tr>
          </tbody>
        </table>
      </div>

      <div className="ticker-bar">
        <div className="tk-row tk-row-1">
          <div className="tk-track">
            <span className="tk-item">SaaS personalizado</span><span className="tk-sep">·</span>
            <span className="tk-item">Automatización real</span><span className="tk-sep">·</span>
            <span className="tk-item">KoBa Studio</span><span className="tk-sep">·</span>
            <span className="tk-item">Sin software genérico</span><span className="tk-sep">·</span>
            <span className="tk-item">Control total</span><span className="tk-sep">·</span>
            <span className="tk-item">SaaS personalizado</span><span className="tk-sep">·</span>
            <span className="tk-item">Automatización real</span><span className="tk-sep">·</span>
            <span className="tk-item">KoBa Studio</span><span className="tk-sep">·</span>
            <span className="tk-item">Sin software genérico</span><span className="tk-sep">·</span>
            <span className="tk-item">Control total</span><span className="tk-sep">·</span>
          </div>
        </div>
      </div>

      <div style={{background:'#0D0D0D',padding:'120px 48px',textAlign:'center'}}>
        <p className="wa" style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.18em',background:'linear-gradient(90deg,#0EA5E9,#10B981)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:'24px'}}>¿Cuál necesitás?</p>
        <h2 className="wa" style={{transitionDelay:'100ms',fontSize:'clamp(40px,5vw,72px)',fontWeight:600,color:'#F8F6F2',letterSpacing:'-0.03em',marginBottom:'48px',maxWidth:'600px',marginLeft:'auto',marginRight:'auto',lineHeight:1.05}}>
          Empezamos con<br/><span style={{color:'rgba(248,246,242,0.3)'}}>una conversación.</span>
        </h2>
        <div className="wa" style={{transitionDelay:'200ms',display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/contacto" className="btn-gold">Agendar diagnóstico</Link>
        </div>
      </div>

      <footer id="footer">
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
            <p className="f-copy">Soluciones SaaS B2B · Automatización</p>
          </div>
        </div>
      </footer>
    </>
  )
}
