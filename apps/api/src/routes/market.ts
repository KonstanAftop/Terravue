import { Router } from 'express'
import { marketService } from '../services/marketService.js'
import { marketAnalyticsService } from '../services/marketAnalyticsService.js'
import { authMiddleware } from '../middleware/auth.js'

export const marketRouter = Router()

// GET /api/v1/market/summary - Get current market summary
marketRouter.get('/summary', (req, res) => {
  try {
    const summary = marketService.getCurrentMarketSummary()
    res.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Error fetching market summary:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market summary',
    })
  }
})

// GET /api/v1/market/data - Get historical market data
marketRouter.get('/data', (req, res) => {
  try {
    const { period = '7d', region = 'Indonesia' } = req.query
    const data = marketService.getMarketData(period as string, region as string)

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching market data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
    })
  }
})

// GET /api/v1/market/analytics - Get comprehensive market analytics
marketRouter.get('/analytics', async (req, res) => {
  try {
    const { period = '7d', region = 'Indonesia' } = req.query
    const priceHistory = marketService.getMarketData(period as string, region as string)
    const analytics = await marketAnalyticsService.getCompleteAnalytics(
      priceHistory,
      period as string,
    )

    res.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error('Error fetching market analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market analytics',
    })
  }
})

// GET /api/v1/market/depth - Get market depth (order book)
marketRouter.get('/depth', async (req, res) => {
  try {
    const depth = await marketAnalyticsService.getMarketDepth()

    res.json({
      success: true,
      data: {
        depth,
        timestamp: new Date(),
        lastUpdate: new Date(),
      },
    })
  } catch (error) {
    console.error('Error fetching market depth:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market depth',
    })
  }
})

// GET /api/v1/market/regional - Get regional pricing data
marketRouter.get('/regional', async (req, res) => {
  try {
    const regionalData = await marketAnalyticsService.getRegionalPricing()

    res.json({
      success: true,
      data: regionalData,
    })
  } catch (error) {
    console.error('Error fetching regional pricing:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch regional pricing',
    })
  }
})

// GET /api/v1/market/transactions/recent - Get recent transactions
marketRouter.get('/transactions/recent', async (req, res) => {
  try {
    const { limit = '20' } = req.query
    const transactions = await marketAnalyticsService.getRecentTransactions(
      parseInt(limit as string),
    )

    res.json({
      success: true,
      data: transactions,
    })
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent transactions',
    })
  }
})

// GET /api/v1/market/stats - Get market summary statistics
marketRouter.get('/stats', async (req, res) => {
  try {
    const { period = '7d' } = req.query
    const priceHistory = marketService.getMarketData(period as string)
    const stats = await marketAnalyticsService.getMarketSummaryStats(priceHistory)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching market stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market stats',
    })
  }
})

