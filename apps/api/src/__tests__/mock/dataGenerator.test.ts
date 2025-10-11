import { describe, it, expect } from 'vitest'
import {
  generateIndonesianCoordinate,
  generateIndonesianName,
  generateMockUsers,
  generateMockLandParcels,
  generateMockCarbonCredits,
} from '../../mock/dataGenerator.js'

describe('Mock Data Generators', () => {
  describe('generateIndonesianCoordinate', () => {
    it('should generate coordinates within Indonesian bounds', () => {
      const coord = generateIndonesianCoordinate()
      
      expect(coord.lat).toBeGreaterThanOrEqual(-11)
      expect(coord.lat).toBeLessThanOrEqual(6)
      expect(coord.lng).toBeGreaterThanOrEqual(95)
      expect(coord.lng).toBeLessThanOrEqual(141)
    })
  })
  
  describe('generateIndonesianName', () => {
    it('should generate valid Indonesian name', () => {
      const name = generateIndonesianName()
      
      expect(name).toBeTruthy()
      expect(name.split(' ')).toHaveLength(2)
    })
  })
  
  describe('generateMockUsers', () => {
    it('should generate specified number of users', () => {
      const users = generateMockUsers(10)
      
      expect(users).toHaveLength(10)
      expect(users[0]).toHaveProperty('id')
      expect(users[0]).toHaveProperty('email')
      expect(users[0]).toHaveProperty('fullName')
      expect(users[0]).toHaveProperty('userType')
    })
    
    it('should generate users with valid user types', () => {
      const users = generateMockUsers(20)
      
      users.forEach(user => {
        expect(['landowner', 'buyer']).toContain(user.userType)
      })
    })
  })
  
  describe('generateMockLandParcels', () => {
    it('should generate land parcels for landowners', () => {
      const users = generateMockUsers(20)
      const lands = generateMockLandParcels(10, users)
      
      expect(lands).toHaveLength(10)
      expect(lands[0]).toHaveProperty('id')
      expect(lands[0]).toHaveProperty('ownerId')
      expect(lands[0]).toHaveProperty('coordinates')
      expect(lands[0]).toHaveProperty('carbonPotential')
    })
    
    it('should generate valid carbon potential', () => {
      const users = generateMockUsers(20)
      const lands = generateMockLandParcels(10, users)
      
      lands.forEach(land => {
        expect(land.carbonPotential).toBeGreaterThan(0)
      })
    })
  })
  
  describe('generateMockCarbonCredits', () => {
    it('should generate credits only for verified lands', () => {
      const users = generateMockUsers(20)
      const lands = generateMockLandParcels(30, users)
      const credits = generateMockCarbonCredits(lands)
      
      expect(credits.length).toBeGreaterThan(0)
      credits.forEach(credit => {
        const land = lands.find(l => l.id === credit.landParcelId)
        expect(land).toBeDefined()
        expect(land!.verificationStatus).toBe('verified')
      })
    })
  })
})


