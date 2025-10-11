import { Router } from 'express'
import { priceAlertService } from '../services/priceAlertService.js'
import { authMiddleware } from '../middleware/auth.js'

export const alertsRouter = Router()

// All alert routes require authentication
alertsRouter.use(authMiddleware)

// POST /api/v1/alerts - Create a new price alert
alertsRouter.post('/', async (req, res) => {
  try {
    const { targetPrice, condition, region, notificationMethods } = req.body
    const userId = req.user!.id

    // Validation
    if (!targetPrice || !condition || !notificationMethods) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: targetPrice, condition, notificationMethods',
      })
    }

    if (!['above', 'below', 'crosses'].includes(condition)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid condition. Must be: above, below, or crosses',
      })
    }

    if (targetPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Target price must be greater than 0',
      })
    }

    const alert = await priceAlertService.createAlert(userId, {
      targetPrice,
      condition,
      region,
      notificationMethods,
    })

    res.status(201).json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error creating price alert:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create price alert',
    })
  }
})

// GET /api/v1/alerts - Get all alerts for current user
alertsRouter.get('/', async (req, res) => {
  try {
    const userId = req.user!.id
    const alerts = await priceAlertService.getUserAlerts(userId)

    res.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
    })
  }
})

// GET /api/v1/alerts/stats - Get alert statistics for current user
alertsRouter.get('/stats', async (req, res) => {
  try {
    const userId = req.user!.id
    const stats = await priceAlertService.getAlertStatistics(userId)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching alert stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert statistics',
    })
  }
})

// GET /api/v1/alerts/:id - Get a specific alert
alertsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const alert = await priceAlertService.getAlert(id)

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      })
    }

    // Check if alert belongs to current user
    if (alert.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      })
    }

    res.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error fetching alert:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert',
    })
  }
})

// PATCH /api/v1/alerts/:id - Update an alert
alertsRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const { targetPrice, condition, isActive } = req.body

    // Check if alert exists and belongs to user
    const existingAlert = await priceAlertService.getAlert(id)
    if (!existingAlert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      })
    }

    if (existingAlert.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      })
    }

    // Validate updates
    if (condition && !['above', 'below', 'crosses'].includes(condition)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid condition. Must be: above, below, or crosses',
      })
    }

    if (targetPrice !== undefined && targetPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Target price must be greater than 0',
      })
    }

    const updatedAlert = await priceAlertService.updateAlert(id, {
      targetPrice,
      condition,
      isActive,
    })

    res.json({
      success: true,
      data: updatedAlert,
    })
  } catch (error) {
    console.error('Error updating alert:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update alert',
    })
  }
})

// DELETE /api/v1/alerts/:id - Delete an alert
alertsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    // Check if alert exists and belongs to user
    const existingAlert = await priceAlertService.getAlert(id)
    if (!existingAlert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      })
    }

    if (existingAlert.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      })
    }

    await priceAlertService.deleteAlert(id)

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting alert:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete alert',
    })
  }
})

