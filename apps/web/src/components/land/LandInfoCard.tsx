import { Paper, Typography, Grid, Box, Chip, Divider, Button } from '@mui/material'
import { Edit, LocationOn, Terrain, Park, CalendarToday, CheckCircle } from '@mui/icons-material'
import { LandParcel } from '@terravue/shared'

interface LandInfoCardProps {
  land: LandParcel
  onEdit?: () => void
}

export const LandInfoCard = ({ land, onEdit }: LandInfoCardProps) => {
  const getStatusColor = (status: LandParcel['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'warning'
    }
  }

  const getStatusLabel = (status: LandParcel['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending Verification'
    }
  }

  const formatLandType = (type: string) => {
    const types: Record<string, string> = {
      'primary-forest': 'Primary Forest',
      'secondary-forest': 'Secondary Forest',
      'plantation-forest': 'Plantation Forest',
      'agroforestry': 'Agroforestry',
      'degraded-land': 'Degraded Land',
      'palm-oil': 'Palm Oil Plantation',
      'rubber': 'Rubber Plantation',
      'coffee': 'Coffee Plantation',
    }
    return types[type] || type
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
            {land.name}
          </Typography>
          <Chip
            label={getStatusLabel(land.verificationStatus)}
            color={getStatusColor(land.verificationStatus)}
            size="small"
            icon={land.verificationStatus === 'verified' ? <CheckCircle /> : undefined}
          />
        </Box>
        {land.verificationStatus !== 'verified' && onEdit && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit />}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
            <LocationOn sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Location
              </Typography>
              <Typography variant="body2">
                {land.address || 'No address provided'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
            <Terrain sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Area
              </Typography>
              <Typography variant="body2">
                {land.area.toFixed(2)} hectares
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Park sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Land Type
              </Typography>
              <Typography variant="body2">
                {formatLandType(land.landType)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
            <CalendarToday sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Registration Date
              </Typography>
              <Typography variant="body2">
                {new Date(land.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Carbon Potential
            </Typography>
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
              {land.carbonPotential?.toLocaleString('en-US') || 0} credits/year
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Estimate based on area and land type
            </Typography>
          </Box>
        </Grid>

        {land.description && (
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {land.description}
            </Typography>
          </Grid>
        )}

        {land.coordinates && land.coordinates.length > 0 && (
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Boundary Coordinates ({land.coordinates.length} point{land.coordinates.length === 1 ? '' : 's'})
            </Typography>
            <Box sx={{ maxHeight: 150, overflow: 'auto', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              {land.coordinates.map((coord, index) => (
                <Typography key={index} variant="caption" display="block" fontFamily="monospace">
                  {index + 1}. {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                </Typography>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

