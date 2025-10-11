export interface UserProfile {
  profilePicture?: string
  bio?: string
  contactInfo: {
    phone?: string
    website?: string
    address?: {
      street?: string
      city?: string
      province?: string
      country?: string
      postalCode?: string
    }
  }
  socialMedia?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  preferences: {
    language: 'en' | 'id'
    timezone: string
    currency: 'IDR' | 'USD'
    theme: 'light' | 'dark' | 'auto'
  }
  publicProfile: boolean
}

export interface UserSettings {
  notifications: {
    email: {
      transactionUpdates: boolean
      marketAlerts: boolean
      verificationUpdates: boolean
      systemAnnouncements: boolean
      marketingEmails: boolean
    }
    browser: {
      priceAlerts: boolean
      transactionUpdates: boolean
      systemNotifications: boolean
    }
    frequency: 'immediate' | 'daily' | 'weekly'
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts'
    showTransactionHistory: boolean
    showLandHoldings: boolean
    allowContactFromBuyers: boolean
    dataRetentionPeriod: number // months
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number // minutes
    loginNotifications: boolean
    deviceTracking: boolean
  }
}

export interface AccountVerificationStatus {
  overall: 'unverified' | 'partial' | 'verified'
  requirements: {
    emailVerified: boolean
    phoneVerified: boolean
    identityVerified: boolean
    addressVerified: boolean
    bankAccountVerified: boolean // for sellers
  }
  completionPercentage: number
  nextSteps: string[]
  lastUpdated: Date
}

export type ActivityType =
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'settings_change'
  | 'land_registration'
  | 'land_update'
  | 'land_verification'
  | 'credit_listing'
  | 'credit_purchase'
  | 'credit_sale'
  | 'transaction_initiated'
  | 'transaction_completed'
  | 'transaction_failed'
  | 'document_upload'
  | 'document_download'
  | 'data_export'
  | 'search_performed'
  | 'filter_applied'
  | 'map_interaction'

export interface UserActivity {
  id: string
  userId: string
  type: ActivityType
  description: string
  metadata: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  location?: {
    country?: string
    city?: string
  }
}

export interface ActivitySummary {
  totalActivities: number
  activitiesByType: Record<string, number>
  activitiesByMonth: Record<string, number>
  lastActivity: Date
  mostActiveDay: string
  averageSessionDuration: number
}

export interface UserPerformanceMetrics {
  trading: {
    totalCreditsTraded: number
    totalTransactionValue: number // IDR
    averageTransactionSize: number
    successfulTransactions: number
    failedTransactions: number
    profitLoss: number // IDR
    portfolioValue: number // IDR
    tradingFrequency: number // transactions per month
  }
  environmental: {
    totalCarbonOffset: number // tons CO2
    carbonFootprintReduction: number // percentage
    projectsSupported: number
    biodiversityImpact: string
    communityBenefits: string[]
    sustainabilityGoalProgress: number // percentage
  }
  platform: {
    accountAge: number // days
    loginFrequency: number // logins per week
    featuresUsed: string[]
    documentsUploaded: number
    verificationLevel: number // percentage
    referralsGenerated: number
  }
}

export type DataCategory =
  | 'profile'
  | 'settings'
  | 'transactions'
  | 'activities'
  | 'land_parcels'
  | 'carbon_credits'

export interface DataExportRequest {
  format: 'json' | 'csv'
  categories: DataCategory[]
  dateRange?: {
    from: Date
    to: Date
  }
  includeMetadata: boolean
}

export interface DataExportResponse {
  exportId: string
  filename: string
  data: string
  format: 'json' | 'csv'
  exportedAt: Date
}

