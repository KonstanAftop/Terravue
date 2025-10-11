import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    // Reset store before each test
    inMemoryStore.reset()
  })
  
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
          userType: 'landowner',
        })
      
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data.user.email).toBe('test@example.com')
    })
    
    it('should reject registration with existing email', async () => {
      // Register first time
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
          userType: 'landowner',
        })
      
      // Try to register again
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password456',
          fullName: 'Another User',
          userType: 'buyer',
        })
      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
    
    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          fullName: 'Test User',
          userType: 'landowner',
        })
      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
          userType: 'landowner',
        })
    })
    
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
    })
    
    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      
      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
    
    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      
      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})


