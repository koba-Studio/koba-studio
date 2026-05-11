import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/adminOnly.js'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return c.json(data || [])
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', c.req.param('id'))
      .single()

    if (error) throw error
    return c.json(data)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/', requireAuth, requireAdmin, async (c) => {
  try {
    const { name, category, description, price, type, discount, image_url, status } = await c.req.json()
    const user = c.get('user')

    if (!name || !price) {
      return c.json({ error: 'Name and price are required' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        category: category || 'Automatización',
        description: description || '',
        price: Number(price),
        type: type || 'Mensual',
        discount: Number(discount) || 0,
        image_url: image_url || '',
        status: status || 'active',
        updated_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    console.log(`[PRODUCTS] New product created: ${name} by ${user.email}`)
    return c.json(data[0], 201)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.put('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const { name, category, description, price, type, discount, image_url, status } = await c.req.json()
    const user = c.get('user')

    if (!name || !price) {
      return c.json({ error: 'Name and price are required' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        category: category || 'Automatización',
        description: description || '',
        price: Number(price),
        type: type || 'Mensual',
        discount: Number(discount) || 0,
        image_url: image_url || '',
        status: status || 'active',
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'Product not found' }, 404)

    console.log(`[PRODUCTS] Product updated: ${c.req.param('id')} by ${user.email}`)
    return c.json(data[0])
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.delete('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const user = c.get('user')
    const supabase = getSupabase(c.env)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', c.req.param('id'))

    if (error) throw error
    console.log(`[PRODUCTS] Product deleted: ${c.req.param('id')} by ${user.email}`)
    return c.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

export default app
