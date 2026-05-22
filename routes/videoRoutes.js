import express from 'express'

import Video from '../models/Video.js'

const router = express.Router()

// GET ALL VIDEOS

router.get('/', async (req, res) => {

  try {

    const videos =
      await Video.find().sort({
        createdAt: -1
      })

    res.json(videos)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

// DELETE VIDEO

router.delete('/:id', async (req, res) => {

  try {

    await Video.findByIdAndDelete(
      req.params.id
    )

    res.json({
      success: true
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

// ANALYTICS

router.get('/analytics', async (req, res) => {

  try {

    const total =
      await Video.countDocuments()

    const uploaded =
      await Video.countDocuments({
        status: 'uploaded'
      })

    const pending =
      await Video.countDocuments({
        status: 'pending'
      })

    const failed =
      await Video.countDocuments({
        status: 'failed'
      })

    res.json({

      total,

      uploaded,

      pending,

      failed,

      successRate:
        total > 0
          ? (
              (uploaded / total) *
              100
            ).toFixed(1)
          : 0

    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

export default router