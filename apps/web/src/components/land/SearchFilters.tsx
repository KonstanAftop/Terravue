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
            label="Search Land"
            placeholder="Land name or type..."
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
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => {
                setSortBy(e.target.value)
                setTimeout(handleSearch, 0)
              }}
            >
              <MenuItem value="createdAt">Date Added</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="area">Area</MenuItem>
              <MenuItem value="verificationStatus">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => {
                setSortOrder(e.target.value as 'asc' | 'desc')
                setTimeout(handleSearch, 0)
              }}
            >
              <MenuItem value="desc">Newest</MenuItem>
              <MenuItem value="asc">Oldest</MenuItem>
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

