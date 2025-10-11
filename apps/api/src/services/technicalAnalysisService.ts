import { MarketData, TrendAnalysis } from '@terravue/shared'

export class TechnicalAnalysisService {
  /**
   * Calculate Simple Moving Average
   */
  calculateMovingAverage(data: MarketData[], period: number): (number | null)[] {
    const ma: (number | null)[] = []

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(null)
      } else {
        const sum = data
          .slice(i - period + 1, i + 1)
          .reduce((acc, item) => acc + item.averagePrice, 0)
        ma.push(sum / period)
      }
    }

    return ma
  }

  /**
   * Calculate Relative Strength Index (RSI)
   */
  calculateRSI(data: MarketData[], period: number = 14): (number | null)[] {
    const rsi: (number | null)[] = [null] // First value is always null
    const gains: number[] = []
    const losses: number[] = []

    for (let i = 1; i < data.length; i++) {
      const change = data[i].averagePrice - data[i - 1].averagePrice
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)

      if (i >= period) {
        const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period
        const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period

        if (avgLoss === 0) {
          rsi.push(100)
        } else {
          const rs = avgGain / avgLoss
          rsi.push(100 - 100 / (1 + rs))
        }
      } else {
        rsi.push(null)
      }
    }

    return rsi
  }

  /**
   * Calculate Bollinger Bands
   */
  calculateBollingerBands(
    data: MarketData[],
    period: number = 20,
    stdDev: number = 2,
  ): {
    upper: (number | null)[]
    middle: (number | null)[]
    lower: (number | null)[]
  } {
    const middle = this.calculateMovingAverage(data, period)
    const upper: (number | null)[] = []
    const lower: (number | null)[] = []

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1 || middle[i] === null) {
        upper.push(null)
        lower.push(null)
      } else {
        const prices = data.slice(i - period + 1, i + 1).map((d) => d.averagePrice)
        const mean = middle[i]!
        const variance =
          prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / period
        const standardDeviation = Math.sqrt(variance)

        upper.push(mean + stdDev * standardDeviation)
        lower.push(mean - stdDev * standardDeviation)
      }
    }

    return { upper, middle, lower }
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(
    data: MarketData[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
  ): {
    macd: (number | null)[]
    signal: (number | null)[]
    histogram: (number | null)[]
  } {
    const emaFast = this.calculateEMA(data, fastPeriod)
    const emaSlow = this.calculateEMA(data, slowPeriod)

    // MACD line is the difference between fast and slow EMAs
    const macd: (number | null)[] = emaFast.map((fast, i) => {
      if (fast === null || emaSlow[i] === null) return null
      return fast - emaSlow[i]!
    })

    // Signal line is EMA of MACD
    const signal = this.calculateEMAFromValues(macd, signalPeriod)

    // Histogram is difference between MACD and signal
    const histogram: (number | null)[] = macd.map((m, i) => {
      if (m === null || signal[i] === null) return null
      return m - signal[i]!
    })

    return { macd, signal, histogram }
  }

  /**
   * Calculate Exponential Moving Average
   */
  private calculateEMA(data: MarketData[], period: number): (number | null)[] {
    const values = data.map((d) => d.averagePrice)
    return this.calculateEMAFromValues(values, period)
  }

  /**
   * Calculate EMA from array of values (can include nulls)
   */
  private calculateEMAFromValues(
    values: (number | null)[],
    period: number,
  ): (number | null)[] {
    const ema: (number | null)[] = []
    const multiplier = 2 / (period + 1)
    let firstValidIndex = -1

    // Find first non-null value
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== null) {
        firstValidIndex = i
        break
      }
    }

    if (firstValidIndex === -1) {
      return values.map(() => null)
    }

    // Initialize with SMA for first period
    for (let i = 0; i < values.length; i++) {
      if (i < firstValidIndex + period - 1) {
        ema.push(null)
      } else if (i === firstValidIndex + period - 1) {
        // Calculate initial SMA
        const validValues = values
          .slice(firstValidIndex, i + 1)
          .filter((v): v is number => v !== null)
        const sum = validValues.reduce((a, b) => a + b, 0)
        ema.push(sum / validValues.length)
      } else {
        // Calculate EMA
        const currentValue = values[i]
        if (currentValue !== null && ema[i - 1] !== null) {
          ema.push(currentValue * multiplier + ema[i - 1]! * (1 - multiplier))
        } else {
          ema.push(ema[i - 1])
        }
      }
    }

    return ema
  }

  /**
   * Calculate volatility index
   */
  calculateVolatility(data: MarketData[], period: number = 20): number {
    if (data.length < period) return 0

    const recentData = data.slice(-period)
    const returns = []

    for (let i = 1; i < recentData.length; i++) {
      const ret =
        (recentData[i].averagePrice - recentData[i - 1].averagePrice) /
        recentData[i - 1].averagePrice
      returns.push(ret)
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance =
      returns.reduce((acc, ret) => acc + Math.pow(ret - mean, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)

    // Annualized volatility (assuming 252 trading days per year)
    return stdDev * Math.sqrt(252) * 100
  }

  /**
   * Determine market sentiment based on technical indicators
   */
  determineMarketSentiment(
    data: MarketData[],
    rsi: (number | null)[],
    macd: (number | null)[],
  ): 'bullish' | 'bearish' | 'neutral' {
    if (data.length < 2) return 'neutral'

    const latestRSI = rsi[rsi.length - 1]
    const latestMACD = macd[macd.length - 1]
    const priceChange = data[data.length - 1].priceChange

    let bullishSignals = 0
    let bearishSignals = 0

    // RSI signals
    if (latestRSI !== null) {
      if (latestRSI > 70) bearishSignals++ // Overbought
      if (latestRSI < 30) bullishSignals++ // Oversold
      if (latestRSI > 50 && latestRSI < 70) bullishSignals++ // Bullish momentum
      if (latestRSI < 50 && latestRSI > 30) bearishSignals++ // Bearish momentum
    }

    // MACD signals
    if (latestMACD !== null) {
      if (latestMACD > 0) bullishSignals++
      if (latestMACD < 0) bearishSignals++
    }

    // Price momentum
    if (priceChange > 2) bullishSignals++
    if (priceChange < -2) bearishSignals++

    if (bullishSignals > bearishSignals) return 'bullish'
    if (bearishSignals > bullishSignals) return 'bearish'
    return 'neutral'
  }

  /**
   * Determine trend direction
   */
  determineTrendDirection(
    data: MarketData[],
    ma7: (number | null)[],
    ma30: (number | null)[],
  ): 'up' | 'down' | 'sideways' {
    if (data.length < 30) return 'sideways'

    const latestPrice = data[data.length - 1].averagePrice
    const latestMA7 = ma7[ma7.length - 1]
    const latestMA30 = ma30[ma30.length - 1]

    if (latestMA7 === null || latestMA30 === null) return 'sideways'

    // Strong uptrend: price > MA7 > MA30
    if (latestPrice > latestMA7 && latestMA7 > latestMA30) return 'up'

    // Strong downtrend: price < MA7 < MA30
    if (latestPrice < latestMA7 && latestMA7 < latestMA30) return 'down'

    return 'sideways'
  }

  /**
   * Generate complete trend analysis
   */
  generateTrendAnalysis(data: MarketData[]): TrendAnalysis {
    const ma7 = this.calculateMovingAverage(data, 7)
    const ma30 = this.calculateMovingAverage(data, 30)
    const ma90 = this.calculateMovingAverage(data, 90)
    const rsi = this.calculateRSI(data, 14)
    const bollingerBands = this.calculateBollingerBands(data, 20, 2)
    const macd = this.calculateMACD(data, 12, 26, 9)

    return {
      ma7,
      ma30,
      ma90,
      rsi,
      bollingerBands: {
        upper: bollingerBands.upper,
        middle: bollingerBands.middle,
        lower: bollingerBands.lower,
      },
      macd: {
        macd: macd.macd,
        signal: macd.signal,
        histogram: macd.histogram,
      },
    }
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService()

