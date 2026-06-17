import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  titleHindi: String,
  descriptionHindi: String,
  descriptionEnglish: String,
  videoUrl: String,
  cloudinaryId: String,
  youtubeVideoId: String,
  status: {
    type: String,
    default: 'scheduled'  // ✅ SAHI
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Video', videoSchema)
