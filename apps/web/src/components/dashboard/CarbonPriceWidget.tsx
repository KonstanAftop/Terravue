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
        Current Carbon Price
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        IDR {marketSummary.currentPrice.toLocaleString('en-US')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isPositive ? (
          <TrendingUp sx={{ fontSize: 20 }} />
        ) : (
          <TrendingDown sx={{ fontSize: 20 }} />
        )}
        <Typography variant="body2">
          {isPositive ? '+' : ''}
          {marketSummary.priceChange24h.toFixed(2)}% since yesterday
      </Typography>
      </Box>
      <Typography variant="caption" sx={{ opacity: 0.8, mt: 2, display: 'block' }}>
        24h volume: {marketSummary.volume24h.toLocaleString('en-US')} credits
      </Typography>
    </Paper>
  )
}

