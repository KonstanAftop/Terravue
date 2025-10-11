import { Router } from 'express'
import { creditService } from '../services/creditService.js'
import { authenticate } from '../middleware/auth.js'

export const creditsRouter = Router()

// All routes require authentication
creditsRouter.use(authenticate)

// GET /api/v1/credits - Get available credits for marketplace with enriched data
creditsRouter.get('/', (req, res) => {
  try {
    const { minPrice, maxPrice, minQuantity, landType, search, sort, order, limit, offset } = req.query

    const filters = {
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity as string) : undefined,
      landType: landType as string | undefined,
      search: search as string | undefined,
    }

    const sortOptions = {
      field: (sort as string) || 'createdAt',
      direction: (order as 'asc' | 'desc') || 'desc',
    }

    const pagination = {
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    }

    const result = creditService.getMarketplaceCredits(filters, sortOptions, pagination)

    res.json({
      success: true,
      data: result.credits,
      total: result.total,
      hasMore: result.hasMore,
      filters: result.availableFilters,
    })
  } catch (error: any) {
    console.error('Error fetching credits:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credits',
    })
  }
})

// GET /api/v1/credits/my-listings - Get user's credit listings
creditsRouter.get('/my-listings', (req, res) => {
  try {
    const userId = req.user!.userId
    const credits = creditService.getUserCredits(userId)

    res.json({
      success: true,
      data: credits,
    })
  } catch (error: any) {
    console.error('Error fetching user credits:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credit listings',
    })
  }
})

// GET /api/v1/credits/market-stats - Get market statistics
creditsRouter.get('/market-stats', (req, res) => {
  try {
    const stats = creditService.getMarketStats()

    res.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error('Error fetching market stats:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch market statistics',
    })
  }
})

// GET /api/v1/credits/:id - Get specific credit details
creditsRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const credit = creditService.getCreditById(id)

    if (!credit) {
      return res.status(404).json({
        success: false,
        error: 'Credit listing not found',
      })
    }

    res.json({
      success: true,
      data: credit,
    })
  } catch (error: any) {
    console.error('Error fetching credit:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credit details',
    })
  }
})

// POST /api/v1/credits - Create new credit listing
creditsRouter.post('/', (req, res) => {
  try {
    const userId = req.user!.userId
    const { landParcelId, quantity, pricePerCredit, validUntil, description, projectDetails } = req.body

    // Validation
    if (!landParcelId || !quantity || !pricePerCredit || !validUntil) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: landParcelId, quantity, pricePerCredit, validUntil',
      })
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      })
    }

    if (pricePerCredit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price per credit must be greater than 0',
      })
    }

    const credit = creditService.createCredit(userId, {
      landParcelId,
      quantity: parseInt(quantity),
      pricePerCredit: parseFloat(pricePerCredit),
      validUntil: new Date(validUntil),
      description,
      projectDetails,
    })

    res.status(201).json({
      success: true,
      data: credit,
    })
  } catch (error: any) {
    console.error('Error creating credit:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create credit listing',
    })
  }
})

// PUT /api/v1/credits/:id - Update credit listing
creditsRouter.put('/:id', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params
    const updates = req.body

    // Validate numeric fields if present
    if (updates.quantity && updates.quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      })
    }

    if (updates.pricePerCredit && updates.pricePerCredit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price per credit must be greater than 0',
      })
    }

    const updatedCredit = creditService.updateCredit(id, userId, updates)

    res.json({
      success: true,
      data: updatedCredit,
    })
  } catch (error: any) {
    console.error('Error updating credit:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update credit listing',
    })
  }
})

// POST /api/v1/credits/expire-old - Manually trigger expiration check
creditsRouter.post('/expire-old', (req, res) => {
  try {
    creditService.expireOldListings()

    res.json({
      success: true,
      message: 'Expiration check completed',
    })
  } catch (error: any) {
    console.error('Error expiring listings:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to expire listings',
    })
  }
})

