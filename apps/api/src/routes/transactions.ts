import { Router } from 'express'
import { transactionService } from '../services/transactionService.js'
import { authenticate } from '../middleware/auth.js'

export const transactionsRouter = Router()

// All routes require authentication
transactionsRouter.use(authenticate)

// POST /api/v1/transactions - Create new transaction (purchase credits)
transactionsRouter.post('/', async (req, res) => {
  try {
    const userId = req.user!.userId
    const { carbonCreditId, quantity, paymentMethod, paymentProvider } = req.body

    if (!carbonCreditId || !quantity || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: carbonCreditId, quantity, paymentMethod',
      })
    }

    const transaction = await transactionService.createTransaction(userId, {
      carbonCreditId,
      quantity,
      paymentMethod,
      paymentProvider,
    })

    res.status(201).json({
      success: true,
      data: transaction,
    })
  } catch (error: any) {
    console.error('Error creating transaction:', error)
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create transaction',
    })
  }
})

// GET /api/v1/transactions - Get user's transactions
transactionsRouter.get('/', (req, res) => {
  try {
    const userId = req.user!.userId
    const { type } = req.query // 'purchases' or 'sales'

    let transactions
    if (type === 'purchases') {
      transactions = transactionService.getBuyerTransactions(userId)
    } else if (type === 'sales') {
      transactions = transactionService.getSellerTransactions(userId)
    } else {
      transactions = transactionService.getUserTransactions(userId)
    }

    res.json({
      success: true,
      data: transactions,
    })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transactions',
    })
  }
})

// GET /api/v1/transactions/stats - Get user's transaction statistics
transactionsRouter.get('/stats', (req, res) => {
  try {
    const userId = req.user!.userId
    const stats = transactionService.getUserTransactionStats(userId)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error('Error fetching transaction stats:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transaction statistics',
    })
  }
})

// GET /api/v1/transactions/:id - Get specific transaction details
transactionsRouter.get('/:id', (req, res) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params

    const transaction = transactionService.getTransaction(id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      })
    }

    // Verify user has access to this transaction
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      })
    }

    res.json({
      success: true,
      data: transaction,
    })
  } catch (error: any) {
    console.error('Error fetching transaction:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transaction details',
    })
  }
})


