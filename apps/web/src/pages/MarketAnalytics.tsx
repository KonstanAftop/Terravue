import React, { useEffect } from 'react'
import { Box, Container, Grid, CircularProgress, Alert, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useMarketAnalyticsStore } from '../stores/marketAnalyticsStore'
import { usePriceAlertStore } from '../stores/priceAlertStore'
import PriceChart from '../components/analytics/PriceChart'
import VolumeIndicators from '../components/analytics/VolumeIndicators'
import TrendAnalysis from '../components/analytics/TrendAnalysis'
import RegionalPricing from '../components/analytics/RegionalPricing'
import MarketDepth from '../components/analytics/MarketDepth'
import TransactionFeed from '../components/analytics/TransactionFeed'
import PriceAlerts from '../components/analytics/PriceAlerts'
import MarketSummary from '../components/analytics/MarketSummary'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const MarketAnalytics: React.FC = () => {
  const navigate = useNavigate()
  
  const {
    analytics,
    priceHistory,
    volumeHistory,
    trends,
    regionalData,
    marketDepth,
    recentTransactions,
    marketStats,
    selectedPeriod,
    isLoading,
    error,
    fetchAnalytics,
    fetchMarketDepth,
    fetchRecentTransactions,
    fetchMarketStats,
    setPeriod,
  } = useMarketAnalyticsStore()

  const {
    alerts,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
  } = usePriceAlertStore()

  useEffect(() => {
    // Initial data fetch
    fetchAnalytics()
    fetchMarketDepth()
    fetchRecentTransactions(20)
    fetchMarketStats()
    fetchAlerts()

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchAnalytics()
      fetchMarketDepth()
      fetchRecentTransactions(20)
      fetchMarketStats()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handlePeriodChange = async (period: string) => {
    setPeriod(period)
    await fetchAnalytics(period)
    await fetchMarketStats(period)
  }

  if (isLoading && !analytics) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShowChartIcon fontSize="large" color="primary" />
            <Typography variant="h4" fontWeight="bold">
              Market Analytics & Pricing
            </Typography>
          </Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/carbon-market')}
            variant="outlined"
          >
            Back to Market
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Comprehensive market data, technical analysis, and price monitoring for Indonesian carbon
          credits
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => {}}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Market Summary - Full Width */}
        {marketStats && (
          <Grid item xs={12}>
            <MarketSummary stats={marketStats} />
          </Grid>
        )}

        {/* Price Chart - Full Width */}
        <Grid item xs={12}>
          <PriceChart
            priceHistory={priceHistory}
            trends={trends}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            showIndicators={true}
          />
        </Grid>

        {/* Volume Indicators - Full Width */}
        {volumeHistory.length > 0 && (
          <Grid item xs={12}>
            <VolumeIndicators volumeHistory={volumeHistory} />
          </Grid>
        )}

        {/* Trend Analysis */}
        {trends && analytics && (
          <Grid item xs={12} md={6}>
            <TrendAnalysis trends={trends} analytics={analytics} />
          </Grid>
        )}

        {/* Market Depth */}
        {marketDepth && (
          <Grid item xs={12} md={6}>
            <MarketDepth marketDepth={marketDepth} />
          </Grid>
        )}

        {/* Price Alerts */}
        <Grid item xs={12} md={6}>
          <PriceAlerts
            alerts={alerts}
            currentPrice={analytics?.currentPrice || 0}
            onCreateAlert={createAlert}
            onUpdateAlert={updateAlert}
            onDeleteAlert={deleteAlert}
          />
        </Grid>

        {/* Transaction Feed */}
        {recentTransactions.length > 0 && (
          <Grid item xs={12} md={6}>
            <TransactionFeed transactions={recentTransactions} />
          </Grid>
        )}

        {/* Regional Pricing - Full Width */}
        {regionalData.length > 0 && (
          <Grid item xs={12}>
            <RegionalPricing regionalData={regionalData} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default MarketAnalytics

