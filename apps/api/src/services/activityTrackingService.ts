import { UserActivity, ActivityType, ActivitySummary, generateId } from '@terravue/shared'

interface ActivityFilters {
  type?: ActivityType
  from?: Date
  to?: Date
  limit?: number
  offset?: number
}

class ActivityTrackingService {
  private activities: Map<string, UserActivity[]> = new Map()

  /**
   * Log a new activity
   */
  async logActivity(
    userId: string,
    type: ActivityType,
    description: string,
    metadata: Record<string, any> = {},
    request?: any,
  ): Promise<void> {
    const activity: UserActivity = {
      id: generateId('activity'),
      userId,
      type,
      description,
      metadata,
      timestamp: new Date(),
      ipAddress: this.getClientIP(request),
      userAgent: request?.headers?.['user-agent'],
      location: undefined, // Could be enhanced with IP geolocation
    }

    const userActivities = this.activities.get(userId) || []
    userActivities.unshift(activity) // Add to beginning for most recent first
    this.activities.set(userId, userActivities)
  }

  /**
   * Get activity timeline with filters
   */
  async getActivityTimeline(
    userId: string,
    filters: ActivityFilters = {},
  ): Promise<{
    timeline: Record<string, UserActivity[]>
    summary: ActivitySummary
    totalCount: number
  }> {
    let activities = this.activities.get(userId) || []

    // Apply filters
    if (filters.type) {
      activities = activities.filter((a) => a.type === filters.type)
    }

    if (filters.from) {
      activities = activities.filter((a) => new Date(a.timestamp) >= filters.from!)
    }

    if (filters.to) {
      activities = activities.filter((a) => new Date(a.timestamp) <= filters.to!)
    }

    const totalCount = activities.length

    // Apply pagination
    const offset = filters.offset || 0
    const limit = filters.limit || 50
    activities = activities.slice(offset, offset + limit)

    // Group by date
    const timeline = this.groupActivitiesByDate(activities)

    // Calculate summary
    const summary = this.calculateActivitySummary(this.activities.get(userId) || [])

    return {
      timeline,
      summary,
      totalCount,
    }
  }

  /**
   * Get activity statistics for a user
   */
  async getActivityStatistics(userId: string): Promise<ActivitySummary> {
    const activities = this.activities.get(userId) || []
    return this.calculateActivitySummary(activities)
  }

  /**
   * Delete user activities (for data cleanup)
   */
  async deleteUserActivities(userId: string): Promise<void> {
    this.activities.delete(userId)
  }

  // Private helper methods

  private groupActivitiesByDate(activities: UserActivity[]): Record<string, UserActivity[]> {
    return activities.reduce(
      (grouped, activity) => {
        const date = new Date(activity.timestamp).toISOString().split('T')[0]
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(activity)
        return grouped
      },
      {} as Record<string, UserActivity[]>,
    )
  }

  private calculateActivitySummary(activities: UserActivity[]): ActivitySummary {
    if (activities.length === 0) {
      return {
        totalActivities: 0,
        activitiesByType: {},
        activitiesByMonth: {},
        lastActivity: new Date(),
        mostActiveDay: '',
        averageSessionDuration: 0,
      }
    }

    // Count by type
    const activitiesByType: Record<string, number> = {}
    activities.forEach((a) => {
      activitiesByType[a.type] = (activitiesByType[a.type] || 0) + 1
    })

    // Count by month
    const activitiesByMonth: Record<string, number> = {}
    activities.forEach((a) => {
      const month = new Date(a.timestamp).toISOString().slice(0, 7) // YYYY-MM
      activitiesByMonth[month] = (activitiesByMonth[month] || 0) + 1
    })

    // Count by day to find most active day
    const activitiesByDay: Record<string, number> = {}
    activities.forEach((a) => {
      const day = new Date(a.timestamp).toISOString().split('T')[0]
      activitiesByDay[day] = (activitiesByDay[day] || 0) + 1
    })

    const mostActiveDay =
      Object.entries(activitiesByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // Get last activity
    const lastActivity = activities.length > 0 ? new Date(activities[0].timestamp) : new Date()

    return {
      totalActivities: activities.length,
      activitiesByType,
      activitiesByMonth,
      lastActivity,
      mostActiveDay,
      averageSessionDuration: 0, // Could be calculated from login/logout events
    }
  }

  private getClientIP(request?: any): string | undefined {
    if (!request) return undefined
    return (
      request.headers?.['x-forwarded-for']?.split(',')[0] ||
      request.headers?.['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress
    )
  }

  /**
   * Initialize with some sample activities for testing
   */
  initializeSampleData(userId: string): void {
    const sampleActivities: Array<{
      type: ActivityType
      description: string
      metadata?: Record<string, any>
    }> = [
      {
        type: 'login',
        description: 'User logged in to the platform',
        metadata: { source: 'web' },
      },
      {
        type: 'land_registration',
        description: 'Registered new land parcel',
        metadata: { landId: 'sample-land-1', area: 10 },
      },
      {
        type: 'credit_listing',
        description: 'Created new carbon credit listing',
        metadata: { listingId: 'sample-listing-1', credits: 500 },
      },
      {
        type: 'transaction_completed',
        description: 'Completed carbon credit transaction',
        metadata: { transactionId: 'sample-tx-1', amount: 25000000 },
      },
      {
        type: 'profile_update',
        description: 'Updated profile information',
        metadata: { fields: ['phone', 'bio'] },
      },
    ]

    const now = Date.now()
    const activities = sampleActivities.map((sample, index) => ({
      id: generateId('activity'),
      userId,
      ...sample,
      metadata: sample.metadata || {},
      timestamp: new Date(now - index * 3600000), // 1 hour apart
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    }))

    this.activities.set(userId, activities)
  }
}

export const activityTrackingService = new ActivityTrackingService()

