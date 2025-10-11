export const USER_TYPES = {
  LANDOWNER: 'landowner' as const,
  BUYER: 'buyer' as const,
}

export const VERIFICATION_STATUS = {
  PENDING: 'pending' as const,
  VERIFIED: 'verified' as const,
  REJECTED: 'rejected' as const,
}

export const LAND_TYPES = {
  PRIMARY_FOREST: 'primary-forest' as const,
  SECONDARY_FOREST: 'secondary-forest' as const,
  PLANTATION_FOREST: 'plantation-forest' as const,
  AGROFORESTRY: 'agroforestry' as const,
  DEGRADED_LAND: 'degraded-land' as const,
}

export const CARBON_CALCULATION_FACTORS = {
  'primary-forest': 15,
  'secondary-forest': 10,
  'plantation-forest': 8,
  'agroforestry': 5,
  'degraded-land': 3,
} as const


