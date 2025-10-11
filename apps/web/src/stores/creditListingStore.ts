import { create } from 'zustand'
import { CarbonCredit } from '@terravue/shared'
import { creditService } from '../services/creditService'

interface CreditListingState {
  myListings: CarbonCredit[]
  marketStats: {
    averagePrice: number
    minPrice: number
    maxPrice: number
    totalQuantity: number
    totalListings: number
  } | null
  loading: boolean
  error: string | null

  // Actions
  fetchMyListings: () => Promise<void>
  fetchMarketStats: () => Promise<void>
  createListing: (data: any) => Promise<CarbonCredit>
  updateListing: (creditId: string, updates: Partial<CarbonCredit>) => Promise<CarbonCredit>
  clearError: () => void
}

export const useCreditListingStore = create<CreditListingState>((set) => ({
  myListings: [],
  marketStats: null,
  loading: false,
  error: null,

  fetchMyListings: async () => {
    set({ loading: true, error: null })
    try {
      const listings = await creditService.getMyListings()
      set({ myListings: listings, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch listings',
        loading: false,
      })
    }
  },

  fetchMarketStats: async () => {
    try {
      const stats = await creditService.getMarketStats()
      set({ marketStats: stats })
    } catch (error) {
      console.error('Failed to fetch market stats:', error)
    }
  },

  createListing: async (data) => {
    set({ loading: true, error: null })
    try {
      const credit = await creditService.createCredit(data)
      set((state) => ({
        myListings: [credit, ...state.myListings],
        loading: false,
      }))
      return credit
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create listing',
        loading: false,
      })
      throw error
    }
  },

  updateListing: async (creditId, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedCredit = await creditService.updateCredit(creditId, updates)
      set((state) => ({
        myListings: state.myListings.map((c) => (c.id === creditId ? updatedCredit : c)),
        loading: false,
      }))
      return updatedCredit
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update listing',
        loading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))

