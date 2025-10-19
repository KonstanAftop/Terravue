import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
}

export const PublicRoute = ({ children, redirectTo = '/dashboard' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
