import express from 'express'
import multer from 'multer'
import { uploadVideos } from '../controllers/uploadController.js'

const router = express.Router()

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024
  }
})

router.post(
  '/upload',
  upload.array('videos'),
  uploadVideos
)

export default router