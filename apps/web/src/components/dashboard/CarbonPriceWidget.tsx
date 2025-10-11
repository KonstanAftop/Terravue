import { Box, Paper, Typography } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { MarketSummary } from '../../services/dashboardService'

interface CarbonPriceWidgetProps {
  marketSummary: MarketSummary | null
}

export const CarbonPriceWidget = ({ marketSummary }: CarbonPriceWidgetProps) => {
  if (!marketSummary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Paper>
    )
  }

  const isPositive = marketSummary.priceChange24h >= 0

  return (
    <Paper
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
        color: 'white',
      }}
    >
      <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
        Harga Karbon Saat Ini
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        IDR {marketSummary.currentPrice.toLocaleString('id-ID')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isPositive ? (
          <TrendingUp sx={{ fontSize: 20 }} />
        ) : (
          <TrendingDown sx={{ fontSize: 20 }} />
        )}
        <Typography variant="body2">
          {isPositive ? '+' : ''}
          {marketSummary.priceChange24h.toFixed(2)}% dari kemarin
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ opacity: 0.8, mt: 2, display: 'block' }}>
        Volume 24 jam: {marketSummary.volume24h.toLocaleString('id-ID')} kredit
      </Typography>
    </Paper>
  )
}

