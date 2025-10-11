import request from 'supertest'
import express from 'express'
import { usersRouter } from '../../routes/users.js'
import { inMemoryStore } from '../../repositories/inMemoryStore.js'
import { generateToken } from '../../utils/jwt.js'
import { describe, it, expect, beforeEach } from 'vitest'

const app = express()
app.use(express.json())
app.use('/api/v1/users', usersRouter)

describe('User Profile API', () => {
  let authToken: string
  let userId: string

  beforeEach(() => {
    // Create a test user
    const user = inMemoryStore.createUser({
      email: 'test@example.com',
      password: 'hashedpassword',
      fullName: 'Test User',
      userType: 'landowner',
    })
    userId = user.id
    authToken = generateToken({ id: user.id, email: user.email, userType: user.userType })
  })

  describe('GET /api/v1/users/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.email).toBe('test@example.com')
      expect(response.body.data.password).toBeUndefined() // Password should be excluded
    })

    it('should return 401 without auth token', async () => {
      const response = await request(app).get('/api/v1/users/profile')

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /api/v1/users/profile', () => {
    it('should update user profile', async () => {
      const updates = {
        bio: 'Updated bio',
        publicProfile: true,
      }

      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.profile).toBeDefined()
      expect(response.body.data.profile.bio).toBe('Updated bio')
      expect(response.body.data.profile.publicProfile).toBe(true)
    })
  })

  describe('GET /api/v1/users/settings', () => {
    it('should return user settings', async () => {
      const response = await request(app)
        .get('/api/v1/users/settings')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.notifications).toBeDefined()
      expect(response.body.data.privacy).toBeDefined()
      expect(response.body.data.security).toBeDefined()
    })
  })

  describe('PUT /api/v1/users/settings', () => {
    it('should update user settings', async () => {
      const updates = {
        notifications: {
          email: {
            transactionUpdates: false,
            marketAlerts: false,
          },
        },
      }

      const response = await request(app)
        .put('/api/v1/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.notifications.email.transactionUpdates).toBe(false)
    })
  })

  describe('GET /api/v1/users/metrics', () => {
    it('should return user performance metrics', async () => {
      const response = await request(app)
        .get('/api/v1/users/metrics')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.trading).toBeDefined()
      expect(response.body.data.environmental).toBeDefined()
      expect(response.body.data.platform).toBeDefined()
    })
  })

  describe('GET /api/v1/users/verification', () => {
    it('should return verification status', async () => {
      const response = await request(app)
        .get('/api/v1/users/verification')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.overall).toBeDefined()
      expect(response.body.data.requirements).toBeDefined()
      expect(response.body.data.completionPercentage).toBeDefined()
    })
  })

  describe('PUT /api/v1/users/verification', () => {
    it('should update verification status', async () => {
      const updates = {
        emailVerified: true,
        phoneVerified: true,
      }

      const response = await request(app)
        .put('/api/v1/users/verification')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.requirements.emailVerified).toBe(true)
      expect(response.body.data.requirements.phoneVerified).toBe(true)
      expect(response.body.data.completionPercentage).toBeGreaterThan(0)
    })
  })

  describe('POST /api/v1/users/export', () => {
    it('should export user data as JSON', async () => {
      const exportRequest = {
        format: 'json',
        categories: ['profile', 'transactions'],
        includeMetadata: true,
      }

      const response = await request(app)
        .post('/api/v1/users/export')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exportRequest)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.exportId).toBeDefined()
      expect(response.body.data.filename).toContain('.json')
      expect(response.body.data.data).toBeDefined()
    })

    it('should export user data as CSV', async () => {
      const exportRequest = {
        format: 'csv',
        categories: ['profile'],
        includeMetadata: false,
      }

      const response = await request(app)
        .post('/api/v1/users/export')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exportRequest)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.filename).toContain('.csv')
    })
  })
})

