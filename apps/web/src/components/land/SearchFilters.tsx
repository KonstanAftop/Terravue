import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
} from '@mui/material'
import { Search, FilterList, Clear } from '@mui/icons-material'

interface SearchFiltersProps {
  onSearch: (params: {
    search?: string
    status?: 'pending' | 'verified' | 'rejected' | ''
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => void
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected' | ''>('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const handleSearch = () => {
    onSearch({
      search: search || undefined,
      status: status || undefined,
      sortBy,
      sortOrder,
    })
  }

  const handleClear = () => {
    setSearch('')
    setStatus('')
    setSortBy('createdAt')
    setSortOrder('desc')
    onSearch({})
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Cari Lahan"
            placeholder="Nama atau jenis lahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value as any)
                setTimeout(handleSearch, 0)
              }}
            >
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="pending">Menunggu</MenuItem>
              <MenuItem value="verified">Terverifikasi</MenuItem>
              <MenuItem value="rejected">Ditolak</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Urutkan</InputLabel>
            <Select
              value={sortBy}
              label="Urutkan"
              onChange={(e) => {
                setSortBy(e.target.value)
                setTimeout(handleSearch, 0)
              }}
            >
              <MenuItem value="createdAt">Tanggal Daftar</MenuItem>
              <MenuItem value="name">Nama</MenuItem>
              <MenuItem value="area">Luas</MenuItem>
              <MenuItem value="verificationStatus">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Urutan</InputLabel>
            <Select
              value={sortOrder}
              label="Urutan"
              onChange={(e) => {
                setSortOrder(e.target.value as 'asc' | 'desc')
                setTimeout(handleSearch, 0)
              }}
            >
              <MenuItem value="desc">Terbaru</MenuItem>
              <MenuItem value="asc">Terlama</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClear}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

