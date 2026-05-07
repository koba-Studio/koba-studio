import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'

export function Navbar() {
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  const handleSignOut = () => {
    signOut()
  }

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 1000,
        backgroundColor: 'transparent',
        borderBottom: '1px solid transparent',
        transition: 'all 300ms ease',
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" style={{ fontSize: '18px', fontWeight: '600', color: '#0D0D0D', textDecoration: 'none' }}>
            KoBa Studio
          </Link>

          <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
            <Link to="/productos" style={{ fontSize: '14px', color: '#2C2A27', textDecoration: 'none', position: 'relative', transition: 'color 200ms' }}>
              Productos
            </Link>
            <Link to="/servicios" style={{ fontSize: '14px', color: '#2C2A27', textDecoration: 'none', position: 'relative', transition: 'color 200ms' }}>
              Servicios
            </Link>
            <Link to="/contacto" style={{ fontSize: '14px', color: '#2C2A27', textDecoration: 'none', position: 'relative', transition: 'color 200ms' }}>
              Contacto
            </Link>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary"
                    type="button"
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#0D0D0D',
                      border: '1px solid var(--border)',
                      padding: '9px 20px',
                      borderRadius: '100px',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                  >
                    Salir
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary"
                  type="button"
                  style={{
                    display: 'inline-block',
                    textDecoration: 'none'
                  }}
                >
                  Ingresar
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {authMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          backgroundColor: '#DCFCE7',
          color: '#166534',
          padding: '12px 16px',
          textAlign: 'center',
          zIndex: 999,
          borderBottom: '1px solid #86EFAC'
        }}>
          {authMessage}
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(msg) => {
          setAuthMessage(msg)
          setTimeout(() => setAuthMessage(''), 3000)
        }}
      />

      {/* Spacer para evitar que el contenido se oculte bajo el navbar fixed */}
      <div style={{ height: '64px' }} />
    </>
  )
}
