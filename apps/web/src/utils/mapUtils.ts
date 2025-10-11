import { GeoCoordinate } from '@terravue/shared'

/**
 * Calculate area of a polygon using the Shoelace formula
 * Returns area in hectares
 */
export function calculatePolygonArea(coordinates: GeoCoordinate[]): number {
  if (coordinates.length < 3) return 0

  // Shoelace formula
  let area = 0
  const n = coordinates.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += coordinates[i].lat * coordinates[j].lng
    area -= coordinates[j].lat * coordinates[i].lng
  }

  area = Math.abs(area) / 2

  // Convert to hectares (approximate for small areas)
  const earthRadius = 6371000 // meters
  const latRad = (coordinates[0].lat * Math.PI) / 180
  const areaInSquareMeters = area * Math.pow((earthRadius * Math.PI) / 180, 2) * Math.cos(latRad)

  return areaInSquareMeters / 10000 // convert to hectares
}

/**
 * Calculate perimeter of a polygon
 * Returns perimeter in meters
 */
export function calculatePolygonPerimeter(coordinates: GeoCoordinate[]): number {
  if (coordinates.length < 2) return 0

  let perimeter = 0
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length
    perimeter += calculateDistance(coordinates[i], coordinates[j])
  }

  return perimeter
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const R = 6371000 // Earth's radius in meters
  const lat1 = (coord1.lat * Math.PI) / 180
  const lat2 = (coord2.lat * Math.PI) / 180
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Format coordinates to different formats
 */
export function formatCoordinate(
  coord: GeoCoordinate,
  format: 'decimal' | 'dms' = 'decimal',
  precision: number = 6,
): string {
  if (format === 'decimal') {
    return `${coord.lat.toFixed(precision)}, ${coord.lng.toFixed(precision)}`
  }

  // Convert to DMS (Degrees, Minutes, Seconds)
  const latDMS = convertToDMS(coord.lat, 'lat')
  const lngDMS = convertToDMS(coord.lng, 'lng')
  return `${latDMS}, ${lngDMS}`
}

function convertToDMS(decimal: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutesDecimal = (absolute - degrees) * 60
  const minutes = Math.floor(minutesDecimal)
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2)

  const direction =
    type === 'lat' ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W'

  return `${degrees}°${minutes}'${seconds}"${direction}`
}

/**
 * Check if a polygon is closed
 */
export function isPolygonClosed(coordinates: GeoCoordinate[]): boolean {
  if (coordinates.length < 3) return false

  const first = coordinates[0]
  const last = coordinates[coordinates.length - 1]

  return Math.abs(first.lat - last.lat) < 0.0001 && Math.abs(first.lng - last.lng) < 0.0001
}

/**
 * Check if a polygon has self-intersections
 */
export function hasSelfIntersection(coordinates: GeoCoordinate[]): boolean {
  if (coordinates.length < 4) return false

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 2; j < coordinates.length - 1; j++) {
      // Skip adjacent segments
      if (Math.abs(i - j) <= 1) continue

      const seg1Start = coordinates[i]
      const seg1End = coordinates[i + 1]
      const seg2Start = coordinates[j]
      const seg2End = coordinates[j + 1]

      if (segmentsIntersect(seg1Start, seg1End, seg2Start, seg2End)) {
        return true
      }
    }
  }

  return false
}

function segmentsIntersect(
  p1: GeoCoordinate,
  p2: GeoCoordinate,
  p3: GeoCoordinate,
  p4: GeoCoordinate,
): boolean {
  const ccw = (A: GeoCoordinate, B: GeoCoordinate, C: GeoCoordinate) => {
    return (C.lng - A.lng) * (B.lat - A.lat) > (B.lng - A.lng) * (C.lat - A.lat)
  }

  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
}

/**
 * Validate boundary coordinates
 */
export interface BoundaryValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateBoundary(coordinates: GeoCoordinate[]): BoundaryValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check minimum vertices
  if (coordinates.length < 3) {
    errors.push('Polygon must have at least 3 vertices')
  }

  // Check if closed
  if (!isPolygonClosed(coordinates) && coordinates.length >= 3) {
    errors.push('Polygon must be closed (first and last points should match)')
  }

  // Check for self-intersection
  if (hasSelfIntersection(coordinates)) {
    errors.push('Polygon cannot intersect itself')
  }

  // Check area
  const area = calculatePolygonArea(coordinates)
  if (area < 0.1 && coordinates.length >= 3) {
    warnings.push('Area is very small (less than 0.1 hectares)')
  }

  if (area > 10000) {
    warnings.push('Area is very large (more than 10,000 hectares)')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Convert area to different units
 */
export function convertArea(hectares: number, unit: 'hectares' | 'acres' | 'sqm'): number {
  switch (unit) {
    case 'hectares':
      return hectares
    case 'acres':
      return hectares * 2.47105
    case 'sqm':
      return hectares * 10000
    default:
      return hectares
  }
}

