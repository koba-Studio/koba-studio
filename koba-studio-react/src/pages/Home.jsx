import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  return (
    <main style={{ flex: 1 }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '160px 48px 80px',
        background: 'linear-gradient(135deg, #FAFAF8 0%, #F5F0FF 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container-custom">
          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 120px)',
            fontWeight: '700',
            lineHeight: '1.1',
            letterSpacing: '-0.04em',
            color: '#0D0D0D',
            maxWidth: '1000px',
            marginBottom: '32px'
          }}>
            Soluciones de <span style={{
              background: 'linear-gradient(135deg, #7B6FE8 0%, #E8507A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>diseño y productividad</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#6B6866',
            maxWidth: '600px',
            marginBottom: '48px',
            lineHeight: '1.7'
          }}>
            Transformamos la manera en que trabajas con soluciones personalizadas para tu negocio.
          </p>

          <button
            onClick={() => navigate('/servicios')}
            className="btn-primary"
            type="button"
            style={{
              fontSize: '16px',
              padding: '16px 40px'
            }}
          >
            Explorar Servicios
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '160px 48px',
        background: '#FFFFFF'
      }}>
        <div className="container-custom">
          <h2 style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            fontWeight: '600',
            letterSpacing: '-0.03em',
            lineHeight: '1',
            color: '#0D0D0D',
            textAlign: 'center',
            marginBottom: '80px'
          }}>
            Nuestros Servicios
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {[
              { title: 'Diseño UI/UX', description: 'Interfaces modernas y funcionales adaptadas a tus usuarios' },
              { title: 'Desarrollo Web', description: 'Aplicaciones web escalables con tecnología moderna' },
              { title: 'Consultoría Digital', description: 'Estrategia y transformación digital para tu empresa' }
            ].map((service) => (
              <div
                key={service.title}
                className="card"
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '32px',
                  transition: 'all 300ms ease'
                }}
              >
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#0D0D0D',
                  marginBottom: '16px'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#6B6866',
                  lineHeight: '1.6'
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '160px 48px',
        background: 'linear-gradient(135deg, #0D0D0D 0%, #2C2A27 100%)',
        textAlign: 'center'
      }}>
        <div className="container-custom">
          <h2 style={{
            color: '#FFFFFF',
            marginBottom: '24px'
          }}>
            ¿Listo para transformar tu negocio?
          </h2>
          <p style={{
            color: '#FFFFFF',
            opacity: 0.9,
            marginBottom: '48px',
            fontSize: '18px'
          }}>
            Contacta con nosotros hoy y descubre cómo podemos ayudarte
          </p>
          <button
            onClick={() => navigate('/contacto')}
            className="btn-primary"
            type="button"
          >
            Solicitar Demo
          </button>
        </div>
      </section>
    </main>
  )
}
