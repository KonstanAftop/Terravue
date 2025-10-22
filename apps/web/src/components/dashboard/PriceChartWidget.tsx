import { alpha, useTheme } from '@mui/material/styles'
import { Typography, Box, Stack, Chip } from '@mui/material'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { MarketDataPoint } from '../../services/dashboardService'
import { WidgetContainer } from './WidgetContainer'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface PriceChartWidgetProps {
  marketData: MarketDataPoint[]
}

export const PriceChartWidget = ({ marketData }: PriceChartWidgetProps) => {
  const theme = useTheme()

  const chartData = {
    labels: marketData.map((d) => {
      const date = new Date(d.timestamp)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Carbon Price (IDR)',
        data: marketData.map((d) => d.averagePrice),
        borderColor: theme.palette.primary.main,
        borderWidth: 2.6,
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) {
            return alpha(theme.palette.primary.main, 0.12)
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, alpha(theme.palette.primary.main, 0.25))
          gradient.addColorStop(1, alpha(theme.palette.primary.main, 0))
          return gradient
        },
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#ffffff',
      },
    ],
  }

  const gridColor = alpha(theme.palette.common.white, 0.08)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: alpha('#0b3d2d', 0.92),
        borderColor: alpha('#ffffff', 0.12),
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `IDR ${context.parsed.y.toLocaleString('en-US')}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: alpha(theme.palette.text.primary, 0.6),
          font: {
            weight: 500,
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawTicks: false,
          borderDash: [4, 4],
        },
        ticks: {
          padding: 6,
          color: alpha(theme.palette.text.primary, 0.55),
          font: {
            weight: 500,
            size: 11,
          },
          callback: function (value: any) {
            return `${(value / 1000).toFixed(0)}k`
          },
        },
      },
    },
  }

  return (
    <WidgetContainer
      title="Carbon Price Trend"
      subtitle="Average daily price over the past 7 days."
      spacing={2}
    >
      <Stack direction="row" justifyContent="flex-start">
        <Chip
          label="7D"
          size="small"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        />
      </Stack>

      <Box
        sx={{
          height: { xs: 220, md: 240 },
          mt: 0.5,
          width: '100%',
        }}
      >
        {marketData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <Typography color="text.secondary">Loading chart...</Typography>
        )}
      </Box>
    </WidgetContainer>
  )
}

