import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRouter from './routes/contact.js'
import paymentsRouter from './routes/payments.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ── CORS ──────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`Origin ${origin} not allowed by CORS`))
  },
  credentials: true,
}))

// Webhook necesita body crudo para verificar firma de MP
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

// ── ROUTES ────────────────────────────────────
app.use('/api/contact', contactRouter)
app.use('/api/payments', paymentsRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ── START ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[KoBa Backend] ✓ Corriendo en http://localhost:${PORT}`)
})
