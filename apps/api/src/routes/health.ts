import { Router, Request, Response } from 'express'

export const healthRouter = Router()

// Basic health check
healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// Detailed health check
healthRouter.get('/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TerraVue API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})


