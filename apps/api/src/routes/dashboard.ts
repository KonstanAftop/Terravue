import { Router } from 'express'
import { dashboardService } from '../services/dashboardService.js'
import { authenticate } from '../middleware/auth.js'

export const dashboardRouter = Router()

// GET /api/v1/dashboard - Get user dashboard data
dashboardRouter.get('/', authenticate, (req, res) => {
  try {
    const userId = req.user!.userId
    const dashboardData = dashboardService.getDashboardData(userId)

    res.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
    })
  }
})

