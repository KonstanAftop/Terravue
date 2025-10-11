import { UserProfile, UserSettings, AccountVerificationStatus } from './userProfile.js'

export type UserType = 'landowner' | 'buyer'

export interface User {
  id: string
  email: string
  password: string // hashed
  fullName: string
  userType: UserType
  createdAt: Date
  lastLogin?: Date
  profile?: UserProfile
  settings?: UserSettings
  verificationStatus?: AccountVerificationStatus
}


