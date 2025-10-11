import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { AppLayout } from '../components/layout/AppLayout'
import { transactionService } from '../services/transactionService'
import { Transaction } from '@terravue/shared'

export const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'purchases' | 'sales'>('all')

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const type = filter === 'all' ? undefined : filter
      const data = await transactionService.getUserTransactions(type)
      setTransactions(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat riwayat transaksi')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'payment_confirmed':
      case 'payment_processing':
        return 'info'
      case 'payment_pending':
      case 'initiated':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      initiated: 'Diinisiasi',
      payment_pending: 'Menunggu Pembayaran',
      payment_processing: 'Memproses Pembayaran',
      payment_confirmed: 'Pembayaran Dikonfirmasi',
      completed: 'Selesai',
      failed: 'Gagal',
      refunded: 'Dikembalikan',
    }
    return labels[status] || status
  }

  return (
    <AppLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Riwayat Transaksi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola dan lihat semua transaksi Anda
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
            size="small"
          >
            <ToggleButton value="all">Semua</ToggleButton>
            <ToggleButton value="purchases">Pembelian</ToggleButton>
            <ToggleButton value="sales">Penjualan</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Belum ada transaksi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transaksi Anda akan muncul di sini
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Transaksi</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Jumlah Kredit</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Metode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {transaction.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(transaction.createdAt).toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{transaction.quantity} kredit</Typography>
                      <Typography variant="caption" color="text.secondary">
                        @ Rp {transaction.pricePerCredit.toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Rp {transaction.totalAmount.toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusLabel(transaction.status)} color={getStatusColor(transaction.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {transaction.paymentDetails
                          ? `${transaction.paymentDetails.method} (${transaction.paymentDetails.provider})`
                          : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  )
}


