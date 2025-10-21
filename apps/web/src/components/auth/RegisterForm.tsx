import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const theme = useTheme()
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
      // handled by store
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2.5, md: 6 },
        py: { xs: 6, md: 8 },
        backgroundImage:
          'linear-gradient(135deg, rgba(16,42,74,0.85) 0%, rgba(16,42,74,0.45) 55%, rgba(16,42,74,0.7) 100%), url("/assets/bg-forest.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 6, lg: 10 }}
        sx={{ width: '100%', maxWidth: 1120 }}
      >
        <Stack
          spacing={3}
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          justifyContent="center"
          textAlign={{ xs: 'left', lg: 'center' }}
          sx={{
            width: { xs: '100%', lg: '48%' },
            color: 'rgba(245,251,247,0.95)',
            px: { xs: 0, lg: 4 },
            order: { xs: 1, lg: 0 },
          }}
        >
          <Box
            component="img"
            src="/assets/logo-nobg.PNG"
            alt="Terravue mark"
            sx={{
              width: { xs: 220, sm: 280, lg: 340 },
              height: 'auto',
              filter: 'drop-shadow(0 36px 72px rgba(2,20,14,0.55))',
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Start mapping your land now
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 420, color: 'rgba(245,251,247,0.78)' }}>
            Build a digital twin of your parcel, streamline MRV workflows, and prepare projects for verified carbon issuance.
          </Typography>
        </Stack>

        <Card
          elevation={0}
          sx={{
            width: { xs: '100%', lg: '52%' },
            borderRadius: 4,
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(27,75,145,0.22)',
            boxShadow: '0 36px 88px rgba(16,42,74,0.28)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Stack spacing={3.5} alignItems="stretch">
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="img"
                    src="/assets/logo.png"
                    alt="Terravue"
                    sx={{ width: 40, height: 'auto' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                      Terravue
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Monitor / Verify / Trade
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component={RouterLink}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{ fontWeight: 600 }}
                >
                  Back to landing
                </Button>
              </Stack>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.015em' }}>
                  Create your Terravue account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register to integrate land intelligence, compliance-ready MRV, and transparent carbon trading in one platform.
                </Typography>
              </Box>

              {(error || validationError) && (
                <Alert severity="error" onClose={() => { clearError(); setValidationError('') }}>
                  {validationError || error}
                </Alert>
              )}

              <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
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
                    <MenuItem value="landowner">Landowner - Sell verified carbon credits</MenuItem>
                    <MenuItem value="buyer">Buyer - Purchase trusted carbon offsets</MenuItem>
                  </Select>
                  <FormHelperText>Select how you plan to collaborate within the Terravue ecosystem.</FormHelperText>
                </FormControl>

                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  fullWidth
                  helperText="At least 8 characters with a mix of letters and numbers"
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
                  startIcon={!isLoading ? <PersonAddIcon /> : undefined}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
              </Stack>

              <Stack spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account? Log in to continue building measurable climate impact.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={onSwitchToLogin}
                  sx={{ borderRadius: 999, px: 4, fontWeight: 600 }}
                >
                  I already have an account
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}

export default RegisterForm
