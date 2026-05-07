import express from 'express'
import { supabase } from '../config.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
