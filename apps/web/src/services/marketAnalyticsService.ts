import { api } from './api'
import {
  MarketAnalytics,
  MarketData,
  MarketDepth,
  RegionalPricing,
  VolumeData,
  TrendAnalysis,
  MarketSummaryStats,
} from '@terravue/shared'

export interface CompleteAnalytics {
  analytics: MarketAnalytics
  priceHistory: MarketData[]
  volumeHistory: VolumeData[]
  trends: TrendAnalysis
  regionalData: RegionalPricing[]
}

class MarketAnalyticsService {
  /**
   * Get comprehensive market analytics
   */
  async getAnalytics(
    period: string = '7d',
    region: string = 'Indonesia',
  ): Promise<CompleteAnalytics> {
    const response = await api.get(`/market/analytics`, {
      params: { period, region },
    })
    return response.data.data
  }

  /**
   * Get market depth (order book)
   */
  async getMarketDepth(): Promise<{
    depth: MarketDepth
    timestamp: Date
    lastUpdate: Date
  }> {
    const response = await api.get('/market/depth')
    return response.data.data
  }

  /**
   * Get regional pricing data
   */
  async getRegionalPricing(): Promise<RegionalPricing[]> {
    const response = await api.get('/market/regional')
    return response.data.data
  }

  /**
   * Get recent transactions feed
   */
  async getRecentTransactions(limit: number = 20): Promise<any[]> {
    const response = await api.get('/market/transactions/recent', {
      params: { limit },
    })
    return response.data.data
  }

  /**
   * Get market summary statistics
   */
  async getMarketStats(period: string = '7d'): Promise<MarketSummaryStats> {
    const response = await api.get('/market/stats', {
      params: { period },
    })
    return response.data.data
  }

  /**
   * Get historical market data
   */
  async getMarketData(period: string = '7d', region: string = 'Indonesia'): Promise<MarketData[]> {
    const response = await api.get('/market/data', {
      params: { period, region },
    })
    return response.data.data
  }
}

export const marketAnalyticsService = new MarketAnalyticsService()

