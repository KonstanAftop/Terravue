import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../server.js'

describe('Market Analytics API', () => {
  let authToken: string

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'buyer1@example.com',
      password: 'password123',
    })

    authToken = loginResponse.body.data.token
  })

  describe('GET /api/v1/market/analytics', () => {
    it('should return comprehensive market analytics', async () => {
      const response = await request(app).get('/api/v1/market/analytics?period=7d')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('analytics')
      expect(response.body.data).toHaveProperty('priceHistory')
      expect(response.body.data).toHaveProperty('volumeHistory')
      expect(response.body.data).toHaveProperty('trends')
      expect(response.body.data).toHaveProperty('regionalData')
    })

    it('should return analytics with valid structure', async () => {
      const response = await request(app).get('/api/v1/market/analytics?period=30d')

      const { analytics } = response.body.data

      expect(analytics).toHaveProperty('currentPrice')
      expect(analytics).toHaveProperty('priceChange24h')
      expect(analytics).toHaveProperty('volume24h')
      expect(analytics).toHaveProperty('marketSentiment')
      expect(analytics).toHaveProperty('trendDirection')
      expect(analytics).toHaveProperty('volatilityIndex')
      expect(typeof analytics.currentPrice).toBe('number')
      expect(['bullish', 'bearish', 'neutral']).toContain(analytics.marketSentiment)
      expect(['up', 'down', 'sideways']).toContain(analytics.trendDirection)
    })

    it('should return trend analysis with technical indicators', async () => {
      const response = await request(app).get('/api/v1/market/analytics?period=90d')

      const { trends } = response.body.data

      expect(trends).toHaveProperty('ma7')
      expect(trends).toHaveProperty('ma30')
      expect(trends).toHaveProperty('ma90')
      expect(trends).toHaveProperty('rsi')
      expect(trends).toHaveProperty('bollingerBands')
      expect(trends).toHaveProperty('macd')
      expect(Array.isArray(trends.ma7)).toBe(true)
      expect(Array.isArray(trends.rsi)).toBe(true)
    })
  })

  describe('GET /api/v1/market/depth', () => {
    it('should return market depth data', async () => {
      const response = await request(app).get('/api/v1/market/depth')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('depth')
      expect(response.body.data.depth).toHaveProperty('bids')
      expect(response.body.data.depth).toHaveProperty('asks')
      expect(response.body.data.depth).toHaveProperty('spread')
      expect(response.body.data.depth).toHaveProperty('spreadPercent')
    })

    it('should have bids and asks with correct structure', async () => {
      const response = await request(app).get('/api/v1/market/depth')

      const { bids, asks } = response.body.data.depth

      expect(Array.isArray(bids)).toBe(true)
      expect(Array.isArray(asks)).toBe(true)

      if (bids.length > 0) {
        expect(bids[0]).toHaveProperty('price')
        expect(bids[0]).toHaveProperty('quantity')
        expect(bids[0]).toHaveProperty('orderCount')
      }
    })
  })

  describe('GET /api/v1/market/regional', () => {
    it('should return regional pricing data', async () => {
      const response = await request(app).get('/api/v1/market/regional')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    it('should have regional data with correct structure', async () => {
      const response = await request(app).get('/api/v1/market/regional')

      const regionalData = response.body.data[0]

      expect(regionalData).toHaveProperty('region')
      expect(regionalData).toHaveProperty('province')
      expect(regionalData).toHaveProperty('currentPrice')
      expect(regionalData).toHaveProperty('priceChange24h')
      expect(regionalData).toHaveProperty('volume24h')
      expect(regionalData).toHaveProperty('activeListings')
      expect(regionalData).toHaveProperty('dominantLandType')
      expect(regionalData).toHaveProperty('verificationRate')
    })
  })

  describe('GET /api/v1/market/transactions/recent', () => {
    it('should return recent transactions', async () => {
      const response = await request(app).get('/api/v1/market/transactions/recent')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should respect limit parameter', async () => {
      const response = await request(app).get('/api/v1/market/transactions/recent?limit=5')

      expect(response.body.data.length).toBeLessThanOrEqual(5)
    })
  })

  describe('GET /api/v1/market/stats', () => {
    it('should return market summary statistics', async () => {
      const response = await request(app).get('/api/v1/market/stats')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('currentPrice')
      expect(response.body.data).toHaveProperty('marketStatus')
      expect(response.body.data).toHaveProperty('lastUpdate')
      expect(response.body.data).toHaveProperty('nextUpdate')
      expect(['open', 'closed', 'pre_market', 'after_hours']).toContain(
        response.body.data.marketStatus,
      )
    })
  })

  describe('Price Alerts API', () => {
    let alertId: string

    it('should create a new price alert', async () => {
      const response = await request(app)
        .post('/api/v1/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetPrice: 80000,
          condition: 'above',
          notificationMethods: ['browser'],
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('targetPrice', 80000)
      expect(response.body.data).toHaveProperty('condition', 'above')
      expect(response.body.data).toHaveProperty('isActive', true)

      alertId = response.body.data.id
    })

    it('should get all user alerts', async () => {
      const response = await request(app)
        .get('/api/v1/alerts')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('should get alert statistics', async () => {
      const response = await request(app)
        .get('/api/v1/alerts/stats')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('total')
      expect(response.body.data).toHaveProperty('active')
      expect(response.body.data).toHaveProperty('triggered')
    })

    it('should update an alert', async () => {
      const response = await request(app)
        .patch(`/api/v1/alerts/${alertId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetPrice: 85000,
          isActive: false,
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.targetPrice).toBe(85000)
      expect(response.body.data.isActive).toBe(false)
    })

    it('should delete an alert', async () => {
      const response = await request(app)
        .delete(`/api/v1/alerts/${alertId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should require authentication for alerts', async () => {
      const response = await request(app).get('/api/v1/alerts')

      expect(response.status).toBe(401)
    })

    it('should validate alert data', async () => {
      const response = await request(app)
        .post('/api/v1/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetPrice: -100, // Invalid
          condition: 'above',
          notificationMethods: ['browser'],
        })

      expect(response.status).toBe(400)
    })
  })
})

