import { requireAuth, signOut } from './auth.js'
import { supabase } from './supabase.js'

async function loadDashboard() {
  const session = await requireAuth()
  const user = session.user

  const emailEl = document.getElementById('user-email')
  if (emailEl) emailEl.textContent = user.email

  await loadPurchases(user.id)
}

async function loadPurchases(userId) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const container = document.getElementById('purchases-list')
  if (!container) return

  if (error || !data || data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Aún no tienes productos activos.</p>
        <a href="/productos.html" class="btn-primary">Ver soluciones</a>
      </div>
    `
    return
  }

  container.innerHTML = data.map(purchase => `
    <div class="purchase-card">
      <div class="purchase-header">
        <h3>${purchase.product_name}</h3>
        <span class="badge badge-${purchase.status}">${purchase.status}</span>
      </div>
      <p class="purchase-date">Activo desde ${new Date(purchase.created_at).toLocaleDateString('es-CL')}</p>
    </div>
  `).join('')
}

async function handleLogout() {
  await signOut()
  window.location.href = '/'
}

document.getElementById('btn-logout')?.addEventListener('click', handleLogout)
document.getElementById('btn-logout-main')?.addEventListener('click', handleLogout)

loadDashboard()
