import rateLimit from 'express-rate-limit'

/**
 * Rate limiter para endpoint de contacto
 * Máximo 5 mensajes por hora por IP
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: 'Demasiados mensajes enviados desde esta IP. Intenta de nuevo más tarde.',
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter más estricto para API general
 * Máximo 100 requests por 15 minutos por IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter para endpoints autenticados
 * Máximo 60 requests por minuto por usuario
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?.id || req.ip,
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
})
