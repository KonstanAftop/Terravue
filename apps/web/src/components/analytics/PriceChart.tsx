import React, { useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { MarketData, TrendAnalysis } from '@terravue/shared'
import { formatCurrency, formatDate } from '@terravue/shared'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface PriceChartProps {
  priceHistory: MarketData[]
  trends: TrendAnalysis | null
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  showIndicators?: boolean
}

const PriceChart: React.FC<PriceChartProps> = ({
  priceHistory,
  trends,
  selectedPeriod,
  onPeriodChange,
  showIndicators = true,
}) => {
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) {
      return null
    }

    const labels = priceHistory.map((data) => formatDate(new Date(data.timestamp)))
    const prices = priceHistory.map((data) => data.averagePrice)

    const datasets: any[] = [
      {
        label: 'Carbon Credit Price',
        data: prices,
        borderColor: '#2E7D32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: priceHistory.length > 30 ? 0 : 3,
        pointHoverRadius: 5,
      },
    ]

    // Add technical indicators if available
    if (showIndicators && trends) {
      // MA7
      if (trends.ma7) {
        datasets.push({
          label: 'MA7',
          data: trends.ma7,
          borderColor: '#FF9800',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 5],
        })
      }

      // MA30
      if (trends.ma30) {
        datasets.push({
          label: 'MA30',
          data: trends.ma30,
          borderColor: '#F44336',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 5],
        })
      }

      // Bollinger Bands
      if (trends.bollingerBands) {
        datasets.push(
          {
            label: 'Bollinger Upper',
            data: trends.bollingerBands.upper,
            borderColor: 'rgba(156, 39, 176, 0.3)',
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [2, 2],
          },
          {
            label: 'Bollinger Lower',
            data: trends.bollingerBands.lower,
            borderColor: 'rgba(156, 39, 176, 0.3)',
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [2, 2],
          },
        )
      }
    }

    return {
      labels,
      datasets,
    }
  }, [priceHistory, trends, showIndicators])

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => formatCurrency(value as number),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  }

  if (!chartData) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Carbon Credit Price Chart
          </Typography>
          <ToggleButtonGroup
            value={selectedPeriod}
            exclusive
            onChange={(e, value) => value && onPeriodChange(value)}
            size="small"
          >
            <ToggleButton value="1d">1D</ToggleButton>
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
            <ToggleButton value="90d">90D</ToggleButton>
            <ToggleButton value="1y">1Y</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box height={400}>
          <Line data={chartData} options={chartOptions} />
        </Box>

        {/* Price Summary */}
        {priceHistory.length > 0 && (
          <Box mt={2} display="flex" gap={3} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current Price
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(priceHistory[priceHistory.length - 1].averagePrice)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Period Change
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={
                  priceHistory[priceHistory.length - 1].priceChange > 0 ? 'success.main' : 'error.main'
                }
              >
                {priceHistory[priceHistory.length - 1].priceChange > 0 ? '+' : ''}
                {priceHistory[priceHistory.length - 1].priceChange.toFixed(2)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                High
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(Math.max(...priceHistory.map((d) => d.averagePrice)))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Low
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(Math.min(...priceHistory.map((d) => d.averagePrice)))}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PriceChart

