import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/adminOnly.js'

const app = new Hono()

app.get('/', requireAuth, requireAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, role, status, created_at, last_sign_in')
      .order('created_at', { ascending: false })

    if (error) throw error

    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('user_id')

    if (purchaseError) console.error('Error fetching purchases:', purchaseError)

    const purchaseCount = {}
    if (purchases) {
      purchases.forEach(p => {
        purchaseCount[p.user_id] = (purchaseCount[p.user_id] || 0) + 1
      })
    }

    const users = (profiles || []).map(profile => ({
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      role: profile.role || 'user',
      status: profile.status || 'active',
      created_at: profile.created_at,
      last_sign_in: profile.last_sign_in,
      purchases: purchaseCount[profile.id] || 0
    }))

    return c.json(users)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/:id', requireAuth, async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', c.req.param('id'))
      .single()

    if (error) throw error
    if (!profile) return c.json({ error: 'User not found' }, 404)

    return c.json(profile)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.patch('/:id/role', requireAuth, requireAdmin, async (c) => {
  try {
    const { role } = await c.req.json()
    const user = c.get('user')

    if (!['user', 'admin'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'User not found' }, 404)

    console.log(`[USERS] Role changed for ${c.req.param('id')} -> ${role} by ${user.email}`)
    return c.json({ success: true, message: 'Role updated' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.patch('/:id/status', requireAuth, requireAdmin, async (c) => {
  try {
    const { status } = await c.req.json()
    const user = c.get('user')

    if (!['active', 'inactive'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'User not found' }, 404)

    console.log(`[USERS] Status changed for ${c.req.param('id')} -> ${status} by ${user.email}`)
    return c.json({ success: true, message: 'Status updated' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

export default app
