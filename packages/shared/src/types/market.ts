export interface MarketData {
  id: string
  timestamp: Date
  averagePrice: number // IDR per credit
  volume: number // credits traded
  priceChange: number // percentage
  region: string
  high24h?: number
  low24h?: number
  open24h?: number
  close24h?: number
  volatility?: number
}

export interface MarketSummary {
  currentPrice: number
  priceChange24h: number
  volume24h: number
  totalCreditsAvailable: number
}

export interface MarketAnalytics {
  currentPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  volumeChange24h: number
  high24h: number
  low24h: number
  marketCap: number
  totalCreditsAvailable: number
  activeListings: number
  averageTransactionSize: number
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
  trendDirection: 'up' | 'down' | 'sideways'
  volatilityIndex: number
}

export interface PriceAlert {
  id: string
  userId: string
  targetPrice: number
  condition: 'above' | 'below' | 'crosses'
  region?: string
  isActive: boolean
  createdAt: Date
  triggeredAt?: Date
  notificationMethods: ('browser' | 'email')[]
}

export interface MarketDepth {
  bids: OrderLevel[]
  asks: OrderLevel[]
  spread: number
  spreadPercent: number
  totalBidVolume: number
  totalAskVolume: number
}

export interface OrderLevel {
  price: number
  quantity: number
  orderCount: number
}

export interface RegionalPricing {
  region: string
  province: string
  currentPrice: number
  priceChange24h: number
  volume24h: number
  activeListings: number
  averageProjectSize: number
  dominantLandType: string
  verificationRate: number
}

export interface TrendAnalysis {
  ma7: number[]
  ma30: number[]
  ma90: number[]
  rsi: number[]
  bollingerBands: {
    upper: number[]
    middle: number[]
    lower: number[]
  }
  macd: {
    macd: number[]
    signal: number[]
    histogram: number[]
  }
}

export interface VolumeData {
  timestamp: Date
  volume: number
  buyVolume: number
  sellVolume: number
  trades: number
}

export interface MarketSummaryStats {
  currentPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  volumeChange24h: number
  high24h: number
  low24h: number
  marketCap: number
  totalCreditsAvailable: number
  activeListings: number
  completedTransactions24h: number
  averageTransactionSize: number
  marketStatus: 'open' | 'closed' | 'pre_market' | 'after_hours'
  lastUpdate: Date
  nextUpdate: Date
}

