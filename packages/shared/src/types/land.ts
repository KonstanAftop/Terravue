import { GeoCoordinate } from './common.js'

export type VerificationStatus = 'pending' | 'verified' | 'rejected'
export type LandType = 'primary-forest' | 'secondary-forest' | 'plantation-forest' | 'agroforestry' | 'degraded-land'

export interface LandParcel {
  id: string
  ownerId: string
  name: string
  coordinates: GeoCoordinate[]
  area: number // hectares
  landType: LandType
  verificationStatus: VerificationStatus
  carbonPotential: number // credits per year
  createdAt: Date
  updatedAt: Date
}


