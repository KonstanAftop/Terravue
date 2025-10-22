import { alpha } from '@mui/material/styles'
import { Typography, Grid, Box, ButtonBase, Stack } from '@mui/material'
import { Add, Landscape, ShowChart, Person, Public } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { WidgetContainer } from './WidgetContainer'

type PaletteKey = 'primary' | 'secondary' | 'success' | 'info'

interface QuickAction {
  label: string
  icon: JSX.Element
  palette: PaletteKey
  onClick: () => void
}

export const QuickActionsWidget = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const landownerActions: QuickAction[] = [
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

  const buyerActions: QuickAction[] = [
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
    <WidgetContainer
      title="Quick Actions"
      subtitle="Jump right into frequent workflows."
      spacing={2}
    >
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {actions.map((action) => (
          <Grid item xs={6} sm={4} md={6} key={action.label}>
            <ButtonBase
              onClick={action.onClick}
              sx={(theme) => {
                const paletteColor = theme.palette[action.palette].main
                return {
                  width: '100%',
                  borderRadius: 2.5,
                  border: `1px solid ${alpha(paletteColor, 0.3)}`,
                  backgroundColor: alpha(paletteColor, 0.08),
                  color: paletteColor,
                  padding: theme.spacing(2),
                  transition: 'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease',
                  textAlign: 'left',
                  display: 'block',
                  boxShadow: `0 14px 28px ${alpha(paletteColor, 0.14)}`,
                  '&:hover, &:focus-visible': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 38px ${alpha(paletteColor, 0.2)}`,
                    borderColor: paletteColor,
                    outline: 'none',
                  },
                }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: alpha(theme.palette.common.white, 0.4),
                    color: 'inherit',
                    flexShrink: 0,
                  })}
                >
                  {action.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {action.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.75 }}>
                    {action.label === 'My Profile' ? 'Update account details' : 'Go to this section'}
                  </Typography>
                </Box>
              </Stack>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </WidgetContainer>
  )
}

