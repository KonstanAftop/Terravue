import { User, LandParcel, CarbonCredit, Transaction, LandActivity, VerificationProgress } from '@terravue/shared'
import { initializeMockData } from '../mock/dataGenerator.js'

// In-memory data storage using Maps for O(1) lookups
class InMemoryStore {
  private users: Map<string, User> = new Map()
  private lands: Map<string, LandParcel> = new Map()
  private credits: Map<string, CarbonCredit> = new Map()
  private transactions: Map<string, Transaction> = new Map()
  private activities: Map<string, LandActivity> = new Map()
  private verificationProgress: Map<string, VerificationProgress> = new Map()
  
  private initialized = false
  
  initialize() {
    if (this.initialized) {
      console.log('⚠ In-memory store already initialized')
      return
    }
    
    const mockData = initializeMockData()
    
    // Populate users
    mockData.users.forEach(user => {
      this.users.set(user.id, user)
    })
    
    // Populate lands
    mockData.lands.forEach(land => {
      this.lands.set(land.id, land)
    })
    
    // Populate credits
    mockData.credits.forEach(credit => {
      this.credits.set(credit.id, credit)
    })
    
    // Populate transactions
    mockData.transactions.forEach(txn => {
      this.transactions.set(txn.id, txn)
    })
    
    this.initialized = true
  }
  
  // User operations
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }
  
  getUser(id: string): User | undefined {
    return this.users.get(id)
  }
  
  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email)
  }
  
  addUser(user: User): void {
    this.users.set(user.id, user)
  }
  
  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (user) {
      const updated = { ...user, ...updates }
      this.users.set(id, updated)
      return updated
    }
    return undefined
  }
  
  // Land operations
  getAllLands(): LandParcel[] {
    return Array.from(this.lands.values())
  }
  
  getLand(id: string): LandParcel | undefined {
    return this.lands.get(id)
  }
  
  getLandsByOwner(ownerId: string): LandParcel[] {
    return Array.from(this.lands.values()).filter(l => l.ownerId === ownerId)
  }
  
  addLand(land: LandParcel): void {
    this.lands.set(land.id, land)
  }
  
  updateLand(id: string, updates: Partial<LandParcel>): LandParcel | undefined {
    const land = this.lands.get(id)
    if (land) {
      const updated = { ...land, ...updates, updatedAt: new Date() }
      this.lands.set(id, updated)
      return updated
    }
    return undefined
  }
  
  // Credit operations
  getAllCredits(): CarbonCredit[] {
    return Array.from(this.credits.values())
  }
  
  getCredit(id: string): CarbonCredit | undefined {
    return this.credits.get(id)
  }
  
  getCreditsByStatus(status: CarbonCredit['status']): CarbonCredit[] {
    return Array.from(this.credits.values()).filter(c => c.status === status)
  }
  
  addCredit(credit: CarbonCredit): void {
    this.credits.set(credit.id, credit)
  }
  
  updateCredit(id: string, updates: Partial<CarbonCredit>): CarbonCredit | undefined {
    const credit = this.credits.get(id)
    if (credit) {
      const updated = { ...credit, ...updates }
      this.credits.set(id, updated)
      return updated
    }
    return undefined
  }
  
  // Transaction operations
  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
  }
  
  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id)
  }
  
  getTransactionsByUser(userId: string): Transaction[] {
    return Array.from(this.transactions.values()).filter(
      t => t.buyerId === userId || t.sellerId === userId
    )
  }
  
  addTransaction(transaction: Transaction): void {
    this.transactions.set(transaction.id, transaction)
  }
  
  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
    const transaction = this.transactions.get(id)
    if (transaction) {
      const updated = { ...transaction, ...updates }
      this.transactions.set(id, updated)
      return updated
    }
    return undefined
  }
  
  // Activity operations
  getAllActivities(): LandActivity[] {
    return Array.from(this.activities.values())
  }
  
  getActivity(id: string): LandActivity | undefined {
    return this.activities.get(id)
  }
  
  getActivitiesByLandParcel(landParcelId: string): LandActivity[] {
    return Array.from(this.activities.values())
      .filter(a => a.landParcelId === landParcelId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  
  addActivity(activity: LandActivity): void {
    this.activities.set(activity.id, activity)
  }
  
  // Verification Progress operations
  getVerificationProgress(landParcelId: string): VerificationProgress | undefined {
    return this.verificationProgress.get(landParcelId)
  }
  
  setVerificationProgress(progress: VerificationProgress): void {
    this.verificationProgress.set(progress.landParcelId, progress)
  }
  
  updateVerificationProgress(landParcelId: string, updates: Partial<VerificationProgress>): VerificationProgress | undefined {
    const progress = this.verificationProgress.get(landParcelId)
    if (progress) {
      const updated = { ...progress, ...updates }
      this.verificationProgress.set(landParcelId, updated)
      return updated
    }
    return undefined
  }
  
  // Utility methods
  reset(): void {
    this.users.clear()
    this.lands.clear()
    this.credits.clear()
    this.transactions.clear()
    this.activities.clear()
    this.verificationProgress.clear()
    this.initialized = false
    this.initialize()
  }
  
  getStats() {
    return {
      users: this.users.size,
      lands: this.lands.size,
      credits: this.credits.size,
      transactions: this.transactions.size,
      activities: this.activities.size,
    }
  }
}

// Singleton instance
export const inMemoryStore = new InMemoryStore()


