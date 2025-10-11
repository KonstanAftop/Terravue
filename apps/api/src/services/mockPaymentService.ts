import { TransactionFees, PaymentResult, CreateTransactionRequest } from '@terravue/shared'

interface PaymentRequest {
  amount: number
  method: 'bank_transfer' | 'ewallet' | 'credit_card'
  provider?: string
}

/**
 * Mock Payment Service simulating Indonesian payment gateways
 * Supports: Bank Transfer, E-wallet (GoPay, OVO, DANA), Credit Card
 */
class MockPaymentService {
  private readonly INDONESIAN_BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Permata']
  private readonly EWALLETS = ['GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay']
  private readonly SUCCESS_RATE = 0.95 // 95% success rate

  /**
   * Process a payment with simulated delay and fees
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    console.log(`💳 Processing payment: ${paymentRequest.method} - IDR ${paymentRequest.amount.toLocaleString('id-ID')}`)

    // Simulate processing delay
    const delay = this.calculateProcessingDelay(paymentRequest.method)
    await this.simulateDelay(delay)

    // Simulate success/failure
    const isSuccess = Math.random() < this.SUCCESS_RATE

    if (isSuccess) {
      const fees = this.calculateFees(paymentRequest.amount, paymentRequest.method)
      const transactionId = this.generateTransactionId(paymentRequest.method)

      console.log(`✅ Payment successful - Transaction ID: ${transactionId}`)

      return {
        status: 'success',
        transactionId,
        fees,
        processedAt: new Date(),
      }
    } else {
      const error = this.generateRandomError()

      console.log(`❌ Payment failed - ${error.message}`)

      return {
        status: 'failed',
        errorCode: error.code,
        errorMessage: error.message,
        processedAt: new Date(),
      }
    }
  }

  /**
   * Calculate fees based on payment method and amount
   */
  calculateFees(amount: number, method: 'bank_transfer' | 'ewallet' | 'credit_card'): TransactionFees {
    let platformFee = Math.round(amount * 0.025) // 2.5% platform fee
    let paymentFee = 0

    // Payment-specific fees
    switch (method) {
      case 'bank_transfer':
        paymentFee = Math.round(amount * 0.005) + 6500 // 0.5% + IDR 6,500
        break
      case 'ewallet':
        paymentFee = Math.round(amount * 0.015) // 1.5%
        break
      case 'credit_card':
        paymentFee = Math.round(amount * 0.029) + 2000 // 2.9% + IDR 2,000
        break
    }

    // Indonesian VAT (PPN) - 11%
    const tax = Math.round(amount * 0.11)

    return {
      platformFee,
      paymentFee,
      tax,
      total: platformFee + paymentFee + tax,
    }
  }

  /**
   * Get available payment providers based on method and amount
   */
  getAvailableProviders(method: 'bank_transfer' | 'ewallet' | 'credit_card', amount: number): string[] {
    switch (method) {
      case 'bank_transfer':
        return this.INDONESIAN_BANKS
      case 'ewallet':
        // E-wallets have transaction limits
        if (amount <= 20000000) {
          // 20 million IDR limit
          return this.EWALLETS
        }
        return []
      case 'credit_card':
        // Credit cards have higher limits
        if (amount <= 50000000) {
          // 50 million IDR limit
          return ['Visa', 'Mastercard', 'JCB', 'AMEX']
        }
        return []
      default:
        return []
    }
  }

  /**
   * Get recommended payment method based on amount
   */
  getRecommendedMethod(amount: number): 'bank_transfer' | 'ewallet' | 'credit_card' {
    if (amount < 5000000) {
      // < 5 million: recommend e-wallet (instant, low fees)
      return 'ewallet'
    } else if (amount < 20000000) {
      // 5-20 million: recommend credit card (instant, moderate fees)
      return 'credit_card'
    } else {
      // > 20 million: recommend bank transfer (no limits, low fees)
      return 'bank_transfer'
    }
  }

  private calculateProcessingDelay(method: 'bank_transfer' | 'ewallet' | 'credit_card'): number {
    const delays = {
      bank_transfer: 5000, // 5 seconds
      ewallet: 2000, // 2 seconds (instant)
      credit_card: 3000, // 3 seconds
    }
    return delays[method] || 3000
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private generateTransactionId(method: string): string {
    const prefix = {
      bank_transfer: 'BT',
      ewallet: 'EW',
      credit_card: 'CC',
    }[method] || 'TX'

    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()

    return `${prefix}-${timestamp}-${random}`
  }

  private generateRandomError(): { code: string; message: string } {
    const errors = [
      { code: 'INSUFFICIENT_FUNDS', message: 'Saldo tidak mencukupi' },
      { code: 'CARD_DECLINED', message: 'Kartu ditolak oleh bank' },
      { code: 'TRANSACTION_TIMEOUT', message: 'Transaksi timeout, silakan coba lagi' },
      { code: 'INVALID_ACCOUNT', message: 'Nomor rekening tidak valid' },
      { code: 'NETWORK_ERROR', message: 'Gangguan jaringan, silakan coba lagi' },
      { code: 'LIMIT_EXCEEDED', message: 'Transaksi melebihi batas harian' },
    ]

    return errors[Math.floor(Math.random() * errors.length)]
  }
}

export const mockPaymentService = new MockPaymentService()


