import { create } from 'zustand'
import { creditService } from '../services/creditService'

interface MarketFilters {
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  landType?: string
  search?: string
}

interface MarketState {
  credits: any[]
  total: number
  hasMore: boolean
  availableFilters: any
  filters: MarketFilters
  sortBy: string
  sortOrder: 'asc' | 'desc'
  viewMode: 'grid' | 'list'
  loading: boolean
  error: string | null

  // Actions
  fetchMarketplaceCredits: () => Promise<void>
  setFilters: (filters: Partial<MarketFilters>) => void
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  setViewMode: (mode: 'grid' | 'list') => void
  clearFilters: () => void
  clearError: () => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  credits: [],
  total: 0,
  hasMore: false,
  availableFilters: null,
  filters: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'grid',
  loading: false,
  error: null,

  fetchMarketplaceCredits: async () => {
    set({ loading: true, error: null })
    try {
      const { filters, sortBy, sortOrder } = get()
      
      const result = await creditService.getMarketplaceCredits({
        ...filters,
        sort: sortBy,
        order: sortOrder,
        limit: 20,
        offset: 0,
      })

      set({
        credits: result.credits,
        total: result.total,
        hasMore: result.hasMore,
        availableFilters: result.availableFilters,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch marketplace credits',
        loading: false,
      })
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
    get().fetchMarketplaceCredits()
  },

  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder })
    get().fetchMarketplaceCredits()
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  clearFilters: () => {
    set({ filters: {} })
    get().fetchMarketplaceCredits()
  },

  clearError: () => set({ error: null }),
}))


