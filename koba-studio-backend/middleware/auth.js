import { getSupabase } from '../lib/supabase.js'

export async function requireAuth(c, next) {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid authorization header' }, 401)
    }

    const token = authHeader.slice(7)
    const supabase = getSupabase(c.env)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    c.set('user', user)
    await next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return c.json({ error: 'Authentication failed' }, 500)
  }
}

export async function optionalAuth(c, next) {
  try {
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const supabase = getSupabase(c.env)
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) c.set('user', user)
    }
    await next()
  } catch (err) {
    console.error('Optional auth middleware error:', err)
    await next()
  }
}
