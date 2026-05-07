import express from 'express'
import { supabase } from '../config.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) throw error

    res.json({ user: data.user, message: 'Signup successful' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    res.json({ user: data.user, session: data.session })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    res.json({ message: 'Signed out successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data, error } = await supabase.auth.getUser(token)

    if (error) throw error

    res.json({ user: data.user })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
})

export default router
