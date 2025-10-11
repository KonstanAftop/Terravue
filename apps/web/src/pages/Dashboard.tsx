import { useEffect } from 'react'
import { Typography, Box, Grid, CircularProgress } from '@mui/material'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../stores/authStore'
import { useDashboardStore } from '../stores/dashboardStore'
import { CarbonPriceWidget } from '../components/dashboard/CarbonPriceWidget'
import { UserSummaryWidget } from '../components/dashboard/UserSummaryWidget'
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget'
import { QuickActionsWidget } from '../components/dashboard/QuickActionsWidget'
import { PriceChartWidget } from '../components/dashboard/PriceChartWidget'

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const { dashboardData, marketData, loading, startAutoRefresh, stopAutoRefresh } = useDashboardStore()

  useEffect(() => {
    // Start auto-refresh when component mounts
    startAutoRefresh()

    // Stop auto-refresh when component unmounts
    return () => {
      stopAutoRefresh()
    }
  }, [startAutoRefresh, stopAutoRefresh])

  if (loading && !dashboardData) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Selamat datang, {user?.fullName}! 
          ({user?.userType === 'landowner' ? 'Pemilik Lahan' : 'Pembeli'})
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Carbon Price Widget */}
          <Grid item xs={12} md={4}>
            <CarbonPriceWidget marketSummary={dashboardData?.marketSummary || null} />
          </Grid>

          {/* Price Chart */}
          <Grid item xs={12} md={8}>
            <PriceChartWidget marketData={marketData} />
          </Grid>

          {/* User Summary */}
          <Grid item xs={12}>
            <UserSummaryWidget userSummary={dashboardData?.userSummary || null} />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <QuickActionsWidget />
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <RecentActivityWidget activities={dashboardData?.recentActivity || []} />
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  )
}


