import {
  User,
  UserProfile,
  UserSettings,
  UserPerformanceMetrics,
  AccountVerificationStatus,
} from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'

export class UserProfileService {
  /**
   * Get user profile with extended information
   */
  async getUserProfile(userId: string): Promise<User | null> {
    const user = inMemoryStore.getUser(userId)
    if (!user) return null

    // Remove password before returning
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<User | null> {
    const user = inMemoryStore.getUser(userId)
    if (!user) return null

    const updatedProfile: UserProfile = {
      ...(user.profile || this.getDefaultProfile()),
      ...updates,
    }

    const updatedUser = inMemoryStore.updateUser(userId, {
      profile: updatedProfile,
    })

    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser
      return userWithoutPassword as User
    }

    return null
  }

  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const user = inMemoryStore.getUser(userId)
    if (!user) return null

    return user.settings || this.getDefaultSettings()
  }

  /**
   * Update user settings
   */
  async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | null> {
    const user = inMemoryStore.getUser(userId)
    if (!user) return null

    const currentSettings = user.settings || this.getDefaultSettings()
    const updatedSettings: UserSettings = {
      notifications: {
        ...currentSettings.notifications,
        ...(updates.notifications || {}),
        email: {
          ...currentSettings.notifications.email,
          ...(updates.notifications?.email || {}),
        },
        browser: {
          ...currentSettings.notifications.browser,
          ...(updates.notifications?.browser || {}),
        },
      },
      privacy: {
        ...currentSettings.privacy,
        ...(updates.privacy || {}),
      },
      security: {
        ...currentSettings.security,
        ...(updates.security || {}),
      },
    }

    const updatedUser = inMemoryStore.updateUser(userId, {
      settings: updatedSettings,
    })

    return updatedUser?.settings || null
  }

  /**
   * Calculate user performance metrics
   */
  async getPerformanceMetrics(userId: string): Promise<UserPerformanceMetrics> {
    const user = inMemoryStore.getUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const transactions = inMemoryStore.getAllTransactions().filter(
      (t) => t.buyerId === userId || t.sellerId === userId,
    )

    const lands = inMemoryStore.getLandsByOwner(userId)
    const credits = inMemoryStore.getAllCredits().filter((c) => c.landParcelId && lands.some(l => l.id === c.landParcelId))

    // Calculate trading metrics
    const completedTransactions = transactions.filter((t) => t.status === 'completed')
    const totalCreditsTraded = completedTransactions.reduce((sum, t) => sum + t.quantity, 0)
    const totalTransactionValue = completedTransactions.reduce((sum, t) => sum + t.totalAmount, 0)

    // Calculate environmental metrics
    const totalCarbonOffset = totalCreditsTraded * 1.2 // Assume 1.2 tons CO2 per credit
    const projectsSupported = new Set(completedTransactions.map((t) => t.creditListingId)).size

    // Calculate platform metrics
    const accountAge = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    )

    const verificationStatus = user.verificationStatus || this.getDefaultVerificationStatus()

    return {
      trading: {
        totalCreditsTraded,
        totalTransactionValue,
        averageTransactionSize:
          completedTransactions.length > 0
            ? totalTransactionValue / completedTransactions.length
            : 0,
        successfulTransactions: completedTransactions.length,
        failedTransactions: transactions.filter((t) => t.status === 'failed').length,
        profitLoss: 0, // TODO: Calculate based on buy/sell transactions
        portfolioValue: credits.reduce((sum, c) => sum + c.quantity * c.pricePerCredit, 0),
        tradingFrequency:
          accountAge > 0 ? (completedTransactions.length / accountAge) * 30 : 0,
      },
      environmental: {
        totalCarbonOffset,
        carbonFootprintReduction: Math.min((totalCarbonOffset / 100) * 100, 100),
        projectsSupported,
        biodiversityImpact: projectsSupported > 5 ? 'High' : projectsSupported > 2 ? 'Medium' : 'Low',
        communityBenefits: [
          'Forest conservation',
          'Local employment',
          'Sustainable development',
        ],
        sustainabilityGoalProgress: Math.min((totalCarbonOffset / 1000) * 100, 100),
      },
      platform: {
        accountAge,
        loginFrequency: 0, // TODO: Calculate from activity logs
        featuresUsed: ['Trading', 'Land Management', 'Market Analytics'],
        documentsUploaded: 0, // TODO: Calculate from document management
        verificationLevel: verificationStatus.completionPercentage,
        referralsGenerated: 0,
      },
    }
  }

  /**
   * Get account verification status
   */
  async getVerificationStatus(userId: string): Promise<AccountVerificationStatus> {
    const user = inMemoryStore.getUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user.verificationStatus || this.getDefaultVerificationStatus()
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    userId: string,
    updates: Partial<AccountVerificationStatus['requirements']>,
  ): Promise<AccountVerificationStatus> {
    const user = inMemoryStore.getUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const currentStatus = user.verificationStatus || this.getDefaultVerificationStatus()
    const updatedRequirements = {
      ...currentStatus.requirements,
      ...updates,
    }

    // Calculate completion percentage
    const requirementKeys = Object.keys(updatedRequirements) as Array<
      keyof AccountVerificationStatus['requirements']
    >
    const completedCount = requirementKeys.filter((key) => updatedRequirements[key]).length
    const completionPercentage = Math.round((completedCount / requirementKeys.length) * 100)

    // Determine overall status
    let overall: AccountVerificationStatus['overall'] = 'unverified'
    if (completionPercentage >= 90) {
      overall = 'verified'
    } else if (completionPercentage >= 50) {
      overall = 'partial'
    }

    // Generate next steps
    const nextSteps: string[] = []
    if (!updatedRequirements.emailVerified) nextSteps.push('Verify your email address')
    if (!updatedRequirements.phoneVerified) nextSteps.push('Verify your phone number')
    if (!updatedRequirements.identityVerified)
      nextSteps.push('Upload identity verification documents')
    if (!updatedRequirements.addressVerified) nextSteps.push('Verify your address')
    if (!updatedRequirements.bankAccountVerified && user.userType === 'landowner')
      nextSteps.push('Verify your bank account for payments')

    const updatedStatus: AccountVerificationStatus = {
      overall,
      requirements: updatedRequirements,
      completionPercentage,
      nextSteps,
      lastUpdated: new Date(),
    }

    inMemoryStore.updateUser(userId, {
      verificationStatus: updatedStatus,
    })

    return updatedStatus
  }

  // Helper methods

  private getDefaultProfile(): UserProfile {
    return {
      contactInfo: {},
      preferences: {
        language: 'id',
        timezone: 'Asia/Jakarta',
        currency: 'IDR',
        theme: 'light',
      },
      publicProfile: false,
    }
  }

  private getDefaultSettings(): UserSettings {
    return {
      notifications: {
        email: {
          transactionUpdates: true,
          marketAlerts: true,
          verificationUpdates: true,
          systemAnnouncements: true,
          marketingEmails: false,
        },
        browser: {
          priceAlerts: true,
          transactionUpdates: true,
          systemNotifications: true,
        },
        frequency: 'immediate',
      },
      privacy: {
        profileVisibility: 'public',
        showTransactionHistory: true,
        showLandHoldings: true,
        allowContactFromBuyers: true,
        dataRetentionPeriod: 24, // 24 months
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30, // 30 minutes
        loginNotifications: true,
        deviceTracking: true,
      },
    }
  }

  private getDefaultVerificationStatus(): AccountVerificationStatus {
    return {
      overall: 'unverified',
      requirements: {
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false,
        addressVerified: false,
        bankAccountVerified: false,
      },
      completionPercentage: 0,
      nextSteps: [
        'Verify your email address',
        'Verify your phone number',
        'Upload identity verification documents',
        'Verify your address',
        'Verify your bank account for payments',
      ],
      lastUpdated: new Date(),
    }
  }
}

export const userProfileService = new UserProfileService()

