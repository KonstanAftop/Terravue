import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { api } from '../../services/api'
import { DataCategory } from '@terravue/shared'

export const DataExport = () => {
  const [format, setFormat] = useState<'json' | 'csv'>('json')
  const [categories, setCategories] = useState<DataCategory[]>([
    'profile',
    'transactions',
    'activities',
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const allCategories: DataCategory[] = [
    'profile',
    'settings',
    'transactions',
    'activities',
    'land_parcels',
    'carbon_credits',
  ]

  const categoryLabels: Record<DataCategory, string> = {
    profile: 'Profile Information',
    settings: 'Account Settings',
    transactions: 'Transaction History',
    activities: 'Activity Timeline',
    land_parcels: 'Land Parcels',
    carbon_credits: 'Carbon Credits',
  }

  const handleCategoryChange = (category: DataCategory) => {
    setCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleExport = async () => {
    if (categories.length === 0) {
      setError('Please select at least one category to export')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/users/export', {
        format,
        categories,
        includeMetadata: true,
      })

      const { filename, data } = response.data.data

      // Create a download link
      const blob = new Blob([data], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess('Data exported successfully!')
    } catch (err: any) {
      console.error('Export error:', err)
      setError(err.response?.data?.error || 'Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Export Your Data
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Download a copy of your TerraVue data in your preferred format.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Select Data Categories
          </FormLabel>
          <FormGroup>
            {allCategories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                }
                label={categoryLabels[category]}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Export Format
          </FormLabel>
          <RadioGroup value={format} onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}>
            <FormControlLabel value="json" control={<Radio />} label="JSON (JavaScript Object Notation)" />
            <FormControlLabel value="csv" control={<Radio />} label="CSV (Comma Separated Values)" />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
        onClick={handleExport}
        disabled={loading || categories.length === 0}
        size="large"
      >
        {loading ? 'Exporting...' : 'Export Data'}
      </Button>
    </Box>
  )
}

