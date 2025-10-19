import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { dashboardRouter } from './routes/dashboard.js'
import { marketRouter } from './routes/market.js'
import { landsRouter } from './routes/lands.js'
import { creditsRouter } from './routes/credits.js'
import { transactionsRouter } from './routes/transactions.js'
import { alertsRouter } from './routes/alerts.js'
import { usersRouter } from './routes/users.js'
import { activityRouter } from './routes/activity.js'
import { inMemoryStore } from './repositories/inMemoryStore.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Initialize in-memory data store
inMemoryStore.initialize()
const stats = inMemoryStore.getStats()

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRouter)
app.use('/api/v1/health', healthRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use('/api/v1/market', marketRouter)
app.use('/api/v1/lands', landsRouter)
app.use('/api/v1/credits', creditsRouter)
app.use('/api/v1/transactions', transactionsRouter)
app.use('/api/v1/alerts', alertsRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/activity', activityRouter)

// Start server
app.listen(PORT, () => {
  console.log('\n🌱 Terravue API Server')
  console.log('======================')
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✓ CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
  console.log(`✓ In-memory data loaded:`)
  console.log(`  - ${stats.users} users`)
  console.log(`  - ${stats.lands} land parcels`)
  console.log(`  - ${stats.credits} carbon credits`)
  console.log(`  - ${stats.transactions} transactions`)
  console.log('\n✓ Health check available at:')
  console.log(`  - http://localhost:${PORT}/api/health`)
  console.log(`  - http://localhost:${PORT}/api/v1/health`)
  console.log('')
})

export default app

