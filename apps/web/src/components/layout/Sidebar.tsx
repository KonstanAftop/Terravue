import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Landscape as LandscapeIcon,
  Logout as LogoutIcon,
  Map as MapIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Public as PublicIcon,
  Receipt as ReceiptIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material'
import { useAuthStore } from '../../stores/authStore'

interface SidebarProps {
  mobileOpen: boolean
  onDrawerToggle: () => void
}

interface NavigationItem {
  label: string
  icon: JSX.Element
  path: string
  roles?: string[]
}

export const SIDEBAR_WIDTH = 300

const drawerGradient = 'linear-gradient(200deg, #091512 0%, #040807 80%)'

export const Sidebar = ({ mobileOpen, onDrawerToggle }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, logout } = useAuthStore()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Land Management', icon: <LandscapeIcon />, path: '/land-management', roles: ['landowner'] },
    { label: 'Interactive Map', icon: <MapIcon />, path: '/interactive-map', roles: ['landowner'] },
    { label: 'Global Map', icon: <PublicIcon />, path: '/global-map' },
    { label: 'Carbon Market', icon: <ShowChartIcon />, path: '/carbon-market' },
    { label: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
    { label: 'Profile & Activity', icon: <PersonIcon />, path: '/profile' },
  ]

  const isItemVisible = (item: NavigationItem) => {
    if (!item.roles) return true
    return user && item.roles.includes(user.userType)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    if (isMobile) {
      onDrawerToggle()
    }
  }

  const handleLogoutClick = () => setLogoutDialogOpen(true)
  const handleLogoutCancel = () => setLogoutDialogOpen(false)
  const handleLogoutConfirm = () => {
    logout()
    setLogoutDialogOpen(false)
    navigate('/login')
  }

  const renderNavigation = () => (
    <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2.5, py: 3 }}>
      {navigationItems.filter(isItemVisible).map((item) => {
        const isActive =
          item.path === '/dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)

        return (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.75 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 3,
                px: 2.2,
                py: 1.4,
                color: 'rgba(233,245,241,0.85)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(233,245,241,0.18) 0%, rgba(233,245,241,0.06) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(233,245,241,0.28)' : '1px solid transparent',
                boxShadow: isActive ? '0 14px 36px rgba(7,25,20,0.35)' : 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(233,245,241,0.12) 0%, rgba(233,245,241,0.04) 100%)',
                  border: '1px solid rgba(233,245,241,0.16)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: 'inherit',
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 15,
                }}
              />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: drawerGradient,
        color: '#E9F5F1',
      }}
    >
      <Stack spacing={1} sx={{ px: 3, pt: 4, pb: 3, borderBottom: '1px solid rgba(233,245,241,0.1)' }}>
        <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.6 }}>
          TERRAVUE
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Climate Operations
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.55 }}>
          Monitor · Verify · Trade
        </Typography>
      </Stack>

      {renderNavigation()}

      <Box sx={{ px: 3, pb: 4, pt: 2 }}>
        {user && (
          <Stack
            spacing={0.5}
            sx={{
              px: 2,
              py: 2.5,
              mb: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(233,245,241,0.05)',
              border: '1px solid rgba(233,245,241,0.12)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.65 }}>
              {user.userType === 'landowner' ? 'Landowner' : 'Buyer'}
            </Typography>
          </Stack>
        )}

        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogoutClick}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: 3,
            borderColor: 'rgba(244,67,54,0.45)',
            color: 'rgba(255,205,205,0.92)',
            fontWeight: 600,
            '&:hover': {
              borderColor: 'rgba(244,67,54,0.7)',
              backgroundColor: 'rgba(244,67,54,0.12)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(9,21,18,0.92)',
            borderBottom: '1px solid rgba(233,245,241,0.08)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Terravue
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: drawerGradient,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: drawerGradient,
            color: '#E9F5F1',
            borderRight: '1px solid rgba(233,245,241,0.05)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out of Terravue? You will need to sign back in to access the platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
