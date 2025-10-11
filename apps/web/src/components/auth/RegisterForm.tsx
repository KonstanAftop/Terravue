import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const { register, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: '' as 'landowner' | 'buyer' | '',
  })
  const [validationError, setValidationError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError('')
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }
    
    if (!formData.userType) {
      setValidationError('Please select account type')
      return
    }
    
    try {
      await register(formData.email, formData.password, formData.fullName, formData.userType)
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
        Register for TerraVue
      </Typography>
      
      {(error || validationError) && (
        <Alert severity="error" onClose={clearError}>
          {validationError || error}
        </Alert>
      )}
      
      <TextField
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
        fullWidth
      />
      
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        fullWidth
      />
      
      <FormControl fullWidth required>
        <InputLabel>Account Type</InputLabel>
        <Select
          value={formData.userType}
          label="Account Type"
          onChange={(e) => setFormData({ ...formData, userType: e.target.value as 'landowner' | 'buyer' })}
        >
          <MenuItem value="landowner">Landowner (Sell Carbon Credits)</MenuItem>
          <MenuItem value="buyer">Buyer (Purchase Carbon Credits)</MenuItem>
        </Select>
        <FormHelperText>Choose how you want to use the platform</FormHelperText>
      </FormControl>
      
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        fullWidth
        helperText="At least 8 characters with letters and numbers"
      />
      
      <TextField
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
        {isLoading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToLogin}
            sx={{ cursor: 'pointer' }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}


