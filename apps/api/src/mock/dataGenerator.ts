import { User, LandParcel, CarbonCredit, Transaction } from '@terravue/shared'
import { GeoCoordinate } from '@terravue/shared'

// Indonesian names for realistic mock data
const indonesianFirstNames = [
  'Budi', 'Sari', 'Andi', 'Dewi', 'Agus', 'Fitri', 'Hendra', 'Lestari',
  'Joko', 'Ratna', 'Wayan', 'Kadek', 'Made', 'Nyoman', 'Putu', 'Ketut'
]

const indonesianLastNames = [
  'Santoso', 'Kusuma', 'Wijaya', 'Pratama', 'Setiawan', 'Wahyudi',
  'Nugroho', 'Gunawan', 'Hartono', 'Susanto', 'Wibowo', 'Permana'
]

const indonesianProvinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi',
  'Sumatera Selatan', 'Kalimantan Timur', 'Kalimantan Tengah',
  'Papua', 'Papua Barat', 'Sulawesi Utara', 'Sulawesi Tengah'
]

// Generate random Indonesian coordinate
export const generateIndonesianCoordinate = (): GeoCoordinate => {
  // Indonesia bounds: lat -11 to 6, lng 95 to 141
  return {
    lat: -11 + Math.random() * 17, // -11 to 6
    lng: 95 + Math.random() * 46, // 95 to 141
  }
}

// Generate random Indonesian name
export const generateIndonesianName = (): string => {
  const firstName = indonesianFirstNames[Math.floor(Math.random() * indonesianFirstNames.length)]
  const lastName = indonesianLastNames[Math.floor(Math.random() * indonesianLastNames.length)]
  return `${firstName} ${lastName}`
}

// Generate mock users
export const generateMockUsers = (count: number): User[] => {
  const users: User[] = []
  
  // Add test users with known credentials (password: "password123")
  // Password hash for "password123" using bcrypt with salt rounds 10
  const testPasswordHash = '$2b$10$qgX32x0fFOa0B0BCWMOZ..RDcpw62f7wrmDck3lmuFEJMsVfmdMpa'
  
  users.push({
    id: 'user-test-landowner',
    email: 'john@example.com',
    password: testPasswordHash,
    fullName: 'John Doe',
    userType: 'landowner',
    createdAt: new Date('2024-01-01'),
  })
  
  users.push({
    id: 'user-test-buyer',
    email: 'buyer@example.com',
    password: testPasswordHash,
    fullName: 'Jane Smith',
    userType: 'buyer',
    createdAt: new Date('2024-01-01'),
  })
  
  // Generate random users
  for (let i = 0; i < count; i++) {
    const name = generateIndonesianName()
    const userType = Math.random() > 0.5 ? 'landowner' : 'buyer'
    
    users.push({
      id: `user-${i + 1}`,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      password: '$2b$10$dummyHashedPassword', // Mock hashed password
      fullName: name,
      userType,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    })
  }
  
  return users
}

// Generate mock land parcels
export const generateMockLandParcels = (count: number, users: User[]): LandParcel[] => {
  const landTypes: Array<LandParcel['landType']> = [
    'primary-forest',
    'secondary-forest',
    'plantation-forest',
    'agroforestry',
    'degraded-land',
  ]
  
  const landowners = users.filter(u => u.userType === 'landowner')
  const lands: LandParcel[] = []
  
  for (let i = 0; i < count; i++) {
    const owner = landowners[Math.floor(Math.random() * landowners.length)]
    const landType = landTypes[Math.floor(Math.random() * landTypes.length)]
    const area = 10 + Math.random() * 490 // 10-500 hectares
    const province = indonesianProvinces[Math.floor(Math.random() * indonesianProvinces.length)]
    
    // Generate polygon coordinates
    const center = generateIndonesianCoordinate()
    const coordinates: GeoCoordinate[] = []
    for (let j = 0; j < 4; j++) {
      coordinates.push({
        lat: center.lat + (Math.random() - 0.5) * 0.1,
        lng: center.lng + (Math.random() - 0.5) * 0.1,
      })
    }
    
    // Calculate carbon potential based on area and land type
    const carbonFactors = {
      'primary-forest': 15,
      'secondary-forest': 10,
      'plantation-forest': 8,
      'agroforestry': 5,
      'degraded-land': 3,
    }
    const carbonPotential = Math.round(area * carbonFactors[landType])
    
    const verificationStatus = Math.random() > 0.3 ? 'verified' : 'pending'
    
    lands.push({
      id: `land-${i + 1}`,
      ownerId: owner.id,
      name: `${landType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - ${province}`,
      coordinates,
      area,
      landType,
      verificationStatus,
      carbonPotential,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    })
  }
  
  return lands
}

// Generate mock carbon credits
export const generateMockCarbonCredits = (lands: LandParcel[]): CarbonCredit[] => {
  const credits: CarbonCredit[] = []
  const verifiedLands = lands.filter(l => l.verificationStatus === 'verified')
  
  // Only 30% of verified lands have listed credits
  const landsWithCredits = verifiedLands.slice(0, Math.floor(verifiedLands.length * 0.3))
  
  landsWithCredits.forEach((land, i) => {
    const basePrice = 75000 // IDR per credit
    const priceVariation = 0.8 + Math.random() * 0.4 // 80% to 120% of base
    const quantity = Math.floor(land.carbonPotential * (0.5 + Math.random() * 0.5))
    
    credits.push({
      id: `credit-${i + 1}`,
      landParcelId: land.id,
      quantity,
      pricePerCredit: Math.round(basePrice * priceVariation),
      status: Math.random() > 0.2 ? 'available' : 'sold',
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      description: `Carbon credits from ${land.name}`,
    })
  })
  
  return credits
}

// Generate mock transactions
export const generateMockTransactions = (
  users: User[],
  credits: CarbonCredit[]
): Transaction[] => {
  const transactions: Transaction[] = []
  const buyers = users.filter(u => u.userType === 'buyer')
  const soldCredits = credits.filter(c => c.status === 'sold')
  
  soldCredits.forEach((credit, i) => {
    const buyer = buyers[Math.floor(Math.random() * buyers.length)]
    const quantity = Math.floor(credit.quantity * (0.1 + Math.random() * 0.9))
    const totalAmount = quantity * credit.pricePerCredit
    
    transactions.push({
      id: `txn-${i + 1}`,
      buyerId: buyer.id,
      sellerId: `seller-${i}`, // Would lookup from land parcel owner
      carbonCreditId: credit.id,
      quantity,
      totalAmount,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
      paymentMethod: ['bank_transfer', 'ewallet', 'credit_card'][Math.floor(Math.random() * 3)] as any,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      completedAt: Math.random() > 0.1 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
    })
  })
  
  return transactions
}

// Initialize all mock data
export const initializeMockData = () => {
  const users = generateMockUsers(50)
  const lands = generateMockLandParcels(100, users)
  const credits = generateMockCarbonCredits(lands)
  const transactions = generateMockTransactions(users, credits)
  
  console.log('✓ Mock data initialized:')
  console.log(`  - Users: ${users.length}`)
  console.log(`  - Land Parcels: ${lands.length}`)
  console.log(`  - Carbon Credits: ${credits.length}`)
  console.log(`  - Transactions: ${transactions.length}`)
  
  return {
    users,
    lands,
    credits,
    transactions,
  }
}


