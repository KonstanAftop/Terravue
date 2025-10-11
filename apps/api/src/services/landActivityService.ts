import { LandActivity } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

class LandActivityService {
  /**
   * Log a new activity for a land parcel
   */
  logActivity(
    landParcelId: string,
    activityType: LandActivity['activityType'],
    description: string,
    userId: string,
    metadata?: Record<string, any>
  ): LandActivity {
    const user = inMemoryStore.getUser(userId)
    
    const activity: LandActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      landParcelId,
      activityType,
      description,
      userId,
      userName: user?.fullName,
      metadata,
      createdAt: new Date(),
    }

    inMemoryStore.addActivity(activity)
    return activity
  }

  /**
   * Get all activities for a land parcel
   */
  getActivitiesByLandParcel(landParcelId: string): LandActivity[] {
    return inMemoryStore.getActivitiesByLandParcel(landParcelId)
  }

  /**
   * Get activities by user
   */
  getActivitiesByUser(userId: string): LandActivity[] {
    return inMemoryStore.getAllActivities().filter(a => a.userId === userId)
  }

  /**
   * Get recent activities across all land parcels
   */
  getRecentActivities(limit: number = 10): LandActivity[] {
    const activities = inMemoryStore.getAllActivities()
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }
}

export const landActivityService = new LandActivityService()

