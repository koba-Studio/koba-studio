import { Router } from 'express'
import MercadoPago, { Preference, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

const router = Router()

// ── Mercado Pago client ──────────────────────
const mpClient = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN,
})

// ── Supabase service-role client ─────────────
// Usa service role key para bypassar RLS en webhook
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ── POST /api/payments/create-preference ─────
// El frontend llama esto cuando el usuario hace click en "Contratar"
router.post('/create-preference', async (req, res) => {
  const { product, userId, userEmail } = req.body

  if (!product?.id || !product?.name || !product?.price || !userId || !userEmail) {
    return res.status(400).json({ error: 'Faltan campos: product {id, name, price}, userId, userEmail.' })
  }

  try {
    const preference = new Preference(mpClient)
    const result = await preference.create({
      body: {
        items: [{
          id: product.id,
          title: product.name,
          quantity: 1,
          currency_id: process.env.MP_CURRENCY || 'CLP',
          unit_price: Number(product.price),
        }],
        payer: {
          email: userEmail,
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/dashboard?status=success&product=${product.id}`,
          failure: `${process.env.FRONTEND_URL}/productos?status=failed`,
          pending: `${process.env.FRONTEND_URL}/dashboard?status=pending&product=${product.id}`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        metadata: {
          user_id: userId,
          product_id: product.id,
        },
        statement_descriptor: 'KoBa Studio',
        external_reference: `${userId}|${product.id}`,
      },
    })

    // Guardar preferencia pendiente en Supabase
    await supabase.from('purchases').insert({
      user_id: userId,
      product_id: product.id,
      mp_preference_id: result.id,
      amount_usd: product.price,
      status: 'pending',
    })

    res.json({
      init_point: result.init_point,       // URL de pago Mercado Pago
      preference_id: result.id,
    })
  } catch (err) {
    console.error('[payments/create-preference]', err)
    res.status(500).json({ error: 'Error creando la preferencia de pago.' })
  }
})

// ── POST /api/payments/webhook ────────────────
// Mercado Pago llama esto después de cada pago
router.post('/webhook', async (req, res) => {
  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body

    const { type, data } = body

    // Solo procesar eventos de tipo 'payment'
    if (type !== 'payment' || !data?.id) return res.sendStatus(200)

    // Obtener datos completos del pago desde MP
    const paymentApi = new Payment(mpClient)
    const paymentData = await paymentApi.get({ id: data.id })

    if (!paymentData?.metadata?.user_id) return res.sendStatus(200)

    const { user_id, product_id } = paymentData.metadata

    // Actualizar/insertar en Supabase
    const { error } = await supabase
      .from('purchases')
      .upsert({
        user_id,
        product_id,
        mp_payment_id: String(paymentData.id),
        mp_preference_id: paymentData.preference_id,
        amount_usd: paymentData.transaction_amount,
        status: paymentData.status,    // 'approved' | 'rejected' | 'pending' | etc.
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'mp_payment_id',
      })

    if (error) console.error('[webhook/supabase]', error)

    res.sendStatus(200)
  } catch (err) {
    console.error('[webhook]', err)
    res.sendStatus(500)
  }
})

export default router
