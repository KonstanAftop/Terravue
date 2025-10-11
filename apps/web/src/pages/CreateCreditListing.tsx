import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { ArrowBack, Save, Publish } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useLandStore } from '../stores/landStore'
import { useCreditListingStore } from '../stores/creditListingStore'
import { VerifiedLandSelector } from '../components/market/VerifiedLandSelector'
import { PricingGuidance } from '../components/market/PricingGuidance'

export const CreateCreditListingPage = () => {
  const navigate = useNavigate()
  const { lands, fetchLands, loading: landsLoading } = useLandStore()
  const { createListing, fetchMarketStats, marketStats, loading, error, clearError } = useCreditListingStore()

  const [formData, setFormData] = useState({
    landParcelId: '',
    quantity: '',
    pricePerCredit: '',
    validUntil: '',
    description: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchLands({})
    fetchMarketStats()
  }, [fetchLands, fetchMarketStats])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  // Set default validity to 30 days from now
  useEffect(() => {
    if (!formData.validUntil) {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      setFormData(prev => ({ ...prev, validUntil: date.toISOString().split('T')[0] }))
    }
  }, [])

  const selectedLand = lands.find(l => l.id === formData.landParcelId)

  // Auto-fill quantity based on land carbon potential
  useEffect(() => {
    if (selectedLand && !formData.quantity) {
      setFormData(prev => ({ ...prev, quantity: selectedLand.carbonPotential.toString() }))
    }
  }, [selectedLand, formData.quantity])

  // Auto-suggest price based on market stats
  useEffect(() => {
    if (marketStats && !formData.pricePerCredit && selectedLand) {
      const landTypeMultipliers: Record<string, number> = {
        'primary-forest': 1.2,
        'secondary-forest': 1.0,
        'plantation-forest': 0.9,
        'agroforestry': 0.8,
        'degraded-land': 0.7,
      }
      const multiplier = landTypeMultipliers[selectedLand.landType] || 1.0
      const suggestedPrice = Math.round(marketStats.averagePrice * multiplier)
      setFormData(prev => ({ ...prev, pricePerCredit: suggestedPrice.toString() }))
    }
  }, [marketStats, formData.pricePerCredit, selectedLand])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.landParcelId) {
      errors.landParcelId = 'Pilih lahan terlebih dahulu'
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      errors.quantity = 'Jumlah kredit harus lebih dari 0'
    } else if (selectedLand && parseInt(formData.quantity) > selectedLand.carbonPotential) {
      errors.quantity = `Jumlah tidak boleh melebihi potensi karbon (${selectedLand.carbonPotential} kredit)`
    }

    if (!formData.pricePerCredit || parseFloat(formData.pricePerCredit) <= 0) {
      errors.pricePerCredit = 'Harga harus lebih dari 0'
    }

    if (!formData.validUntil) {
      errors.validUntil = 'Tanggal kadaluarsa wajib diisi'
    } else {
      const validDate = new Date(formData.validUntil)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (validDate <= today) {
        errors.validUntil = 'Tanggal kadaluarsa harus di masa depan'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await createListing({
        landParcelId: formData.landParcelId,
        quantity: parseInt(formData.quantity),
        pricePerCredit: parseFloat(formData.pricePerCredit),
        validUntil: new Date(formData.validUntil).toISOString(),
        description: formData.description,
      })

      setSuccess(true)
      
      // Navigate to listings page after brief delay
      setTimeout(() => {
        navigate('/my-listings')
      }, 2000)
    } catch (err) {
      // Error is handled by the store
    }
  }

  if (landsLoading) {
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
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/carbon-market')}
            sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Pasar Karbon
          </Link>
          <Typography variant="body2" color="text.primary">
            Buat Listing Baru
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Daftarkan Kredit Karbon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monetisasi aset karbon hutan Anda dengan menjualnya di pasar
            </Typography>
          </Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/carbon-market')}
            variant="outlined"
          >
            Kembali
          </Button>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Listing berhasil dibuat! Mengalihkan ke halaman listing Anda...
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column - Form */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Informasi Listing
                </Typography>

                {/* Land Selector */}
                <VerifiedLandSelector
                  lands={lands}
                  selectedLandId={formData.landParcelId}
                  onChange={(landId) => setFormData({ ...formData, landParcelId: landId })}
                  error={formErrors.landParcelId}
                />

                {/* Quantity */}
                <TextField
                  fullWidth
                  label="Jumlah Kredit"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  margin="normal"
                  error={!!formErrors.quantity}
                  helperText={formErrors.quantity || `Maksimal: ${selectedLand?.carbonPotential || 0} kredit`}
                  InputProps={{
                    endAdornment: <Typography variant="body2" color="text.secondary">kredit</Typography>,
                  }}
                />

                {/* Price */}
                <TextField
                  fullWidth
                  label="Harga per Kredit"
                  type="number"
                  value={formData.pricePerCredit}
                  onChange={(e) => setFormData({ ...formData, pricePerCredit: e.target.value })}
                  required
                  margin="normal"
                  error={!!formErrors.pricePerCredit}
                  helperText={formErrors.pricePerCredit || 'Tentukan harga per kredit dalam Rupiah'}
                  InputProps={{
                    startAdornment: <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Rp</Typography>,
                  }}
                />

                {/* Valid Until */}
                <TextField
                  fullWidth
                  label="Berlaku Hingga"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                  margin="normal"
                  error={!!formErrors.validUntil}
                  helperText={formErrors.validUntil || 'Listing akan otomatis kadaluarsa setelah tanggal ini'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* Description */}
                <TextField
                  fullWidth
                  label="Deskripsi (Opsional)"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                  helperText="Jelaskan detail proyek konservasi, metode, dan manfaat tambahan"
                  placeholder="Contoh: Hutan primer yang dikelola dengan metode konservasi berkelanjutan, mencakup perlindungan keanekaragaman hayati dan pemberdayaan masyarakat lokal..."
                />

                {/* Listing Preview */}
                {selectedLand && formData.quantity && formData.pricePerCredit && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Preview Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedLand.name} • {parseInt(formData.quantity)} kredit @ Rp {parseFloat(formData.pricePerCredit).toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                      Total: Rp {(parseInt(formData.quantity || '0') * parseFloat(formData.pricePerCredit || '0')).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                )}

                {/* Submit Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <Publish />}
                    disabled={loading || success}
                    sx={{ flex: 1 }}
                  >
                    {loading ? 'Mempublikasikan...' : 'Publikasikan Listing'}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Guidance */}
            <Grid item xs={12} lg={4}>
              <PricingGuidance marketStats={marketStats} landType={selectedLand?.landType} />
            </Grid>
          </Grid>
        </form>
      </Box>
    </AppLayout>
  )
}

