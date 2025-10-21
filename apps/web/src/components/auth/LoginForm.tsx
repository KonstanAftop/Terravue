import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Login as LoginIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const theme = useTheme()
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
          'linear-gradient(135deg, rgba(9,31,29,0.86) 0%, rgba(9,31,29,0.45) 55%, rgba(9,31,29,0.72) 100%), url("/assets/bg-forest.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 6, lg: 10 }}
        sx={{ width: '100%', maxWidth: 1120 }}
      >
        <Card
          elevation={0}
          sx={{
            width: { xs: '100%', lg: '52%' },
            borderRadius: 4,
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(20,98,74,0.22)',
            boxShadow: '0 36px 88px rgba(9,31,29,0.28)',
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
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Log in to orchestrate monitoring, verification, and trading workflows across your carbon portfolio.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" onClose={clearError}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
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
                  startIcon={!isLoading ? <LoginIcon /> : undefined}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Box>

              <Divider flexItem>
                <Typography variant="caption" color="text.secondary">
                  Need an account?
                </Typography>
              </Divider>

              <Stack spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Terravue connects every stakeholder in the carbon market with trusted data and secure transactions.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={onSwitchToRegister}
                  sx={{ borderRadius: 999, px: 4, fontWeight: 600 }}
                >
                  Create a Terravue account
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack
          spacing={3}
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          justifyContent="center"
          textAlign={{ xs: 'left', lg: 'center' }}
          sx={{
            width: { xs: '100%', lg: '48%' },
            color: 'rgba(245,251,247,0.95)',
            px: { xs: 0, lg: 4 },
          }}
        >
          <Box
            component="img"
            src="/assets/logo-nobg.PNG"
            alt="Terravue mark"
            sx={{
              width: { xs: 220, sm: 280, lg: 330 },
              height: 'auto',
              filter: 'drop-shadow(0 36px 72px rgba(4,18,12,0.55))',
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Keep your climate mission in motion
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 420, color: 'rgba(245,251,247,0.78)' }}>
            Access real-time land analytics, validator requests, and carbon trading tools designed for high-integrity projects.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default LoginForm
