import { MenuItem, TextField, Box, Typography, Chip, Alert } from '@mui/material'
import { CheckCircle, Terrain, Park } from '@mui/icons-material'
import { LandParcel } from '@terravue/shared'

interface VerifiedLandSelectorProps {
  lands: LandParcel[]
  selectedLandId: string
  onChange: (landId: string) => void
  error?: string
}

export const VerifiedLandSelector = ({ lands, selectedLandId, onChange, error }: VerifiedLandSelectorProps) => {
  const verifiedLands = lands.filter(land => land.verificationStatus === 'verified')

  if (verifiedLands.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Anda belum memiliki lahan yang terverifikasi. Hanya lahan terverifikasi yang dapat didaftarkan untuk kredit karbon.
      </Alert>
    )
  }

  const selectedLand = verifiedLands.find(l => l.id === selectedLandId)

  return (
    <Box>
      <TextField
        select
        fullWidth
        label="Pilih Lahan Terverifikasi"
        value={selectedLandId}
        onChange={(e) => onChange(e.target.value)}
        required
        error={!!error}
        helperText={error || 'Pilih lahan yang ingin Anda daftarkan kredit karbonnya'}
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
                  {land.area.toFixed(2)} ha • {land.carbonPotential} kredit/tahun
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {selectedLand && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Detail Lahan Terpilih
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Terrain sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Luas Area
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedLand.area.toFixed(2)} hektar
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Park sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Potensi Karbon
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {selectedLand.carbonPotential} kredit/tahun
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip
              label="Terverifikasi"
              color="success"
              size="small"
              icon={<CheckCircle />}
              sx={{ mr: 1 }}
            />
            <Chip
              label={selectedLand.landType}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

