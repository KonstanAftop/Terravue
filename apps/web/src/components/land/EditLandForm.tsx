import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { LandParcel } from '@terravue/shared'
import { LAND_TYPES } from '../../utils/landTypes'

interface EditLandFormProps {
  open: boolean
  land: LandParcel
  onClose: () => void
  onSave: (updates: Partial<LandParcel>) => Promise<void>
}

export const EditLandForm = ({ open, land, onClose, onSave }: EditLandFormProps) => {
  const [formData, setFormData] = useState({
    name: land.name,
    address: land.address || '',
    landType: land.landType,
    description: land.description || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update land')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: land.name,
        address: land.address || '',
        landType: land.landType,
        description: land.description || '',
      })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Land Information</DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Land Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />

          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            disabled={loading}
          />

          <TextField
            select
            label="Land Type"
            value={formData.landType}
            onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          >
            {LAND_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label} - {type.carbonFactor} credits/ha/year
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
            placeholder="Add a description or notes about this land..."
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Coordinates and land area cannot be changed after registration.
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

