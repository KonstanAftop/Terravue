import { MenuItem, TextField, Box, Typography, Chip, Alert } from '@mui/material'
import { CheckCircle, Terrain, Park } from '@mui/icons-material'
import { LandParcel } from '@terravue/shared'

interface VerifiedLandSelectorProps {
  lands: LandParcel[]
  selectedLandId: string
  onChange: (landId: string) => void
  error?: string
}

export const VerifiedLandSelector = ({
  lands,
  selectedLandId,
  onChange,
  error,
}: VerifiedLandSelectorProps) => {
  const verifiedLands = lands.filter((land) => land.verificationStatus === 'verified')

  if (verifiedLands.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        You do not have any verified land parcels yet. Only verified parcels can be listed for carbon credits.
      </Alert>
    )
  }

  const selectedLand = verifiedLands.find((land) => land.id === selectedLandId)

  return (
    <Box>
      <TextField
        select
        fullWidth
        label="Select Verified Land"
        value={selectedLandId}
        onChange={(event) => onChange(event.target.value)}
        required
        error={!!error}
        helperText={error || 'Choose the land parcel you want to list credits from'}
        margin="normal"
      >
        {verifiedLands.map((land) => (
          <MenuItem key={land.id} value={land.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {land.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {land.area.toFixed(2)} ha • {land.carbonPotential} credits/year
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {selectedLand && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Selected Land Details
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Terrain sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Area
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedLand.area.toFixed(2)} hectares
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Park sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Carbon Potential
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {selectedLand.carbonPotential} credits/year
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip label="Verified" color="success" size="small" icon={<CheckCircle />} sx={{ mr: 1 }} />
            <Chip label={selectedLand.landType} size="small" variant="outlined" />
          </Box>
        </Box>
      )}
    </Box>
  )
}
