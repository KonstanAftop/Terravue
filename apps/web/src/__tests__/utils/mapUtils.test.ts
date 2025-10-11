import { describe, it, expect } from 'vitest'
import {
  calculatePolygonArea,
  calculateDistance,
  formatCoordinate,
  isPolygonClosed,
  hasSelfIntersection,
  validateBoundary,
  convertArea,
} from '../../utils/mapUtils'
import { GeoCoordinate } from '@terravue/shared'

describe('mapUtils', () => {
  describe('calculatePolygonArea', () => {
    it('should calculate area for a simple square', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0.01 },
        { lat: 0.01, lng: 0.01 },
        { lat: 0.01, lng: 0 },
        { lat: 0, lng: 0 },
      ]

      const area = calculatePolygonArea(coordinates)
      expect(area).toBeGreaterThan(0)
    })

    it('should return 0 for less than 3 vertices', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0.01 },
      ]

      const area = calculatePolygonArea(coordinates)
      expect(area).toBe(0)
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const coord1: GeoCoordinate = { lat: 0, lng: 0 }
      const coord2: GeoCoordinate = { lat: 0, lng: 0.01 }

      const distance = calculateDistance(coord1, coord2)
      expect(distance).toBeGreaterThan(0)
    })

    it('should return 0 for same points', () => {
      const coord: GeoCoordinate = { lat: 0, lng: 0 }
      const distance = calculateDistance(coord, coord)
      expect(distance).toBe(0)
    })
  })

  describe('formatCoordinate', () => {
    it('should format coordinate in decimal format', () => {
      const coord: GeoCoordinate = { lat: -6.200000, lng: 106.816666 }
      const formatted = formatCoordinate(coord, 'decimal', 6)
      expect(formatted).toBe('-6.200000, 106.816666')
    })

    it('should format coordinate in DMS format', () => {
      const coord: GeoCoordinate = { lat: -6.2, lng: 106.816666 }
      const formatted = formatCoordinate(coord, 'dms')
      expect(formatted).toContain('°')
      expect(formatted).toContain("'")
      expect(formatted).toContain('"')
    })
  })

  describe('isPolygonClosed', () => {
    it('should return true for closed polygon', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0.01 },
        { lat: 0.01, lng: 0.01 },
        { lat: 0, lng: 0 },
      ]

      expect(isPolygonClosed(coordinates)).toBe(true)
    })

    it('should return false for open polygon', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 0.01 },
        { lat: 0.01, lng: 0.01 },
      ]

      expect(isPolygonClosed(coordinates)).toBe(false)
    })
  })

  describe('validateBoundary', () => {
    it('should validate a correct polygon', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 1 },
        { lat: 1, lng: 1 },
        { lat: 1, lng: 0 },
        { lat: 0, lng: 0 },
      ]

      const result = validateBoundary(coordinates)
      expect(result.isValid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should detect insufficient vertices', () => {
      const coordinates: GeoCoordinate[] = [
        { lat: 0, lng: 0 },
        { lat: 0, lng: 1 },
      ]

      const result = validateBoundary(coordinates)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('convertArea', () => {
    it('should convert hectares to acres', () => {
      const hectares = 10
      const acres = convertArea(hectares, 'acres')
      expect(acres).toBeCloseTo(24.7105, 1)
    })

    it('should convert hectares to square meters', () => {
      const hectares = 1
      const sqm = convertArea(hectares, 'sqm')
      expect(sqm).toBe(10000)
    })

    it('should return hectares when unit is hectares', () => {
      const hectares = 5
      const result = convertArea(hectares, 'hectares')
      expect(result).toBe(5)
    })
  })
})

