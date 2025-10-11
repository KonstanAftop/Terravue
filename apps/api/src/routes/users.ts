import { Router } from 'express'
import { userProfileService } from '../services/userProfileService.js'
import { dataExportService } from '../services/dataExportService.js'
import { authMiddleware } from '../middleware/auth.js'

export const usersRouter = Router()

// All routes require authentication
usersRouter.use(authMiddleware)

// GET /api/v1/users/profile - Get current user profile
usersRouter.get('/profile', async (req, res) => {
  try {
    const userId = req.user!.id
    const profile = await userProfileService.getUserProfile(userId)

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      })
    }

    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    })
  }
})

// PUT /api/v1/users/profile - Update user profile
usersRouter.put('/profile', async (req, res) => {
  try {
    const userId = req.user!.id
    const updates = req.body

    const updatedProfile = await userProfileService.updateProfile(userId, updates)

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      })
    }

    res.json({
      success: true,
      data: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
    })
  }
})

// GET /api/v1/users/settings - Get user settings
usersRouter.get('/settings', async (req, res) => {
  try {
    const userId = req.user!.id
    const settings = await userProfileService.getUserSettings(userId)

    res.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user settings',
    })
  }
})

// PUT /api/v1/users/settings - Update user settings
usersRouter.put('/settings', async (req, res) => {
  try {
    const userId = req.user!.id
    const updates = req.body

    const updatedSettings = await userProfileService.updateSettings(userId, updates)

    res.json({
      success: true,
      data: updatedSettings,
    })
  } catch (error) {
    console.error('Error updating user settings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user settings',
    })
  }
})

// GET /api/v1/users/metrics - Get user performance metrics
usersRouter.get('/metrics', async (req, res) => {
  try {
    const userId = req.user!.id
    const metrics = await userProfileService.getPerformanceMetrics(userId)

    res.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error('Error fetching user metrics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user metrics',
    })
  }
})

// GET /api/v1/users/verification - Get verification status
usersRouter.get('/verification', async (req, res) => {
  try {
    const userId = req.user!.id
    const status = await userProfileService.getVerificationStatus(userId)

    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('Error fetching verification status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification status',
    })
  }
})

// PUT /api/v1/users/verification - Update verification status
usersRouter.put('/verification', async (req, res) => {
  try {
    const userId = req.user!.id
    const updates = req.body

    const status = await userProfileService.updateVerificationStatus(userId, updates)

    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('Error updating verification status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update verification status',
    })
  }
})

// POST /api/v1/users/export - Export user data
usersRouter.post('/export', async (req, res) => {
  try {
    const userId = req.user!.id
    const exportRequest = req.body

    const result = await dataExportService.exportUserData(userId, exportRequest)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error exporting user data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to export user data',
    })
  }
})

