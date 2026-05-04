import { initNavbar } from './navbar.js'
import { initModal } from './modal.js'

document.addEventListener('DOMContentLoaded', async () => {
  await initNavbar()
  initModal()
})
