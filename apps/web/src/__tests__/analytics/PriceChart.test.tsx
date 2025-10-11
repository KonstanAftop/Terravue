import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PriceChart from '../../components/analytics/PriceChart'
import { MarketData, TrendAnalysis } from '@terravue/shared'

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Chart</div>,
}))

describe('PriceChart Component', () => {
  const mockPriceHistory: MarketData[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01'),
      averagePrice: 75000,
      volume: 1000,
      priceChange: 2.5,
      region: 'Indonesia',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-02'),
      averagePrice: 77000,
      volume: 1200,
      priceChange: 2.67,
      region: 'Indonesia',
    },
    {
      id: '3',
      timestamp: new Date('2024-01-03'),
      averagePrice: 76000,
      volume: 900,
      priceChange: -1.3,
      region: 'Indonesia',
    },
  ]

  const mockTrends: TrendAnalysis = {
    ma7: [null, null, 76000],
    ma30: [null, null, null],
    ma90: [null, null, null],
    rsi: [null, 65, 58],
    bollingerBands: {
      upper: [null, null, 78000],
      middle: [null, null, 76000],
      lower: [null, null, 74000],
    },
    macd: {
      macd: [null, 50, 45],
      signal: [null, 48, 47],
      histogram: [null, 2, -2],
    },
  }

  const mockOnPeriodChange = vi.fn()

  it('should render price chart with data', () => {
    render(
      <PriceChart
        priceHistory={mockPriceHistory}
        trends={mockTrends}
        selectedPeriod="7d"
        onPeriodChange={mockOnPeriodChange}
      />,
    )

    expect(screen.getByText('Carbon Credit Price Chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('should display current price and statistics', () => {
    render(
      <PriceChart
        priceHistory={mockPriceHistory}
        trends={mockTrends}
        selectedPeriod="7d"
        onPeriodChange={mockOnPeriodChange}
      />,
    )

    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('Period Change')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('should show period selector buttons', () => {
    render(
      <PriceChart
        priceHistory={mockPriceHistory}
        trends={mockTrends}
        selectedPeriod="7d"
        onPeriodChange={mockOnPeriodChange}
      />,
    )

    expect(screen.getByText('1D')).toBeInTheDocument()
    expect(screen.getByText('7D')).toBeInTheDocument()
    expect(screen.getByText('30D')).toBeInTheDocument()
    expect(screen.getByText('90D')).toBeInTheDocument()
    expect(screen.getByText('1Y')).toBeInTheDocument()
  })

  it('should call onPeriodChange when period is selected', () => {
    render(
      <PriceChart
        priceHistory={mockPriceHistory}
        trends={mockTrends}
        selectedPeriod="7d"
        onPeriodChange={mockOnPeriodChange}
      />,
    )

    const button30D = screen.getByText('30D')
    fireEvent.click(button30D)

    expect(mockOnPeriodChange).toHaveBeenCalledWith('30d')
  })

  it('should show loading when no data', () => {
    render(
      <PriceChart
        priceHistory={[]}
        trends={null}
        selectedPeriod="7d"
        onPeriodChange={mockOnPeriodChange}
      />,
    )

    // CircularProgress is rendered but text isn't visible
    const cards = screen.getAllByRole('region')
    expect(cards.length).toBeGreaterThan(0)
  })
})

