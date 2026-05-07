import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function AuthModal() {
  const { isModalOpen, closeModal } = useAuth()
  const [mode, setMode] = useState('login')   // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isModalOpen) return null

  const resetFields = () => { setError(''); setSuccess(''); setEmail(''); setPassword(''); setName('') }
  const switchMode = (m) => { setMode(m); setError(''); setSuccess('') }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
    // Si no hay error, Google redirige — el modal se cierra solo
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message.includes('Invalid login credentials')
            ? 'Email o contraseña incorrectos.'
            : error.message)
        } else { resetFields(); closeModal() }

      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        })
        if (error) setError(error.message)
        else setSuccess('¡Cuenta creada! Revisá tu email para confirmarla.')

      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/dashboard',
        })
        if (error) setError(error.message)
        else setSuccess('Te enviamos un link para restablecer tu contraseña.')
      }
    } catch (err) {
      setError('Error inesperado. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={closeModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button className="auth-modal-close" onClick={closeModal} aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Logo */}
        <p className="auth-modal-logo">KoBa Studio</p>

        {mode !== 'reset' ? (
          <>
            {/* Tabs */}
            <div className="auth-modal-tabs">
              <button className={`auth-tab${mode === 'login'  ? ' active' : ''}`} onClick={() => switchMode('login')}>Iniciar sesión</button>
              <button className={`auth-tab${mode === 'signup' ? ' active' : ''}`} onClick={() => switchMode('signup')}>Crear cuenta</button>
            </div>

            {/* Google OAuth */}
            <button
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              type="button"
            >
              {googleLoading ? (
                <span className="auth-spinner"></span>
              ) : (
                /* Google "G" logo oficial */
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
              )}
              {googleLoading ? 'Conectando...' : 'Continuar con Google'}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>o con email</span>
            </div>

            {success ? (
              <div className="auth-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <p>{success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-name">Nombre</label>
                    <input className="form-input" id="auth-name" type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-email">Email</label>
                  <input className="form-input" id="auth-email" type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-password">Contraseña</label>
                  <input className="form-input" id="auth-password" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
                  {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  )}
                </button>
              </form>
            )}

            {mode === 'login' && !success && (
              <button className="auth-link auth-forgot" onClick={() => switchMode('reset')}>
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </>
        ) : (
          /* Modo reset password */
          <>
            <p className="auth-modal-subtitle">
              Ingresá tu email y te enviamos un link para restablecer la contraseña.
            </p>
            {success ? (
              <div className="auth-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <p>{success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-reset-email">Email</label>
                  <input className="form-input" id="auth-reset-email" type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
            )}
            <button className="auth-link auth-forgot" onClick={() => switchMode('login')}>
              ← Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  )
}
