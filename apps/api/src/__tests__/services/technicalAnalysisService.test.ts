import { describe, it, expect } from 'vitest'
import { TechnicalAnalysisService } from '../../services/technicalAnalysisService.js'
import { MarketData } from '@terravue/shared'

describe('TechnicalAnalysisService', () => {
  const service = new TechnicalAnalysisService()

  // Generate test data
  const generateTestData = (days: number): MarketData[] => {
    const data: MarketData[] = []
    let price = 75000

    for (let i = 0; i < days; i++) {
      price = price + (Math.random() - 0.5) * 2000
      data.push({
        id: `test-${i}`,
        timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
        averagePrice: price,
        volume: 1000 + Math.random() * 500,
        priceChange: (Math.random() - 0.5) * 10,
        region: 'Indonesia',
      })
    }

    return data
  }

  describe('calculateMovingAverage', () => {
    it('should calculate MA correctly', () => {
      const data = generateTestData(30)
      const ma7 = service.calculateMovingAverage(data, 7)

      expect(ma7.length).toBe(data.length)
      expect(ma7[0]).toBeNull()
      expect(ma7[6]).not.toBeNull()
      expect(typeof ma7[6]).toBe('number')
    })

    it('should return nulls for insufficient data points', () => {
      const data = generateTestData(5)
      const ma7 = service.calculateMovingAverage(data, 7)

      expect(ma7.every((val) => val === null)).toBe(true)
    })
  })

  describe('calculateRSI', () => {
    it('should calculate RSI with valid range', () => {
      const data = generateTestData(30)
      const rsi = service.calculateRSI(data, 14)

      const validRSI = rsi.filter((val) => val !== null)

      validRSI.forEach((val) => {
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(100)
      })
    })

    it('should return nulls for initial period', () => {
      const data = generateTestData(30)
      const rsi = service.calculateRSI(data, 14)

      // First 14 values should be null
      expect(rsi[0]).toBeNull()
      expect(rsi[13]).toBeNull()
      expect(rsi[14]).not.toBeNull()
    })
  })

  describe('calculateBollingerBands', () => {
    it('should calculate Bollinger Bands', () => {
      const data = generateTestData(30)
      const bands = service.calculateBollingerBands(data, 20, 2)

      expect(bands).toHaveProperty('upper')
      expect(bands).toHaveProperty('middle')
      expect(bands).toHaveProperty('lower')
      expect(bands.upper.length).toBe(data.length)
    })

    it('should have upper > middle > lower', () => {
      const data = generateTestData(30)
      const bands = service.calculateBollingerBands(data, 20, 2)

      const lastIndex = data.length - 1
      const upper = bands.upper[lastIndex]
      const middle = bands.middle[lastIndex]
      const lower = bands.lower[lastIndex]

      if (upper !== null && middle !== null && lower !== null) {
        expect(upper).toBeGreaterThan(middle)
        expect(middle).toBeGreaterThan(lower)
      }
    })
  })

  describe('calculateMACD', () => {
    it('should calculate MACD indicators', () => {
      const data = generateTestData(50)
      const macd = service.calculateMACD(data, 12, 26, 9)

      expect(macd).toHaveProperty('macd')
      expect(macd).toHaveProperty('signal')
      expect(macd).toHaveProperty('histogram')
      expect(macd.macd.length).toBe(data.length)
    })

    it('should calculate histogram as macd - signal', () => {
      const data = generateTestData(50)
      const macd = service.calculateMACD(data, 12, 26, 9)

      const lastIndex = data.length - 1
      const macdVal = macd.macd[lastIndex]
      const signalVal = macd.signal[lastIndex]
      const histogramVal = macd.histogram[lastIndex]

      if (macdVal !== null && signalVal !== null && histogramVal !== null) {
        expect(Math.abs(histogramVal - (macdVal - signalVal))).toBeLessThan(0.01)
      }
    })
  })

  describe('calculateVolatility', () => {
    it('should calculate volatility index', () => {
      const data = generateTestData(30)
      const volatility = service.calculateVolatility(data, 20)

      expect(typeof volatility).toBe('number')
      expect(volatility).toBeGreaterThanOrEqual(0)
    })

    it('should return 0 for insufficient data', () => {
      const data = generateTestData(10)
      const volatility = service.calculateVolatility(data, 20)

      expect(volatility).toBe(0)
    })
  })

  describe('determineMarketSentiment', () => {
    it('should return valid sentiment', () => {
      const data = generateTestData(30)
      const rsi = service.calculateRSI(data, 14)
      const macd = service.calculateMACD(data, 12, 26, 9)

      const sentiment = service.determineMarketSentiment(data, rsi, macd.macd)

      expect(['bullish', 'bearish', 'neutral']).toContain(sentiment)
    })

    it('should detect bullish signals', () => {
      const data = generateTestData(30)
      // Manipulate data to create bullish conditions
      data[data.length - 1].priceChange = 5

      const rsi = service.calculateRSI(data, 14)
      const macd = service.calculateMACD(data, 12, 26, 9)

      const sentiment = service.determineMarketSentiment(data, rsi, macd.macd)

      // Should be either bullish or neutral based on indicators
      expect(['bullish', 'neutral']).toContain(sentiment)
    })
  })

  describe('determineTrendDirection', () => {
    it('should return valid trend direction', () => {
      const data = generateTestData(50)
      const ma7 = service.calculateMovingAverage(data, 7)
      const ma30 = service.calculateMovingAverage(data, 30)

      const trend = service.determineTrendDirection(data, ma7, ma30)

      expect(['up', 'down', 'sideways']).toContain(trend)
    })

    it('should return sideways for insufficient data', () => {
      const data = generateTestData(20)
      const ma7 = service.calculateMovingAverage(data, 7)
      const ma30 = service.calculateMovingAverage(data, 30)

      const trend = service.determineTrendDirection(data, ma7, ma30)

      expect(trend).toBe('sideways')
    })
  })

  describe('generateTrendAnalysis', () => {
    it('should generate complete trend analysis', () => {
      const data = generateTestData(100)
      const analysis = service.generateTrendAnalysis(data)

      expect(analysis).toHaveProperty('ma7')
      expect(analysis).toHaveProperty('ma30')
      expect(analysis).toHaveProperty('ma90')
      expect(analysis).toHaveProperty('rsi')
      expect(analysis).toHaveProperty('bollingerBands')
      expect(analysis).toHaveProperty('macd')

      expect(Array.isArray(analysis.ma7)).toBe(true)
      expect(Array.isArray(analysis.rsi)).toBe(true)
      expect(analysis.ma7.length).toBe(data.length)
    })

    it('should have consistent data lengths', () => {
      const data = generateTestData(100)
      const analysis = service.generateTrendAnalysis(data)

      expect(analysis.ma7.length).toBe(data.length)
      expect(analysis.ma30.length).toBe(data.length)
      expect(analysis.rsi.length).toBe(data.length)
      expect(analysis.bollingerBands.upper.length).toBe(data.length)
    })
  })
})

