import express from 'express'
import { supabase } from '../config.js'

const router = express.Router()

router.post('/checkout', async (req, res) => {
  try {
    const { userId, items, email } = req.body

    // TODO: Implement Mercado Pago preference creation
    const preferenceId = 'TEST_' + Date.now()

    res.json({
      preferenceId,
      paymentUrl: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', req.params.userId)

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/record', async (req, res) => {
  try {
    const { userId, items, status, mercadoPagoId } = req.body

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
    res.json(data[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
