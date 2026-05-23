import cron from 'node-cron'

import Video from '../models/Video.js'

import cloudinary from '../utils/cloudinary.js'

import {
  makeVideoPublic
} from '../services/youtubeService.js'

// ======================
// DAILY 6 PM PUBLISH
// ======================

cron.schedule(

  '* * * * *',

  async () => {

    console.log('======================')
    console.log('PUBLISH CRON STARTED')
    console.log('======================')

    try {

      const video =
        await Video.findOne({

          status: 'scheduled'

        })

      if (!video) {

        console.log(
          'NO SCHEDULED VIDEOS'
        )

        return

      }

      console.log(
        'MAKING VIDEO PUBLIC'
      )

      const success =
        await makeVideoPublic(
          video.youtubeVideoId
        )

      if (!success) {

        console.log(
          'FAILED TO PUBLIC'
        )

        return

      }

      console.log(
        'VIDEO PUBLIC SUCCESS'
      )

      // ======================
      // DELETE CLOUDINARY VIDEO
      // ======================

      await cloudinary.uploader.destroy(

        video.cloudinaryId,

        {

          resource_type:
            'video'

        }

      )

      console.log(
        'CLOUDINARY VIDEO DELETED'
      )

      // ======================
      // DELETE MONGODB RECORD
      // ======================

      await Video.findByIdAndDelete(
        video._id
      )

      console.log(
        'MONGODB RECORD DELETED'
      )

      console.log('======================')
      console.log('CRON FINISHED')
      console.log('======================')

    } catch (error) {

      console.log(
        'CRON ERROR:',
        error.message
      )

    }

  },

  {
    timezone: 'Asia/Kolkata'
  }

)
