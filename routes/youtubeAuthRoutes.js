import express from 'express'

import {
  getAuthUrl,
  saveTokens
} from '../services/youtubeService.js'

const router = express.Router()

router.get('/youtube', (req, res) => {

  const url = getAuthUrl()

  res.redirect(url)
})

router.get(
  '/youtube/callback',

  async (req, res) => {

    try {

      const code = req.query.code

      await saveTokens(code)

      res.send(
        'YouTube Connected Successfully'
      )

    } catch (error) {

      console.log(error)

      res.send('Connection Failed')
    }
  }
)

export default router