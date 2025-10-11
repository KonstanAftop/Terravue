import { useState, useRef, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Alert,
  Chip,
  Stack,
  Divider,
} from '@mui/material'
import {
  Edit,
  Delete,
  Save,
  Cancel,
  MyLocation,
  Layers,
  Download,
} from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { GeoCoordinate } from '@terravue/shared'
import {
  calculatePolygonArea,
  formatCoordinate,
  validateBoundary,
  convertArea,
} from '../utils/mapUtils'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type MapLayer = 'street' | 'satellite' | 'terrain'

interface DrawingComponentProps {
  isDrawing: boolean
  onPointAdded: (lat: number, lng: number) => void
}

function DrawingComponent({ isDrawing, onPointAdded }: DrawingComponentProps) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onPointAdded(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export const InteractiveMapPage = () => {
  const [coordinates, setCoordinates] = useState<GeoCoordinate[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLayer, setCurrentLayer] = useState<MapLayer>('street')
  const [landName, setLandName] = useState('')
  const [cursorPosition, setCursorPosition] = useState<GeoCoordinate | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const mapRef = useRef<any>(null)

  // Default center for Indonesia
  const defaultCenter: [number, number] = [-2.5489, 118.0149]
  const defaultZoom = 5

  const handlePointAdded = useCallback(
    (lat: number, lng: number) => {
      const newPoint: GeoCoordinate = { lat, lng }
      setCoordinates((prev) => [...prev, newPoint])
    },
    [],
  )

  const startDrawing = () => {
    setIsDrawing(true)
    setCoordinates([])
    setValidationResult(null)
  }

  const finishDrawing = () => {
    if (coordinates.length >= 3) {
      // Close the polygon by adding the first point at the end
      const closedCoords = [...coordinates, coordinates[0]]
      setCoordinates(closedCoords)
      const result = validateBoundary(closedCoords)
      setValidationResult(result)
    }
    setIsDrawing(false)
  }

  const cancelDrawing = () => {
    setIsDrawing(false)
    setCoordinates([])
    setValidationResult(null)
  }

  const clearBoundary = () => {
    setCoordinates([])
    setValidationResult(null)
  }

  const saveBoundary = () => {
    if (coordinates.length < 3) {
      alert('Please draw a boundary first')
      return
    }

    if (!landName.trim()) {
      alert('Please enter a name for the land parcel')
      return
    }

    const validation = validateBoundary(coordinates)
    if (!validation.isValid) {
      alert(`Cannot save: ${validation.errors.join(', ')}`)
      return
    }

    // Save to local storage
    const boundaryData = {
      name: landName,
      coordinates,
      area: calculatePolygonArea(coordinates),
      createdAt: new Date().toISOString(),
    }

    const existingBoundaries = JSON.parse(localStorage.getItem('boundaries') || '[]')
    existingBoundaries.push(boundaryData)
    localStorage.setItem('boundaries', JSON.stringify(existingBoundaries))

    alert('Boundary saved successfully!')
    setLandName('')
    clearBoundary()
  }

  const exportBoundary = () => {
    if (coordinates.length < 3) {
      alert('Please draw a boundary first')
      return
    }

    const geojson = {
      type: 'Feature',
      properties: {
        name: landName || 'Unnamed Boundary',
        area: calculatePolygonArea(coordinates),
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates.map((c) => [c.lng, c.lat])],
      },
    }

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `boundary-${Date.now()}.geojson`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTileLayerUrl = () => {
    switch (currentLayer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
      case 'street':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  }

  const area = coordinates.length >= 3 ? calculatePolygonArea(coordinates) : 0

  return (
    <AppLayout>
      <Box sx={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
        {/* Control Panel */}
        <Paper
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            p: 2,
            minWidth: 300,
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Interactive Land Mapping
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Land Parcel Name"
            value={landName}
            onChange={(e) => setLandName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack spacing={1}>
            <ButtonGroup fullWidth size="small">
              <Button
                variant={isDrawing ? 'contained' : 'outlined'}
                onClick={startDrawing}
                disabled={isDrawing}
                startIcon={<Edit />}
              >
                Draw
              </Button>
              <Button
                variant="outlined"
                onClick={finishDrawing}
                disabled={!isDrawing || coordinates.length < 3}
                startIcon={<Save />}
              >
                Finish
              </Button>
              <Button
                variant="outlined"
                onClick={cancelDrawing}
                disabled={!isDrawing}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
            </ButtonGroup>

            <ButtonGroup fullWidth size="small">
              <Button onClick={saveBoundary} disabled={coordinates.length < 3} startIcon={<Save />}>
                Save
              </Button>
              <Button onClick={clearBoundary} disabled={coordinates.length === 0} startIcon={<Delete />}>
                Clear
              </Button>
              <Button onClick={exportBoundary} disabled={coordinates.length < 3} startIcon={<Download />}>
                Export
              </Button>
            </ButtonGroup>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Layer Controls */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Map Layer
            </Typography>
            <ButtonGroup fullWidth size="small">
              <Button
                variant={currentLayer === 'street' ? 'contained' : 'outlined'}
                onClick={() => setCurrentLayer('street')}
              >
                Street
              </Button>
              <Button
                variant={currentLayer === 'satellite' ? 'contained' : 'outlined'}
                onClick={() => setCurrentLayer('satellite')}
              >
                Satellite
              </Button>
              <Button
                variant={currentLayer === 'terrain' ? 'contained' : 'outlined'}
                onClick={() => setCurrentLayer('terrain')}
              >
                Terrain
              </Button>
            </ButtonGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Statistics */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Boundary Information
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vertices:
                </Typography>
                <Typography variant="body2">{coordinates.length}</Typography>
              </Box>
              {area > 0 && (
                <>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Area:
                    </Typography>
                    <Typography variant="body2">
                      {area.toFixed(2)} hectares ({convertArea(area, 'acres').toFixed(2)} acres)
                    </Typography>
                  </Box>
                </>
              )}
              {cursorPosition && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cursor Position:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {formatCoordinate(cursorPosition)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Validation Results */}
          {validationResult && (
            <Box sx={{ mt: 2 }}>
              {validationResult.isValid ? (
                <Alert severity="success">Boundary is valid!</Alert>
              ) : (
                <Alert severity="error">
                  {validationResult.errors.map((err: string, i: number) => (
                    <div key={i}>{err}</div>
                  ))}
                </Alert>
              )}
              {validationResult.warnings.length > 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {validationResult.warnings.map((warn: string, i: number) => (
                    <div key={i}>{warn}</div>
                  ))}
                </Alert>
              )}
            </Box>
          )}

          {isDrawing && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Click on the map to add vertices. Click "Finish" when done.
            </Alert>
          )}
        </Paper>

        {/* Map */}
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer url={getTileLayerUrl()} attribution='&copy; OpenStreetMap contributors' />

          <DrawingComponent isDrawing={isDrawing} onPointAdded={handlePointAdded} />

          {/* Draw polygon */}
          {coordinates.length >= 3 && (
            <Polygon
              positions={coordinates.map((c) => [c.lat, c.lng] as [number, number])}
              pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.3 }}
            />
          )}

          {/* Draw markers for each vertex */}
          {coordinates.map((coord, index) => (
            <Marker key={index} position={[coord.lat, coord.lng]}>
              <Popup>
                Vertex {index + 1}
                <br />
                {formatCoordinate(coord)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </AppLayout>
  )
}

