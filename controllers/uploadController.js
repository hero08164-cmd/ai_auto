import cloudinary from '../utils/cloudinary.js'

import Video from '../models/Video.js'

import streamifier from 'streamifier'

import {
  uploadToYoutube
} from '../services/youtubeService.js'

import {
  generateAiTitle
} from '../services/aiService.js'

export const uploadVideos = async (
  req,
  res
) => {

  try {

    console.log('========================')
    console.log('UPLOAD API CALLED')
    console.log('========================')

    console.log(
      'REQ FILES:',
      req.files
    )

    if (
      !req.files ||
      req.files.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          'No files uploaded'

      })

    }

    const uploadedVideos = []

    for (const file of req.files) {

      console.log(
        '------------------------'
      )

      console.log(
        'Uploading:',
        file.originalname
      )

      // AI TITLE GENERATION

      const generatedTitle =
        await generateAiTitle(
          file.originalname
        )

      console.log(
        'AI TITLE:',
        generatedTitle
      )

      // CLOUDINARY UPLOAD

      const result =
        await new Promise(

          (resolve, reject) => {

            const uploadStream =

              cloudinary.uploader.upload_stream(

                {

                  resource_type:
                    'video',

                  folder:
                    'ai-auto-video-uploader',

                  chunk_size:
                    6000000

                },

                (error, result) => {

                  if (error) {

                    console.log(
                      'CLOUDINARY ERROR:',
                      error
                    )

                    reject(error)

                  } else {

                    resolve(result)

                  }

                }

              )

            streamifier
              .createReadStream(
                file.buffer
              )
              .pipe(uploadStream)

          }

        )

      console.log(
        'CLOUDINARY SUCCESS:',
        result.secure_url
      )

      // YOUTUBE PRIVATE UPLOAD

      const youtubeResult =
        await uploadToYoutube({

          titleHindi:
            generatedTitle,

          descriptionHindi:
            `🔥 ${generatedTitle}

यह वीडियो AI Auto Video Uploader द्वारा अपलोड किया गया है।`,

          descriptionEnglish:
            'Uploaded using AI Auto Video Uploader',

          videoUrl:
            result.secure_url

        })

      if (!youtubeResult.success) {

        console.log(
          'YOUTUBE UPLOAD FAILED'
        )

        continue

      }

      console.log(
        'YOUTUBE PRIVATE SUCCESS'
      )

      // SAVE DATABASE

      const savedVideo =
        await Video.create({

          titleHindi:
            generatedTitle,

          descriptionHindi:
            `🔥 ${generatedTitle}

यह वीडियो AI Auto Video Uploader द्वारा अपलोड किया गया है।`,

          descriptionEnglish:
            'Uploaded using AI Auto Video Uploader',

          videoUrl:
            result.secure_url,

          cloudinaryId:
            result.public_id,

          youtubeVideoId:
            youtubeResult.youtubeVideoId,

          status:
            'scheduled'

        })

      uploadedVideos.push(
        savedVideo
      )

      console.log(
        'MONGODB SAVED'
      )

    }

    console.log('========================')
    console.log('UPLOAD SUCCESS')
    console.log('========================')

    res.json({

      success: true,

      videos:
        uploadedVideos

    })

  } catch (error) {

    console.log('========================')
    console.log('UPLOAD ERROR')
    console.log(error)
    console.log('========================')

    res.status(500).json({

      success: false,

      error: error.message

    })

  }

}