import cron from 'node-cron'
import Video from '../models/Video.js'
import cloudinary from '../utils/cloudinary.js'
import { makeVideoPublic } from '../services/youtubeService.js'

// ======================
// TEST - 1:32 PM IST = 8:02 AM UTC
// ======================

cron.schedule('2 8 * * *', async () => {

  console.log('======================')
  console.log('PUBLISH CRON STARTED')
  console.log('======================')

  try {
    const video = await Video.findOne({ status: 'scheduled' })

    if (!video) {
      console.log('NO SCHEDULED VIDEOS')
      return
    }

    console.log('MAKING VIDEO PUBLIC:', video.youtubeVideoId)

    const success = await makeVideoPublic(video.youtubeVideoId)

    if (!success) {
      console.log('FAILED TO PUBLIC')
      return
    }

    console.log('VIDEO PUBLIC SUCCESS')

    await cloudinary.uploader.destroy(video.cloudinaryId, {
      resource_type: 'video'
    })
    console.log('CLOUDINARY VIDEO DELETED')

    await Video.findByIdAndDelete(video._id)
    console.log('MONGODB RECORD DELETED')

    console.log('======================')
    console.log('CRON FINISHED')
    console.log('======================')

  } catch (error) {
    console.log('CRON ERROR:', error.message)
  }

})
