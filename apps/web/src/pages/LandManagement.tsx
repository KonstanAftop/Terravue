import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { alpha, Box, Typography, Button, CircularProgress, Pagination, Paper, Toolbar, Chip, Stack } from '@mui/material'
import { Add, GetApp, Delete } from '@mui/icons-material'
import { AppLayout } from '../components/layout/AppLayout'
import { useLandStore } from '../stores/landStore'
import { LandList } from '../components/land/LandList'
import { SearchFilters } from '../components/land/SearchFilters'
import { exportService } from '../services/exportService'
import { PageHeader } from '../components/layout/PageHeader'

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
      <PageHeader
        eyebrow="Portfolio"
        title="Land Management"
        subtitle="Manage your registered parcels and track verification progress."
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/land-management/add')}>
            Add Land
          </Button>
        }
      />

      <Stack spacing={3.5}>
        <SearchFilters onSearch={handleSearch} />

        {selectedLands.length > 0 && (
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            })}
          >
            <Toolbar sx={{ px: 0, minHeight: 'auto' }}>
              <Chip
                label={`${selectedLands.length} land parcel${selectedLands.length === 1 ? '' : 's'} selected`}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Button size="small" startIcon={<GetApp />} onClick={handleExport} sx={{ mr: 1 }}>
                Export Selected
              </Button>
              <Button size="small" startIcon={<Delete />} color="error" onClick={clearSelection}>
                Clear Selection
              </Button>
            </Toolbar>
          </Paper>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {lands.length} of {total} land parcels
          </Typography>
          <Button size="small" variant="outlined" startIcon={<GetApp />} onClick={handleExportAll}>
            Export All
          </Button>
        </Stack>

        <LandList
          lands={lands}
          selectedLands={selectedLands}
          onToggleSelection={toggleLandSelection}
          onSelectAll={selectAllLands}
          onClearSelection={clearSelection}
          onViewDetails={(id) => navigate(`/land-management/${id}`)}
        />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" />
          </Box>
        )}
      </Stack>
    </AppLayout>
  )
}

