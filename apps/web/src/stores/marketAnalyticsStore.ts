import { create } from 'zustand'
import {
  MarketAnalytics,
  MarketData,
  MarketDepth,
  RegionalPricing,
  VolumeData,
  TrendAnalysis,
  MarketSummaryStats,
} from '@terravue/shared'
import { marketAnalyticsService, CompleteAnalytics } from '../services/marketAnalyticsService'

interface MarketAnalyticsState {
  // Data
  analytics: MarketAnalytics | null
  priceHistory: MarketData[]
  volumeHistory: VolumeData[]
  trends: TrendAnalysis | null
  regionalData: RegionalPricing[]
  marketDepth: MarketDepth | null
  recentTransactions: any[]
  marketStats: MarketSummaryStats | null

  // UI State
  selectedPeriod: string
  selectedRegion: string
  isLoading: boolean
  error: string | null

  // Actions
  fetchAnalytics: (period?: string, region?: string) => Promise<void>
  fetchMarketDepth: () => Promise<void>
  fetchRegionalPricing: () => Promise<void>
  fetchRecentTransactions: (limit?: number) => Promise<void>
  fetchMarketStats: (period?: string) => Promise<void>
  setPeriod: (period: string) => void
  setRegion: (region: string) => void
  reset: () => void
}

const initialState = {
  analytics: null,
  priceHistory: [],
  volumeHistory: [],
  trends: null,
  regionalData: [],
  marketDepth: null,
  recentTransactions: [],
  marketStats: null,
  selectedPeriod: '7d',
  selectedRegion: 'Indonesia',
  isLoading: false,
  error: null,
}

export const useMarketAnalyticsStore = create<MarketAnalyticsState>((set, get) => ({
  ...initialState,

  fetchAnalytics: async (period?: string, region?: string) => {
    const selectedPeriod = period || get().selectedPeriod
    const selectedRegion = region || get().selectedRegion

    set({ isLoading: true, error: null })

    try {
      const data: CompleteAnalytics = await marketAnalyticsService.getAnalytics(
        selectedPeriod,
        selectedRegion,
      )

      set({
        analytics: data.analytics,
        priceHistory: data.priceHistory,
        volumeHistory: data.volumeHistory,
        trends: data.trends,
        regionalData: data.regionalData,
        selectedPeriod,
        selectedRegion,
        isLoading: false,
      })
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      set({
        error: error.response?.data?.error || 'Failed to fetch analytics',
        isLoading: false,
      })
    }
  },

  fetchMarketDepth: async () => {
    try {
      const data = await marketAnalyticsService.getMarketDepth()
      set({ marketDepth: data.depth })
    } catch (error: any) {
      console.error('Error fetching market depth:', error)
      set({ error: error.response?.data?.error || 'Failed to fetch market depth' })
    }
  },

  fetchRegionalPricing: async () => {
    try {
      const data = await marketAnalyticsService.getRegionalPricing()
      set({ regionalData: data })
    } catch (error: any) {
      console.error('Error fetching regional pricing:', error)
      set({ error: error.response?.data?.error || 'Failed to fetch regional pricing' })
    }
  },

  fetchRecentTransactions: async (limit = 20) => {
    try {
      const data = await marketAnalyticsService.getRecentTransactions(limit)
      set({ recentTransactions: data })
    } catch (error: any) {
      console.error('Error fetching recent transactions:', error)
      set({ error: error.response?.data?.error || 'Failed to fetch recent transactions' })
    }
  },

  fetchMarketStats: async (period?: string) => {
    const selectedPeriod = period || get().selectedPeriod

    try {
      const data = await marketAnalyticsService.getMarketStats(selectedPeriod)
      set({ marketStats: data })
    } catch (error: any) {
      console.error('Error fetching market stats:', error)
      set({ error: error.response?.data?.error || 'Failed to fetch market stats' })
    }
  },

  setPeriod: (period: string) => {
    set({ selectedPeriod: period })
  },

  setRegion: (region: string) => {
    set({ selectedRegion: region })
  },

  reset: () => {
    set(initialState)
  },
}))

