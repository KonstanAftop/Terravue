import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material'
import { formatCurrency, formatNumber } from '@terravue/shared'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface Transaction {
  id: string
  quantity: number
  pricePerCredit: number
  totalAmount: number
  timestamp: Date
  region: string
}

interface TransactionFeedProps {
  transactions: Transaction[]
}

const TransactionFeed: React.FC<TransactionFeedProps> = ({ transactions }) => {
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getTransactionSize = (totalAmount: number) => {
    if (totalAmount > 10000000) return { label: 'Large', color: 'error' as const }
    if (totalAmount > 5000000) return { label: 'Medium', color: 'warning' as const }
    return { label: 'Small', color: 'success' as const }
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recent Transactions
          </Typography>
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No recent transactions</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <SwapHorizIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Recent Transactions
          </Typography>
          <Chip label={`${transactions.length} trades`} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Live feed of anonymized market transactions
        </Typography>

        <List sx={{ maxHeight: 500, overflow: 'auto' }}>
          {transactions.map((transaction, index) => {
            const sizeInfo = getTransactionSize(transaction.totalAmount)

            return (
              <React.Fragment key={transaction.id}>
                <ListItem
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="body2" fontWeight="bold">
                          {formatNumber(transaction.quantity)} credits
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(transaction.pricePerCredit)}
                        </Typography>
                        <Chip label={sizeInfo.label} color={sizeInfo.color} size="small" />
                        <Chip label={transaction.region} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon fontSize="small" sx={{ fontSize: 14 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(transaction.timestamp)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" fontWeight="bold">
                          Total: {formatCurrency(transaction.totalAmount)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            )
          })}
        </List>

        {/* Summary */}
        <Box mt={2} p={2} bgcolor="background.default" borderRadius={1}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Transaction Summary
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            <Box>
              <Typography variant="body2">
                <strong>Total Volume:</strong>{' '}
                {formatNumber(transactions.reduce((sum, t) => sum + t.quantity, 0))} credits
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                <strong>Total Value:</strong>{' '}
                {formatCurrency(transactions.reduce((sum, t) => sum + t.totalAmount, 0))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                <strong>Avg Size:</strong>{' '}
                {formatNumber(
                  Math.round(
                    transactions.reduce((sum, t) => sum + t.quantity, 0) / transactions.length,
                  ),
                )}{' '}
                credits
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TransactionFeed

