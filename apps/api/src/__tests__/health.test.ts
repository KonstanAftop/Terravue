import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server.js'

describe('Health Check Endpoints', () => {
  it('should return 200 status for basic health check', async () => {
    const response = await request(app).get('/api/health')
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'healthy')
    expect(response.body).toHaveProperty('timestamp')
  })
  
  it('should return detailed system status', async () => {
    const response = await request(app).get('/api/v1/health')
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'healthy')
    expect(response.body).toHaveProperty('service', 'TerraVue API')
    expect(response.body).toHaveProperty('version')
    expect(response.body).toHaveProperty('environment')
  })
})


