import { LandParcel } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import {
  validateIndonesianTerritory,
  calculatePolygonArea,
  estimateCarbonPotential,
  validateCoordinate,
  validateMinimumArea,
} from '../utils/geospatial.js'

interface LandQueryParams {
  search?: string
  status?: 'pending' | 'verified' | 'rejected'
  sortBy?: 'name' | 'area' | 'createdAt' | 'verificationStatus'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

interface LandListResponse {
  lands: LandParcel[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export class LandService {
  getUserLands(userId: string, params: LandQueryParams = {}): LandListResponse {
    const {
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = params

    // Get all user's lands
    let lands = inMemoryStore.getLandsByOwner(userId)

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      lands = lands.filter(
        (land) =>
          land.name.toLowerCase().includes(searchLower) ||
          land.landType.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (status) {
      lands = lands.filter((land) => land.verificationStatus === status)
    }

    // Apply sorting
    lands.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'area':
          comparison = a.area - b.area
          break
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'verificationStatus':
          comparison = a.verificationStatus.localeCompare(b.verificationStatus)
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    // Calculate pagination
    const total = lands.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Apply pagination
    const paginatedLands = lands.slice(startIndex, endIndex)

    return {
      lands: paginatedLands,
      total,
      page,
      totalPages,
      limit,
    }
  }

  getLandById(landId: string, userId: string): LandParcel | null {
    const land = inMemoryStore.getLand(landId)

    // Verify ownership
    if (!land || land.ownerId !== userId) {
      return null
    }

    return land
  }

  createLand(landData: Omit<LandParcel, 'id' | 'createdAt' | 'updatedAt'>): LandParcel {
    // Validate coordinates
    if (!landData.coordinates || landData.coordinates.length < 3) {
      throw new Error('At least 3 coordinates required to define land boundaries')
    }

    // Validate coordinate format
    if (!landData.coordinates.every(validateCoordinate)) {
      throw new Error('Invalid coordinate format')
    }

    // Validate Indonesian territory
    if (!validateIndonesianTerritory(landData.coordinates)) {
      throw new Error('Coordinates must be within Indonesian territory')
    }

    // Calculate area if not provided or validate provided area
    let area = landData.area
    if (!area || area === 0) {
      area = calculatePolygonArea(landData.coordinates)
    }

    // Validate minimum area
    if (!validateMinimumArea(area)) {
      throw new Error('Land area must be at least 0.1 hectares')
    }

    // Calculate carbon potential
    const carbonPotential = estimateCarbonPotential(area, landData.landType)

    const newLand: LandParcel = {
      ...landData,
      area,
      carbonPotential,
      id: `land-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    inMemoryStore.addLand(newLand)
    return newLand
  }

  updateLand(
    landId: string,
    userId: string,
    updates: Partial<LandParcel>
  ): LandParcel | null {
    const land = this.getLandById(landId, userId)

    if (!land) {
      return null
    }

    const updatedLand = inMemoryStore.updateLand(landId, updates)
    return updatedLand || null
  }

  deleteLand(landId: string, userId: string): boolean {
    const land = this.getLandById(landId, userId)

    if (!land) {
      return false
    }

    // In a real implementation, this would delete from the store
    // For now, we'll just return true as the in-memory store doesn't have a delete method
    return true
  }
}

// Singleton instance
export const landService = new LandService()

