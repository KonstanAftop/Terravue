import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Toolbar,
  Chip,
} from '@mui/material'
import { Add, GetApp, Delete } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useLandStore } from '../stores/landStore'
import { LandList } from '../components/land/LandList'
import { SearchFilters } from '../components/land/SearchFilters'
import { exportService } from '../services/exportService'

export const LandManagementPage = () => {
  const navigate = useNavigate()
  const {
    lands,
    total,
    page,
    totalPages,
    loading,
    selectedLands,
    fetchLands,
    setSearchParams,
    toggleLandSelection,
    selectAllLands,
    clearSelection,
  } = useLandStore()

  useEffect(() => {
    fetchLands()
  }, [])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value })
  }

  const handleSearch = (params: any) => {
    setSearchParams({ ...params, page: 1 })
  }

  const handleExport = () => {
    const landsToExport = selectedLands.length > 0
      ? lands.filter((land) => selectedLands.includes(land.id))
      : lands
    
    exportService.exportToCSV(landsToExport, `land-portfolio-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleExportAll = () => {
    exportService.exportToCSV(lands)
  }

  if (loading && lands.length === 0) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              Land Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your land portfolio and monitor verification status
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/land-management/add')}
            sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
          >
            Add Land
          </Button>
        </Box>

        {/* Search and Filters */}
        <SearchFilters onSearch={handleSearch} />

        {/* Bulk Actions Toolbar */}
        {selectedLands.length > 0 && (
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e9' }}>
            <Toolbar sx={{ px: 0, minHeight: 'auto' }}>
              <Chip
                label={`${selectedLands.length} land parcel${selectedLands.length === 1 ? '' : 's'} selected`}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Button
                size="small"
                startIcon={<GetApp />}
                onClick={handleExport}
                sx={{ mr: 1 }}
              >
                Export Selected
              </Button>
              <Button
                size="small"
                startIcon={<Delete />}
                color="error"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
            </Toolbar>
          </Paper>
        )}

        {/* Summary */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {lands.length} of {total} land parcels
          </Typography>
          <Button
            size="small"
            startIcon={<GetApp />}
            onClick={handleExportAll}
            variant="outlined"
          >
            Export All
          </Button>
        </Box>

        {/* Land List */}
        <LandList
          lands={lands}
          selectedLands={selectedLands}
          onToggleSelection={toggleLandSelection}
          onSelectAll={selectAllLands}
          onClearSelection={clearSelection}
          onViewDetails={(id) => navigate(`/land-management/${id}`)}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Box>
    </AppLayout>
  )
}

