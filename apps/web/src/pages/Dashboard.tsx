import { useEffect } from 'react'
import { Box, Grid, CircularProgress, Stack, Typography } from '@mui/material'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../stores/authStore'
import { useDashboardStore } from '../stores/dashboardStore'
import { CarbonPriceWidget } from '../components/dashboard/CarbonPriceWidget'
import { UserSummaryWidget } from '../components/dashboard/UserSummaryWidget'
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget'
import { QuickActionsWidget } from '../components/dashboard/QuickActionsWidget'
import { PriceChartWidget } from '../components/dashboard/PriceChartWidget'
import { PageHeader } from '../components/layout/PageHeader'
import { WidgetContainer } from '../components/dashboard/WidgetContainer'
import { SectionHeader } from '../components/dashboard/SectionHeader'

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const { dashboardData, marketData, loading, startAutoRefresh, stopAutoRefresh } = useDashboardStore()

  const marketSummary = dashboardData?.marketSummary ?? null
  const userSummary = dashboardData?.userSummary ?? null

  const heroStats = [
    {
      label: 'Verified Parcels',
      value:
        userSummary && userSummary.totalLands > 0
          ? `${userSummary.verifiedLands} of ${userSummary.totalLands}`
          : userSummary
          ? `${userSummary.verifiedLands}`
          : 'Loading',
    },
    {
      label: 'Available Credits',
      value: userSummary ? userSummary.availableCredits.toLocaleString('en-US') : 'Loading',
    },
    {
      label: 'Total Revenue',
      value: userSummary ? `IDR ${(userSummary.totalRevenue / 1_000_000).toFixed(1)}M` : 'Loading',
    },
  ]

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
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: '100%' }}>
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          subtitle={`Welcome back, ${user?.fullName ?? 'team member'} (${user?.userType === 'landowner' ? 'Landowner' : 'Buyer'})`}
          sx={{ mb: 0 }}
        />

        <WidgetContainer
          eyebrow="Today"
          title={`Hello, ${user?.fullName ?? 'Terravue member'}`}
          subtitle="Here’s a snapshot of your Terravue impact."
          spacing={2.5}
        >
          <Stack spacing={{ xs: 2.5, lg: 3 }} direction={{ xs: 'column', lg: 'row' }} alignItems="stretch">
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.015em' }}>
                Welcome back, {user?.fullName ?? 'team member'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You’re logged in as a {user?.userType === 'landowner' ? 'Landowner' : 'Buyer'}. Review your portfolio metrics
                and take the next action when you’re ready.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row', lg: 'column' }}
              spacing={1.5}
              sx={{ flex: { xs: '1 1 auto', lg: '0 0 320px' } }}
            >
              {heroStats.map((stat) => (
                <Box
                  key={stat.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(255,255,255,0.32)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </WidgetContainer>

        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <SectionHeader
            title="Market Insights"
            description="Stay on top of price swings and short-term momentum."
          />

          <Grid container spacing={{ xs: 2.25, md: 2.5 }}>
            <Grid item xs={12} lg={5}>
              <CarbonPriceWidget marketSummary={marketSummary} />
            </Grid>
            <Grid item xs={12} lg={7}>
              <PriceChartWidget marketData={marketData} />
            </Grid>
          </Grid>
        </Stack>

        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <SectionHeader
            title="Portfolio Overview"
            description="Track verified parcels, carbon credits, and revenue in one view."
          />
          <UserSummaryWidget userSummary={userSummary} />
        </Stack>

        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <SectionHeader
            title="Actions & Activity"
            description="Quickly jump into workflows and catch up on recent events."
          />
          <Grid container spacing={{ xs: 2.25, md: 2.5 }}>
            <Grid item xs={12} md={6}>
              <QuickActionsWidget />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentActivityWidget activities={dashboardData?.recentActivity || []} />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </AppLayout>
  )
}
