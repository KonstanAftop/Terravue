import { Grid, Typography, Box, Stack } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Landscape, CheckCircle, ShowChart, Receipt } from '@mui/icons-material'
import { UserSummary } from '../../services/dashboardService'
import { WidgetContainer } from './WidgetContainer'

interface UserSummaryWidgetProps {
  userSummary: UserSummary | null
}

export const UserSummaryWidget = ({ userSummary }: UserSummaryWidgetProps) => {
  const theme = useTheme()

  if (!userSummary) {
    return (
      <WidgetContainer title="Portfolio Overview">
        <Typography variant="body2" color="text.secondary">
          Loading your portfolio insights...
        </Typography>
      </WidgetContainer>
    )
  }

  const stats = [
    {
      icon: <Landscape sx={{ fontSize: 28 }} />,
      label: 'Total Land Parcels',
      value: userSummary.totalLands.toLocaleString('en-US'),
      subValue: `${userSummary.verifiedLands.toLocaleString('en-US')} verified`,
      palette: theme.palette.primary,
    },
    {
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      label: 'Carbon Credits',
      value: userSummary.totalCredits.toLocaleString('en-US'),
      subValue: `${userSummary.availableCredits.toLocaleString('en-US')} available`,
      palette: theme.palette.info,
    },
    {
      icon: <Receipt sx={{ fontSize: 28 }} />,
      label: 'Transactions',
      value: userSummary.totalTransactions.toLocaleString('en-US'),
      subValue: 'Completed trades',
      palette: theme.palette.success,
    },
    {
      icon: <ShowChart sx={{ fontSize: 28 }} />,
      label: 'Total Revenue',
      value: `IDR ${(userSummary.totalRevenue / 1_000_000).toFixed(1)}M`,
      subValue: 'From credit sales',
      palette: theme.palette.secondary,
    },
  ]

  return (
    <WidgetContainer spacing={2.5}>
      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Box
              sx={{
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${alpha(stat.palette.main, 0.18)}`,
                backgroundColor: alpha(stat.palette.main, 0.08),
                boxShadow: `0 18px 32px ${alpha(stat.palette.main, 0.12)}`,
                p: 2.25,
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 26px 46px ${alpha(stat.palette.main, 0.2)}`,
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: alpha(stat.palette.main, 0.16),
                    color: stat.palette.main,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                {stat.subValue}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </WidgetContainer>
  )
}
