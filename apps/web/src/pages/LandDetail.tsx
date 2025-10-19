import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button, CircularProgress, Alert, Breadcrumbs, Link, Stack } from '@mui/material'
import { ArrowBack, Refresh } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useLandDetailStore } from '../stores/landDetailStore'
import { LandInfoCard } from '../components/land/LandInfoCard'
import { VerificationProgressIndicator } from '../components/land/VerificationProgressIndicator'
import { ActivityTimeline } from '../components/land/ActivityTimeline'
import { SatelliteImageViewer } from '../components/land/SatelliteImageViewer'
import { EditLandForm } from '../components/land/EditLandForm'
import { PageHeader } from '../components/layout/PageHeader'

export const LandDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    land,
    activities,
    verificationProgress,
    satelliteImages,
    loading,
    error,
    fetchLandDetail,
    updateLand,
    startAutoRefresh,
    stopAutoRefresh,
  } = useLandDetailStore()

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      // Start auto-refresh to watch verification progress
      startAutoRefresh(id, 3000) // Refresh every 3 seconds
    }

    return () => {
      stopAutoRefresh()
    }
  }, [id, startAutoRefresh, stopAutoRefresh])

  const handleRefresh = () => {
    if (id) {
      fetchLandDetail(id)
    }
  }

  const handleSaveEdit = async (updates: any) => {
    if (id) {
      await updateLand(id, updates)
      setEditDialogOpen(false)
    }
  }

  if (loading && !land) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  if (error && !land) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/land-management')}>
          Back to Land List
        </Button>
      </AppLayout>
    )
  }

  if (!land) {
    return (
      <AppLayout>
        <Alert severity="warning">Land parcel not found</Alert>
        <Button variant="contained" onClick={() => navigate('/land-management')} sx={{ mt: 2 }}>
          Back to Land List
        </Button>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Land Portfolio"
        title={land.name}
        subtitle="Detailed insight into verification milestones, monitoring data, and activity timeline."
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/land-management')}>
              Back to list
            </Button>
            <Button variant="contained" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh data'}
            </Button>
          </Stack>
        }
      />

      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/land-management')}
          sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Land Management
        </Link>
        <Typography variant="body2" color="text.primary">
          {land.name}
        </Typography>
      </Breadcrumbs>

      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Land Information */}
              <LandInfoCard
                land={land}
                onEdit={land.verificationStatus !== 'verified' ? () => setEditDialogOpen(true) : undefined}
              />

              {/* Satellite Image Viewer */}
              <SatelliteImageViewer images={satelliteImages} landName={land.name} />

              {/* Activity Timeline */}
              <ActivityTimeline activities={activities} />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Verification Progress */}
            {verificationProgress && (
              <VerificationProgressIndicator progress={verificationProgress} />
            )}
          </Grid>
        </Grid>

        {/* Edit Dialog */}
        {land && (
          <EditLandForm
            open={editDialogOpen}
            land={land}
            onClose={() => setEditDialogOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
      </Box>
    </AppLayout>
  )
}

