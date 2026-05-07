import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Contacto() {
  const { user, openModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  useEffect(() => {
    document.body.classList.add('page-contacto')
    return () => document.body.classList.remove('page-contacto')
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
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const d = parseInt(e.target.style.transitionDelay) || 0
        setTimeout(() => e.target.classList.add('in'), d)
        io.unobserve(e.target)
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.wa').forEach(el => io.observe(el))
    return () => { window.removeEventListener('scroll', handleScroll); io.disconnect() }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSendError('')

    const form = e.target
    const urgencia = Array.from(form.querySelectorAll('input[name="urgencia"]:checked'))
      .map((i) => i.value)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:  form.nombre.value,
          empresa: form.empresa.value,
          email:   form.email.value,
          servicio: form.servicio.value,
          mensaje: form.mensaje.value,
          urgencia,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Error del servidor')
      }

      setSubmitted(true)
    } catch (err) {
      setSendError(err.message || 'No se pudo enviar el mensaje. Intentá de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <nav id="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" id="nl">KoBa Studio</Link>
          <ul className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}>
            <li><Link to="/servicios" id="nl1" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso" id="nl2" onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
            <li><Link to="/productos" id="nl3" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
            <li><Link to="/contacto" id="nl4" className="active" onClick={() => setMobileMenuOpen(false)}>Contacto</Link></li>
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

      <div className="contact-layout">

        {/* LEFT */}
        <div className="contact-left">
          <div>
            <p className="contact-eyebrow wa">KBA · Contacto</p>
            <h1 className="contact-title wa" style={{transitionDelay:'80ms'}}>
              Hablemos<br/>de tu <span className="accent">operación.</span>
            </h1>
            <p className="contact-desc wa" style={{transitionDelay:'160ms'}}>
              El diagnóstico inicial es siempre sin costo. Cuéntanos tu desafío y te respondemos en menos de 24 horas hábiles.
            </p>
          </div>

          <div>
            <div className="contact-details wa" style={{transitionDelay:'240ms'}}>
              <div className="contact-detail-row">
                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <div>
                  <p className="detail-label">Email</p>
                  <p className="detail-value">hola@kobastudio.com</p>
                </div>
              </div>
              <div className="contact-detail-row">
                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <p className="detail-label">Respuesta</p>
                  <p className="detail-value">Menos de 24 horas hábiles</p>
                </div>
              </div>
              <div className="contact-detail-row">
                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p className="detail-label">Ubicación</p>
                  <p className="detail-value">Temuco, IX Región, Chile<br/>Servicio en toda Latinoamérica</p>
                </div>
              </div>
            </div>

            <div className="contact-social-row wa" style={{transitionDelay:'320ms'}}>
              <a href="#" className="contact-social" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="contact-social" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="contact-social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="contact-right">
          <p className="form-eyebrow wa">Cuéntanos tu proyecto</p>

          {!submitted ? (
            <form className="contact-form wa" style={{transitionDelay:'80ms'}} onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="nombre">Nombre</label>
                  <input className="form-input" type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="empresa">Empresa</label>
                  <input className="form-input" type="text" id="empresa" name="empresa" placeholder="Nombre de tu empresa" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input className="form-input" type="email" id="email" name="email" placeholder="tu@empresa.com" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="servicio">¿Qué necesitas?</label>
                <select className="form-select" id="servicio" name="servicio" defaultValue="">
                  <option value="" disabled>Selecciona un servicio</option>
                  <option value="diagnostico">Diagnóstico inicial (gratis)</option>
                  <option value="starter">Plan Starter — automatización puntual</option>
                  <option value="pro">Plan Pro — SaaS completo</option>
                  <option value="enterprise">Plan Enterprise — solución a medida</option>
                  <option value="consulta">Solo tengo una consulta</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mensaje">Cuéntanos el desafío</label>
                <textarea className="form-textarea" id="mensaje" name="mensaje" placeholder="Describe brevemente qué proceso deseas mejorar, automatizar o construir. Sin tecnicismos — habla como si le explicaras a un colega." required></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cuándo quieres empezar?</label>
                <div className="form-check-group">
                  <label className="form-check"><input type="checkbox" name="urgencia" value="ya" /> Lo antes posible</label>
                  <label className="form-check"><input type="checkbox" name="urgencia" value="1mes" /> En el próximo mes</label>
                  <label className="form-check"><input type="checkbox" name="urgencia" value="explorando" /> Solo estoy explorando</label>
                </div>
              </div>

              {sendError && (
                <p style={{fontSize:'13px',color:'#EF4444',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'8px',padding:'10px 14px',margin:'0 0 8px'}}>
                  {sendError}
                </p>
              )}
              <div className="form-submit">
                <span className="form-submit-note">Sin compromiso · Respuesta en &lt;24hs</span>
                <button type="submit" className="submit-btn" disabled={sending}>
                  {sending ? 'Enviando...' : 'Enviar'}
                  {!sending && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="form-success show">
              <div className="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="success-title">¡Recibimos tu mensaje!</p>
              <p className="success-sub">Te respondemos en menos de 24 horas hábiles. Revisa tu casilla de email.</p>
              <Link to="/" style={{marginTop:'16px',fontSize:'14px',color:'#7B6FE8'}}>Volver al inicio →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Info Strip */}
      <div className="contact-strip">
        <div className="strip-item wa">
          <p className="strip-label">Diagnóstico</p>
          <p className="strip-value"><span className="gold">Gratis</span> siempre</p>
        </div>
        <div className="strip-item wa" style={{transitionDelay:'100ms'}}>
          <p className="strip-label">Respuesta</p>
          <p className="strip-value">{'< '}<span className="gold">24hs</span> hábiles</p>
        </div>
        <div className="strip-item wa" style={{transitionDelay:'200ms'}}>
          <p className="strip-label">Operamos en</p>
          <p className="strip-value">Toda <span className="gold">Latinoamérica</span></p>
        </div>
      </div>

      {/* Footer */}
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
