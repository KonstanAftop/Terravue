import { useState } from 'react'
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton, Alert } from '@mui/material'
import { Satellite, Terrain } from '@mui/icons-material'

interface SatelliteImageViewerProps {
  images: string[]
  landName: string
}

export const SatelliteImageViewer = ({ images, landName }: SatelliteImageViewerProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  if (images.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Satellite Imagery
        </Typography>
        <Alert severity="info">
          Satellite imagery will be available once verification begins.
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Satellite Imagery
        </Typography>
        
        {images.length > 1 && (
          <ToggleButtonGroup
            value={selectedImage}
            exclusive
            onChange={(_, newValue) => newValue !== null && setSelectedImage(newValue)}
            size="small"
          >
            <ToggleButton value={0}>
              <Satellite sx={{ mr: 0.5, fontSize: 18 }} />
              RGB
            </ToggleButton>
            <ToggleButton value={1}>
              <Terrain sx={{ mr: 0.5, fontSize: 18 }} />
              Infrared
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // 4:3 aspect ratio
          bgcolor: 'grey.200',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Placeholder for mock satellite image */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, #2e7d32 0%, #66bb6a 50%, #81c784 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'white', p: 2 }}>
              <Satellite sx={{ fontSize: 60, opacity: 0.7, mb: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Satellite Imagery Preview
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {landName}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.6 }}>
                {selectedImage === 0 ? 'RGB Mode' : 'Infrared Mode'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Note: This is a simulated satellite view. In production it will display live imagery from providers such as Sentinel or Landsat.
      </Typography>
    </Paper>
  )
}

