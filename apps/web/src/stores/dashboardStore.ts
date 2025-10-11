import { create } from 'zustand'
import { dashboardService, DashboardData, MarketDataPoint } from '../services/dashboardService'

interface DashboardState {
  dashboardData: DashboardData | null
  marketData: MarketDataPoint[]
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  fetchDashboardData: () => Promise<void>
  fetchMarketData: (period?: string) => Promise<void>
  startAutoRefresh: () => void
  stopAutoRefresh: () => void
}

let refreshInterval: NodeJS.Timeout | null = null

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboardData: null,
  marketData: [],
  loading: false,
  error: null,
  lastUpdate: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null })
    try {
      const data = await dashboardService.getDashboardData()
      set({ dashboardData: data, loading: false, lastUpdate: new Date() })
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch dashboard data', loading: false })
    }
  },

  fetchMarketData: async (period = '7d') => {
    try {
      const data = await dashboardService.getMarketData(period)
      set({ marketData: data })
    } catch (error: any) {
      console.error('Failed to fetch market data:', error)
    }
  },

  startAutoRefresh: () => {
    // Fetch initial data
    get().fetchDashboardData()
    get().fetchMarketData()

    // Set up 30-second refresh
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }

    refreshInterval = setInterval(() => {
      get().fetchDashboardData()
      get().fetchMarketData()
    }, 30000) // 30 seconds
  },

  stopAutoRefresh: () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  },
}))

