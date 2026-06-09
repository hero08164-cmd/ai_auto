import axios from 'axios'

export const generateAiTitle =
  async (fileName) => {

    try {

      const cleanName =
        fileName
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')

      const prompt =
`
"${cleanName}"

के लिए एक वायरल YouTube Shorts title बनाओ।

Rules:
- केवल हिंदी
- बहुत catchy
- emoji use करो
- 5-10 words
- clickbait style
- सिर्फ ONE title
`

      const response =
        await axios.post(

          'https://api-inference.huggingface.co/models/google/flan-t5-large',

          {
            inputs: prompt
          },

          {

            headers: {

              Authorization:
                `Bearer ${process.env.HUGGINGFACE_API_KEY}`

            },

            timeout: 30000

          }

        )

      const aiTitle =
        response.data?.[0]
          ?.generated_text

      if (!aiTitle) {

        return `Hydraulic Press vs Red Hot Metal 😱🔥 | So Satisfying to Watch! 💥`

      }

      return aiTitle.trim()

    } catch (error) {

      console.log(
        'AI ERROR:',
        error.message
      )

      return `Hydraulic Press vs Red Hot Metal 😱🔥 | So Satisfying to Watch! 💥`

    }

  }
