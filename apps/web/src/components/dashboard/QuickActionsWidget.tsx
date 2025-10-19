import { Paper, Typography, Grid, Button } from '@mui/material'
import { Add, Landscape, ShowChart, Person, Public } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export const QuickActionsWidget = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const landownerActions = [
    {
      label: 'Add Land',
      icon: <Add />,
      color: '#2e7d32',
      onClick: () => navigate('/land-management'),
    },
    {
      label: 'Manage Land',
      icon: <Landscape />,
      color: '#558b2f',
      onClick: () => navigate('/land-management'),
    },
    {
      label: 'View Marketplace',
      icon: <ShowChart />,
      color: '#1565c0',
      onClick: () => navigate('/carbon-market'),
    },
    {
      label: 'My Profile',
      icon: <Person />,
      color: '#5d4037',
      onClick: () => navigate('/profile'),
    },
  ]

  const buyerActions = [
    {
      label: 'Explore Marketplace',
      icon: <ShowChart />,
      color: '#1565c0',
      onClick: () => navigate('/carbon-market'),
    },
    {
      label: 'Global Map',
      icon: <Public />,
      color: '#0277bd',
      onClick: () => navigate('/global-map'),
    },
    {
      label: 'My Profile',
      icon: <Person />,
      color: '#5d4037',
      onClick: () => navigate('/profile'),
    },
  ]

  const actions = user?.userType === 'landowner' ? landownerActions : buyerActions

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {actions.map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Button
              variant="outlined"
              fullWidth
              onClick={action.onClick}
              sx={{
                height: 100,
                flexDirection: 'column',
                gap: 1,
                borderColor: action.color,
                color: action.color,
                '&:hover': {
                  borderColor: action.color,
                  backgroundColor: `${action.color}10`,
                },
              }}
            >
              {action.icon}
              <Typography variant="caption">{action.label}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

