import { describe, it, expect, beforeEach } from 'vitest'
import { activityTrackingService } from '../../services/activityTrackingService.js'

describe('ActivityTrackingService', () => {
  const testUserId = 'test-user-123'

  beforeEach(async () => {
    // Clean up any existing data
    await activityTrackingService.deleteUserActivities(testUserId)
  })

  describe('logActivity', () => {
    it('should log a new activity', async () => {
      await activityTrackingService.logActivity(
        testUserId,
        'login',
        'User logged in',
        { source: 'web' },
      )

      const timeline = await activityTrackingService.getActivityTimeline(testUserId)
      expect(timeline.totalCount).toBe(1)
    })

    it('should store activity metadata', async () => {
      const metadata = { transactionId: 'tx-123', amount: 1000000 }
      await activityTrackingService.logActivity(
        testUserId,
        'transaction_completed',
        'Transaction completed',
        metadata,
      )

      const timeline = await activityTrackingService.getActivityTimeline(testUserId)
      const activities = Object.values(timeline.timeline).flat()
      expect(activities[0].metadata).toEqual(metadata)
    })
  })

  describe('getActivityTimeline', () => {
    beforeEach(async () => {
      // Create some test activities
      await activityTrackingService.logActivity(testUserId, 'login', 'Login activity')
      await activityTrackingService.logActivity(
        testUserId,
        'land_registration',
        'Registered land',
      )
      await activityTrackingService.logActivity(testUserId, 'credit_listing', 'Created listing')
    })

    it('should return grouped timeline', async () => {
      const timeline = await activityTrackingService.getActivityTimeline(testUserId)

      expect(timeline.totalCount).toBe(3)
      expect(timeline.timeline).toBeDefined()
      expect(timeline.summary).toBeDefined()
    })

    it('should filter by activity type', async () => {
      const timeline = await activityTrackingService.getActivityTimeline(testUserId, {
        type: 'login',
      })

      expect(timeline.totalCount).toBe(1)
    })

    it('should apply pagination', async () => {
      const timeline = await activityTrackingService.getActivityTimeline(testUserId, {
        limit: 2,
        offset: 0,
      })

      const activities = Object.values(timeline.timeline).flat()
      expect(activities.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getActivityStatistics', () => {
    beforeEach(async () => {
      await activityTrackingService.logActivity(testUserId, 'login', 'Login 1')
      await activityTrackingService.logActivity(testUserId, 'login', 'Login 2')
      await activityTrackingService.logActivity(testUserId, 'transaction_completed', 'Transaction')
    })

    it('should calculate activity statistics', async () => {
      const stats = await activityTrackingService.getActivityStatistics(testUserId)

      expect(stats.totalActivities).toBe(3)
      expect(stats.activitiesByType['login']).toBe(2)
      expect(stats.activitiesByType['transaction_completed']).toBe(1)
      expect(stats.lastActivity).toBeDefined()
    })
  })

  describe('initializeSampleData', () => {
    it('should initialize sample activities', () => {
      activityTrackingService.initializeSampleData(testUserId)

      const result = activityTrackingService.getActivityTimeline(testUserId)
      expect(result).resolves.toBeDefined()
    })
  })
})

