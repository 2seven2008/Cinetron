import { Router } from 'express'
import { Watchlist } from '../models/Media.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// GET /api/watchlist
router.get('/', async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/watchlist
router.post('/', async (req, res) => {
  try {
    const { tmdbId, title, posterPath, mediaType, rating } = req.body
    const item = await Watchlist.create({ user: req.user._id, tmdbId, title, posterPath, mediaType, rating })
    res.status(201).json(item)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Já está na sua lista' })
    res.status(500).json({ message: err.message })
  }
})

// GET /api/watchlist/check/:tmdbId
router.get('/check/:tmdbId', async (req, res) => {
  try {
    const item = await Watchlist.findOne({ user: req.user._id, tmdbId: req.params.tmdbId })
    res.json({ inList: !!item })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/watchlist/:tmdbId
router.delete('/:tmdbId', async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ user: req.user._id, tmdbId: req.params.tmdbId })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
