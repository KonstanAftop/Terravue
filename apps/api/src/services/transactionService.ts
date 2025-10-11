import { Transaction, CreateTransactionRequest } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { mockPaymentService } from './mockPaymentService.js'
import { mockEmailService } from './mockEmailService.js'

/**
 * Transaction Service - Handles complete purchase workflow
 */
class TransactionService {
  /**
   * Create a new transaction and process payment
   */
  async createTransaction(buyerId: string, request: CreateTransactionRequest): Promise<Transaction> {
    // Validate credit availability
    const credit = inMemoryStore.getCredit(request.carbonCreditId)
    if (!credit) {
      throw new Error('Credit tidak ditemukan')
    }

    if (credit.status !== 'available') {
      throw new Error('Credit tidak tersedia untuk pembelian')
    }

    if (credit.quantity < request.quantity) {
      throw new Error(`Jumlah credit tidak mencukupi. Tersedia: ${credit.quantity}`)
    }

    // Get seller from land owner
    const land = inMemoryStore.getLand(credit.landParcelId)
    if (!land) {
      throw new Error('Land parcel tidak ditemukan')
    }

    // Calculate total amount
    const subtotal = credit.pricePerCredit * request.quantity
    const fees = mockPaymentService.calculateFees(subtotal, request.paymentMethod)
    const totalAmount = subtotal + fees.total

    // Create transaction
    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      buyerId,
      sellerId: land.ownerId,
      carbonCreditId: request.carbonCreditId,
      quantity: request.quantity,
      pricePerCredit: credit.pricePerCredit,
      totalAmount,
      status: 'initiated',
      createdAt: new Date(),
    }

    inMemoryStore.addTransaction(transaction)

    console.log(`\n🔄 Transaction created: ${transaction.id}`)

    // Process payment asynchronously
    this.processPaymentAsync(transaction.id, request.paymentMethod, request.paymentProvider)

    return transaction
  }

  /**
   * Process payment asynchronously
   */
  private async processPaymentAsync(transactionId: string, paymentMethod: string, provider?: string): Promise<void> {
    try {
      // Update status to payment pending
      await this.updateTransactionStatus(transactionId, 'payment_pending')

      // Simulate user payment action (instant for simulation)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update status to payment processing
      await this.updateTransactionStatus(transactionId, 'payment_processing')

      // Process payment through mock gateway
      const transaction = inMemoryStore.getTransaction(transactionId)
      if (!transaction) {
        throw new Error('Transaction not found')
      }

      const paymentResult = await mockPaymentService.processPayment({
        amount: transaction.totalAmount,
        method: paymentMethod as any,
        provider,
      })

      if (paymentResult.status === 'success') {
        // Update transaction with payment details
        const updatedTransaction = {
          ...transaction,
          status: 'payment_confirmed' as const,
          paymentDetails: {
            method: paymentMethod as any,
            provider: provider || 'Default Provider',
            transactionId: paymentResult.transactionId!,
            fees: paymentResult.fees!,
          },
        }

        inMemoryStore.updateTransaction(transactionId, updatedTransaction)

        // Send confirmation email
        await mockEmailService.sendTransactionConfirmation(updatedTransaction)

        // Transfer credits
        await this.transferCredits(transactionId)
      } else {
        // Payment failed
        await this.updateTransactionStatus(transactionId, 'failed')
        console.error(`❌ Payment failed for transaction ${transactionId}: ${paymentResult.errorMessage}`)
      }
    } catch (error) {
      console.error(`Error processing payment for transaction ${transactionId}:`, error)
      await this.updateTransactionStatus(transactionId, 'failed')
    }
  }

  /**
   * Transfer credits to buyer upon successful payment
   */
  private async transferCredits(transactionId: string): Promise<void> {
    const transaction = inMemoryStore.getTransaction(transactionId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    if (transaction.status !== 'payment_confirmed') {
      throw new Error('Cannot transfer credits: payment not confirmed')
    }

    const credit = inMemoryStore.getCredit(transaction.carbonCreditId)
    if (!credit) {
      throw new Error('Credit not found')
    }

    // Reduce credit quantity
    const updatedCredit = {
      ...credit,
      quantity: credit.quantity - transaction.quantity,
    }

    // If all credits sold, mark as sold
    if (updatedCredit.quantity === 0) {
      updatedCredit.status = 'sold' as const
    }

    inMemoryStore.updateCredit(transaction.carbonCreditId, updatedCredit)

    // Update transaction status to completed
    const completedTransaction = {
      ...transaction,
      status: 'completed' as const,
      completedAt: new Date(),
    }

    inMemoryStore.updateTransaction(transactionId, completedTransaction)

    // Send receipt
    await mockEmailService.sendReceipt(completedTransaction)

    console.log(`✅ Credits transferred successfully for transaction ${transactionId}`)
  }

  /**
   * Update transaction status
   */
  private async updateTransactionStatus(
    transactionId: string,
    status: Transaction['status']
  ): Promise<void> {
    const transaction = inMemoryStore.getTransaction(transactionId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    const updatedTransaction = {
      ...transaction,
      status,
    }

    inMemoryStore.updateTransaction(transactionId, updatedTransaction)

    // Send status update email
    await mockEmailService.sendStatusUpdate(updatedTransaction)

    console.log(`📊 Transaction ${transactionId} status updated to: ${status}`)
  }

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): Transaction | undefined {
    return inMemoryStore.getTransaction(transactionId)
  }

  /**
   * Get all transactions for a user (as buyer or seller)
   */
  getUserTransactions(userId: string): Transaction[] {
    return inMemoryStore
      .getAllTransactions()
      .filter((t) => t.buyerId === userId || t.sellerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get buyer's purchase history
   */
  getBuyerTransactions(buyerId: string): Transaction[] {
    return inMemoryStore
      .getAllTransactions()
      .filter((t) => t.buyerId === buyerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get seller's sales history
   */
  getSellerTransactions(sellerId: string): Transaction[] {
    return inMemoryStore
      .getAllTransactions()
      .filter((t) => t.sellerId === sellerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get transaction statistics for a user
   */
  getUserTransactionStats(userId: string) {
    const transactions = this.getUserTransactions(userId)
    const purchases = transactions.filter((t) => t.buyerId === userId)
    const sales = transactions.filter((t) => t.sellerId === userId)

    return {
      totalTransactions: transactions.length,
      totalPurchases: purchases.length,
      totalSales: sales.length,
      totalSpent: purchases.reduce((sum, t) => sum + (t.status === 'completed' ? t.totalAmount : 0), 0),
      totalEarned: sales.reduce((sum, t) => sum + (t.status === 'completed' ? t.totalAmount * 0.95 : 0), 0), // 95% after platform fee
      successRate: transactions.length > 0
        ? (transactions.filter((t) => t.status === 'completed').length / transactions.length) * 100
        : 0,
    }
  }
}

export const transactionService = new TransactionService()


