import { useState } from 'react'
import { Container, Paper } from '@mui/material'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    navigate('/dashboard')
  }
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {showRegister ? (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </Paper>
    </Container>
  )
}


