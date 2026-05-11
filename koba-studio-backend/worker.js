// Entrada para Cloudflare Workers
import app from './server.js'

export default {
  fetch: app.handler ? app.handler.bind(app) : app,
  async scheduled(event, env, ctx) {
    // Aquí irían tareas cron si las necesitas
    console.log('Scheduled event triggered', event)
  }
}
