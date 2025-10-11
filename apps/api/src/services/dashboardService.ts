import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { marketService } from './marketService.js'

interface UserSummary {
  totalLands: number
  verifiedLands: number
  pendingLands: number
  totalCredits: number
  availableCredits: number
  totalTransactions: number
  totalRevenue: number
}

interface DashboardData {
  userSummary: UserSummary
  marketSummary: {
    currentPrice: number
    priceChange: number
    volume: number
    totalCreditsAvailable: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
  }>
}

export class DashboardService {
  getUserLandSummary(userId: string): {
    totalLands: number
    verifiedLands: number
    pendingLands: number
  } {
    const userLands = inMemoryStore.getLandsByOwner(userId)

    return {
      totalLands: userLands.length,
      verifiedLands: userLands.filter((land) => land.verificationStatus === 'verified').length,
      pendingLands: userLands.filter((land) => land.verificationStatus === 'pending').length,
    }
  }

  getUserCreditSummary(userId: string): {
    totalCredits: number
    availableCredits: number
  } {
    const userLands = inMemoryStore.getLandsByOwner(userId)
    const landIds = new Set(userLands.map((land) => land.id))

    const userCredits = inMemoryStore.getAllCredits().filter((credit) => landIds.has(credit.landParcelId))

    return {
      totalCredits: userCredits.reduce((sum, credit) => sum + credit.quantity, 0),
      availableCredits: userCredits
        .filter((credit) => credit.status === 'available')
        .reduce((sum, credit) => sum + credit.quantity, 0),
    }
  }

  getUserTransactionSummary(userId: string): {
    totalTransactions: number
    totalRevenue: number
  } {
    const transactions = inMemoryStore.getTransactionsByUser(userId)

    const completedTransactions = transactions.filter((txn) => txn.status === 'completed')

    const totalRevenue = completedTransactions
      .filter((txn) => txn.sellerId === userId)
      .reduce((sum, txn) => sum + txn.totalAmount, 0)

    return {
      totalTransactions: completedTransactions.length,
      totalRevenue,
    }
  }

  getRecentActivity(userId: string): Array<{
    id: string
    type: string
    description: string
    timestamp: Date
  }> {
    const transactions = inMemoryStore.getTransactionsByUser(userId)
    const userLands = inMemoryStore.getLandsByOwner(userId)

    const activities: Array<{
      id: string
      type: string
      description: string
      timestamp: Date
    }> = []

    // Add recent transactions
    transactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .forEach((txn) => {
        const isSeller = txn.sellerId === userId
        activities.push({
          id: `txn-${txn.id}`,
          type: 'transaction',
          description: isSeller
            ? `Sold ${txn.quantity} carbon credits for IDR ${txn.totalAmount.toLocaleString()}`
            : `Purchased ${txn.quantity} carbon credits for IDR ${txn.totalAmount.toLocaleString()}`,
          timestamp: txn.createdAt,
        })
      })

    // Add recent land registrations
    userLands
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3)
      .forEach((land) => {
        activities.push({
          id: `land-${land.id}`,
          type: 'land',
          description: `Registered land parcel: ${land.name} (${land.verificationStatus})`,
          timestamp: land.createdAt,
        })
      })

    // Sort by timestamp and return top 10
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
  }

  getDashboardData(userId: string): DashboardData {
    const landSummary = this.getUserLandSummary(userId)
    const creditSummary = this.getUserCreditSummary(userId)
    const transactionSummary = this.getUserTransactionSummary(userId)
    const marketSummary = marketService.getCurrentMarketSummary()
    const recentActivity = this.getRecentActivity(userId)

    return {
      userSummary: {
        ...landSummary,
        ...creditSummary,
        ...transactionSummary,
      },
      marketSummary,
      recentActivity,
    }
  }
}

// Singleton instance
export const dashboardService = new DashboardService()

