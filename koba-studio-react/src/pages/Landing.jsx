import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Landing() {
  const { user, openModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Intersection Observer para animaciones
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('in')
            }, entry.target.dataset.delay || 0)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    document.querySelectorAll('.will-animate').forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [])

  // Navbar scroll listener
  useEffect(() => {
    const nav = document.getElementById('nav')
    const handleScroll = () => {
      if (window.scrollY > 10) {
        nav?.classList.add('scrolled')
      } else {
        nav?.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Horizontal process pan
  useEffect(() => {
    const section = document.getElementById('process-scroll')
    const track   = document.getElementById('process-cards')
    const cards   = Array.from(document.querySelectorAll('.p-card'))
    const dots    = Array.from(document.querySelectorAll('.prog-dot'))
    if (!section || !track || cards.length === 0) return

    const update = () => {
      const scrolled = -section.getBoundingClientRect().top
      const range    = section.offsetHeight - window.innerHeight
      if (range <= 0) return
      const progress = Math.max(0, Math.min(1, scrolled / range))
      const index    = Math.min(Math.floor(progress * cards.length), cards.length - 1)

      track.style.transform = `translateX(${-index * 100}vw)`
      cards.forEach((c, i) => c.classList.toggle('active', i === index))
      dots.forEach((d, i)  => d.classList.toggle('active', i === index))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])


  return (
    <>
      {/* Navbar */}
      <nav id="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo in" id="nl">KoBa Studio</Link>
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><Link to="/servicios" id="nl1" className="in" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso" id="nl2" className="in" onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
            <li><Link to="/productos" id="nl3" className="in" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
            <li><Link to="/contacto" id="nl4" className="in" onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
          </ul>
          {user
            ? <Link to="/dashboard" className="nav-btn in" id="nb">Mi cuenta</Link>
            : <button className="nav-btn in" id="nb" onClick={openModal}>Iniciar sesión</button>
          }
          <button
            className={`nav-hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero">
        <div className="hero-scroll-line" id="scroll-line" style={{height: 0}}></div>

        <span className="hero-top-label in" id="htl">KOBA-STUDIO · 2025</span>
        <span className="hero-top-right in" id="htr">SaaS B2B · Personalizado</span>

        <div>
          <h1 className="hero-headline" id="hero-hl">
            <span className="word"><span className="word-inner in">Menos</span></span>
            <span className="word"><span className="word-inner in">tiempo</span></span>
            <span className="word"><span className="word-inner in" style={{transitionDelay: '80ms'}}>perdido.</span></span>
            <br style={{lineHeight: 1}} />
            <span className="word"><span className="word-inner accent in" style={{transitionDelay: '200ms'}}>Más</span></span>
            <span className="word"><span className="word-inner in" style={{transitionDelay: '280ms'}}>control.</span></span>
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-sub in" id="hs" data-delay="200">
            Software hecho para tu operación,<br/>no al revés.
          </p>
          <div className="hero-cta in" id="hc" data-delay="300">
            <a href="/servicios" className="btn-gold">Ver soluciones</a>
            <a href="/contacto" className="btn-outline">
              Busquemos soluciones
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-item">DISEÑO PERSONALIZADO</span>
          <span className="marquee-dot">·</span>
          <span className="marquee-item">ANÁLISIS INCLUIDO</span>
          <span className="marquee-dot">·</span>
          <span className="marquee-item">SOPORTE 24/7</span>
          <span className="marquee-dot">·</span>
          <span className="marquee-item">INTEGRACIÓN FÁCIL</span>
          <span className="marquee-dot">·</span>
          <span className="marquee-item">DISEÑO PERSONALIZADO</span>
          <span className="marquee-dot">·</span>
          <span className="marquee-item">ANÁLISIS INCLUIDO</span>
        </div>
      </section>

      {/* Proceso Section */}
      <section id="process">
        <div className="process-header">
          <div>
            <div className="process-eyebrow will-animate" data-delay="0">CÓMO FUNCIONA</div>
            <h2 className="process-title will-animate" data-delay="100">
              Proceso simple y <br/>directo
            </h2>
          </div>
          <p className="process-desc will-animate" data-delay="200">
            Desde el primer encuentro hasta la implementación, guiamos cada paso para asegurar que el software se alinee perfectamente con tus operaciones.
          </p>
        </div>

        <div id="process-scroll">
          <div className="process-sticky">
            <div className="process-cards-track" id="process-cards">
              {/* Card 1 */}
              <div className="p-card active">
                <div className="p-card-num">01</div>
                <div className="p-card-content">
                  <div className="p-card-code">
                    <span>ETAPA UNO</span>
                    <span className="p-card-code-dot"></span>
                  </div>
                  <h3 className="p-card-title">Descubrimiento</h3>
                  <ul className="p-card-list">
                    <li><span className="dash">—</span> Análisis de procesos actuales</li>
                    <li><span className="dash">—</span> Identificación de ineficiencias</li>
                    <li><span className="dash">—</span> Mapeo de flujos de trabajo</li>
                    <li><span className="dash">—</span> Requerimientos específicos</li>
                  </ul>
                  <span className="p-card-tag">2-3 semanas</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-card">
                <div className="p-card-num">02</div>
                <div className="p-card-content">
                  <div className="p-card-code">
                    <span>ETAPA DOS</span>
                    <span className="p-card-code-dot"></span>
                  </div>
                  <h3 className="p-card-title">Diseño y Desarrollo</h3>
                  <ul className="p-card-list">
                    <li><span className="dash">—</span> Arquitectura técnica</li>
                    <li><span className="dash">—</span> Prototipado interactivo</li>
                    <li><span className="dash">—</span> Validación con equipo</li>
                    <li><span className="dash">—</span> Desarrollo iterativo</li>
                  </ul>
                  <span className="p-card-tag">4-6 semanas</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-card">
                <div className="p-card-num">03</div>
                <div className="p-card-content">
                  <div className="p-card-code">
                    <span>ETAPA TRES</span>
                    <span className="p-card-code-dot"></span>
                  </div>
                  <h3 className="p-card-title">Implementación</h3>
                  <ul className="p-card-list">
                    <li><span className="dash">—</span> Migración de datos</li>
                    <li><span className="dash">—</span> Testing completo</li>
                    <li><span className="dash">—</span> Capacitación de equipo</li>
                    <li><span className="dash">—</span> Go-live asistido</li>
                  </ul>
                  <span className="p-card-tag">2-3 semanas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="process-progress">
          <span className="prog-dot active" data-index="0"></span>
          <span className="prog-dot" data-index="1"></span>
          <span className="prog-dot" data-index="2"></span>
        </div>
      </section>

      {/* Bridge Section */}
      <section id="bridge">
        <div className="bridge-inner">
          <h2 className="bridge-big">
            <span className="will-animate" data-delay="0">Resulta en operaciones</span>
            <span className="will-animate" data-delay="100">más eficientes,</span>
            <span className="will-animate" data-delay="200">equipo más productivo</span>
            <span className="will-animate" data-delay="300">y crecimiento visible.</span>
          </h2>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={{padding: '160px 48px', background: '#0A0C16', color: '#F8F6F2', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 600, marginBottom: '24px'}}>
          Listo para transformar tu operación
        </h2>
        <p style={{fontSize: '16px', color: '#A8A49F', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px'}}>
          Conversemos sobre cómo podemos adaptarnos a tu negocio y generar impacto real.
        </p>
        <a href="/contacto" className="btn-gold">Iniciar conversación</a>
      </section>

      {/* Footer */}
      <footer id="footer" style={{background: '#0A0C16', borderTop: '1px solid #1A1D26', padding: '64px 48px 40px', color: '#F8F6F2'}}>
        <div className="footer-grid">
          <div className="footer-top">
            <a href="/" className="f-logo">KoBa Studio</a>
            <ul className="f-nav">
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/proceso">Proceso</a></li>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p className="f-copy">© 2025 KoBa Studio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
