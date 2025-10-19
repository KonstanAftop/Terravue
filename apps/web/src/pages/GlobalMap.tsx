import { useEffect, useState, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Button,
  ButtonGroup,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  FilterList,
  Layers,
  Close,
  Verified,
  Landscape,
} from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { LandParcel } from '@terravue/shared'
import { formatCurrency, formatNumber } from '@terravue/shared'
import { calculatePolygonArea } from '../utils/mapUtils'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LandWithOwner extends LandParcel {
  ownerName: string
  ownerType: string
}

type MapLayer = 'street' | 'satellite' | 'terrain'
type LandType = 'all' | 'primary-forest' | 'secondary-forest' | 'plantation-forest' | 'agroforestry' | 'degraded-land'

// Custom icons for different land types
const createCustomIcon = (landType: string, verified: boolean) => {
  const color = verified ? '#4caf50' : '#ff9800'
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

function MapBoundsUpdater({ lands }: { lands: LandWithOwner[] }) {
  const map = useMap()

  useEffect(() => {
    if (lands.length > 0 && map) {
      const bounds = lands
        .filter(land => land.coordinates.length > 0)
        .map(land => [land.coordinates[0].lat, land.coordinates[0].lng] as [number, number])

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 })
      }
    }
  }, [lands, map])

  return null
}

export const GlobalMapPage = () => {
  const [lands, setLands] = useState<LandWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLayer, setCurrentLayer] = useState<MapLayer>('street')
  const [search, setSearch] = useState('')
  const [landTypeFilter, setLandTypeFilter] = useState<LandType>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [selectedLand, setSelectedLand] = useState<LandWithOwner | null>(null)

  useEffect(() => {
    fetchGlobalLands()
  }, [landTypeFilter])

  const fetchGlobalLands = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (landTypeFilter !== 'all') {
        params.append('landType', landTypeFilter)
      }

      const response = await fetch(`http://localhost:8000/api/v1/lands/global?${params}`)
      const data = await response.json()

      if (data.success) {
        setLands(data.data.lands)
      } else {
        setError(data.error || 'Failed to fetch lands')
      }
    } catch (err) {
      console.error('Error fetching global lands:', err)
      setError('Failed to load global map data')
    } finally {
      setLoading(false)
    }
  }

  const filteredLands = useMemo(() => {
    if (!search) return lands

    const searchLower = search.toLowerCase()
    return lands.filter(
      (land) =>
        land.name.toLowerCase().includes(searchLower) ||
        land.ownerName.toLowerCase().includes(searchLower),
    )
  }, [lands, search])

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

  const landTypeLabels: Record<string, string> = {
    'primary-forest': 'Primary Forest',
    'secondary-forest': 'Secondary Forest',
    'plantation-forest': 'Plantation Forest',
    'agroforestry': 'Agroforestry',
    'degraded-land': 'Degraded Land',
  }

  const stats = useMemo(() => {
    return {
      total: filteredLands.length,
      verified: filteredLands.filter((l) => l.verificationStatus === 'verified').length,
      totalArea: filteredLands.reduce((sum, l) => sum + l.area, 0),
      totalCarbon: filteredLands.reduce((sum, l) => sum + (l.carbonPotential || 0), 0),
    }
  }, [filteredLands])

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Global Monitoring"
        title="Global Project Atlas"
        subtitle="Explore verified and pending carbon projects across regions with rich geospatial context."
      />
      <Box sx={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
        {/* Top Control Bar */}
        <Paper
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            zIndex: 1000,
            p: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" sx={{ flexGrow: 0, minWidth: 150 }}>
              Global Carbon Map
            </Typography>

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search projects or owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />

            {/* Layer Controls */}
            <ButtonGroup size="small">
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

            {/* Filter Button */}
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'default'}
            >
              <FilterList />
            </IconButton>

            {/* Legend Toggle */}
            <IconButton
              onClick={() => setShowLegend(!showLegend)}
              color={showLegend ? 'primary' : 'default'}
            >
              <Layers />
            </IconButton>
          </Stack>

          {/* Stats Bar */}
          <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
            <Chip label={`${stats.total} Projects`} color="primary" />
            <Chip
              label={`${stats.verified} Verified`}
              icon={<Verified />}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${formatNumber(stats.totalArea)} ha`}
              icon={<Landscape />}
              variant="outlined"
            />
            <Chip
              label={`${formatNumber(stats.totalCarbon)} tons CO₂`}
              variant="outlined"
            />
          </Stack>
        </Paper>

        {/* Filters Drawer */}
        <Drawer
          anchor="right"
          open={showFilters}
          onClose={() => setShowFilters(false)}
          PaperProps={{ sx: { width: 300, p: 3 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton size="small" onClick={() => setShowFilters(false)}>
              <Close />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Land Type</InputLabel>
            <Select
              value={landTypeFilter}
              onChange={(e) => setLandTypeFilter(e.target.value as LandType)}
              label="Land Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="primary-forest">Primary Forest</MenuItem>
              <MenuItem value="secondary-forest">Secondary Forest</MenuItem>
              <MenuItem value="plantation-forest">Plantation Forest</MenuItem>
              <MenuItem value="agroforestry">Agroforestry</MenuItem>
              <MenuItem value="degraded-land">Degraded Land</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" fullWidth onClick={() => setLandTypeFilter('all')}>
            Clear Filters
          </Button>
        </Drawer>

        {/* Legend */}
        {showLegend && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              zIndex: 1000,
              p: 2,
              minWidth: 200,
            }}
          >
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Legend
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#4caf50',
                    border: '2px solid white',
                  }}
                />
                <Typography variant="caption">Verified</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#ff9800',
                    border: '2px solid white',
                  }}
                />
                <Typography variant="caption">Pending</Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Loading/Error States */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ position: 'absolute', top: 120, left: 16, right: 16, zIndex: 1000 }}
          >
            {error}
          </Alert>
        )}

        {/* Map */}
        <MapContainer
          center={[-2.5489, 118.0149]} // Indonesia center
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url={getTileLayerUrl()} attribution="&copy; OpenStreetMap contributors" />

          <MapBoundsUpdater lands={filteredLands} />

          <MarkerClusterGroup chunkedLoading>
            {filteredLands.map((land) => {
              if (land.coordinates.length === 0) return null

              const center = land.coordinates[0]
              const isVerified = land.verificationStatus === 'verified'

              return (
                <Marker
                  key={land.id}
                  position={[center.lat, center.lng]}
                  icon={createCustomIcon(land.landType, isVerified)}
                  eventHandlers={{
                    click: () => setSelectedLand(land),
                  }}
                >
                  <Popup maxWidth={300}>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {land.name}
                      </Typography>

                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Owner:
                          </Typography>
                          <Typography variant="body2">{land.ownerName}</Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Type:
                          </Typography>
                          <Typography variant="body2">
                            {landTypeLabels[land.landType] || land.landType}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Area:
                          </Typography>
                          <Typography variant="body2">{formatNumber(land.area)} hectares</Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Carbon Potential:
                          </Typography>
                          <Typography variant="body2">
                            {formatNumber(land.carbonPotential || 0)} tons CO₂
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Status:
                          </Typography>
                          <Chip
                            label={land.verificationStatus}
                            size="small"
                            color={isVerified ? 'success' : 'warning'}
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </Popup>

                  {/* Show polygon if coordinates available */}
                  {land.coordinates.length >= 3 && (
                    <Polygon
                      positions={land.coordinates.map((c) => [c.lat, c.lng] as [number, number])}
                      pathOptions={{
                        color: isVerified ? '#4caf50' : '#ff9800',
                        fillColor: isVerified ? '#4caf50' : '#ff9800',
                        fillOpacity: 0.2,
                      }}
                    />
                  )}
                </Marker>
              )
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </Box>
    </AppLayout>
  )
}
