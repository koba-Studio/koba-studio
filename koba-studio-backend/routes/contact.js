import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateContactForm } from '../lib/validate.js'
import { contactLimiter } from '../lib/rateLimiter.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * POST /api/contact
 * Crear nuevo mensaje de contacto
 *
 * Seguridad:
 * - Rate limiting: máx 5 por hora por IP
 * - Validación de inputs
 * - Sanitización de datos
 * - Autenticación opcional (para usuarios registrados)
 */
router.post('/', contactLimiter, optionalAuth, async (req, res) => {
  try {
    const { nombre, email, mensaje, servicio, empresa, urgencia } = req.body

    // Validar y sanitizar datos
    const validation = validateContactForm({
      nombre,
      email,
      mensaje,
      servicio,
      empresa,
      urgencia
    })

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: validation.errors
      })
    }

    const sanitized = validation.data

    // Crear mensaje de contacto en Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          nombre: sanitized.nombre,
          email: sanitized.email,
          mensaje: sanitized.mensaje,
          servicio: sanitized.servicio,
          empresa: sanitized.empresa,
          urgencia: sanitized.urgencia,
          user_id: req.user?.id || null, // null si no está autenticado
          ip_address: req.ip,
          read: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Error al guardar el mensaje' })
    }

    // Log para auditoría
    console.log(`[CONTACT] New message from ${sanitized.email} (user: ${req.user?.id || 'anonymous'})`)

    // Responder con éxito (sin exponer datos internos)
    res.status(201).json({
      success: true,
      message: 'Mensaje recibido. Te responderemos en menos de 24 horas.'
    })

  } catch (err) {
    console.error('Contact endpoint error:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
