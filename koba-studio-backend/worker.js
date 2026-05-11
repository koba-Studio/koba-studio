import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import purchasesRouter from './routes/purchases.js'
import webhooksRouter from './routes/webhooks.js'
import contactRouter from './routes/contact.js'
import usersRouter from './routes/users.js'
import pagesRouter from './routes/pages.js'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => {
    if (!origin || origin === 'https://kobastudio.cl' || origin.startsWith('http://localhost')) {
      return origin
    }
    return null
  },
  credentials: true,
}))

app.get('/health', (c) => c.json({ status: 'OK', timestamp: new Date().toISOString() }))

app.route('/api/auth', authRouter)
app.route('/api/products', productsRouter)
app.route('/api/purchases', purchasesRouter)
app.route('/api/webhooks', webhooksRouter)
app.route('/api/contact', contactRouter)
app.route('/api/users', usersRouter)
app.route('/api/pages', pagesRouter)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

export default app
