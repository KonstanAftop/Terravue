import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await login(formData.email, formData.password)
      onSuccess?.()
    } catch (err) {
      // Error is handled by the store
    }
  }
  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        Login to TerraVue
      </Typography>
      
      {error && (
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      )}
      
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        fullWidth
      />
      
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        fullWidth
      />
      
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToRegister}
            sx={{ cursor: 'pointer' }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}


