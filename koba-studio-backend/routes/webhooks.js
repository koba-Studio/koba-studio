import express from 'express'
import { supabase } from '../config.js'

const router = express.Router()

router.post('/mercado-pago', async (req, res) => {
  try {
    const { type, data } = req.body

    if (type !== 'payment') {
      return res.json({ received: true })
    }

    const paymentId = data?.id
    const status = 'completed' // TODO: Get from Mercado Pago API

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing payment ID' })
    }

    const { error } = await supabase
      .from('purchases')
      .update({ status })
      .eq('mercado_pago_id', paymentId)

    if (error) {
      console.error('Database update error:', error)
    }

    console.log(`Payment ${paymentId} status: ${status}`)
    res.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(400).json({ error: err.message })
  }
})

export default router
