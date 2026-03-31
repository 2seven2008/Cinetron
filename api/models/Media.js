import mongoose from 'mongoose'

const mediaItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String, default: null },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  rating: { type: Number, default: null },
}, { timestamps: true })

mediaItemSchema.index({ user: 1, tmdbId: 1 }, { unique: true })

export const Watchlist = mongoose.model('Watchlist', mediaItemSchema)

const downloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String, default: null },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
}, { timestamps: true })

downloadSchema.index({ user: 1, tmdbId: 1 }, { unique: true })

export const Download = mongoose.model('Download', downloadSchema)
