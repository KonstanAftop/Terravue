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
          Kembali ke Daftar Lahan
        </Button>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
          Tambah Lahan Baru
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Daftarkan lahan Anda untuk memulai proses verifikasi dan mendapatkan kredit karbon
        </Typography>

        <AddLandForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Box>
    </AppLayout>
  )
}

