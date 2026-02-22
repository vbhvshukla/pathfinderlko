const mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String },
  mime: { type: String },
  size: { type: Number },
  type: { type: String, enum: ['image', 'pdf', 'other'], default: 'image' },
  category: { type: String , enum:['services','gallery']}, // gallery,services etc.
  relatedId: { type: String },
  title: { type: String },
  alt: { type: String },
  featured: { type: Boolean, default: false },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})

UploadSchema.index({ category: 1, relatedId: 1, createdAt: -1 })

module.exports = mongoose.model('Upload', UploadSchema)