import { getSupabase } from '../lib/supabase.js'

export async function requireAdmin(c, next) {
  try {
    const user = c.get('user')
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    const supabase = getSupabase(c.env)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      return c.json({ error: 'User profile not found' }, 403)
    }

    if (profile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    c.set('userRole', profile.role)
    await next()
  } catch (err) {
    console.error('Admin middleware error:', err)
    return c.json({ error: 'Authorization check failed' }, 500)
  }
}
