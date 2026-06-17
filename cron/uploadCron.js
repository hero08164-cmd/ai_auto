import cron from 'node-cron'
import Video from '../models/Video.js'
import cloudinary from '../utils/cloudinary.js'
import { makeVideoPublic } from '../utils/youtube.js'

// ======================
// SCHEDULED - 1:20 PM IST = 7:50 AM UTC
cron.schedule('50 7 * * *', async () => {


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
