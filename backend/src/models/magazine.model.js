const mongoose = require('mongoose')

const MagazineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String },
  downloadUrl: { type: String },
  featured: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Magazine', MagazineSchema)