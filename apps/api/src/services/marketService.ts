import { MarketData } from '@terravue/shared'

interface MarketSummary {
  currentPrice: number
  priceChange24h: number
  volume24h: number
  totalCreditsAvailable: number
}

export class MarketService {
  private basePrice = 75000 // IDR 75,000 per credit
  private priceHistory: MarketData[] = []

  constructor() {
    this.initializeMarketData()
  }

  private initializeMarketData() {
    // Generate 30 days of historical market data
    const now = new Date()
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const randomVariation = (Math.random() - 0.5) * 10000 // ±5,000 IDR variation
      const trendFactor = Math.sin(i / 5) * 5000 // Trending pattern
      const price = this.basePrice + randomVariation + trendFactor

      this.priceHistory.push({
        id: `market-${i}`,
        timestamp,
        averagePrice: Math.round(price),
        volume: Math.round(500 + Math.random() * 1000), // 500-1500 credits
        priceChange: Math.round((Math.random() - 0.5) * 10), // -5% to +5%
        region: 'Indonesia',
      })
    }
  }

  getCurrentMarketSummary(): MarketSummary {
    const latestData = this.priceHistory[this.priceHistory.length - 1]
    const previousData = this.priceHistory[this.priceHistory.length - 2]

    const priceChange =
      ((latestData.averagePrice - previousData.averagePrice) / previousData.averagePrice) * 100

    return {
      currentPrice: latestData.averagePrice,
      priceChange24h: Math.round(priceChange * 100) / 100,
      volume24h: latestData.volume,
      totalCreditsAvailable: Math.round(Math.random() * 5000 + 10000), // 10k-15k available
    }
  }

  getMarketData(period: string = '7d', region: string = 'Indonesia'): MarketData[] {
    let days = 7
    switch (period) {
      case '1d':
        days = 1
        break
      case '7d':
        days = 7
        break
      case '30d':
        days = 30
        break
      case '90d':
        days = 90
        break
      default:
        days = 7
    }

    // Return the last N days of data
    return this.priceHistory.slice(-days).filter((data) => data.region === region)
  }

  // Simulate real-time price update
  updateCurrentPrice(): void {
    const lastPrice = this.priceHistory[this.priceHistory.length - 1].averagePrice
    const randomChange = (Math.random() - 0.5) * 2000 // ±1,000 IDR
    const newPrice = Math.round(lastPrice + randomChange)

    const newData: MarketData = {
      id: `market-${Date.now()}`,
      timestamp: new Date(),
      averagePrice: newPrice,
      volume: Math.round(500 + Math.random() * 1000),
      priceChange: Math.round(((newPrice - lastPrice) / lastPrice) * 10000) / 100,
      region: 'Indonesia',
    }

    // Keep only last 90 days
    if (this.priceHistory.length > 90) {
      this.priceHistory.shift()
    }

    this.priceHistory.push(newData)
  }
}

// Singleton instance
export const marketService = new MarketService()

// Update price every 5 minutes
setInterval(() => {
  marketService.updateCurrentPrice()
}, 5 * 60 * 1000)

