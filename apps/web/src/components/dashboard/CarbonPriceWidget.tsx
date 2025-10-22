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
        background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 18px 40px rgba(27, 94, 32, 0.35)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        minHeight: '260px',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 22px 48px rgba(27, 94, 32, 0.45)',
        },
      }}
    >
      <Typography
        variant="overline"
        sx={{ opacity: 0.85, letterSpacing: 3, display: 'block', mb: 1.5 }}
      >
        Current Carbon Price
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.1 }}>
        IDR {marketSummary.currentPrice.toLocaleString('en-US')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        {isPositive ? (
          <TrendingUp sx={{ fontSize: 22, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }} />
        ) : (
          <TrendingDown sx={{ fontSize: 22, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }} />
        )}
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {isPositive ? '+' : ''}
          {marketSummary.priceChange24h.toFixed(2)}% since yesterday
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
        24h volume · {marketSummary.volume24h.toLocaleString('en-US')} credits
      </Typography>
    </Paper>
  )
}

