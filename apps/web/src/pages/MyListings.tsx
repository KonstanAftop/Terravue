import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Add, Refresh } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useCreditListingStore } from '../stores/creditListingStore'
import { CarbonCredit } from '@terravue/shared'

export const MyListingsPage = () => {
  const navigate = useNavigate()
  const { myListings, loading, error, fetchMyListings } = useCreditListingStore()

  useEffect(() => {
    fetchMyListings()
  }, [fetchMyListings])

  const getStatusColor = (status: CarbonCredit['status']) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'reserved':
        return 'warning'
      case 'sold':
        return 'default'
      default:
        return 'error'
    }
  }

  const getStatusLabel = (status: CarbonCredit['status']) => {
    switch (status) {
      case 'available':
        return 'Tersedia'
      case 'reserved':
        return 'Dipesan'
      case 'sold':
        return 'Terjual'
      default:
        return 'Kadaluarsa'
    }
  }

  const isExpired = (validUntil: Date) => {
    return new Date(validUntil) <= new Date()
  }

  if (loading && myListings.length === 0) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Listing Kredit Karbon Saya
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola listing kredit karbon yang telah Anda buat
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Refresh />}
              onClick={fetchMyListings}
              variant="outlined"
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              startIcon={<Add />}
              onClick={() => navigate('/create-listing')}
              variant="contained"
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Buat Listing Baru
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {myListings.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Belum Ada Listing
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Anda belum membuat listing kredit karbon. Mulai dengan membuat listing pertama Anda.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-listing')}
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Buat Listing Pertama
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Listing</TableCell>
                  <TableCell>ID Lahan</TableCell>
                  <TableCell align="right">Jumlah</TableCell>
                  <TableCell align="right">Harga/Kredit</TableCell>
                  <TableCell align="right">Total Nilai</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Berlaku Hingga</TableCell>
                  <TableCell align="right">Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myListings.map((listing) => {
                  const expired = isExpired(listing.validUntil)
                  const totalValue = listing.quantity * listing.pricePerCredit

                  return (
                    <TableRow
                      key={listing.id}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                        opacity: expired ? 0.6 : 1,
                      }}
                      onClick={() => {
                        // Navigate to listing detail or edit page
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {listing.id.substring(0, 12)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {listing.landParcelId.substring(0, 12)}...
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {listing.quantity.toLocaleString('id-ID')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          Rp {listing.pricePerCredit.toLocaleString('id-ID')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Rp {totalValue.toLocaleString('id-ID')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={expired ? 'Kadaluarsa' : getStatusLabel(listing.status)}
                          color={expired ? 'error' : getStatusColor(listing.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={expired ? 'error.main' : 'text.primary'}>
                          {new Date(listing.validUntil).toLocaleDateString('id-ID')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" color="text.secondary">
                          {new Date(listing.createdAt).toLocaleDateString('id-ID')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  )
}

