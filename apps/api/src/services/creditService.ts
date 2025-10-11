import { CarbonCredit } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { landActivityService } from './landActivityService.js'

interface CreateCreditRequest {
  landParcelId: string
  quantity: number
  pricePerCredit: number
  validUntil: Date
  description?: string
  projectDetails?: CarbonCredit['projectDetails']
}

class CreditService {
  /**
   * Create a new carbon credit listing
   */
  createCredit(userId: string, data: CreateCreditRequest): CarbonCredit {
    // Validate land ownership and verification status
    const land = inMemoryStore.getLand(data.landParcelId)
    if (!land) {
      throw new Error('Land parcel not found')
    }

    if (land.ownerId !== userId) {
      throw new Error('You do not own this land parcel')
    }

    if (land.verificationStatus !== 'verified') {
      throw new Error('Land parcel must be verified before listing credits')
    }

    // Check if land already has active credits
    const existingCredits = this.getCreditsByLandParcel(data.landParcelId)
    const hasActiveCredits = existingCredits.some(c => c.status === 'available' || c.status === 'reserved')
    if (hasActiveCredits) {
      throw new Error('This land parcel already has active credit listings')
    }

    // Validate quantity doesn't exceed land's carbon potential
    if (data.quantity > land.carbonPotential) {
      throw new Error(`Quantity exceeds land carbon potential of ${land.carbonPotential} credits`)
    }

    // Create credit
    const credit: CarbonCredit = {
      id: `credit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      landParcelId: data.landParcelId,
      quantity: data.quantity,
      pricePerCredit: data.pricePerCredit,
      status: 'available',
      validUntil: data.validUntil,
      createdAt: new Date(),
      description: data.description,
      projectDetails: data.projectDetails,
    }

    inMemoryStore.addCredit(credit)

    // Log activity
    landActivityService.logActivity(
      data.landParcelId,
      'status_changed',
      `${data.quantity} kredit karbon tercatat dengan harga Rp ${data.pricePerCredit.toLocaleString()}/kredit`,
      userId,
      { creditId: credit.id, quantity: data.quantity, price: data.pricePerCredit }
    )

    return credit
  }

  /**
   * Update an existing credit listing
   */
  updateCredit(creditId: string, userId: string, updates: Partial<CarbonCredit>): CarbonCredit {
    const credit = inMemoryStore.getCredit(creditId)
    if (!credit) {
      throw new Error('Credit listing not found')
    }

    // Verify ownership
    const land = inMemoryStore.getLand(credit.landParcelId)
    if (!land || land.ownerId !== userId) {
      throw new Error('You do not own this credit listing')
    }

    // Only allow updates to certain fields
    const allowedUpdates: Partial<CarbonCredit> = {
      pricePerCredit: updates.pricePerCredit,
      quantity: updates.quantity,
      description: updates.description,
      validUntil: updates.validUntil,
      status: updates.status,
      projectDetails: updates.projectDetails,
    }

    // Validate quantity if updated
    if (updates.quantity && updates.quantity > land.carbonPotential) {
      throw new Error(`Quantity exceeds land carbon potential of ${land.carbonPotential} credits`)
    }

    const updatedCredit = inMemoryStore.updateCredit(creditId, allowedUpdates)
    if (!updatedCredit) {
      throw new Error('Failed to update credit listing')
    }

    // Log activity
    landActivityService.logActivity(
      credit.landParcelId,
      'updated',
      'Listing kredit karbon diperbarui',
      userId,
      { creditId, updates: Object.keys(allowedUpdates) }
    )

    return updatedCredit
  }

  /**
   * Get all credits for a specific land parcel
   */
  getCreditsByLandParcel(landParcelId: string): CarbonCredit[] {
    return inMemoryStore.getAllCredits().filter(c => c.landParcelId === landParcelId)
  }

  /**
   * Get all credits owned by a user
   */
  getUserCredits(userId: string): CarbonCredit[] {
    const userLands = inMemoryStore.getLandsByOwner(userId)
    const landIds = userLands.map(l => l.id)
    return inMemoryStore.getAllCredits().filter(c => landIds.includes(c.landParcelId))
  }

  /**
   * Get credit by ID
   */
  getCreditById(creditId: string): CarbonCredit | undefined {
    return inMemoryStore.getCredit(creditId)
  }

  /**
   * Get available credits for marketplace
   */
  getAvailableCredits(filters?: {
    minPrice?: number
    maxPrice?: number
    minQuantity?: number
    landType?: string
  }): CarbonCredit[] {
    let credits = inMemoryStore.getCreditsByStatus('available')

    // Apply filters
    if (filters) {
      if (filters.minPrice) {
        credits = credits.filter(c => c.pricePerCredit >= filters.minPrice!)
      }
      if (filters.maxPrice) {
        credits = credits.filter(c => c.pricePerCredit <= filters.maxPrice!)
      }
      if (filters.minQuantity) {
        credits = credits.filter(c => c.quantity >= filters.minQuantity!)
      }
      if (filters.landType) {
        const landsOfType = inMemoryStore.getAllLands().filter(l => l.landType === filters.landType)
        const landIds = landsOfType.map(l => l.id)
        credits = credits.filter(c => landIds.includes(c.landParcelId))
      }
    }

    // Filter out expired credits
    const now = new Date()
    credits = credits.filter(c => new Date(c.validUntil) > now)

    return credits
  }

  /**
   * Get marketplace credits with enriched data, filtering, sorting, and pagination
   */
  getMarketplaceCredits(
    filters?: {
      minPrice?: number
      maxPrice?: number
      minQuantity?: number
      landType?: string
      search?: string
    },
    sort?: {
      field: string
      direction: 'asc' | 'desc'
    },
    pagination?: {
      limit: number
      offset: number
    }
  ) {
    let credits = this.getAvailableCredits(filters)

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      credits = credits.filter(credit => {
        const land = inMemoryStore.getLand(credit.landParcelId)
        if (!land) return false

        const owner = inMemoryStore.getUser(land.ownerId)
        
        return (
          land.name.toLowerCase().includes(searchLower) ||
          land.address?.toLowerCase().includes(searchLower) ||
          land.description?.toLowerCase().includes(searchLower) ||
          credit.description?.toLowerCase().includes(searchLower) ||
          owner?.fullName.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply sorting
    if (sort) {
      credits.sort((a, b) => {
        let comparison = 0
        
        switch (sort.field) {
          case 'price':
            comparison = a.pricePerCredit - b.pricePerCredit
            break
          case 'quantity':
            comparison = a.quantity - b.quantity
            break
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          default:
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        
        return sort.direction === 'asc' ? comparison : -comparison
      })
    }

    // Enrich credits with land and owner data
    const enrichedCredits = credits.map(credit => {
      const land = inMemoryStore.getLand(credit.landParcelId)
      const owner = land ? inMemoryStore.getUser(land.ownerId) : null

      return {
        ...credit,
        landParcel: land ? {
          name: land.name,
          location: land.address || 'Indonesia',
          area: land.area,
          landType: land.landType,
          verificationStatus: land.verificationStatus,
          coordinates: land.coordinates,
        } : null,
        seller: owner ? {
          id: owner.id,
          name: owner.fullName,
          userType: owner.userType,
        } : null,
      }
    })

    // Calculate available filters
    const allLands = inMemoryStore.getAllLands()
    const availableFilters = {
      priceRange: {
        min: Math.min(...credits.map(c => c.pricePerCredit)),
        max: Math.max(...credits.map(c => c.pricePerCredit)),
      },
      landTypes: [...new Set(allLands.map(l => l.landType))],
      totalListings: credits.length,
    }

    // Apply pagination
    const total = enrichedCredits.length
    const paginatedCredits = pagination
      ? enrichedCredits.slice(pagination.offset, pagination.offset + pagination.limit)
      : enrichedCredits

    return {
      credits: paginatedCredits,
      total,
      hasMore: pagination ? pagination.offset + pagination.limit < total : false,
      availableFilters,
    }
  }

  /**
   * Check and expire old listings
   */
  expireOldListings(): void {
    const now = new Date()
    const allCredits = inMemoryStore.getAllCredits()

    allCredits.forEach(credit => {
      if (credit.status === 'available' && new Date(credit.validUntil) <= now) {
        inMemoryStore.updateCredit(credit.id, { status: 'expired' })
        
        const land = inMemoryStore.getLand(credit.landParcelId)
        if (land) {
          landActivityService.logActivity(
            credit.landParcelId,
            'status_changed',
            'Listing kredit karbon kadaluarsa',
            land.ownerId,
            { creditId: credit.id }
          )
        }
      }
    })
  }

  /**
   * Get market statistics
   */
  getMarketStats() {
    const availableCredits = this.getAvailableCredits()
    
    if (availableCredits.length === 0) {
      return {
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        totalQuantity: 0,
        totalListings: 0,
      }
    }

    const prices = availableCredits.map(c => c.pricePerCredit)
    const totalQuantity = availableCredits.reduce((sum, c) => sum + c.quantity, 0)

    return {
      averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      totalQuantity,
      totalListings: availableCredits.length,
    }
  }
}

export const creditService = new CreditService()

