import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import uploadRoutes from './routes/uploadRoutes.js'
import videoRoutes from './routes/videoRoutes.js'
import youtubeAuthRoutes from './routes/youtubeAuthRoutes.js'

import './cron/uploadCron.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend Running 🚀')
})

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use('/api', uploadRoutes)
app.use('/api/videos', videoRoutes)
app.use('/auth', youtubeAuthRoutes)

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB Connected')

  app.listen(process.env.PORT || 5000, () => {
    console.log('Server Running')
  })
})
