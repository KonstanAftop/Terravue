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
  const chartData = {
    labels: marketData.map((d) => {
      const date = new Date(d.timestamp)
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Harga Karbon (IDR)',
        data: marketData.map((d) => d.averagePrice),
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
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
            return `IDR ${context.parsed.y.toLocaleString('id-ID')}`
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Tren Harga Karbon (7 Hari)
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        {marketData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <Typography color="text.secondary">Loading chart...</Typography>
        )}
      </Box>
    </Paper>
  )
}

