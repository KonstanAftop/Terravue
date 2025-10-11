import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Landscape as LandscapeIcon,
  Public as PublicIcon,
  ShowChart as ShowChartIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Map as MapIcon,
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

const drawerWidth = 280

export const Sidebar = ({ mobileOpen, onDrawerToggle }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, logout } = useAuthStore()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      label: 'Kelola Lahan',
      icon: <LandscapeIcon />,
      path: '/land-management',
      roles: ['landowner'],
    },
    {
      label: 'Peta Interaktif',
      icon: <MapIcon />,
      path: '/interactive-map',
      roles: ['landowner'],
    },
    {
      label: 'Peta Dunia',
      icon: <PublicIcon />,
      path: '/global-map',
    },
    {
      label: 'Market Karbon',
      icon: <ShowChartIcon />,
      path: '/carbon-market',
    },
    {
      label: 'Transaksi',
      icon: <ReceiptIcon />,
      path: '/transactions',
    },
    {
      label: 'Profil & Aktivitas',
      icon: <PersonIcon />,
      path: '/profile',
    },
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
    if (isMobile) {
      onDrawerToggle()
    }
  }

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    setLogoutDialogOpen(false)
    navigate('/login')
  }

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false)
  }

  const isItemVisible = (item: NavigationItem) => {
    if (!item.roles) return true
    return user && item.roles.includes(user.userType)
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          🌍 TerraVue
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Carbon Market Platform
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navigationItems
          .filter(isItemVisible)
          .map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : theme.palette.text.secondary,
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
      </List>

      {/* User Info and Logout */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        {user && (
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.userType === 'landowner' ? 'Pemilik Lahan' : 'Pembeli'}
            </Typography>
          </Box>
        )}
        <ListItemButton
          onClick={handleLogoutClick}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.dark,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            backgroundColor: theme.palette.primary.main,
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
            <Typography variant="h6" noWrap component="div">
              TerraVue
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Apakah Anda yakin ingin keluar dari TerraVue? Anda perlu login
            kembali untuk mengakses platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Batal
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

