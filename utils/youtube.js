import axios from 'axios'
import fs from 'fs'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
)

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
})

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
})

export const uploadToYoutube = async (video) => {
  try {
    console.log('DOWNLOADING VIDEO...')

    const response = await axios({
      method: 'GET',
      url: video.videoUrl,
      responseType: 'stream',
      timeout: 0
    })

    const tempFile = `temp-${Date.now()}.mp4`
    const writer = fs.createWriteStream(tempFile)
    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    console.log('DOWNLOAD SUCCESS')
    console.log('STARTING YOUTUBE UPLOAD')

    const youtubeResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: video.titleHindi,
          description: `${video.descriptionHindi}\n\n${video.descriptionEnglish}`,
          tags: ['ai', 'shorts', 'viral'],
          categoryId: '22'
        },
        status: {
          privacyStatus: 'unlisted'
        }
      },
      media: {
        body: fs.createReadStream(tempFile)
      }
    })

    console.log('YOUTUBE UNLISTED SUCCESS')
    fs.unlinkSync(tempFile)

    return {
      success: true,
      youtubeVideoId: youtubeResponse.data.id
    }

  } catch (error) {
    console.log('YOUTUBE ERROR:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

export const makeVideoPublic = async (videoId) => {
  try {
    await youtube.videos.update({
      part: ['status'],
      requestBody: {
        id: videoId,
        status: {
          privacyStatus: 'public'
        }
      }
    })
    console.log('PUBLIC SUCCESS:', videoId)
    return true
  } catch (error) {
    console.log('PUBLIC ERROR:', error.message)
    return false
  }
}
