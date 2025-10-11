import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CircularProgress, Box } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireLandowner?: boolean
  requireBuyer?: boolean
}

export const ProtectedRoute = ({
  children,
  requireLandowner,
  requireBuyer,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLandowner, isBuyer, isLoading } = useAuth()
  
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requireLandowner && !isLandowner) {
    return <Navigate to="/dashboard" replace />
  }
  
  if (requireBuyer && !isBuyer) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}


