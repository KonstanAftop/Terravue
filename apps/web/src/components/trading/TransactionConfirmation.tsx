import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import { CheckCircle, Payment, AccountBalance, CreditCard } from '@mui/icons-material'

interface TransactionConfirmationProps {
  open: boolean
  onClose: () => void
  creditData: any
  quantity: number
  onConfirm: (paymentMethod: string, paymentProvider?: string) => Promise<void>
}

const PAYMENT_METHODS = [
  {
    value: 'ewallet',
    label: 'E-Wallet',
    icon: <Payment />,
    providers: ['GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay'],
    description: 'Instant, IDR 0-20M',
  },
  {
    value: 'credit_card',
    label: 'Credit Card',
    icon: <CreditCard />,
    providers: ['Visa', 'Mastercard', 'JCB', 'AMEX'],
    description: 'Instant, IDR 0-50M',
  },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    icon: <AccountBalance />,
    providers: ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Permata'],
    description: '1-3 business days, unlimited',
  },
]

export const TransactionConfirmation = ({
  open,
  onClose,
  creditData,
  quantity,
  onConfirm,
}: TransactionConfirmationProps) => {
  const [paymentMethod, setPaymentMethod] = useState('ewallet')
  const [paymentProvider, setPaymentProvider] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = creditData.pricePerCredit * quantity
  const platformFee = Math.round(subtotal * 0.025) // 2.5%
  let paymentFee = 0

  switch (paymentMethod) {
    case 'bank_transfer':
      paymentFee = Math.round(subtotal * 0.005) + 6500
      break
    case 'ewallet':
      paymentFee = Math.round(subtotal * 0.015)
      break
    case 'credit_card':
      paymentFee = Math.round(subtotal * 0.029) + 2000
      break
  }

  const tax = Math.round(subtotal * 0.11) // 11% VAT
  const totalAmount = subtotal + platformFee + paymentFee + tax

  const selectedMethod = PAYMENT_METHODS.find((m) => m.value === paymentMethod)

  const handleConfirm = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      await onConfirm(paymentMethod, paymentProvider || selectedMethod?.providers[0])
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          <Typography variant="h6">Confirm Purchase</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Credit Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Carbon Credit Details
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Land:</strong> {creditData.landParcel?.name || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Land Type:</strong> {creditData.landParcel?.landType || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Quantity:</strong> {quantity} credits
            </Typography>
            <Typography variant="body2">
              <strong>Price per Credit:</strong> IDR {creditData.pricePerCredit?.toLocaleString('en-US')}
            </Typography>
          </Box>
        </Box>

        {/* Payment Method Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Payment Method
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map((method) => (
                <Box
                  key={method.value}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid',
                    borderColor: paymentMethod === method.value ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.light' },
                  }}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <FormControlLabel
                    value={method.value}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {method.icon}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {method.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {paymentMethod === method.value && (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Choose Provider"
                      value={paymentProvider || method.providers[0]}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                      sx={{ mt: 1, ml: 4 }}
                    >
                      {method.providers.map((provider) => (
                        <MenuItem key={provider} value={provider}>
                          {provider}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Cost Breakdown */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Cost Breakdown
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">IDR {subtotal.toLocaleString('en-US')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Platform Fee (2.5%)</Typography>
              <Typography variant="body2">IDR {platformFee.toLocaleString('en-US')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Payment Fee</Typography>
              <Typography variant="body2">IDR {paymentFee.toLocaleString('en-US')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Tax (VAT 11%)</Typography>
              <Typography variant="body2">IDR {tax.toLocaleString('en-US')}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                IDR {totalAmount.toLocaleString('en-US')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Terms */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          By continuing, you agree to Terravue&apos;s terms and conditions. Carbon credits will be transferred to your portfolio within 24 hours after payment confirmation.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isProcessing}
          sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
        >
          {isProcessing ? <CircularProgress size={24} /> : `Pay IDR ${totalAmount.toLocaleString('en-US')}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

