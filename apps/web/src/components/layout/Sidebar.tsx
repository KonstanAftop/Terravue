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
import { alpha } from '@mui/material/styles'
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
const LOGO_PLACEHOLDER_SRC = new URL('../../../assets/S__206069779.jpg', import.meta.url).href

export const Sidebar = ({ mobileOpen, onDrawerToggle }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, logout } = useAuthStore()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [sidebarLogoErrored, setSidebarLogoErrored] = useState(false)
  const [topbarLogoErrored, setTopbarLogoErrored] = useState(false)

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
    <List
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 2,
        py: 2,
        gap: 1,
        '&::-webkit-scrollbar': {
          width: 0,
        },
      }}
    >
      {navigationItems.filter(isItemVisible).map((item) => {
        const isActive =
          item.path === '/dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)

        return (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={(theme) => {
                const primaryTint = alpha(theme.palette.primary.main, 0.2)
                const borderColor = alpha(theme.palette.primary.main, isActive ? 0.55 : 0.18)
                const hoverColor = alpha(theme.palette.primary.main, 0.16)
                return {
                  position: 'relative',
                  borderRadius: 3,
                  px: 1.8,
                  py: 1,
                  color: alpha(theme.palette.common.white, isActive ? 0.95 : 0.78),
                  backgroundColor: isActive ? primaryTint : 'transparent',
                  border: `1px solid ${isActive ? borderColor : 'transparent'}`,
                  boxShadow: isActive ? `0 20px 38px ${alpha(theme.palette.common.black, 0.38)}` : 'none',
                  transition: 'all 0.25s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '8px auto 8px 8px',
                    width: 2,
                    borderRadius: 999,
                    backgroundColor: isActive ? alpha(theme.palette.primary.light, 0.85) : 'transparent',
                    transition: 'background-color 0.25s ease, transform 0.25s ease',
                  },
                  '&:hover': {
                    backgroundColor: hoverColor,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
                    '&::before': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.6),
                      transform: 'scaleY(1.1)',
                    },
                  },
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: 'inherit',
                  opacity: isActive ? 1 : 0.75,
                  '& svg': {
                    transform: 'scale(0.92)',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ ml: 1.25 }}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 14,
                  letterSpacing: 0.2,
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
      <Stack
        spacing={1}
        alignItems="center"
        sx={(theme) => ({
          px: 2.5,
          pt: 3,
          pb: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          textAlign: 'center',
        })}
      >
        {sidebarLogoErrored ? (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              px: 2.5,
              borderRadius: 2,
              border: `1px dashed ${alpha('#ffffff', 0.4)}`,
              color: alpha('#ffffff', 0.85),
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: 12,
            }}
          >
            Your Logo
          </Box>
        ) : (
          <Box
            component="img"
            src={LOGO_PLACEHOLDER_SRC}
            alt="Terravue logo"
            onError={() => setSidebarLogoErrored(true)}
            sx={{
              height: 44,
              width: 'auto',
              filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.45))',
            }}
          />
        )}
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Monitor · Verify · Trade
        </Typography>
      </Stack>

      {renderNavigation()}

      <Box sx={{ px: 2.5, pb: 3, pt: 1.5 }}>
        {user && (
          <Stack
            spacing={0.5}
            sx={{
              px: 1.8,
              py: 2,
              mb: 1.5,
              borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
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
          sx={(theme) => ({
            borderRadius: 3,
            borderColor: alpha(theme.palette.error.main, 0.55),
            color: alpha(theme.palette.error.light, 0.92),
            fontWeight: 600,
            py: 1.1,
            '&:hover': {
              borderColor: theme.palette.error.main,
              backgroundColor: alpha(theme.palette.error.main, 0.16),
            },
          })}
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
            backgroundColor: alpha(theme.palette.background.default, 0.92),
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
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
            {topbarLogoErrored ? (
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Your Logo
              </Typography>
            ) : (
              <Box
                component="img"
                src={LOGO_PLACEHOLDER_SRC}
                alt="Terravue logo"
                onError={() => setTopbarLogoErrored(true)}
                sx={{
                  height: 32,
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
                }}
              />
            )}
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
            borderRadius: 0,
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
            borderRight: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
            borderRadius: 0,
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
