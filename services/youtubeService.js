import axios from 'axios'

import { google } from 'googleapis'

import dotenv from 'dotenv'

dotenv.config()

// ======================
// GOOGLE OAUTH
// ======================

const oauth2Client =
  new google.auth.OAuth2(

    process.env.YOUTUBE_CLIENT_ID,

    process.env.YOUTUBE_CLIENT_SECRET,

    process.env.YOUTUBE_REDIRECT_URI

  )

oauth2Client.setCredentials({

  refresh_token:
    process.env.YOUTUBE_REFRESH_TOKEN

})

// ======================
// YOUTUBE CLIENT
// ======================

const youtube =
  google.youtube({

    version: 'v3',

    auth: oauth2Client

  })

// ======================
// GET AUTH URL
// ======================

export const getAuthUrl = () => {

  return oauth2Client.generateAuthUrl({

    access_type: 'offline',

    scope: [
      'https://www.googleapis.com/auth/youtube'
    ],

    prompt: 'consent'

  })

}

// ======================
// SAVE TOKENS
// ======================

export const saveTokens =
  async (code) => {

    const { tokens } =
      await oauth2Client.getToken(code)

    oauth2Client.setCredentials(tokens)

    console.log('====================')
    console.log('YOUTUBE TOKENS')
    console.log(tokens)
    console.log('====================')

    return tokens

  }

// ======================
// DIRECT STREAM UPLOAD
// ======================

export const uploadToYoutube =
  async (video) => {

    try {

      console.log(
        'STARTING YOUTUBE STREAM UPLOAD'
      )

      // DIRECT STREAM FROM CLOUDINARY

      const response =
        await axios({

          method: 'GET',

          url: video.videoUrl,

          responseType: 'stream',

          timeout: 0

        })

      console.log(
        'CLOUDINARY STREAM READY'
      )

      const youtubeResponse =
        await youtube.videos.insert({

          part: [
            'snippet',
            'status'
          ],

          requestBody: {

            snippet: {

              title:
                video.titleHindi,

              description:
`
${video.descriptionHindi}

${video.descriptionEnglish}
              `,

              tags: [
                'ai',
                'shorts',
                'viral'
              ],

              categoryId: '22'

            },

            status: {

              privacyStatus:
                'private'

            }

          },

          media: {

            body:
              response.data

          }

        })

      console.log(
        'PRIVATE YOUTUBE UPLOAD SUCCESS'
      )

      return {

        success: true,

        youtubeVideoId:
          youtubeResponse.data.id

      }

    } catch (error) {

      console.log(
        'YOUTUBE ERROR:',
        error.message
      )

      return {

        success: false,

        error: error.message

      }

    }

  }

// ======================
// MAKE VIDEO PUBLIC
// ======================

export const makeVideoPublic =
  async (youtubeVideoId) => {

    try {

      console.log(
        'MAKING VIDEO PUBLIC'
      )

      await youtube.videos.update({

        part: ['status'],

        requestBody: {

          id: youtubeVideoId,

          status: {

            privacyStatus:
              'public'

          }

        }

      })

      console.log(
        'VIDEO PUBLIC SUCCESS'
      )

      return true

    } catch (error) {

      console.log(
        'PUBLIC ERROR:',
        error.message
      )

      return false

    }

  }