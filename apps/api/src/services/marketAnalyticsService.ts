import {
  MarketAnalytics,
  MarketData,
  MarketDepth,
  RegionalPricing,
  VolumeData,
  MarketSummaryStats,
  TrendAnalysis,
} from '@terravue/shared'
import { technicalAnalysisService } from './technicalAnalysisService.js'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

export class MarketAnalyticsService {
  /**
   * Generate comprehensive market analytics
   */
  async getMarketAnalytics(
    priceHistory: MarketData[],
    period: string = '7d',
  ): Promise<MarketAnalytics> {
    if (priceHistory.length === 0) {
      return this.getDefaultAnalytics()
    }

    const latestData = priceHistory[priceHistory.length - 1]
    const previousData = priceHistory[priceHistory.length - 2] || latestData

    // Calculate 24h changes
    const priceChange24h = latestData.averagePrice - previousData.averagePrice
    const priceChangePercent24h = (priceChange24h / previousData.averagePrice) * 100

    // Calculate volume changes
    const volume24h = latestData.volume
    const previousVolume = previousData.volume
    const volumeChange24h =
      previousVolume > 0 ? ((volume24h - previousVolume) / previousVolume) * 100 : 0

    // Calculate high/low
    const high24h = Math.max(...priceHistory.slice(-1).map((d) => d.averagePrice))
    const low24h = Math.min(...priceHistory.slice(-1).map((d) => d.averagePrice))

    // Get active listings count
    const activeListings = inMemoryStore.getAllCredits().filter((l) => l.status === 'available')
      .length

    // Calculate total credits available
    const totalCreditsAvailable = inMemoryStore.getAllCredits()
      .filter((l) => l.status === 'available')
      .reduce((sum, listing) => sum + listing.quantity, 0)

    // Calculate market cap (total credits * current price)
    const marketCap = totalCreditsAvailable * latestData.averagePrice

    // Calculate average transaction size
    const completedTransactions = inMemoryStore.getAllTransactions().filter(
      (t) => t.status === 'completed',
    )
    const averageTransactionSize =
      completedTransactions.length > 0
        ? completedTransactions.reduce((sum, t) => sum + t.quantity, 0) /
          completedTransactions.length
        : 0

    // Technical analysis for sentiment and trend
    const trendAnalysis = technicalAnalysisService.generateTrendAnalysis(priceHistory)
    const marketSentiment = technicalAnalysisService.determineMarketSentiment(
      priceHistory,
      trendAnalysis.rsi,
      trendAnalysis.macd.macd,
    )
    const trendDirection = technicalAnalysisService.determineTrendDirection(
      priceHistory,
      trendAnalysis.ma7,
      trendAnalysis.ma30,
    )

    // Calculate volatility
    const volatilityIndex = technicalAnalysisService.calculateVolatility(priceHistory, 20)

    return {
      currentPrice: latestData.averagePrice,
      priceChange24h,
      priceChangePercent24h,
      volume24h,
      volumeChange24h,
      high24h,
      low24h,
      marketCap,
      totalCreditsAvailable,
      activeListings,
      averageTransactionSize: Math.round(averageTransactionSize),
      marketSentiment,
      trendDirection,
      volatilityIndex: Math.round(volatilityIndex * 100) / 100,
    }
  }

  /**
   * Generate market depth data (order book)
   */
  async getMarketDepth(): Promise<MarketDepth> {
    const activeListings = inMemoryStore.getAllCredits().filter((l) => l.status === 'available')

    // Group listings by price to create order book levels
    const priceMap = new Map<number, { quantity: number; count: number }>()

    activeListings.forEach((listing) => {
      const roundedPrice = Math.round(listing.pricePerCredit / 1000) * 1000 // Round to nearest 1000
      const existing = priceMap.get(roundedPrice) || { quantity: 0, count: 0 }
      priceMap.set(roundedPrice, {
        quantity: existing.quantity + listing.quantity,
        count: existing.count + 1,
      })
    })

    // Convert to sorted arrays
    const sortedPrices = Array.from(priceMap.entries()).sort((a, b) => b[0] - a[0])

    // Split into asks (sell orders - current listings are all asks)
    const asks = sortedPrices.map(([price, data]) => ({
      price,
      quantity: data.quantity,
      orderCount: data.count,
    }))

    // Generate simulated bids (buy orders)
    const currentPrice = asks.length > 0 ? asks[0].price : 75000
    const bids = this.generateSimulatedBids(currentPrice, 10)

    // Calculate spread
    const bestBid = bids.length > 0 ? bids[0].price : currentPrice * 0.98
    const bestAsk = asks.length > 0 ? asks[0].price : currentPrice * 1.02
    const spread = bestAsk - bestBid
    const spreadPercent = (spread / bestBid) * 100

    // Calculate total volumes
    const totalBidVolume = bids.reduce((sum, bid) => sum + bid.quantity, 0)
    const totalAskVolume = asks.reduce((sum, ask) => sum + ask.quantity, 0)

    return {
      bids,
      asks,
      spread: Math.round(spread),
      spreadPercent: Math.round(spreadPercent * 100) / 100,
      totalBidVolume,
      totalAskVolume,
    }
  }

  /**
   * Get regional pricing data
   */
  async getRegionalPricing(): Promise<RegionalPricing[]> {
    const indonesianProvinces = [
      { name: 'DKI Jakarta', region: 'Java', multiplier: 1.3, landType: 'Urban Forestry' },
      { name: 'Jawa Barat', region: 'Java', multiplier: 1.2, landType: 'Mixed Forest' },
      { name: 'Jawa Tengah', region: 'Java', multiplier: 1.1, landType: 'Mixed Forest' },
      { name: 'Jawa Timur', region: 'Java', multiplier: 1.15, landType: 'Teak Forest' },
      { name: 'Kalimantan Timur', region: 'Kalimantan', multiplier: 1.25, landType: 'Rainforest' },
      {
        name: 'Kalimantan Tengah',
        region: 'Kalimantan',
        multiplier: 1.2,
        landType: 'Peatland Forest',
      },
      {
        name: 'Kalimantan Barat',
        region: 'Kalimantan',
        multiplier: 1.15,
        landType: 'Rainforest',
      },
      { name: 'Papua', region: 'Papua', multiplier: 1.4, landType: 'Primary Rainforest' },
      { name: 'Papua Barat', region: 'Papua', multiplier: 1.35, landType: 'Primary Rainforest' },
      { name: 'Sumatera Utara', region: 'Sumatra', multiplier: 1.1, landType: 'Mixed Forest' },
      {
        name: 'Sumatera Selatan',
        region: 'Sumatra',
        multiplier: 1.05,
        landType: 'Peatland Forest',
      },
      { name: 'Aceh', region: 'Sumatra', multiplier: 0.9, landType: 'Mountain Forest' },
      { name: 'Sulawesi Selatan', region: 'Sulawesi', multiplier: 1.0, landType: 'Mixed Forest' },
      { name: 'Sulawesi Utara', region: 'Sulawesi', multiplier: 0.95, landType: 'Mangrove' },
      { name: 'Bali', region: 'Lesser Sunda', multiplier: 1.2, landType: 'Conservation Forest' },
      { name: 'Maluku', region: 'Maluku', multiplier: 0.85, landType: 'Island Forest' },
    ]

    const basePrice = 75000 // IDR

    return indonesianProvinces.map((province) => ({
      region: province.region,
      province: province.name,
      currentPrice: Math.round(basePrice * province.multiplier),
      priceChange24h: (Math.random() - 0.5) * 10, // ±5%
      volume24h: Math.round(Math.random() * 5000 + 1000),
      activeListings: Math.round(Math.random() * 50 + 10),
      averageProjectSize: Math.round(50 + Math.random() * 200), // 50-250 hectares
      dominantLandType: province.landType,
      verificationRate: Math.round((0.7 + Math.random() * 0.3) * 100) / 100, // 70-100%
    }))
  }

  /**
   * Get recent transactions feed (anonymized)
   */
  async getRecentTransactions(limit: number = 20): Promise<any[]> {
    const completedTransactions = inMemoryStore.getAllTransactions()
      .filter((t) => t.status === 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return completedTransactions.map((transaction) => ({
      id: transaction.id,
      quantity: transaction.quantity,
      pricePerCredit: transaction.pricePerCredit,
      totalAmount: transaction.totalAmount,
      timestamp: transaction.createdAt,
      region: this.getRandomRegion(),
      // Anonymized - no user or listing details
    }))
  }

  /**
   * Get volume data with buy/sell breakdown
   */
  async getVolumeData(priceHistory: MarketData[]): Promise<VolumeData[]> {
    return priceHistory.map((data) => {
      const totalVolume = data.volume
      // Simulate buy/sell split based on price movement
      const buyRatio = data.priceChange > 0 ? 0.6 : 0.4
      const buyVolume = Math.round(totalVolume * buyRatio)
      const sellVolume = totalVolume - buyVolume

      return {
        timestamp: data.timestamp,
        volume: totalVolume,
        buyVolume,
        sellVolume,
        trades: Math.round(totalVolume / 50), // Estimate number of trades
      }
    })
  }

  /**
   * Generate market summary statistics
   */
  async getMarketSummaryStats(priceHistory: MarketData[]): Promise<MarketSummaryStats> {
    if (priceHistory.length === 0) {
      return this.getDefaultMarketSummaryStats()
    }

    const analytics = await this.getMarketAnalytics(priceHistory)
    const currentTime = new Date()
    const marketStatus = this.getMarketStatus(currentTime)

    // Get 24h completed transactions
    const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)
    const completedTransactions24h = inMemoryStore.getAllTransactions().filter(
      (t) => t.status === 'completed' && new Date(t.createdAt) >= oneDayAgo,
    ).length

    return {
      currentPrice: analytics.currentPrice,
      priceChange24h: analytics.priceChange24h,
      priceChangePercent24h: analytics.priceChangePercent24h,
      volume24h: analytics.volume24h,
      volumeChange24h: analytics.volumeChange24h,
      high24h: analytics.high24h,
      low24h: analytics.low24h,
      marketCap: analytics.marketCap,
      totalCreditsAvailable: analytics.totalCreditsAvailable,
      activeListings: analytics.activeListings,
      completedTransactions24h,
      averageTransactionSize: analytics.averageTransactionSize,
      marketStatus,
      lastUpdate: currentTime,
      nextUpdate: this.getNextUpdateTime(currentTime),
    }
  }

  /**
   * Generate complete analytics response
   */
  async getCompleteAnalytics(
    priceHistory: MarketData[],
    period: string = '7d',
  ): Promise<{
    analytics: MarketAnalytics
    priceHistory: MarketData[]
    volumeHistory: VolumeData[]
    trends: TrendAnalysis
    regionalData: RegionalPricing[]
  }> {
    const analytics = await this.getMarketAnalytics(priceHistory, period)
    const volumeHistory = await this.getVolumeData(priceHistory)
    const trends = technicalAnalysisService.generateTrendAnalysis(priceHistory)
    const regionalData = await this.getRegionalPricing()

    return {
      analytics,
      priceHistory,
      volumeHistory,
      trends,
      regionalData,
    }
  }

  // Helper methods

  private generateSimulatedBids(
    currentPrice: number,
    levels: number = 10,
  ): Array<{ price: number; quantity: number; orderCount: number }> {
    const bids = []
    const spreadPercent = 0.02 // 2% spread

    for (let i = 0; i < levels; i++) {
      const priceLevel = Math.round(currentPrice * (1 - spreadPercent - i * 0.01))
      const quantity = Math.round(100 + Math.random() * 500)
      const orderCount = Math.round(1 + Math.random() * 5)

      bids.push({ price: priceLevel, quantity, orderCount })
    }

    return bids.sort((a, b) => b.price - a.price)
  }

  private getMarketStatus(time: Date): MarketSummaryStats['marketStatus'] {
    const hour = time.getHours()
    const day = time.getDay()

    // Weekend
    if (day === 0 || day === 6) return 'closed'

    // Trading hours: 9 AM - 5 PM WIB (Indonesian time)
    if (hour >= 9 && hour < 17) return 'open'
    if (hour >= 8 && hour < 9) return 'pre_market'
    if (hour >= 17 && hour < 18) return 'after_hours'

    return 'closed'
  }

  private getNextUpdateTime(currentTime: Date): Date {
    const nextUpdate = new Date(currentTime)
    nextUpdate.setMinutes(Math.ceil(nextUpdate.getMinutes() / 15) * 15, 0, 0)
    return nextUpdate
  }

  private getRandomRegion(): string {
    const regions = ['Java', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Papua', 'Bali', 'Maluku']
    return regions[Math.floor(Math.random() * regions.length)]
  }

  private getDefaultAnalytics(): MarketAnalytics {
    return {
      currentPrice: 75000,
      priceChange24h: 0,
      priceChangePercent24h: 0,
      volume24h: 0,
      volumeChange24h: 0,
      high24h: 75000,
      low24h: 75000,
      marketCap: 0,
      totalCreditsAvailable: 0,
      activeListings: 0,
      averageTransactionSize: 0,
      marketSentiment: 'neutral',
      trendDirection: 'sideways',
      volatilityIndex: 0,
    }
  }

  private getDefaultMarketSummaryStats(): MarketSummaryStats {
    const currentTime = new Date()
    return {
      currentPrice: 75000,
      priceChange24h: 0,
      priceChangePercent24h: 0,
      volume24h: 0,
      volumeChange24h: 0,
      high24h: 75000,
      low24h: 75000,
      marketCap: 0,
      totalCreditsAvailable: 0,
      activeListings: 0,
      completedTransactions24h: 0,
      averageTransactionSize: 0,
      marketStatus: this.getMarketStatus(currentTime),
      lastUpdate: currentTime,
      nextUpdate: this.getNextUpdateTime(currentTime),
    }
  }
}

export const marketAnalyticsService = new MarketAnalyticsService()

