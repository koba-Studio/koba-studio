import { getSession, signOut, onAuthChange } from './auth.js'

async function updateNavbar() {
  const session = await getSession()
  const btnLogin = document.getElementById('btn-login')
  const btnProfile = document.getElementById('btn-profile')

  if (!btnLogin || !btnProfile) return

  if (session) {
    btnLogin.style.display = 'none'
    btnProfile.style.display = 'inline-flex'
    const emailLabel = document.getElementById('nav-user-email')
    if (emailLabel) emailLabel.textContent = session.user.email
  } else {
    btnLogin.style.display = 'inline-flex'
    btnProfile.style.display = 'none'
  }
}

function initLogout() {
  const btnLogout = document.getElementById('btn-logout')
  if (!btnLogout) return
  btnLogout.addEventListener('click', async () => {
    await signOut()
    window.location.href = '/index.html'
  })
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar')
  if (!navbar) return

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  })
}

export async function initNavbar() {
  initNavbarScroll()
  initLogout()
  await updateNavbar()

  onAuthChange(async () => {
    await updateNavbar()
  })
}
