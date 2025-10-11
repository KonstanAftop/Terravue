import { api } from './api'

export interface UserSummary {
  totalLands: number
  verifiedLands: number
  pendingLands: number
  totalCredits: number
  availableCredits: number
  totalTransactions: number
  totalRevenue: number
}

export interface MarketSummary {
  currentPrice: number
  priceChange24h: number
  volume24h: number
  totalCreditsAvailable: number
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
}

export interface DashboardData {
  userSummary: UserSummary
  marketSummary: MarketSummary
  recentActivity: RecentActivity[]
}

export interface MarketDataPoint {
  id: string
  timestamp: string
  averagePrice: number
  volume: number
  priceChange: number
  region: string
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/dashboard')
    return response.data.data
  },

  async getMarketSummary(): Promise<MarketSummary> {
    const response = await api.get('/market/summary')
    return response.data.data
  },

  async getMarketData(period: string = '7d', region: string = 'Indonesia'): Promise<MarketDataPoint[]> {
    const response = await api.get('/market/data', {
      params: { period, region },
    })
    return response.data.data
  },
}

