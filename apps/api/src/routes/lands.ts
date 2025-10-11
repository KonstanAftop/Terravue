import { Router } from 'express'
import { landService } from '../services/landService.js'
import { landActivityService } from '../services/landActivityService.js'
import { mockVerificationService } from '../mock/verificationService.js'
import { authenticate } from '../middleware/auth.js'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

export const landsRouter = Router()

// GET /api/v1/lands/global - Get all verified land parcels for global map (no auth required)
landsRouter.get('/global', (req, res) => {
  try {
    const { status, landType, search, minArea, maxArea } = req.query

    let lands = inMemoryStore.getAllLands()

    // Filter by verification status (default to verified only)
    if (status) {
      lands = lands.filter(land => land.verificationStatus === status)
    } else {
      // Default: only show verified lands on global map
      lands = lands.filter(land => land.verificationStatus === 'verified')
    }

    // Filter by land type
    if (landType) {
      lands = lands.filter(land => land.landType === landType)
    }

    // Filter by search (name or location)
    if (search) {
      const searchLower = (search as string).toLowerCase()
      lands = lands.filter(land => 
        land.name.toLowerCase().includes(searchLower)
      )
    }

    // Filter by area range
    if (minArea) {
      lands = lands.filter(land => land.area >= parseFloat(minArea as string))
    }
    if (maxArea) {
      lands = lands.filter(land => land.area <= parseFloat(maxArea as string))
    }

    // Get owner information for each land (without sensitive data)
    const landsWithOwners = lands.map(land => {
      const owner = inMemoryStore.getUser(land.ownerId)
      return {
        ...land,
        ownerName: owner?.fullName || 'Unknown',
        ownerType: owner?.userType || 'unknown',
      }
    })

    res.json({
      success: true,
      data: {
        lands: landsWithOwners,
        total: landsWithOwners.length,
      },
    })
  } catch (error) {
    console.error('Error fetching global lands:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch global lands',
    })
  }
})

// All other routes require authentication
landsRouter.use(authenticate)

// GET /api/v1/lands - Get user's land parcels with filtering and pagination
landsRouter.get('/', (req, res) => {
  try {
    const userId = req.user!.userId
    const { search, status, sortBy, sortOrder, page, limit } = req.query

    const result = landService.getUserLands(userId, {
      search: search as string,
      status: status as 'pending' | 'verified' | 'rejected' | undefined,
      sortBy: sortBy as 'name' | 'area' | 'createdAt' | 'verificationStatus' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching lands:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lands',
    })
  }
})

// GET /api/v1/lands/:id - Get specific land parcel with full details
landsRouter.get('/:id', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params

    const land = landService.getLandById(id, userId)

    if (!land) {
      return res.status(404).json({
        success: false,
        error: 'Land parcel not found or access denied',
      })
    }

    // Get activities for this land parcel
    const activities = landActivityService.getActivitiesByLandParcel(id)

    // Get verification progress
    const verificationProgress = mockVerificationService.getVerificationProgress(id)

    // Mock satellite images (coordinate-based selection)
    const satelliteImages = [
      `/mock-satellite/indonesia-forest-${Math.floor(Math.random() * 3) + 1}.jpg`,
      `/mock-satellite/indonesia-forest-${Math.floor(Math.random() * 3) + 1}-infrared.jpg`,
    ]

    res.json({
      success: true,
      data: {
        land,
        activities,
        verificationProgress,
        satelliteImages,
      },
    })
  } catch (error) {
    console.error('Error fetching land:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch land details',
    })
  }
})

// POST /api/v1/lands - Create new land parcel
landsRouter.post('/', async (req, res) => {
  try {
    const userId = req.user!.userId
    const { name, coordinates, area, landType, carbonPotential, address, description } = req.body

    // Validation
    if (!name || !coordinates || !landType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, coordinates, landType',
      })
    }

    const newLand = landService.createLand({
      ownerId: userId,
      name,
      coordinates,
      area: area || 0,
      landType,
      address,
      description,
      carbonPotential: carbonPotential || 0,
      verificationStatus: 'pending',
    })

    // Log creation activity
    landActivityService.logActivity(
      newLand.id,
      'created',
      `Lahan "${name}" berhasil didaftarkan`,
      userId
    )

    // Start automatic verification process
    await mockVerificationService.startVerification(newLand.id, userId)

    res.status(201).json({
      success: true,
      data: newLand,
    })
  } catch (error: any) {
    console.error('Error creating land:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create land parcel',
    })
  }
})

// PUT /api/v1/lands/:id - Update land parcel
landsRouter.put('/:id', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params
    const updates = req.body

    const updatedLand = landService.updateLand(id, userId, updates)

    if (!updatedLand) {
      return res.status(404).json({
        success: false,
        error: 'Land parcel not found or access denied',
      })
    }

    // Log update activity
    landActivityService.logActivity(
      id,
      'updated',
      'Informasi lahan diperbarui',
      userId,
      { updatedFields: Object.keys(updates) }
    )

    res.json({
      success: true,
      data: updatedLand,
    })
  } catch (error: any) {
    console.error('Error updating land:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update land parcel',
    })
  }
})

// POST /api/v1/lands/:id/submit-documents - Submit verification documents
landsRouter.post('/:id/submit-documents', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params
    const { documents } = req.body

    const land = landService.getLandById(id, userId)
    if (!land) {
      return res.status(404).json({
        success: false,
        error: 'Land parcel not found or access denied',
      })
    }

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        error: 'Documents array is required',
      })
    }

    mockVerificationService.submitDocuments(id, userId, documents)

    res.json({
      success: true,
      message: 'Documents submitted successfully',
    })
  } catch (error: any) {
    console.error('Error submitting documents:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit documents',
    })
  }
})

// DELETE /api/v1/lands/:id - Delete land parcel
landsRouter.delete('/:id', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params

    const deleted = landService.deleteLand(id, userId)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Land parcel not found or access denied',
      })
    }

    res.json({
      success: true,
      message: 'Land parcel deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting land:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete land parcel',
    })
  }
})

