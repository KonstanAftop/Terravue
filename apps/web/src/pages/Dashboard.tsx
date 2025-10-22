import { useEffect } from 'react'
import { Box, Grid, CircularProgress, Stack } from '@mui/material'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../stores/authStore'
import { useDashboardStore } from '../stores/dashboardStore'
import { CarbonPriceWidget } from '../components/dashboard/CarbonPriceWidget'
import { UserSummaryWidget } from '../components/dashboard/UserSummaryWidget'
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget'
import { QuickActionsWidget } from '../components/dashboard/QuickActionsWidget'
import { PriceChartWidget } from '../components/dashboard/PriceChartWidget'
import { PageHeader } from '../components/layout/PageHeader'

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
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%' }}>
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          subtitle={`Welcome back, ${user?.fullName ?? 'team member'} (${user?.userType === 'landowner' ? 'Landowner' : 'Buyer'})`}
          sx={{ mb: 0 }}
        />

        <Stack spacing={2.5} mt={{ xs: 3, md: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <CarbonPriceWidget marketSummary={dashboardData?.marketSummary || null} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <PriceChartWidget marketData={marketData} />
              </Box>
            </Grid>
          </Grid>

          <UserSummaryWidget userSummary={dashboardData?.userSummary || null} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <QuickActionsWidget />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentActivityWidget activities={dashboardData?.recentActivity || []} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </AppLayout>
  )
}


