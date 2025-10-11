import React, { useMemo } from 'react'
import { Box, Card, CardContent, Typography, Grid } from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { VolumeData } from '@terravue/shared'
import { formatDate, formatNumber } from '@terravue/shared'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface VolumeIndicatorsProps {
  volumeHistory: VolumeData[]
}

const VolumeIndicators: React.FC<VolumeIndicatorsProps> = ({ volumeHistory }) => {
  const chartData = useMemo(() => {
    if (!volumeHistory || volumeHistory.length === 0) {
      return null
    }

    const labels = volumeHistory.map((data) => formatDate(new Date(data.timestamp)))

    return {
      labels,
      datasets: [
        {
          label: 'Buy Volume',
          data: volumeHistory.map((data) => data.buyVolume),
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4CAF50',
          borderWidth: 1,
        },
        {
          label: 'Sell Volume',
          data: volumeHistory.map((data) => data.sellVolume),
          backgroundColor: 'rgba(244, 67, 54, 0.7)',
          borderColor: '#F44336',
          borderWidth: 1,
        },
      ],
    }
  }, [volumeHistory])

  const volumeStats = useMemo(() => {
    if (!volumeHistory || volumeHistory.length === 0) {
      return null
    }

    const totalVolume = volumeHistory.reduce((sum, data) => sum + data.volume, 0)
    const totalBuyVolume = volumeHistory.reduce((sum, data) => sum + data.buyVolume, 0)
    const totalSellVolume = volumeHistory.reduce((sum, data) => sum + data.sellVolume, 0)
    const totalTrades = volumeHistory.reduce((sum, data) => sum + data.trades, 0)
    const averageVolume = totalVolume / volumeHistory.length

    // Calculate volume change
    const latestVolume = volumeHistory[volumeHistory.length - 1]?.volume || 0
    const previousVolume = volumeHistory[volumeHistory.length - 2]?.volume || latestVolume
    const volumeChange = previousVolume > 0 ? ((latestVolume - previousVolume) / previousVolume) * 100 : 0

    // Buy/sell ratio
    const buySellRatio = totalSellVolume > 0 ? totalBuyVolume / totalSellVolume : 0

    return {
      totalVolume,
      totalBuyVolume,
      totalSellVolume,
      totalTrades,
      averageVolume,
      volumeChange,
      buySellRatio,
      latestVolume,
    }
  }, [volumeHistory])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            label += formatNumber(context.parsed.y) + ' credits'
            return label
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value: any) => formatNumber(value),
        },
      },
    },
  }

  if (!chartData || !volumeStats) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Volume Analysis
        </Typography>

        {/* Volume Statistics */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                24h Volume
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatNumber(volumeStats.latestVolume)}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {volumeStats.volumeChange > 0 ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography
                  variant="caption"
                  color={volumeStats.volumeChange > 0 ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {volumeStats.volumeChange > 0 ? '+' : ''}
                  {volumeStats.volumeChange.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Volume
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatNumber(volumeStats.totalVolume)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                credits traded
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Avg Volume
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatNumber(Math.round(volumeStats.averageVolume))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                per period
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Trades
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatNumber(volumeStats.totalTrades)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                transactions
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Volume Chart */}
        <Box height={300}>
          <Bar data={chartData} options={chartOptions} />
        </Box>

        {/* Buy/Sell Analysis */}
        <Box mt={3} p={2} bgcolor="background.default" borderRadius={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Buy Volume
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="success.main">
                {formatNumber(volumeStats.totalBuyVolume)} credits
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((volumeStats.totalBuyVolume / volumeStats.totalVolume) * 100).toFixed(1)}% of total
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Sell Volume
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="error.main">
                {formatNumber(volumeStats.totalSellVolume)} credits
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((volumeStats.totalSellVolume / volumeStats.totalVolume) * 100).toFixed(1)}% of total
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Buy/Sell Ratio
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                color={volumeStats.buySellRatio > 1 ? 'success.main' : 'error.main'}
              >
                {volumeStats.buySellRatio.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {volumeStats.buySellRatio > 1 ? 'Bullish' : volumeStats.buySellRatio < 1 ? 'Bearish' : 'Neutral'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default VolumeIndicators

