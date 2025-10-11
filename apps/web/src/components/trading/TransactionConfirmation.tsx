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
    description: 'Instant, IDR 0-20 juta',
  },
  {
    value: 'credit_card',
    label: 'Kartu Kredit',
    icon: <CreditCard />,
    providers: ['Visa', 'Mastercard', 'JCB', 'AMEX'],
    description: 'Instant, IDR 0-50 juta',
  },
  {
    value: 'bank_transfer',
    label: 'Transfer Bank',
    icon: <AccountBalance />,
    providers: ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Permata'],
    description: '1-3 hari kerja, unlimited',
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
      setError(err.message || 'Gagal memproses transaksi')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          <Typography variant="h6">Konfirmasi Pembelian</Typography>
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
            Detail Kredit Karbon
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Lahan:</strong> {creditData.landParcel?.name || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Jenis Lahan:</strong> {creditData.landParcel?.landType || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Jumlah:</strong> {quantity} kredit
            </Typography>
            <Typography variant="body2">
              <strong>Harga per Kredit:</strong> Rp {creditData.pricePerCredit?.toLocaleString('id-ID')}
            </Typography>
          </Box>
        </Box>

        {/* Payment Method Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Metode Pembayaran
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
                      label="Pilih Provider"
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
            Rincian Biaya
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">Rp {subtotal.toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Biaya Platform (2.5%)</Typography>
              <Typography variant="body2">Rp {platformFee.toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Biaya Pembayaran</Typography>
              <Typography variant="body2">Rp {paymentFee.toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Pajak (PPN 11%)</Typography>
              <Typography variant="body2">Rp {tax.toLocaleString('id-ID')}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                Rp {totalAmount.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Terms */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Dengan melanjutkan, Anda menyetujui syarat dan ketentuan TerraVue. Kredit karbon akan ditransfer ke
          portofolio Anda dalam 24 jam setelah pembayaran dikonfirmasi.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Batal
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isProcessing}
          sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
        >
          {isProcessing ? <CircularProgress size={24} /> : `Bayar Rp ${totalAmount.toLocaleString('id-ID')}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

