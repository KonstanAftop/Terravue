import { api } from './api'
import { CarbonCredit } from '@terravue/shared'

interface CreateCreditRequest {
  landParcelId: string
  quantity: number
  pricePerCredit: number
  validUntil: string
  description?: string
  projectDetails?: CarbonCredit['projectDetails']
}

interface MarketStats {
  averagePrice: number
  minPrice: number
  maxPrice: number
  totalQuantity: number
  totalListings: number
}

class CreditService {
  /**
   * Create a new carbon credit listing
   */
  async createCredit(data: CreateCreditRequest): Promise<CarbonCredit> {
    const response = await api.post<{ success: boolean; data: CarbonCredit }>('/credits', data)
    return response.data.data
  }

  /**
   * Update an existing credit listing
   */
  async updateCredit(creditId: string, updates: Partial<CarbonCredit>): Promise<CarbonCredit> {
    const response = await api.put<{ success: boolean; data: CarbonCredit }>(`/credits/${creditId}`, updates)
    return response.data.data
  }

  /**
   * Get user's credit listings
   */
  async getMyListings(): Promise<CarbonCredit[]> {
    const response = await api.get<{ success: boolean; data: CarbonCredit[] }>('/credits/my-listings')
    return response.data.data
  }

  /**
   * Get available credits in marketplace with enriched data
   */
  async getMarketplaceCredits(filters?: {
    minPrice?: number
    maxPrice?: number
    minQuantity?: number
    landType?: string
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    limit?: number
    offset?: number
  }): Promise<{
    credits: any[]
    total: number
    hasMore: boolean
    availableFilters: any
  }> {
    const params = new URLSearchParams()
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.minQuantity) params.append('minQuantity', filters.minQuantity.toString())
    if (filters?.landType) params.append('landType', filters.landType)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sort) params.append('sort', filters.sort)
    if (filters?.order) params.append('order', filters.order)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())

    const response = await api.get<{
      success: boolean
      data: any[]
      total: number
      hasMore: boolean
      filters: any
    }>(`/credits${params.toString() ? '?' + params.toString() : ''}`)
    
    return {
      credits: response.data.data,
      total: response.data.total,
      hasMore: response.data.hasMore,
      availableFilters: response.data.filters,
    }
  }

  /**
   * Get market statistics
   */
  async getMarketStats(): Promise<MarketStats> {
    const response = await api.get<{ success: boolean; data: MarketStats }>('/credits/market-stats')
    return response.data.data
  }

  /**
   * Get specific credit details
   */
  async getCreditById(creditId: string): Promise<CarbonCredit> {
    const response = await api.get<{ success: boolean; data: CarbonCredit }>(`/credits/${creditId}`)
    return response.data.data
  }
}

export const creditService = new CreditService()

