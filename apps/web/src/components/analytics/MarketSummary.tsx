import React from 'react'
import { Box, Card, CardContent, Typography, Grid, Chip, Divider } from '@mui/material'
import { MarketSummaryStats } from '@terravue/shared'
import { formatCurrency, formatNumber } from '@terravue/shared'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

interface MarketSummaryProps {
  stats: MarketSummaryStats
}

const MarketSummary: React.FC<MarketSummaryProps> = ({ stats }) => {
  const getMarketStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'success'
      case 'pre_market':
      case 'after_hours':
        return 'warning'
      case 'closed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getMarketStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Market Open'
      case 'pre_market':
        return 'Pre-Market'
      case 'after_hours':
        return 'After Hours'
      case 'closed':
        return 'Market Closed'
      default:
        return status
    }
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Market Summary
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={getMarketStatusLabel(stats.marketStatus)}
              color={getMarketStatusColor(stats.marketStatus) as any}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              Updated: {new Date(stats.lastUpdate).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3}>
          {/* Current Price */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <ShowChartIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Current Price
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(stats.currentPrice)}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                {stats.priceChangePercent24h > 0 ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography
                  variant="body2"
                  color={stats.priceChangePercent24h > 0 ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {stats.priceChangePercent24h > 0 ? '+' : ''}
                  {stats.priceChangePercent24h.toFixed(2)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({stats.priceChange24h > 0 ? '+' : ''}
                  {formatCurrency(Math.abs(stats.priceChange24h))})
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* 24h High/Low */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                24h Range
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    High
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {formatCurrency(stats.high24h)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Low
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {formatCurrency(stats.low24h)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Volume */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <EqualizerIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  24h Volume
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatNumber(stats.volume24h)}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                {stats.volumeChange24h > 0 ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography
                  variant="body2"
                  color={stats.volumeChange24h > 0 ? 'success.main' : 'error.main'}
                  fontWeight="medium"
                >
                  {stats.volumeChange24h > 0 ? '+' : ''}
                  {stats.volumeChange24h.toFixed(2)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                credits traded
              </Typography>
            </Box>
          </Grid>

          {/* Market Cap */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <AccountBalanceIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Market Cap
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(stats.marketCap)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                {formatNumber(stats.totalCreditsAvailable)} credits
              </Typography>
              <Typography variant="caption" color="text.secondary">
                available
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Additional Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Active Listings
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatNumber(stats.activeListings)}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              24h Transactions
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatNumber(stats.completedTransactions24h)}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Avg Trade Size
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatNumber(stats.averageTransactionSize)}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Last Update
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {new Date(stats.lastUpdate).toLocaleTimeString()}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Next Update
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {new Date(stats.nextUpdate).toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>

        {/* Market Status Info */}
        <Box mt={3} p={2} bgcolor="background.default" borderRadius={1}>
          <Typography variant="body2" color="text.secondary">
            {stats.marketStatus === 'open' && (
              <>
                🟢 Market is currently open for trading. All transactions are being processed in
                real-time.
              </>
            )}
            {stats.marketStatus === 'pre_market' && (
              <>
                🟡 Pre-market trading hours. Limited liquidity may be available.
              </>
            )}
            {stats.marketStatus === 'after_hours' && (
              <>
                🟡 After-hours trading. Extended trading session with potentially wider spreads.
              </>
            )}
            {stats.marketStatus === 'closed' && (
              <>
                🔴 Market is currently closed. Trading will resume during market hours.
              </>
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MarketSummary

