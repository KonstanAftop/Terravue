import { api } from './api'
import { Transaction, CreateTransactionRequest } from '@terravue/shared'

class TransactionService {
  /**
   * Create a new transaction (purchase credits)
   */
  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const response = await api.post<{ success: boolean; data: Transaction }>('/transactions', request)
    if (response.data.success) {
      return response.data.data
    }
    throw new Error('Failed to create transaction')
  }

  /**
   * Get all user transactions
   */
  async getUserTransactions(type?: 'purchases' | 'sales'): Promise<Transaction[]> {
    const params = type ? `?type=${type}` : ''
    const response = await api.get<{ success: boolean; data: Transaction[] }>(`/transactions${params}`)
    if (response.data.success) {
      return response.data.data
    }
    throw new Error('Failed to fetch transactions')
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`)
    if (response.data.success) {
      return response.data.data
    }
    throw new Error('Failed to fetch transaction')
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<{
    totalTransactions: number
    totalPurchases: number
    totalSales: number
    totalSpent: number
    totalEarned: number
    successRate: number
  }> {
    const response = await api.get<{
      success: boolean
      data: {
        totalTransactions: number
        totalPurchases: number
        totalSales: number
        totalSpent: number
        totalEarned: number
        successRate: number
      }
    }>('/transactions/stats')
    if (response.data.success) {
      return response.data.data
    }
    throw new Error('Failed to fetch transaction statistics')
  }
}

export const transactionService = new TransactionService()


