import { useMemo, useState } from 'react'
import { Box, Fade } from '@mui/material'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    navigate('/dashboard')
  }

  const content = useMemo(
    () =>
      showRegister ? (
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      ),
    [showRegister],
  )

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Fade
        key={showRegister ? 'register' : 'login'}
        in
        timeout={500}
        appear
        mountOnEnter
        unmountOnExit
      >
        <Box sx={{ position: 'absolute', inset: 0 }}>
          {content}
        </Box>
      </Fade>
    </Box>
  )
}


