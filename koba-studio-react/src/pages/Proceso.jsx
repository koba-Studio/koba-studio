import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Proceso() {
  const { user, openModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const curDotRef = useRef(null)
  const curRingRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('page-proceso')
    return () => document.body.classList.remove('page-proceso')
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
    }, { threshold: 0.15 })
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

  // Step progress nav scroll tracking
  useEffect(() => {
    const steps = ['step1', 'step2', 'step3', 'step4']
    const updateStepNav = () => {
      const mid = window.scrollY + window.innerHeight * 0.5
      let active = 0
      steps.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) active = i
      })
      setActiveStep(active)
    }
    window.addEventListener('scroll', updateStepNav, { passive: true })
    updateStepNav()
    return () => window.removeEventListener('scroll', updateStepNav)
  }, [])

  const gradStyle = { background: 'linear-gradient(135deg, #F97316, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }

  return (
    <>
      <div id="cur-dot" ref={curDotRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>

      {/* Hidden SVG gradient definition for step icons */}
      <svg width="0" height="0" style={{position:'absolute'}}>
        <defs>
          <linearGradient id="stepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316"/>
            <stop offset="100%" stopColor="#EF4444"/>
          </linearGradient>
        </defs>
      </svg>

      <nav id="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" id="nl">KoBa Studio</Link>
          <ul className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}>
            <li><Link to="/servicios" id="nl1" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso" id="nl2" className="active" onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
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

      {/* PAGE HERO */}
      <header className="page-hero">
        <p className="page-hero-eyebrow wa">KBA · Proceso</p>
        <h1 className="page-hero-headline" id="ph">
          <span className="word"><span className="word-inner">Proceso</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'80ms'}}>simple.</span></span>
          <br style={{lineHeight:1}} />
          <span className="word"><span className="word-inner" style={{transitionDelay:'180ms', ...gradStyle}}>Resultados</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'260ms'}}>reales.</span></span>
        </h1>
        <p className="page-hero-sub" id="phs">
          Cada proyecto pasa por cuatro fases probadas. Sin sorpresas, sin excusas — solo entregas medibles en cada paso.
        </p>
      </header>

      {/* MARQUEE */}
      <div className="marquee-bar">
        <div className="mq-track">
          <span className="mq-item">01 Diagnóstico</span><span className="mq-dot">◆</span>
          <span className="mq-item">02 Diseño</span><span className="mq-dot">◆</span>
          <span className="mq-item">03 Construcción</span><span className="mq-dot">◆</span>
          <span className="mq-item">04 Entrega</span><span className="mq-dot">◆</span>
          <span className="mq-item">01 Diagnóstico</span><span className="mq-dot">◆</span>
          <span className="mq-item">02 Diseño</span><span className="mq-dot">◆</span>
          <span className="mq-item">03 Construcción</span><span className="mq-dot">◆</span>
          <span className="mq-item">04 Entrega</span><span className="mq-dot">◆</span>
          <span className="mq-item">01 Diagnóstico</span><span className="mq-dot">◆</span>
          <span className="mq-item">02 Diseño</span><span className="mq-dot">◆</span>
          <span className="mq-item">03 Construcción</span><span className="mq-dot">◆</span>
          <span className="mq-item">04 Entrega</span><span className="mq-dot">◆</span>
        </div>
      </div>

      {/* STEP PROGRESS NAV */}
      <div className="step-progress-nav">
        {['Diagnóstico','Diseño','Construcción','Entrega'].map((label, i) => (
          <div
            key={label}
            className={`spn-dot${activeStep === i ? ' active' : ''}`}
            data-label={label}
            onClick={() => {
              const el = document.getElementById(`step${i+1}`)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        ))}
      </div>

      {/* STEP 01 */}
      <div id="step1">
        <section className="step-section">
          <div className="step-grid">
            <div className="step-left wa">
              <div className="step-num-label">
                <span className="step-num">01</span>
                <span className="step-code">KBA-001</span>
              </div>
              <h2 className="step-title">Diagnóstico</h2>
              <p className="step-desc">
                Antes de escribir una línea de código, <strong style={gradStyle}>entendemos tu operación</strong>. Analizamos tus procesos actuales, identificamos las fricciones más costosas y proponemos un camino claro.
              </p>
              <ul className="step-items">
                <li><span className="step-dash">—</span>Workshop de 90 minutos con tu equipo</li>
                <li><span className="step-dash">—</span>Mapeo de flujos de trabajo actuales</li>
                <li><span className="step-dash">—</span>Identificación de fricciones y cuellos de botella</li>
                <li><span className="step-dash">—</span>Análisis de herramientas existentes</li>
                <li><span className="step-dash">—</span>Propuesta a medida sin compromiso</li>
              </ul>
              <span className="step-tag">Paso 1 de 4 · Sin costo</span>
            </div>
            <div className="step-right wa" style={{transitionDelay:'150ms'}}>
              <div className="step-img-placeholder">
                <svg className="step-img-icon" viewBox="0 0 24 24" fill="none" stroke="url(#stepGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span className="step-img-label">Imagen diagnóstico</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="section-divider"></div>

      {/* STEP 02 */}
      <div id="step2">
        <section className="step-section">
          <div className="step-grid">
            <div className="step-left wa">
              <div className="step-num-label">
                <span className="step-num">02</span>
                <span className="step-code">KBA-002</span>
              </div>
              <h2 className="step-title">Diseño</h2>
              <p className="step-desc">
                Con el diagnóstico en mano, diseñamos la <strong style={gradStyle}>arquitectura exacta</strong> de tu solución. Prototipo funcional en dos semanas. Revisiones ilimitadas hasta que sea perfecto.
              </p>
              <ul className="step-items">
                <li><span className="step-dash">—</span>Arquitectura de producto y flujos de usuario</li>
                <li><span className="step-dash">—</span>Sistema de diseño a medida</li>
                <li><span className="step-dash">—</span>Prototipo funcional en pocos días</li>
                <li><span className="step-dash">—</span>Concepto de animaciones e interacciones</li>
                <li><span className="step-dash">—</span>Revisiones ilimitadas</li>
              </ul>
              <span className="step-tag">Paso 2 de 4 · 2 semanas</span>
            </div>
            <div className="step-right wa" style={{transitionDelay:'150ms'}}>
              <div className="step-img-placeholder">
                <svg className="step-img-icon" viewBox="0 0 24 24" fill="none" stroke="url(#stepGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="8" height="8" rx="1"/><rect x="14" y="3" width="8" height="8" rx="1"/>
                  <rect x="2" y="13" width="8" height="8" rx="1"/><rect x="14" y="13" width="8" height="8" rx="1"/>
                </svg>
                <span className="step-img-label">Imagen diseño</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="section-divider"></div>

      {/* STEP 03 */}
      <div id="step3">
        <section className="step-section">
          <div className="step-grid">
            <div className="step-left wa">
              <div className="step-num-label">
                <span className="step-num">03</span>
                <span className="step-code">KBA-003</span>
              </div>
              <h2 className="step-title">Construcción</h2>
              <p className="step-desc">
                Desarrollo <strong style={gradStyle}>ágil por sprints</strong> de dos semanas. Cada sprint tiene entregables concretos. Ves el progreso en tiempo real. Sin caja negra, sin sorpresas al final.
              </p>
              <ul className="step-items">
                <li><span className="step-dash">—</span>Desarrollo ágil por sprints de 2 semanas</li>
                <li><span className="step-dash">—</span>Integraciones con tu stack tecnológico actual</li>
                <li><span className="step-dash">—</span>Testing completo en cada sprint</li>
                <li><span className="step-dash">—</span>Documentación técnica completa</li>
                <li><span className="step-dash">—</span>Código documentado, sin deuda técnica</li>
                <li><span className="step-dash">—</span>Acceso al repositorio en todo momento</li>
              </ul>
              <span className="step-tag">Paso 3 de 4 · Sprints 2 sem.</span>
            </div>
            <div className="step-right wa" style={{transitionDelay:'150ms'}}>
              <div className="step-img-placeholder">
                <svg className="step-img-icon" viewBox="0 0 24 24" fill="none" stroke="url(#stepGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
                <span className="step-img-label">Imagen construcción</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="section-divider"></div>

      {/* STEP 04 */}
      <div id="step4">
        <section className="step-section">
          <div className="step-grid">
            <div className="step-left wa">
              <div className="step-num-label">
                <span className="step-num">04</span>
                <span className="step-code">KBA-004</span>
              </div>
              <h2 className="step-title">Entrega</h2>
              <p className="step-desc">
                Tu software va <strong style={gradStyle}>live</strong>. Documentación completa, capacitación de tu equipo, soporte post-lanzamiento. No terminamos cuando entregamos — terminamos cuando funciona.
              </p>
              <ul className="step-items">
                <li><span className="step-dash">—</span>Despliegue en tu infraestructura</li>
                <li><span className="step-dash">—</span>Documentación técnica completa</li>
                <li><span className="step-dash">—</span>Capacitación del equipo (hasta 4 personas)</li>
                <li><span className="step-dash">—</span>Soporte prioritario 30 días post-lanzamiento</li>
                <li><span className="step-dash">—</span>Iteración continua disponible</li>
              </ul>
              <span className="step-tag">Paso 4 de 4 · Go live</span>
            </div>
            <div className="step-right wa" style={{transitionDelay:'150ms'}}>
              <div className="step-img-placeholder">
                <svg className="step-img-icon" viewBox="0 0 24 24" fill="none" stroke="url(#stepGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="step-img-label">Imagen entrega</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TICKER */}
      <div className="ticker-bar">
        <div className="tk-row tk-row-1">
          <div className="tk-track">
            <span className="tk-item">Diagnóstico</span><span className="tk-sep">·</span>
            <span className="tk-item">Diseño</span><span className="tk-sep">·</span>
            <span className="tk-item">Construcción</span><span className="tk-sep">·</span>
            <span className="tk-item">Entrega</span><span className="tk-sep">·</span>
            <span className="tk-item">KoBa Studio</span><span className="tk-sep">·</span>
            <span className="tk-item">SaaS B2B</span><span className="tk-sep">·</span>
            <span className="tk-item">Diagnóstico</span><span className="tk-sep">·</span>
            <span className="tk-item">Diseño</span><span className="tk-sep">·</span>
            <span className="tk-item">Construcción</span><span className="tk-sep">·</span>
            <span className="tk-item">Entrega</span><span className="tk-sep">·</span>
            <span className="tk-item">KoBa Studio</span><span className="tk-sep">·</span>
            <span className="tk-item">SaaS B2B</span><span className="tk-sep">·</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="proceso-cta">
        <p className="proceso-cta-eyebrow wa">¿Listo para comenzar?</p>
        <h2 className="proceso-cta-title wa" style={{transitionDelay:'100ms'}}>
          El primer paso<br/><span className="muted">es una conversación.</span>
        </h2>
        <div className="cta-btn-row wa" style={{transitionDelay:'200ms'}}>
          <Link to="/contacto" className="btn-gold">Agendar diagnóstico</Link>
          <Link to="/productos" className="btn-outline-dark" style={{borderColor:'rgba(248,246,242,0.15)',color:'rgba(248,246,242,0.5)'}}>Ver productos →</Link>
        </div>
      </div>

      {/* FOOTER */}
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
            <div className="f-socials">
              <a href="#" className="f-social" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="f-social" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="f-social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
            </div>
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
