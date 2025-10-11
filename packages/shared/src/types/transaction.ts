export interface Transaction {
  id: string
  buyerId: string
  sellerId: string
  carbonCreditId: string
  quantity: number
  pricePerCredit: number
  totalAmount: number // IDR
  status: 'initiated' | 'payment_pending' | 'payment_processing' | 'payment_confirmed' | 'completed' | 'failed' | 'refunded'
  createdAt: Date
  completedAt?: Date
  paymentDetails?: {
    method: 'bank_transfer' | 'ewallet' | 'credit_card'
    provider: string
    transactionId: string
    fees: TransactionFees
  }
  disputeInfo?: {
    status: 'none' | 'filed' | 'in_progress' | 'resolved'
    filedAt?: Date
    reason?: string
    resolution?: string
  }
}

export interface TransactionFees {
  platformFee: number // IDR
  paymentFee: number // IDR
  tax: number // IDR (Indonesian VAT)
  total: number // IDR
}

export interface CreateTransactionRequest {
  carbonCreditId: string
  quantity: number
  paymentMethod: 'bank_transfer' | 'ewallet' | 'credit_card'
  paymentProvider?: string
}

export interface PaymentResult {
  status: 'success' | 'failed'
  transactionId?: string
  fees?: TransactionFees
  errorCode?: string
  errorMessage?: string
  processedAt: Date
}

export interface RefundRequest {
  transactionId: string
  amount?: number // partial refund if specified
  reason: string
}
