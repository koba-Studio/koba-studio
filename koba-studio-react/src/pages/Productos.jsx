import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function usePageSetup(activeTab) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const nav = document.getElementById('nav')
    const handleScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    setTimeout(() => document.getElementById('nl')?.classList.add('in'), 100)
    ;['nl1','nl2','nl3','nl4'].forEach((id, i) =>
      setTimeout(() => document.getElementById(id)?.classList.add('in'), 250 + i * 100)
    )
    setTimeout(() => document.getElementById('nb')?.classList.add('in'), 650)
    document.querySelectorAll('.prod-hero-hl .word-inner').forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), 300 + i * 90)
    })
    setTimeout(() => document.getElementById('phs')?.classList.add('in'), 200)
    setTimeout(() => document.getElementById('prod-hero')?.classList.add('orbs-in'), 200)
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

  return { mobileMenuOpen, setMobileMenuOpen }
}

export function Productos() {
  const { user, openModal } = useAuth()
  const [activeTab, setActiveTab] = useState('saas')
  const { mobileMenuOpen, setMobileMenuOpen } = usePageSetup(activeTab)

  useEffect(() => {
    document.body.classList.add('page-productos')
    return () => document.body.classList.remove('page-productos')
  }, [])

  const scrollTo = (id, tab) => {
    setActiveTab(tab)
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' })
  }

  return (
    <>

      <nav id="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo" id="nl">KoBa Studio</Link>
          <ul className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}>
            <li><Link to="/servicios" id="nl1" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
            <li><Link to="/proceso" id="nl2" onClick={() => setMobileMenuOpen(false)}>Proceso</Link></li>
            <li><Link to="/productos" id="nl3" className="active" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
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

      {/* Hero */}
      <header className="prod-hero" id="prod-hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <p className="prod-hero-eyebrow wa">KBA · Productos</p>
        <h1 className="prod-hero-hl" id="ph">
          <span className="word"><span className="word-inner">Software</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'80ms'}}>listo</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'160ms'}}>para</span></span>
          <br style={{lineHeight:1}} />
          <span className="word"><span className="word-inner" style={{transitionDelay:'240ms'}}>tu</span></span>{' '}
          <span className="word"><span className="word-inner" style={{transitionDelay:'320ms',background:'linear-gradient(135deg,#8B5CF6,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>operación.</span></span>
        </h1>
        <p className="prod-hero-sub" id="phs">
          Dos categorías: SaaS propios listos para desplegar, y desarrollos 100% a medida. Cada producto tiene su estructura de precio independiente.
        </p>
      </header>

      {/* Tabs */}
      <div className="prod-tabs-bar">
        <a href="#saas" className={`prod-tab${activeTab==='saas'?' active':''}`} onClick={e=>{e.preventDefault();scrollTo('saas','saas')}}>SaaS Listos</a>
        <a href="#custom" className={`prod-tab${activeTab==='custom'?' active':''}`} onClick={e=>{e.preventDefault();scrollTo('custom','custom')}}>A Medida</a>
        <a href="#futuro" className={`prod-tab${activeTab==='futuro'?' active':''}`} onClick={e=>{e.preventDefault();scrollTo('futuro','futuro')}}>Próximamente</a>
      </div>

      {/* Marquee */}
      <div className="marquee-bar">
        <div className="mq-track">
          <span className="mq-item">SaaS listos</span><span className="mq-dot">◆</span>
          <span className="mq-item">A medida</span><span className="mq-dot">◆</span>
          <span className="mq-item">Precio por producto</span><span className="mq-dot">◆</span>
          <span className="mq-item">Sin genéricos</span><span className="mq-dot">◆</span>
          <span className="mq-item">KoBa Studio</span><span className="mq-dot">◆</span>
          <span className="mq-item">SaaS listos</span><span className="mq-dot">◆</span>
          <span className="mq-item">A medida</span><span className="mq-dot">◆</span>
          <span className="mq-item">Precio por producto</span><span className="mq-dot">◆</span>
          <span className="mq-item">Sin genéricos</span><span className="mq-dot">◆</span>
          <span className="mq-item">KoBa Studio</span><span className="mq-dot">◆</span>
        </div>
      </div>

      {/* SaaS Listos */}
      <div id="saas">
        <section className="prod-section">
          <div className="prod-section-header">
            <div>
              <p className="prod-section-eyebrow wa">KBA · SaaS Listos</p>
              <h2 className="prod-section-title wa" style={{transitionDelay:'80ms'}}>Productos<br/>propios.</h2>
            </div>
            <p className="prod-section-desc wa" style={{transitionDelay:'160ms'}}>Software desarrollado por KoBa que podés activar en tu operación en días. Base probada, configuración a tu medida.</p>
          </div>
          <div className="prod-grid">
            <div className="prod-card wa">
              <div className="prod-card-badge gold"><div className="prod-card-badge-dot"></div>Disponible</div>
              <h3 className="prod-card-name">KoBa Ops</h3>
              <p className="prod-card-tagline">Centro de control operacional para equipos B2B. Gestión de tareas, flujos de aprobación y reportes en un solo lugar.</p>
              <ul className="prod-card-features">
                <li><span className="pf-dash">—</span>Gestión de proyectos y tareas</li>
                <li><span className="pf-dash">—</span>Flujos de aprobación automáticos</li>
                <li><span className="pf-dash">—</span>Dashboard de métricas en tiempo real</li>
                <li><span className="pf-dash">—</span>Integraciones con Slack, Email, WhatsApp</li>
              </ul>
              <div className="prod-card-price"><span className="price-from">Desde</span><span className="price-val">$290</span><span className="price-per">/ mes</span></div>
              <Link to="/contacto" className="prod-card-cta">Ver demo →</Link>
            </div>
            <div className="prod-card dark wa" style={{transitionDelay:'100ms'}}>
              <div className="prod-card-badge gold"><div className="prod-card-badge-dot"></div>Más solicitado</div>
              <h3 className="prod-card-name">KoBa Flow</h3>
              <p className="prod-card-tagline">Motor de automatización de procesos. Conecta tus herramientas, elimina tareas manuales y ejecuta flujos complejos sin código.</p>
              <ul className="prod-card-features">
                <li><span className="pf-dash">—</span>Constructor visual de flujos</li>
                <li><span className="pf-dash">—</span>+50 conectores nativos</li>
                <li><span className="pf-dash">—</span>Triggers por evento, tiempo o condición</li>
                <li><span className="pf-dash">—</span>Logs y auditoría completa</li>
              </ul>
              <div className="prod-card-price"><span className="price-from">Desde</span><span className="price-val">$490</span><span className="price-per">/ mes</span></div>
              <Link to="/contacto" className="prod-card-cta">Ver demo →</Link>
            </div>
            <div className="prod-card wa" style={{transitionDelay:'200ms'}}>
              <div className="prod-card-badge gold"><div className="prod-card-badge-dot"></div>Disponible</div>
              <h3 className="prod-card-name">KoBa Pulse</h3>
              <p className="prod-card-tagline">Panel de inteligencia operacional. Centraliza métricas de todas tus herramientas y genera reportes automáticos para tu equipo directivo.</p>
              <ul className="prod-card-features">
                <li><span className="pf-dash">—</span>Centralización de métricas multi-fuente</li>
                <li><span className="pf-dash">—</span>Reportes automáticos programados</li>
                <li><span className="pf-dash">—</span>Alertas por umbrales críticos</li>
                <li><span className="pf-dash">—</span>Exportación PDF / Slides</li>
              </ul>
              <div className="prod-card-price"><span className="price-from">Desde</span><span className="price-val">$190</span><span className="price-per">/ mes</span></div>
              <Link to="/contacto" className="prod-card-cta">Ver demo →</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="prod-divider"></div>

      {/* A Medida */}
      <div id="custom">
        <section className="prod-section">
          <div className="prod-section-header">
            <div>
              <p className="prod-section-eyebrow wa">KBA · A Medida</p>
              <h2 className="prod-section-title wa" style={{transitionDelay:'80ms'}}>Tu software,<br/>tu precio.</h2>
            </div>
            <p className="prod-section-desc wa" style={{transitionDelay:'160ms'}}>Desarrollos 100% personalizados para tu operación específica. Cada proyecto tiene su propuesta y precio independiente.</p>
          </div>
          <div className="prod-grid prod-grid-2">
            <div className="prod-card wa">
              <div className="prod-card-badge iris"><div className="prod-card-badge-dot"></div>A medida</div>
              <h3 className="prod-card-name">Portal de Clientes</h3>
              <p className="prod-card-tagline">Plataforma white-label para que tus clientes gestionen sus contratos, pagos, tickets y comunicación con tu empresa.</p>
              <ul className="prod-card-features">
                <li><span className="pf-dash">—</span>Portal 100% branded</li>
                <li><span className="pf-dash">—</span>Gestión de contratos y pagos</li>
                <li><span className="pf-dash">—</span>Sistema de tickets integrado</li>
                <li><span className="pf-dash">—</span>Notificaciones multicanal</li>
              </ul>
              <div className="prod-card-price"><span className="price-val" style={{fontSize:'28px'}}>Cotización</span></div>
              <Link to="/contacto" className="prod-card-cta">Consultar →</Link>
            </div>
            <div className="prod-card wa" style={{transitionDelay:'100ms'}}>
              <div className="prod-card-badge iris"><div className="prod-card-badge-dot"></div>A medida</div>
              <h3 className="prod-card-name">ERP Sectorial</h3>
              <p className="prod-card-tagline">Sistema de gestión empresarial diseñado específicamente para las particularidades de tu industria. Sin módulos que no usarás.</p>
              <ul className="prod-card-features">
                <li><span className="pf-dash">—</span>Módulos según tu operación</li>
                <li><span className="pf-dash">—</span>Integraciones con sistemas legados</li>
                <li><span className="pf-dash">—</span>Roles y permisos granulares</li>
                <li><span className="pf-dash">—</span>API propia para extensiones futuras</li>
              </ul>
              <div className="prod-card-price"><span className="price-val" style={{fontSize:'28px'}}>Cotización</span></div>
              <Link to="/contacto" className="prod-card-cta">Consultar →</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="prod-divider"></div>

      {/* Próximamente */}
      <div id="futuro">
        <section className="prod-section">
          <div className="prod-section-header">
            <div>
              <p className="prod-section-eyebrow wa">KBA · Próximamente</p>
              <h2 className="prod-section-title wa" style={{transitionDelay:'80ms'}}>En desarrollo.</h2>
            </div>
            <p className="prod-section-desc wa" style={{transitionDelay:'160ms'}}>Productos en construcción. Podés registrarte para acceso anticipado.</p>
          </div>
          <div className="prod-grid">
            {[
              { name:'KoBa Hire', badge:'Q3 2025', desc:'Automatización del proceso de reclutamiento y onboarding. Desde el primer contacto hasta el primer día de trabajo.', features:['Pipeline de candidatos automatizado','Evaluaciones técnicas integradas','Onboarding digital estructurado'], delay:0 },
              { name:'KoBa Pay', badge:'Q4 2025', desc:'Gestión de cobranzas y pagos recurrentes B2B. Conciliación automática, alertas de vencimiento y reportes de tesorería.', features:['Cobranzas automáticas','Conciliación bancaria automática','Reportes de flujo de caja'], delay:100 },
              { name:'KoBa Intel', badge:'2026', desc:'Inteligencia artificial aplicada a tu operación. Predicciones, anomalías, recomendaciones — basadas en tus propios datos.', features:['Modelos entrenados con tus datos','Detección de anomalías en tiempo real','Asistente operacional con IA'], delay:200 },
            ].map(p => (
              <div key={p.name} className="prod-card wa" style={{position:'relative',transitionDelay:`${p.delay}ms`}}>
                <div className="prod-card-badge soon"><div className="prod-card-badge-dot"></div>{p.badge}</div>
                <h3 className="prod-card-name">{p.name}</h3>
                <p className="prod-card-tagline">{p.desc}</p>
                <ul className="prod-card-features">
                  {p.features.map(f => <li key={f}><span className="pf-dash">—</span>{f}</li>)}
                </ul>
                <div className="prod-card-soon-overlay"><span className="soon-label">Próximamente</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Crystal Section */}
      <div className="crystal-section">
        <div className="crystal-orb crystal-orb-1"></div>
        <div className="crystal-orb crystal-orb-2"></div>
        <div className="crystal-orb crystal-orb-3"></div>
        <div className="crystal-section-inner">
          <p className="crystal-eyebrow wa">KBA · Visión</p>
          <h2 className="crystal-headline wa" style={{transitionDelay:'80ms'}}>
            <span className="iris">Software</span><br/>
            <span className="plain">del futuro,</span><br/>
            <span className="iris">hoy.</span>
          </h2>
          <p className="crystal-sub wa" style={{transitionDelay:'160ms'}}>
            Cada producto KoBa está diseñado para durar. Arquitectura limpia, interfaces que no envejecen y tecnología que evoluciona con tu operación.
          </p>
          <div className="crystal-cards">
            {[
              { label:'KBA-S · Stack', name:'Arquitectura limpia', desc:'Código modular, documentado y sin deuda técnica. Tu equipo lo puede mantener y escalar sin depender de nosotros.', tag:'Base sólida para escalar', delay:200 },
              { label:'KBA-D · Design', name:'Interfaz que perdura', desc:'Sistemas de diseño construidos para durar. No seguimos tendencias — construimos lenguajes visuales que envejecen bien.', tag:'Design system propio', delay:300 },
              { label:'KBA-I · Intelligence', name:'Datos que trabajan', desc:'Cada producto captura los datos correctos desde el día uno. Cuando llegue el momento de aplicar IA, la base ya estará lista.', tag:'Preparado para IA', delay:400 },
            ].map(c => (
              <div key={c.name} className="crystal-card wa" style={{transitionDelay:`${c.delay}ms`}}>
                <div className="crystal-card-inner">
                  <span className="crystal-card-label">{c.label}</span>
                  <h3 className="crystal-card-name">{c.name}</h3>
                  <p className="crystal-card-desc">{c.desc}</p>
                  <span className="crystal-card-tag">{c.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker-bar">
        <div className="tk-row tk-row-1">
          <div className="tk-track">
            {['KoBa Ops','KoBa Flow','KoBa Pulse','KoBa Hire','KoBa Pay','KoBa Intel','KoBa Ops','KoBa Flow','KoBa Pulse','KoBa Hire','KoBa Pay','KoBa Intel'].map((t,i) => (
              <span key={i}><span className="tk-item">{t}</span><span className="tk-sep">·</span></span>
            ))}
          </div>
        </div>
        <div className="tk-row tk-row-2" style={{marginTop:'6px'}}>
          <div className="tk-track-r">
            {['SaaS B2B','Automatización','A medida','Tu operación','SaaS B2B','Automatización','A medida','Tu operación'].map((t,i) => (
              <span key={i}><span className="tk-item">{t}</span><span className="tk-sep">·</span></span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="prod-cta">
        <p className="wa" style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.18em',background:'linear-gradient(90deg,#8B5CF6,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:'24px'}}>¿Cuál es el tuyo?</p>
        <h2 className="wa" style={{transitionDelay:'100ms',fontSize:'clamp(40px,5vw,72px)',fontWeight:600,letterSpacing:'-0.04em',lineHeight:0.95,marginBottom:'48px',maxWidth:'600px',marginLeft:'auto',marginRight:'auto'}}>
          <span style={{background:'linear-gradient(135deg,#8B5CF6,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>El software correcto</span><br/>
          <span style={{color:'rgba(248,246,242,0.25)'}}>cambia todo.</span>
        </h2>
        <div className="wa" style={{transitionDelay:'200ms',display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/contacto" className="btn-gold">Hablar con el equipo</Link>
          <Link to="/proceso" style={{fontSize:'13px',color:'rgba(248,246,242,0.35)',alignSelf:'center',transition:'color 200ms'}}>Ver nuestro proceso →</Link>
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
