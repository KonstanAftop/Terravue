import { Box, TextField, MenuItem, Button, Paper, Typography, Slider } from '@mui/material'
import { FilterList, Clear } from '@mui/icons-material'
import { useState, useEffect } from 'react'

interface MarketFiltersProps {
  filters: any
  availableFilters: any
  onFilterChange: (filters: any) => void
  onClear: () => void
}

export const MarketFilters = ({ filters, availableFilters, onFilterChange, onClear }: MarketFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState<number[]>([
    availableFilters?.priceRange?.min || 0,
    availableFilters?.priceRange?.max || 1000000,
  ])

  useEffect(() => {
    if (availableFilters?.priceRange) {
      setPriceRange([
        localFilters.minPrice || availableFilters.priceRange.min,
        localFilters.maxPrice || availableFilters.priceRange.max,
      ])
    }
  }, [availableFilters, localFilters])

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[])
  }

  const handlePriceCommit = () => {
    setLocalFilters({
      ...localFilters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    })
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleClear = () => {
    setLocalFilters({})
    setPriceRange([
      availableFilters?.priceRange?.min || 0,
      availableFilters?.priceRange?.max || 1000000,
    ])
    onClear()
  }

  const landTypes = [
    { value: 'primary-forest', label: 'Primary Forest' },
    { value: 'secondary-forest', label: 'Secondary Forest' },
    { value: 'plantation-forest', label: 'Plantation Forest' },
    { value: 'agroforestry', label: 'Agroforestry' },
    { value: 'degraded-land', label: 'Degraded Land' },
  ]

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterList />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filter
        </Typography>
      </Box>

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Price Range (per credit)
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          onChangeCommitted={handlePriceCommit}
          valueLabelDisplay="auto"
          min={availableFilters?.priceRange?.min || 0}
          max={availableFilters?.priceRange?.max || 1000000}
          valueLabelFormat={(value) => `IDR ${value.toLocaleString('en-US')}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            IDR {priceRange[0].toLocaleString('en-US')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            IDR {priceRange[1].toLocaleString('en-US')}
          </Typography>
        </Box>
      </Box>

      {/* Land Type Filter */}
      <TextField
        select
        fullWidth
        label="Land Type"
        value={localFilters.landType || ''}
        onChange={(e) => setLocalFilters({ ...localFilters, landType: e.target.value })}
        margin="normal"
        size="small"
      >
        <MenuItem value="">All Types</MenuItem>
        {landTypes.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Minimum Quantity Filter */}
      <TextField
        fullWidth
        label="Minimum Quantity (credits)"
        type="number"
        value={localFilters.minQuantity || ''}
        onChange={(e) => setLocalFilters({ ...localFilters, minQuantity: parseInt(e.target.value) || undefined })}
        margin="normal"
        size="small"
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
        >
          Apply
        </Button>
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClear}
        >
          Reset
        </Button>
      </Box>

      {/* Filter Summary */}
      {availableFilters && (
        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {availableFilters.totalListings} listings available
          </Typography>
        </Box>
      )}
    </Paper>
  )
}


