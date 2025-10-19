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
  Paper,
  Stack,
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
import { PageHeader } from '../components/layout/PageHeader'
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
      <PageHeader
        eyebrow="Marketplace"
        title="Carbon Marketplace"
        subtitle={`${total} carbon credit listings available right now.`}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" startIcon={<ShowChart />} onClick={() => navigate('/market-analytics')}>
              Market Analytics
            </Button>
            {isLandowner && (
              <>
                <Button variant="outlined" startIcon={<ListAlt />} onClick={() => navigate('/my-listings')}>
                  My Listings
                </Button>
                <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create-listing')}>
                  Create Listing
                </Button>
              </>
            )}
          </Stack>
        }
      />

      <Stack spacing={3.5}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: '1px solid rgba(20,98,74,0.12)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search carbon credits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="small"
            sx={{ flex: 1, minWidth: 280 }}
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
            sx={{ minWidth: 160 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Sort />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="createdAt">Newest</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
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
        </Paper>

        {error && (
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <MarketFilters
              filters={filters}
              availableFilters={availableFilters}
              onFilterChange={setFilters}
              onClear={clearFilters}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : credits.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No listings found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or search keywords.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {credits.map((credit) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'grid' ? 6 : 12}
                    lg={viewMode === 'grid' ? 4 : 12}
                    key={credit.id}
                  >
                    <CreditListingCard credit={credit} viewMode={viewMode} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Stack>
    </AppLayout>
  )
}

