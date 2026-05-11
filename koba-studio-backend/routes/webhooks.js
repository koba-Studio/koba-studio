import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'

const app = new Hono()

app.post('/mercado-pago', async (c) => {
  try {
    const { type, data } = await c.req.json()

    if (type !== 'payment') {
      return c.json({ received: true })
    }

    const paymentId = data?.id
    if (!paymentId) {
      return c.json({ error: 'Missing payment ID' }, 400)
    }

    const supabase = getSupabase(c.env)
    const { error } = await supabase
      .from('purchases')
      .update({ status: 'completed' })
      .eq('mercado_pago_id', paymentId)

    if (error) console.error('Database update error:', error)

    console.log(`Payment ${paymentId} status: completed`)
    return c.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return c.json({ error: err.message }, 400)
  }
})

export default app
