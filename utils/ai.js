import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const HF_API =
  'https://api-inference.huggingface.co/models/google/flan-t5-large'

export const generateAIContent = async (
  filename
) => {

  try {

    const cleanName = filename
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]/g, ' ')

    const prompt = `
Generate:
1 Hindi viral YouTube title
1 Hindi short description
1 English short description

Topic: ${cleanName}

Return JSON only.
`

    const response = await axios.post(

      HF_API,

      {
        inputs: prompt
      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }

    )

    const text =
      response.data?.[0]?.generated_text || ''

    return {

      titleHindi:
        text || `🔥 ${cleanName}`,

      descriptionHindi:
        `यह वीडियो ${cleanName} के बारे में है।`,

      descriptionEnglish:
        `This video is about ${cleanName}.`
    }

  } catch (error) {

    console.log(
      'AI ERROR:',
      error.message
    )

    return {

      titleHindi:
        `🔥 ${filename}`,

      descriptionHindi:
        'मजेदार वीडियो',

      descriptionEnglish:
        'Funny video'
    }
  }
}