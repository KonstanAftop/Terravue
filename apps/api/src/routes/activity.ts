import { Router } from 'express'
import { activityTrackingService } from '../services/activityTrackingService.js'
import { authMiddleware } from '../middleware/auth.js'
import { ActivityType } from '@terravue/shared'

export const activityRouter = Router()

// All routes require authentication
activityRouter.use(authMiddleware)

// GET /api/v1/activity - Get user activity timeline
activityRouter.get('/', async (req, res) => {
  try {
    const userId = req.user!.id
    const type = req.query.type as ActivityType | undefined
    const from = req.query.from ? new Date(req.query.from as string) : undefined
    const to = req.query.to ? new Date(req.query.to as string) : undefined
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0

    const result = await activityTrackingService.getActivityTimeline(userId, {
      type,
      from,
      to,
      limit,
      offset,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching activity timeline:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity timeline',
    })
  }
})

// GET /api/v1/activity/statistics - Get activity statistics
activityRouter.get('/statistics', async (req, res) => {
  try {
    const userId = req.user!.id
    const statistics = await activityTrackingService.getActivityStatistics(userId)

    res.json({
      success: true,
      data: statistics,
    })
  } catch (error) {
    console.error('Error fetching activity statistics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity statistics',
    })
  }
})

// POST /api/v1/activity/initialize - Initialize sample data (development only)
activityRouter.post('/initialize', async (req, res) => {
  try {
    const userId = req.user!.id
    activityTrackingService.initializeSampleData(userId)

    res.json({
      success: true,
      message: 'Sample activity data initialized',
    })
  } catch (error) {
    console.error('Error initializing sample data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to initialize sample data',
    })
  }
})

