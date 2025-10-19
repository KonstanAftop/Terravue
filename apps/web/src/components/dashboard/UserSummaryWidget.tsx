import { Grid, Paper, Typography, Box } from '@mui/material'
import { Landscape, CheckCircle, ShowChart, Receipt } from '@mui/icons-material'
import { UserSummary } from '../../services/dashboardService'

interface UserSummaryWidgetProps {
  userSummary: UserSummary | null
}

export const UserSummaryWidget = ({ userSummary }: UserSummaryWidgetProps) => {
  if (!userSummary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Paper>
    )
  }

  const stats = [
    {
      icon: <Landscape sx={{ fontSize: 40, color: '#2e7d32' }} />,
      label: 'Total Land Parcels',
      value: userSummary.totalLands,
      subValue: `${userSummary.verifiedLands} verified`,
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40, color: '#1565c0' }} />,
      label: 'Carbon Credits',
      value: userSummary.totalCredits,
      subValue: `${userSummary.availableCredits} available`,
    },
    {
      icon: <Receipt sx={{ fontSize: 40, color: '#558b2f' }} />,
      label: 'Transactions',
      value: userSummary.totalTransactions,
      subValue: 'completed transactions',
    },
    {
      icon: <ShowChart sx={{ fontSize: 40, color: '#f57c00' }} />,
      label: 'Total Revenue',
      value: `IDR ${(userSummary.totalRevenue / 1000000).toFixed(1)}M`,
      subValue: 'from credit sales',
    },
  ]

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {stat.icon}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {stat.subValue}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

