import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/adminOnly.js'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const user = c.get('user')
    const supabase = getSupabase(c.env)
    let query = supabase.from('pages').select('*')

    if (!user) query = query.eq('status', 'published')

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return c.json(data || [])
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/:slug', async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', c.req.param('slug'))
      .single()

    if (error) throw error
    if (!data) return c.json({ error: 'Page not found' }, 404)

    if (data.status !== 'published') {
      const user = c.get('user')
      if (!user) return c.json({ error: 'Page not found' }, 404)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return c.json({ error: 'Page not found' }, 404)
      }
    }

    await supabase
      .from('pages')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id)

    return c.json(data)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/', requireAuth, requireAdmin, async (c) => {
  try {
    const { title, slug, description, content, status, meta_title, meta_description } = await c.req.json()
    const user = c.get('user')

    if (!title || !slug) {
      return c.json({ error: 'Title and slug are required' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data: existing } = await supabase.from('pages').select('id').eq('slug', slug)

    if (existing && existing.length > 0) {
      return c.json({ error: 'Slug already exists' }, 400)
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([{
        title, slug,
        description: description || '',
        content: content || '',
        status: status || 'draft',
        meta_title: meta_title || title,
        meta_description: meta_description || description || '',
        created_by: user.id,
        updated_by: user.id,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    console.log(`[PAGES] New page created: ${slug} by ${user.email}`)
    return c.json(data[0], 201)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.put('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const { title, slug, description, content, status, meta_title, meta_description } = await c.req.json()
    const user = c.get('user')

    if (!title || !slug) {
      return c.json({ error: 'Title and slug are required' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data: existing } = await supabase
      .from('pages').select('id').eq('slug', slug).neq('id', c.req.param('id'))

    if (existing && existing.length > 0) {
      return c.json({ error: 'Slug already exists' }, 400)
    }

    const { data, error } = await supabase
      .from('pages')
      .update({
        title, slug,
        description: description || '',
        content: content || '',
        status: status || 'draft',
        meta_title: meta_title || title,
        meta_description: meta_description || description || '',
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'Page not found' }, 404)

    console.log(`[PAGES] Page updated: ${c.req.param('id')} by ${user.email}`)
    return c.json(data[0])
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.patch('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const { status } = await c.req.json()
    const user = c.get('user')

    if (!['draft', 'published'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('pages')
      .update({ status, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'Page not found' }, 404)

    console.log(`[PAGES] Page status changed: ${c.req.param('id')} -> ${status} by ${user.email}`)
    return c.json({ success: true, message: 'Page status updated' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.delete('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const user = c.get('user')
    const supabase = getSupabase(c.env)
    const { error } = await supabase.from('pages').delete().eq('id', c.req.param('id'))

    if (error) throw error
    console.log(`[PAGES] Page deleted: ${c.req.param('id')} by ${user.email}`)
    return c.json({ success: true, message: 'Page deleted' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

export default app
