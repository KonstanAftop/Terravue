import { describe, it, expect, beforeEach } from 'vitest'
import { dataExportService } from '../../services/dataExportService.js'
import { inMemoryStore } from '../../repositories/inMemoryStore.js'

describe('DataExportService', () => {
  let testUserId: string

  beforeEach(() => {
    // Create a test user
    const user = inMemoryStore.createUser({
      email: 'export@test.com',
      password: 'hashed',
      fullName: 'Export Test User',
      userType: 'landowner',
    })
    testUserId = user.id
  })

  describe('exportUserData', () => {
    it('should export data in JSON format', async () => {
      const request = {
        format: 'json' as const,
        categories: ['profile' as const, 'transactions' as const],
        includeMetadata: true,
      }

      const result = await dataExportService.exportUserData(testUserId, request)

      expect(result.exportId).toBeDefined()
      expect(result.filename).toContain('.json')
      expect(result.format).toBe('json')
      expect(result.data).toBeDefined()

      // Validate JSON structure
      const parsedData = JSON.parse(result.data)
      expect(parsedData.profile).toBeDefined()
      expect(parsedData.transactions).toBeDefined()
      expect(parsedData.metadata).toBeDefined()
    })

    it('should export data in CSV format', async () => {
      const request = {
        format: 'csv' as const,
        categories: ['profile' as const],
        includeMetadata: false,
      }

      const result = await dataExportService.exportUserData(testUserId, request)

      expect(result.filename).toContain('.csv')
      expect(result.format).toBe('csv')
      expect(result.data).toBeDefined()
      expect(typeof result.data).toBe('string')
    })

    it('should include only requested categories', async () => {
      const request = {
        format: 'json' as const,
        categories: ['profile' as const],
        includeMetadata: false,
      }

      const result = await dataExportService.exportUserData(testUserId, request)
      const parsedData = JSON.parse(result.data)

      expect(parsedData.profile).toBeDefined()
      expect(parsedData.transactions).toBeUndefined()
      expect(parsedData.activities).toBeUndefined()
    })

    it('should exclude metadata when not requested', async () => {
      const request = {
        format: 'json' as const,
        categories: ['profile' as const],
        includeMetadata: false,
      }

      const result = await dataExportService.exportUserData(testUserId, request)
      const parsedData = JSON.parse(result.data)

      expect(parsedData.metadata).toBeUndefined()
    })

    it('should filter data by date range', async () => {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      const request = {
        format: 'json' as const,
        categories: ['transactions' as const],
        dateRange: {
          from: yesterday,
          to: tomorrow,
        },
        includeMetadata: false,
      }

      const result = await dataExportService.exportUserData(testUserId, request)
      expect(result.data).toBeDefined()
    })

    it('should handle multiple categories', async () => {
      const request = {
        format: 'json' as const,
        categories: ['profile' as const, 'settings' as const, 'transactions' as const],
        includeMetadata: true,
      }

      const result = await dataExportService.exportUserData(testUserId, request)
      const parsedData = JSON.parse(result.data)

      expect(parsedData.profile).toBeDefined()
      expect(parsedData.settings).toBeDefined()
      expect(parsedData.transactions).toBeDefined()
    })
  })
})

