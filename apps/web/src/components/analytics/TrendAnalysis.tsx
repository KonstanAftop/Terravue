import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material'
import { TrendAnalysis as TrendAnalysisType, MarketAnalytics } from '@terravue/shared'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TimelineIcon from '@mui/icons-material/Timeline'

interface TrendAnalysisProps {
  trends: TrendAnalysisType
  analytics: MarketAnalytics
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trends, analytics }) => {
  // Get latest RSI value
  const latestRSI = trends.rsi.filter((v) => v !== null).slice(-1)[0] || 50

  // Get latest MACD values
  const latestMACD = trends.macd.macd.filter((v) => v !== null).slice(-1)[0] || 0
  const latestSignal = trends.macd.signal.filter((v) => v !== null).slice(-1)[0] || 0
  const latestHistogram = trends.macd.histogram.filter((v) => v !== null).slice(-1)[0] || 0

  // RSI interpretation
  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { label: 'Overbought', color: 'error' as const, desc: 'Price may decline' }
    if (rsi < 30) return { label: 'Oversold', color: 'success' as const, desc: 'Price may rise' }
    if (rsi > 50) return { label: 'Bullish', color: 'success' as const, desc: 'Upward momentum' }
    return { label: 'Bearish', color: 'warning' as const, desc: 'Downward momentum' }
  }

  // MACD interpretation
  const getMACDStatus = () => {
    if (latestMACD > latestSignal && latestHistogram > 0) {
      return { label: 'Bullish Signal', color: 'success' as const, desc: 'Buy momentum strong' }
    }
    if (latestMACD < latestSignal && latestHistogram < 0) {
      return { label: 'Bearish Signal', color: 'error' as const, desc: 'Sell pressure strong' }
    }
    return { label: 'Neutral', color: 'default' as const, desc: 'No clear signal' }
  }

  const rsiStatus = getRSIStatus(latestRSI)
  const macdStatus = getMACDStatus()

  // Trend direction icon
  const getTrendIcon = () => {
    switch (analytics.trendDirection) {
      case 'up':
        return <TrendingUpIcon color="success" />
      case 'down':
        return <TrendingDownIcon color="error" />
      default:
        return <TrendingFlatIcon color="action" />
    }
  }

  // Market sentiment icon
  const getSentimentIcon = () => {
    switch (analytics.marketSentiment) {
      case 'bullish':
        return <TrendingUpIcon color="success" />
      case 'bearish':
        return <TrendingDownIcon color="error" />
      default:
        return <TrendingFlatIcon color="action" />
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Technical Analysis
        </Typography>

        {/* Overall Market Status */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Box
              p={2}
              bgcolor="background.default"
              borderRadius={1}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {getTrendIcon()}
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Trend Direction
                </Typography>
                <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                  {analytics.trendDirection}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              p={2}
              bgcolor="background.default"
              borderRadius={1}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {getSentimentIcon()}
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Market Sentiment
                </Typography>
                <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                  {analytics.marketSentiment}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* RSI Analysis */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <ShowChartIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">
                RSI (Relative Strength Index)
              </Typography>
            </Box>
            <Chip label={rsiStatus.label} color={rsiStatus.color} size="small" />
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography variant="h4" fontWeight="bold">
              {latestRSI.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rsiStatus.desc}
            </Typography>
          </Box>

          <Box position="relative" mb={1}>
            <LinearProgress
              variant="determinate"
              value={latestRSI}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    latestRSI > 70
                      ? '#F44336'
                      : latestRSI < 30
                        ? '#4CAF50'
                        : latestRSI > 50
                          ? '#4CAF50'
                          : '#FF9800',
                },
              }}
            />
            {/* RSI Markers */}
            <Box
              position="absolute"
              left="30%"
              top={-5}
              width={2}
              height={18}
              bgcolor="error.main"
              sx={{ opacity: 0.3 }}
            />
            <Box
              position="absolute"
              left="70%"
              top={-5}
              width={2}
              height={18}
              bgcolor="error.main"
              sx={{ opacity: 0.3 }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              0 (Oversold)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              30
            </Typography>
            <Typography variant="caption" color="text.secondary">
              50
            </Typography>
            <Typography variant="caption" color="text.secondary">
              70
            </Typography>
            <Typography variant="caption" color="text.secondary">
              100 (Overbought)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* MACD Analysis */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <TimelineIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">
                MACD (Moving Average Convergence Divergence)
              </Typography>
            </Box>
            <Chip label={macdStatus.label} color={macdStatus.color} size="small" />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">
                MACD Line
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {latestMACD.toFixed(0)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">
                Signal Line
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {latestSignal.toFixed(0)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">
                Histogram
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={latestHistogram > 0 ? 'success.main' : 'error.main'}
              >
                {latestHistogram > 0 ? '+' : ''}
                {latestHistogram.toFixed(0)}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" mt={1}>
            {macdStatus.desc}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Volatility */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Volatility Index
          </Typography>
          <Box display="flex" alignItems="baseline" gap={1}>
            <Typography variant="h5" fontWeight="bold">
              {analytics.volatilityIndex.toFixed(2)}%
            </Typography>
            <Chip
              label={
                analytics.volatilityIndex > 30
                  ? 'High Volatility'
                  : analytics.volatilityIndex > 15
                    ? 'Moderate'
                    : 'Low Volatility'
              }
              color={
                analytics.volatilityIndex > 30
                  ? 'error'
                  : analytics.volatilityIndex > 15
                    ? 'warning'
                    : 'success'
              }
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {analytics.volatilityIndex > 30
              ? 'Market experiencing high price swings'
              : analytics.volatilityIndex > 15
                ? 'Normal market fluctuation'
                : 'Stable market conditions'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TrendAnalysis

