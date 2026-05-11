import { Hono } from 'hono'
import { getSupabase } from '../lib/supabase.js'

const app = new Hono()

app.post('/checkout', async (c) => {
  try {
    const preferenceId = 'TEST_' + Date.now()
    return c.json({
      preferenceId,
      paymentUrl: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
    })
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/user/:userId', async (c) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', c.req.param('userId'))

    if (error) throw error
    return c.json(data)
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

app.post('/record', async (c) => {
  try {
    const { userId, items, status, mercadoPagoId } = await c.req.json()
    const supabase = getSupabase(c.env)

    const { data, error } = await supabase
      .from('purchases')
      .insert([{
        user_id: userId,
        items,
        status: status || 'pending',
        mercado_pago_id: mercadoPagoId,
      }])
      .select()

    if (error) throw error
    return c.json(data[0])
  } catch (err) {
    return c.json({ error: err.message }, 400)
  }
})

export default app
