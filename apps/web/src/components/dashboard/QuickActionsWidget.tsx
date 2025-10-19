import { alpha } from '@mui/material/styles'
import { Paper, Typography, Grid, Button } from '@mui/material'
import { Add, Landscape, ShowChart, Person, Public } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export const QuickActionsWidget = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  type PaletteKey = 'primary' | 'secondary' | 'success' | 'info'

  const landownerActions: Array<{
    label: string
    icon: JSX.Element
    palette: PaletteKey
    onClick: () => void
  }> = [
    {
      label: 'Add Land',
      icon: <Add />,
      palette: 'primary',
      onClick: () => navigate('/land-management'),
    },
    {
      label: 'Manage Land',
      icon: <Landscape />,
      palette: 'secondary',
      onClick: () => navigate('/land-management'),
    },
    {
      label: 'View Marketplace',
      icon: <ShowChart />,
      palette: 'info',
      onClick: () => navigate('/carbon-market'),
    },
    {
      label: 'My Profile',
      icon: <Person />,
      palette: 'secondary',
      onClick: () => navigate('/profile'),
    },
  ]

  const buyerActions: typeof landownerActions = [
    {
      label: 'Explore Marketplace',
      icon: <ShowChart />,
      palette: 'info',
      onClick: () => navigate('/carbon-market'),
    },
    {
      label: 'Global Map',
      icon: <Public />,
      palette: 'secondary',
      onClick: () => navigate('/global-map'),
    },
    {
      label: 'My Profile',
      icon: <Person />,
      palette: 'primary',
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
              sx={(theme) => {
                const paletteColor = theme.palette[action.palette].main
                return {
                  height: 100,
                  flexDirection: 'column',
                  gap: 1,
                  borderColor: alpha(paletteColor, 0.65),
                  color: paletteColor,
                  boxShadow: `inset 0 0 0 1px ${alpha(paletteColor, 0.15)}`,
                  '&:hover': {
                    borderColor: paletteColor,
                    backgroundColor: alpha(paletteColor, 0.12),
                    boxShadow: `0 18px 32px ${alpha(paletteColor, 0.22)}`,
                  },
                }
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

