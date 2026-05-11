import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'
import { validateContactForm } from '../lib/validate.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/adminOnly.js'

const app = new Hono()

app.post('/', optionalAuth, async (c) => {
  try {
    const { nombre, email, mensaje, servicio, empresa, urgencia } = await c.req.json()
    const user = c.get('user')

    const validation = validateContactForm({ nombre, email, mensaje, servicio, empresa, urgencia })

    if (!validation.valid) {
      return c.json({ error: 'Validación fallida', details: validation.errors }, 400)
    }

    const sanitized = validation.data
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'

    const supabase = getSupabase(c.env)
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        nombre: sanitized.nombre,
        email: sanitized.email,
        mensaje: sanitized.mensaje,
        servicio: sanitized.servicio,
        empresa: sanitized.empresa,
        urgencia: sanitized.urgencia,
        user_id: user?.id || null,
        ip_address: ip,
        read: false,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Supabase insert error:', error)
      return c.json({ error: 'Error al guardar el mensaje' }, 500)
    }

    console.log(`[CONTACT] New message from ${sanitized.email} (user: ${user?.id || 'anonymous'})`)
    return c.json({ success: true, message: 'Mensaje recibido. Te responderemos en menos de 24 horas.' }, 201)
  } catch (err) {
    console.error('Contact endpoint error:', err)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

app.get('/', requireAuth, requireAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const tickets = (data || []).map(msg => ({
      id: msg.id,
      name: msg.nombre,
      email: msg.email,
      message: msg.mensaje,
      channel: msg.servicio || 'Formulario web',
      status: msg.status || 'open',
      timestamp: msg.created_at,
      urgency: msg.urgencia,
      company: msg.empresa,
      user_id: msg.user_id,
      replies: msg.replies || [],
      read: msg.read
    }))

    return c.json(tickets)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.patch('/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const { status } = await c.req.json()
    const user = c.get('user')

    if (!['open', 'replied', 'resolved'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status, read: true, updated_at: new Date().toISOString() })
      .eq('id', c.req.param('id'))
      .select()

    if (error) throw error
    if (!data || data.length === 0) return c.json({ error: 'Message not found' }, 404)

    console.log(`[CONTACT] Ticket updated: ${c.req.param('id')} -> ${status} by ${user.email}`)
    return c.json({ success: true, message: 'Ticket updated' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/:id/reply', requireAuth, requireAdmin, async (c) => {
  try {
    const { message } = await c.req.json()
    const user = c.get('user')

    if (!message || message.trim().length === 0) {
      return c.json({ error: 'Message is required' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { data: ticket, error: getError } = await supabase
      .from('contact_messages')
      .select('replies')
      .eq('id', c.req.param('id'))
      .single()

    if (getError) throw getError
    if (!ticket) return c.json({ error: 'Message not found' }, 404)

    const replies = ticket.replies || []
    replies.push({
      from: 'admin',
      text: message,
      timestamp: new Date().toISOString(),
      admin_email: user.email
    })

    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({ replies, status: 'replied', updated_at: new Date().toISOString() })
      .eq('id', c.req.param('id'))

    if (updateError) throw updateError

    console.log(`[CONTACT] Reply added to ticket ${c.req.param('id')} by ${user.email}`)
    return c.json({ success: true, message: 'Reply sent' })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

export default app
