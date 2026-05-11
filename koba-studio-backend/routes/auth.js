import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'

const app = new Hono()

app.post('/signup', async (c) => {
  try {
    const { email, password, fullName } = await c.req.json()
    const supabase = getSupabase(c.env)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) throw error
    return c.json({ user: data.user, message: 'Signup successful' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/signin', async (c) => {
  try {
    const { email, password } = await c.req.json()
    const supabase = getSupabase(c.env)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw error
    return c.json({ user: data.user, session: data.session })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/signout', async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return c.json({ message: 'Signed out successfully' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase.auth.getUser(token)

    if (error) throw error
    return c.json({ user: data.user })
  } catch (err) {
    return c.json({ error: err.message }, 401)
  }
})

export default app
