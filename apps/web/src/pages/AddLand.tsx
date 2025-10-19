import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { AddLandForm } from '../components/land/AddLandForm'
import { PageHeader } from '../components/layout/PageHeader'

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
      <PageHeader
        eyebrow="Land Portfolio"
        title="Add New Land"
        subtitle="Register a new parcel to begin verification and unlock carbon credit opportunities."
        actions={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/land-management')}>
            Back to Land List
          </Button>
        }
      />

      <Box>
        <AddLandForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Box>
    </AppLayout>
  )
}

