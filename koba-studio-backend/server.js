import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import purchasesRouter from './routes/purchases.js'
import webhooksRouter from './routes/webhooks.js'
import contactRouter from './routes/contact.js'
import usersRouter from './routes/users.js'
import pagesRouter from './routes/pages.js'
import { generalLimiter } from './lib/rateLimiter.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : (origin, callback) => {
        // En desarrollo aceptar cualquier localhost
        if (!origin || origin.startsWith('http://localhost')) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
  credentials: true,
}))

app.use(express.json())

// Aplicar rate limiting general a todas las rutas
app.use(generalLimiter)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/purchases', purchasesRouter)
app.use('/api/webhooks', webhooksRouter)
app.use('/api/contact', contactRouter)
app.use('/api/users', usersRouter)
app.use('/api/pages', pagesRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

// Exportar para Cloudflare Workers
export default app

// Listener para desarrollo local
if (process.env.NODE_ENV !== 'worker') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
