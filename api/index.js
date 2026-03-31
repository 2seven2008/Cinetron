import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import watchlistRoutes from './routes/watchlist.js'
import downloadsRoutes from './routes/downloads.js'

const app = express()

// ── CORS ────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (curl, Postman, same-origin)
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      return cb(null, true)
    }
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json())

// ── MongoDB (connection pooling across invocations) ──────
let connected = false
const connectDB = async () => {
  if (connected) return
  await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  })
  connected = true
}

// Middleware to ensure DB is connected before any route
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('DB connection error:', err.message)
    res.status(503).json({ message: 'Serviço indisponível. Tente novamente.' })
  }
})

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/downloads', downloadsRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }))

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: err.message || 'Erro interno do servidor' })
})

export default app
