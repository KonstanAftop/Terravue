import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
} from '@mui/material'
import { Save, Send } from '@mui/icons-material'
import { GeoCoordinate } from '@terravue/shared'
import { LAND_TYPES, estimateCarbonPotential } from '../../utils/landTypes'
import { landService } from '../../services/landService'

interface AddLandFormProps {
  onSuccess?: (landId: string) => void
  onCancel?: () => void
}

export const AddLandForm = ({ onSuccess, onCancel }: AddLandFormProps) => {
  const [name, setName] = useState('')
  const [landType, setLandType] = useState('')
  const [area, setArea] = useState('')
  const [coordinates, setCoordinates] = useState<GeoCoordinate[]>([
    { lat: -6.2, lng: 106.816 }, // Default to Jakarta
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const selectedLandType = LAND_TYPES.find((t) => t.value === landType)
  const estimatedCarbon = area && landType
    ? estimateCarbonPotential(parseFloat(area), landType)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate required fields
      if (!name || !landType || !area || coordinates.length < 3) {
        throw new Error('Mohon lengkapi semua field yang diperlukan')
      }

      const areaNum = parseFloat(area)
      if (isNaN(areaNum) || areaNum <= 0) {
        throw new Error('Luas lahan harus berupa angka positif')
      }

      if (areaNum < 0.1) {
        throw new Error('Luas lahan minimal 0.1 hektar')
      }

      // Create land
      const newLand = await landService.createLand({
        name,
        landType,
        area: areaNum,
        coordinates,
        verificationStatus: 'pending',
        carbonPotential: estimatedCarbon,
        ownerId: '', // Will be set by backend from JWT
      })

      setSuccess(true)
      if (onSuccess) {
        setTimeout(() => onSuccess(newLand.id), 1500)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan lahan')
    } finally {
      setLoading(false)
    }
  }

  const addCoordinate = () => {
    setCoordinates([...coordinates, { lat: 0, lng: 0 }])
  }

  const updateCoordinate = (index: number, field: 'lat' | 'lng', value: string) => {
    const newCoords = [...coordinates]
    newCoords[index] = {
      ...newCoords[index],
      [field]: parseFloat(value) || 0,
    }
    setCoordinates(newCoords)
  }

  const removeCoordinate = (index: number) => {
    setCoordinates(coordinates.filter((_, i) => i !== index))
  }

  if (success) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="success.main" gutterBottom>
          ✓ Lahan Berhasil Didaftarkan!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lahan Anda telah terdaftar dan menunggu verifikasi.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Daftarkan Lahan Baru
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Land Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nama Lahan *"
              placeholder="Contoh: Kebun Raya Bogor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>

          {/* Land Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Jenis Lahan *</InputLabel>
              <Select value={landType} label="Jenis Lahan *" onChange={(e) => setLandType(e.target.value)}>
                {LAND_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedLandType && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {selectedLandType.description}
              </Typography>
            )}
          </Grid>

          {/* Area */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Luas Lahan *"
              type="number"
              placeholder="0.0"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">hektar</InputAdornment>,
              }}
              required
              inputProps={{ min: 0.1, step: 0.1 }}
            />
            {estimatedCarbon > 0 && (
              <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                Est. potensi karbon: ~{estimatedCarbon.toLocaleString('id-ID')} kredit/tahun
              </Typography>
            )}
          </Grid>

          {/* Coordinates */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Koordinat Lahan * (minimal 3 titik)
            </Typography>
            {coordinates.map((coord, index) => (
              <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Latitude"
                    type="number"
                    value={coord.lat}
                    onChange={(e) => updateCoordinate(index, 'lat', e.target.value)}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Longitude"
                    type="number"
                    value={coord.lng}
                    onChange={(e) => updateCoordinate(index, 'lng', e.target.value)}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>
                <Grid item xs={2}>
                  {index > 0 && (
                    <Button size="small" color="error" onClick={() => removeCoordinate(index)} fullWidth>
                      Hapus
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
            <Button size="small" onClick={addCoordinate} variant="outlined">
              + Tambah Koordinat
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Wilayah Indonesia: Lat -11° hingga 6°, Lng 95° hingga 141°
            </Typography>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              {onCancel && (
                <Button variant="outlined" onClick={onCancel}>
                  Batal
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                disabled={loading}
                sx={{ backgroundColor: '#2e7d32' }}
              >
                {loading ? 'Mendaftar...' : 'Daftarkan Lahan'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

