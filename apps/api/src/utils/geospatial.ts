import { GeoCoordinate } from '@terravue/shared'

// Indonesian territory bounds
const INDONESIA_BOUNDS = {
  minLat: -11.0,
  maxLat: 6.0,
  minLng: 95.0,
  maxLng: 141.0,
}

/**
 * Validate if coordinates are within Indonesian territory
 */
export function validateIndonesianTerritory(coordinates: GeoCoordinate[]): boolean {
  if (!coordinates || coordinates.length === 0) {
    return false
  }

  return coordinates.every(
    (coord) =>
      coord.lat >= INDONESIA_BOUNDS.minLat &&
      coord.lat <= INDONESIA_BOUNDS.maxLat &&
      coord.lng >= INDONESIA_BOUNDS.minLng &&
      coord.lng <= INDONESIA_BOUNDS.maxLng
  )
}

/**
 * Calculate polygon area using Shoelace formula
 * Returns area in hectares
 */
export function calculatePolygonArea(coordinates: GeoCoordinate[]): number {
  if (!coordinates || coordinates.length < 3) {
    return 0
  }

  // Convert lat/lng to approximate meters (simplified)
  // For more accuracy, would use Haversine formula
  const toMeters = (lat: number, lng: number) => ({
    x: lng * 111320 * Math.cos((lat * Math.PI) / 180),
    y: lat * 111320,
  })

  const points = coordinates.map((c) => toMeters(c.lat, c.lng))

  // Shoelace formula
  let area = 0
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length
    area += points[i].x * points[j].y
    area -= points[j].x * points[i].y
  }

  area = Math.abs(area) / 2

  // Convert square meters to hectares (1 hectare = 10,000 m²)
  return area / 10000
}

/**
 * Estimate carbon potential based on land area and type
 * Returns estimated carbon credits per year
 */
export function estimateCarbonPotential(area: number, landType: string): number {
  // Carbon absorption rates (tons CO2/hectare/year)
  const rates: Record<string, number> = {
    'Primary Forest': 15,
    'Secondary Forest': 10,
    'Plantation Forest': 8,
    'Mangrove Forest': 12,
    'Agricultural Land': 3,
    'Mixed-use Land': 5,
    'Conservation Area': 13,
  }

  const rate = rates[landType] || 5

  // Assume 1 credit = 1 ton CO2
  return Math.round(area * rate)
}

/**
 * Validate coordinate format
 */
export function validateCoordinate(coord: GeoCoordinate): boolean {
  return (
    typeof coord.lat === 'number' &&
    typeof coord.lng === 'number' &&
    coord.lat >= -90 &&
    coord.lat <= 90 &&
    coord.lng >= -180 &&
    coord.lng <= 180
  )
}

/**
 * Validate minimum polygon area
 */
export function validateMinimumArea(area: number): boolean {
  // Minimum 0.1 hectares (1000 m²)
  return area >= 0.1
}

/**
 * Get center point of polygon
 */
export function getPolygonCenter(coordinates: GeoCoordinate[]): GeoCoordinate {
  if (!coordinates || coordinates.length === 0) {
    return { lat: -2.5, lng: 118.0 } // Center of Indonesia
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  )

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  }
}

