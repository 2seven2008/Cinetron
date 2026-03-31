import { Router } from 'express'
import { Download } from '../models/Media.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  try {
    const items = await Download.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { tmdbId, title, posterPath, mediaType } = req.body
    const item = await Download.create({ user: req.user._id, tmdbId, title, posterPath, mediaType })
    res.status(201).json(item)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Já nos downloads' })
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:tmdbId', async (req, res) => {
  try {
    await Download.findOneAndDelete({ user: req.user._id, tmdbId: req.params.tmdbId })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
