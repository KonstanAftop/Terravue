import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { AddLandForm } from '../components/land/AddLandForm'

export const AddLandPage = () => {
  const navigate = useNavigate()

  const handleSuccess = (landId: string) => {
    // Navigate back to land management with success message
    navigate('/land-management')
  }

  const handleCancel = () => {
    navigate('/land-management')
  }

  return (
    <AppLayout>
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/land-management')}
          sx={{ mb: 2 }}
        >
          Back to Land List
        </Button>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
          Add New Land
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Register your land to start the verification process and earn carbon credits
        </Typography>

        <AddLandForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Box>
    </AppLayout>
  )
}

