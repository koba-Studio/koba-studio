import { signIn, signUp, signInWithGoogle } from './auth.js'

export function initModal() {
  const modal = document.getElementById('modal-auth')
  const btnLogin = document.getElementById('btn-login')
  const btnClose = document.getElementById('modal-close')
  const tabLogin = document.getElementById('tab-login')
  const tabSignup = document.getElementById('tab-signup')
  const formLogin = document.getElementById('form-login')
  const formSignup = document.getElementById('form-signup')
  const errorLogin = document.getElementById('error-login')
  const errorSignup = document.getElementById('error-signup')

  if (!modal) return

  btnLogin?.addEventListener('click', () => {
    modal.classList.add('active')
    document.body.style.overflow = 'hidden'
  })

  btnClose?.addEventListener('click', closeModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })

  tabLogin?.addEventListener('click', () => switchTab('login'))
  tabSignup?.addEventListener('click', () => switchTab('signup'))

  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorLogin.textContent = ''
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const btn = formLogin.querySelector('button[type="submit"]')
    btn.textContent = 'Entrando...'
    btn.disabled = true
    try {
      await signIn(email, password)
      closeModal()
      window.location.href = '/dashboard.html'
    } catch (err) {
      errorLogin.textContent = 'Email o contraseña incorrectos.'
    } finally {
      btn.textContent = 'Entrar'
      btn.disabled = false
    }
  })

  formSignup?.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorSignup.textContent = ''
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    const btn = formSignup.querySelector('button[type="submit"]')
    btn.textContent = 'Creando cuenta...'
    btn.disabled = true
    try {
      await signUp(email, password)
      errorSignup.style.color = '#7B6FE8'
      errorSignup.textContent = 'Revisa tu email para confirmar tu cuenta.'
    } catch (err) {
      errorSignup.textContent = 'Error al crear la cuenta. Intenta de nuevo.'
    } finally {
      btn.textContent = 'Crear cuenta'
      btn.disabled = false
    }
  })

  const btnGoogle = document.getElementById('btn-google')
  btnGoogle?.addEventListener('click', async () => {
    btnGoogle.textContent = 'Redirigiendo...'
    btnGoogle.disabled = true
    try {
      await signInWithGoogle()
    } catch (err) {
      btnGoogle.textContent = 'Continuar con Google'
      btnGoogle.disabled = false
    }
  })

  function closeModal() {
    modal.classList.remove('active')
    document.body.style.overflow = ''
  }

  function switchTab(tab) {
    if (tab === 'login') {
      tabLogin.classList.add('active')
      tabSignup.classList.remove('active')
      formLogin.style.display = 'flex'
      formSignup.style.display = 'none'
    } else {
      tabSignup.classList.add('active')
      tabLogin.classList.remove('active')
      formSignup.style.display = 'flex'
      formLogin.style.display = 'none'
    }
  }
}
