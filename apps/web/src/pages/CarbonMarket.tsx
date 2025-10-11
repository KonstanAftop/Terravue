import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add,
  ListAlt,
  Search,
  GridView,
  ViewList,
  Sort,
  ShowChart,
} from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { useMarketStore } from '../stores/marketStore'
import { CreditListingCard } from '../components/market/CreditListingCard'
import { MarketFilters } from '../components/market/MarketFilters'

export const CarbonMarketPage = () => {
  const navigate = useNavigate()
  const { isLandowner } = useAuth()
  const {
    credits,
    total,
    availableFilters,
    filters,
    sortBy,
    sortOrder,
    viewMode,
    loading,
    error,
    fetchMarketplaceCredits,
    setFilters,
    setSort,
    setViewMode,
    clearFilters,
    clearError,
  } = useMarketStore()

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMarketplaceCredits()
  }, [fetchMarketplaceCredits])

  const handleSearch = () => {
    setFilters({ search: searchQuery })
  }

  const handleSortChange = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSort(field, newOrder)
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Pasar Karbon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total} listing kredit karbon tersedia
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Market Analytics Button - Available for all users */}
            <Button
              startIcon={<ShowChart />}
              onClick={() => navigate('/market-analytics')}
              variant="outlined"
              color="primary"
            >
              Analitik Pasar
            </Button>
            
            {/* Landowner specific buttons */}
            {isLandowner && (
              <>
                <Button
                  startIcon={<ListAlt />}
                  onClick={() => navigate('/my-listings')}
                  variant="outlined"
                >
                  Listing Saya
                </Button>
                <Button
                  startIcon={<Add />}
                  onClick={() => navigate('/create-listing')}
                  variant="contained"
                  sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                >
                  Buat Listing
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Search and Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Cari kredit karbon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="small"
            sx={{ flex: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSearch}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Sort />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="createdAt">Terbaru</MenuItem>
            <MenuItem value="price">Harga</MenuItem>
            <MenuItem value="quantity">Jumlah</MenuItem>
          </TextField>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Main Content: Filters + Listings */}
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <MarketFilters
              filters={filters}
              availableFilters={availableFilters}
              onFilterChange={setFilters}
              onClear={clearFilters}
            />
          </Grid>

          {/* Listings Grid/List */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : credits.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Tidak ada listing yang ditemukan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coba ubah filter atau kata kunci pencarian Anda
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {credits.map((credit) => (
                  <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={credit.id}>
                    <CreditListingCard credit={credit} viewMode={viewMode} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  )
}

