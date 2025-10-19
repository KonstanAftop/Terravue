import { useState } from 'react'
import { Card, CardContent, CardActions, Typography, Box, Chip, Button, TextField, InputAdornment } from '@mui/material'
import { CheckCircle, LocationOn, Terrain, ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { TransactionConfirmation } from '../trading/TransactionConfirmation'
import { transactionService } from '../../services/transactionService'
import { useAuth } from '../../hooks/useAuth'

interface CreditListingCardProps {
  credit: any
  viewMode?: 'grid' | 'list'
}

export const CreditListingCard = ({ credit, viewMode = 'grid' }: CreditListingCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const formatLandType = (type: string) => {
    const types: Record<string, string> = {
      'primary-forest': 'Primary Forest',
      'secondary-forest': 'Secondary Forest',
      'plantation-forest': 'Plantation Forest',
      'agroforestry': 'Agroforestry',
      'degraded-land': 'Degraded Land',
      'palm-oil': 'Palm Oil',
      'rubber': 'Rubber',
      'coffee': 'Coffee',
    }
    return types[type] || type
  }

  const isGridView = viewMode === 'grid'

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirmation(true)
  }

  const handleConfirmPurchase = async (paymentMethod: string, paymentProvider?: string) => {
    await transactionService.createTransaction({
      carbonCreditId: credit.id,
      quantity,
      paymentMethod: paymentMethod as any,
      paymentProvider,
    })
    // Optionally refresh the marketplace or show success message
    alert('Transaction created successfully! Please check the status on the Transactions page.')
  }

  return (
    <>
      <Card
      sx={{
        height: isGridView ? '100%' : 'auto',
        display: 'flex',
        flexDirection: isGridView ? 'column' : 'row',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          cursor: 'pointer',
        },
      }}
      onClick={() => {
        // Navigate to credit detail (will implement later)
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        {/* Header with verification badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            {credit.landParcel?.name || 'Lahan Terdaftar'}
          </Typography>
          {credit.landParcel?.verificationStatus === 'verified' && (
            <Chip
              icon={<CheckCircle />}
              label="Verified"
              color="success"
              size="small"
            />
          )}
        </Box>

        {/* Location */}
        {credit.landParcel?.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {credit.landParcel.location}
            </Typography>
          </Box>
        )}

        {/* Land details */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Terrain sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {credit.landParcel?.area?.toFixed(1) || 0} ha
            </Typography>
          </Box>
          <Chip
            label={formatLandType(credit.landParcel?.landType || '')}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Price and quantity */}
        <Box sx={{ bgcolor: 'success.50', p: 1.5, borderRadius: 1, mb: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Price per Credit
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
            IDR {credit.pricePerCredit?.toLocaleString('en-US') || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {credit.quantity?.toLocaleString('en-US') || 0} credits available
          </Typography>
        </Box>

        {/* Seller info */}
        {credit.seller && (
          <Typography variant="caption" color="text.secondary">
            Seller: {credit.seller.name}
          </Typography>
        )}

        {/* Description preview */}
        {credit.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {credit.description}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2, flexDirection: isGridView ? 'column' : 'row', gap: 1 }}>
        <TextField
          type="number"
          size="small"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(credit.quantity, parseInt(e.target.value) || 1)))}
          InputProps={{
            inputProps: { min: 1, max: credit.quantity },
            endAdornment: <InputAdornment position="end">credits</InputAdornment>,
          }}
          sx={{ width: isGridView ? '100%' : 150 }}
        />
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' }, width: isGridView ? '100%' : 'auto' }}
          onClick={handleBuy}
        >
          Buy
        </Button>
      </CardActions>
    </Card>

      <TransactionConfirmation
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        creditData={credit}
        quantity={quantity}
        onConfirm={handleConfirmPurchase}
      />
    </>
  )
}

