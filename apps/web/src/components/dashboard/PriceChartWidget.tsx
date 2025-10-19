import { alpha, useTheme } from '@mui/material/styles'
import { Paper, Typography, Box } from '@mui/material'
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
        backgroundColor: alpha(theme.palette.primary.main, 0.18),
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `IDR ${context.parsed.y.toLocaleString('en-US')}`
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return `${(value / 1000).toFixed(0)}k`
          },
        },
      },
    },
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, opacity: 0.85 }}>
        Carbon Price Trend (7 Days)
      </Typography>
      <Box
        sx={{
          height: 180,
          mt: 1.5,
          width: '100%',
        }}
      >
        {marketData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <Typography color="text.secondary">Loading chart...</Typography>
        )}
      </Box>
    </Paper>
  )
}

