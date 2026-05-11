import validator from 'validator'
const { isEmail, escape } = validator

/**
 * Validar y sanitizar datos del formulario de contacto
 */
export function validateContactForm(data) {
  const errors = []

  // Validar nombre
  if (!data.nombre || typeof data.nombre !== 'string') {
    errors.push('Nombre es requerido')
  } else if (data.nombre.trim().length < 2 || data.nombre.trim().length > 100) {
    errors.push('Nombre debe tener entre 2 y 100 caracteres')
  }

  // Validar email
  if (!data.email || !isEmail(data.email)) {
    errors.push('Email inválido')
  }

  // Validar mensaje
  if (!data.mensaje || typeof data.mensaje !== 'string') {
    errors.push('Mensaje es requerido')
  } else if (data.mensaje.trim().length < 10 || data.mensaje.trim().length > 5000) {
    errors.push('Mensaje debe tener entre 10 y 5000 caracteres')
  }

  // Validar servicio (opcional pero si está presente)
  const servicios = ['diagnostico', 'starter', 'pro', 'enterprise', 'consulta']
  if (data.servicio && !servicios.includes(data.servicio)) {
    errors.push('Servicio inválido')
  }

  // Validar empresa (opcional)
  if (data.empresa && (typeof data.empresa !== 'string' || data.empresa.length > 100)) {
    errors.push('Empresa inválida')
  }

  // Validar urgencia (array de strings)
  const urgenciasValidas = ['ya', '1mes', 'explorando']
  if (Array.isArray(data.urgencia)) {
    for (const u of data.urgencia) {
      if (!urgenciasValidas.includes(u)) {
        errors.push('Urgencia inválida')
        break
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Retornar datos sanitizados
  return {
    valid: true,
    data: {
      nombre: escape(data.nombre.trim()),
      email: escape(data.email.trim()),
      mensaje: escape(data.mensaje.trim()),
      servicio: data.servicio || null,
      empresa: data.empresa ? escape(data.empresa.trim()) : null,
      urgencia: Array.isArray(data.urgencia) ? data.urgencia.filter(u => urgenciasValidas.includes(u)) : []
    }
  }
}

/**
 * Sanitizar string para evitar XSS
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  return escape(str.trim())
}

/**
 * Validar UUID
 */
export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
