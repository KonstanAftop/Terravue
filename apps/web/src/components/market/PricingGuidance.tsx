import { Paper, Typography, Box, Alert, Chip, Divider } from '@mui/material'
import { TrendingUp, TrendingDown, Info } from '@mui/icons-material'

interface PricingGuidanceProps {
  marketStats: {
    averagePrice: number
    minPrice: number
    maxPrice: number
    totalQuantity: number
    totalListings: number
  } | null
  landType?: string
}

export const PricingGuidance = ({ marketStats, landType }: PricingGuidanceProps) => {
  if (!marketStats || marketStats.totalListings === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Panduan Harga
        </Typography>
        <Alert severity="info">
          Belum ada data pasar yang tersedia. Anda dapat menetapkan harga berdasarkan estimasi Anda.
        </Alert>
      </Paper>
    )
  }

  const suggestedMin = Math.round(marketStats.averagePrice * 0.85)
  const suggestedMax = Math.round(marketStats.averagePrice * 1.15)

  // Adjust suggestions based on land type
  const landTypeMultipliers: Record<string, number> = {
    'primary-forest': 1.2,
    'secondary-forest': 1.0,
    'plantation-forest': 0.9,
    'agroforestry': 0.8,
    'degraded-land': 0.7,
  }

  const multiplier = landType ? landTypeMultipliers[landType] || 1.0 : 1.0
  const adjustedMin = Math.round(suggestedMin * multiplier)
  const adjustedMax = Math.round(suggestedMax * multiplier)
  const adjustedAvg = Math.round(marketStats.averagePrice * multiplier)

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Panduan Harga
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Berdasarkan {marketStats.totalListings} listing aktif di pasar
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 150 }}>
          <Typography variant="caption" color="text.secondary">
            Harga Rata-rata Pasar
          </Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
            Rp {marketStats.averagePrice.toLocaleString('id-ID')}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 150 }}>
          <Typography variant="caption" color="text.secondary">
            Rentang Harga Pasar
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Rp {marketStats.minPrice.toLocaleString('id-ID')} - Rp {marketStats.maxPrice.toLocaleString('id-ID')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ bgcolor: 'success.50', p: 2, borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingUp sx={{ color: 'success.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Rekomendasi Harga
            {landType && ' (disesuaikan dengan jenis lahan)'}
          </Typography>
        </Box>
        
        <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
          Rp {adjustedAvg.toLocaleString('id-ID')}/kredit
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Rentang kompetitif: Rp {adjustedMin.toLocaleString('id-ID')} - Rp {adjustedMax.toLocaleString('id-ID')}
        </Typography>
      </Box>

      <Alert severity="info" icon={<Info />}>
        <Typography variant="caption">
          <strong>Tips:</strong> Harga di tengah rentang biasanya paling menarik pembeli. 
          Harga lebih rendah = penjualan lebih cepat, harga lebih tinggi = margin lebih besar.
        </Typography>
      </Alert>

      {landType && multiplier !== 1.0 && (
        <Box sx={{ mt: 2 }}>
          <Chip
            icon={multiplier > 1.0 ? <TrendingUp /> : <TrendingDown />}
            label={`${landType}: ${multiplier > 1.0 ? 'Premium' : 'Standar'} ${Math.round((multiplier - 1) * 100)}%`}
            color={multiplier > 1.0 ? 'success' : 'default'}
            size="small"
          />
        </Box>
      )}
    </Paper>
  )
}

