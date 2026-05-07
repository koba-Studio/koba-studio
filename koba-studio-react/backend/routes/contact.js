import { Router } from 'express'
import { Resend } from 'resend'

const router = Router()
const resend = new Resend(process.env.RESEND_API_KEY)

router.post('/', async (req, res) => {
  const { nombre, empresa, email, servicio, mensaje, urgencia } = req.body

  // Validación básica
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, mensaje.' })
  }

  const urgenciaTexto = Array.isArray(urgencia) && urgencia.length
    ? urgencia.map(u => ({ ya: 'Lo antes posible', '1mes': 'Próximo mes', explorando: 'Solo explorando' }[u] || u)).join(', ')
    : 'No especificado'

  const servicioTexto = {
    diagnostico: 'Diagnóstico inicial (gratis)',
    starter: 'Plan Starter',
    pro: 'Plan Pro',
    enterprise: 'Plan Enterprise',
    consulta: 'Solo una consulta',
  }[servicio] || servicio || 'No especificado'

  try {
    await resend.emails.send({
      from: `KoBa Studio <notificaciones@${process.env.RESEND_DOMAIN || 'kobastudio.com'}>`,
      to: process.env.CONTACT_EMAIL || 'hola@kobastudio.com',
      reply_to: email,
      subject: `Contacto: ${nombre}${empresa ? ` — ${empresa}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:system-ui,sans-serif;background:#0A0C16;color:#F8F6F2;padding:32px;margin:0">
          <div style="max-width:560px;margin:0 auto">
            <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Nuevo mensaje de contacto</h1>
            <p style="color:#A8A49F;margin-bottom:32px;font-size:14px">Recibido desde kobastudio.com</p>

            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:12px 0;border-bottom:1px solid #1A1D26;color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:120px">Nombre</td><td style="padding:12px 0;border-bottom:1px solid #1A1D26;font-size:15px">${nombre}</td></tr>
              ${empresa ? `<tr><td style="padding:12px 0;border-bottom:1px solid #1A1D26;color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Empresa</td><td style="padding:12px 0;border-bottom:1px solid #1A1D26;font-size:15px">${empresa}</td></tr>` : ''}
              <tr><td style="padding:12px 0;border-bottom:1px solid #1A1D26;color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Email</td><td style="padding:12px 0;border-bottom:1px solid #1A1D26;font-size:15px"><a href="mailto:${email}" style="color:#7B6FE8">${email}</a></td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid #1A1D26;color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Servicio</td><td style="padding:12px 0;border-bottom:1px solid #1A1D26;font-size:15px">${servicioTexto}</td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid #1A1D26;color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Inicio</td><td style="padding:12px 0;border-bottom:1px solid #1A1D26;font-size:15px">${urgenciaTexto}</td></tr>
            </table>

            <div style="margin-top:24px;padding:20px;background:#12151F;border-radius:12px;border:1px solid #1A1D26">
              <p style="color:#A8A49F;font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px">Mensaje</p>
              <p style="font-size:15px;line-height:1.6;margin:0">${mensaje.replace(/\n/g, '<br/>')}</p>
            </div>

            <p style="margin-top:32px;font-size:12px;color:#6B6A6A">
              Respondé directamente a este email — el reply irá a <strong style="color:#A8A49F">${email}</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('[contact/send]', err)
    res.status(500).json({ error: 'Error al enviar el mensaje. Por favor intentá más tarde.' })
  }
})

export default router
