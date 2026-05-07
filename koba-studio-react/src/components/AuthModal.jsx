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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isModalOpen) return null

  const resetFields = () => { setError(''); setSuccess(''); setEmail(''); setPassword(''); setName('') }

  const switchMode = (m) => { setMode(m); setError(''); setSuccess('') }

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
        } else {
          resetFields(); closeModal()
        }
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        })
        if (error) setError(error.message)
        else setSuccess('¡Cuenta creada! Revisá tu email para confirmarla antes de entrar.')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/dashboard`,
        })
        if (error) setError(error.message)
        else setSuccess('Te enviamos un link para restablecer tu contraseña.')
      }
    } catch (err) {
      setError('Error inesperado. Intentá de nuevo.')
      console.error('[AuthModal]', err)
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
            <div className="auth-modal-tabs">
              <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => switchMode('login')}>Iniciar sesión</button>
              <button className={`auth-tab${mode === 'signup' ? ' active' : ''}`} onClick={() => switchMode('signup')}>Crear cuenta</button>
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
          <>
            <p className="auth-modal-subtitle">Ingresá tu email y te enviamos un link para restablecer la contraseña.</p>
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
            <button className="auth-link auth-forgot" onClick={() => switchMode('login')}>← Volver al inicio de sesión</button>
          </>
        )}
      </div>
    </div>
  )
}
