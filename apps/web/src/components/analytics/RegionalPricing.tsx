import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Paper,
} from '@mui/material'
import { RegionalPricing as RegionalPricingType } from '@terravue/shared'
import { formatCurrency, formatNumber } from '@terravue/shared'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface RegionalPricingProps {
  regionalData: RegionalPricingType[]
}

type OrderDirection = 'asc' | 'desc'
type SortField = 'province' | 'currentPrice' | 'priceChange24h' | 'volume24h' | 'activeListings'

const RegionalPricing: React.FC<RegionalPricingProps> = ({ regionalData }) => {
  const [orderBy, setOrderBy] = useState<SortField>('currentPrice')
  const [order, setOrder] = useState<OrderDirection>('desc')

  const handleSort = (field: SortField) => {
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
  }

  const sortedData = React.useMemo(() => {
    return [...regionalData].sort((a, b) => {
      let aValue: any = a[orderBy]
      let bValue: any = b[orderBy]

      if (orderBy === 'province') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return order === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [regionalData, order, orderBy])

  // Group by region for summary
  const regionSummary = React.useMemo(() => {
    const summary = new Map<string, { avgPrice: number; totalVolume: number; count: number }>()

    regionalData.forEach((data) => {
      const existing = summary.get(data.region) || { avgPrice: 0, totalVolume: 0, count: 0 }
      summary.set(data.region, {
        avgPrice: existing.avgPrice + data.currentPrice,
        totalVolume: existing.totalVolume + data.volume24h,
        count: existing.count + 1,
      })
    })

    return Array.from(summary.entries())
      .map(([region, data]) => ({
        region,
        avgPrice: data.avgPrice / data.count,
        totalVolume: data.totalVolume,
      }))
      .sort((a, b) => b.avgPrice - a.avgPrice)
  }, [regionalData])

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Regional Pricing Analysis
        </Typography>

        {/* Region Summary */}
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Top Regions by Price
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {regionSummary.slice(0, 5).map((region) => (
              <Chip
                key={region.region}
                icon={<LocationOnIcon />}
                label={`${region.region}: ${formatCurrency(Math.round(region.avgPrice))}`}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>

        {/* Province Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'province'}
                    direction={orderBy === 'province' ? order : 'asc'}
                    onClick={() => handleSort('province')}
                  >
                    Province
                  </TableSortLabel>
                </TableCell>
                <TableCell>Region</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'currentPrice'}
                    direction={orderBy === 'currentPrice' ? order : 'asc'}
                    onClick={() => handleSort('currentPrice')}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'priceChange24h'}
                    direction={orderBy === 'priceChange24h' ? order : 'asc'}
                    onClick={() => handleSort('priceChange24h')}
                  >
                    24h Change
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'volume24h'}
                    direction={orderBy === 'volume24h' ? order : 'asc'}
                    onClick={() => handleSort('volume24h')}
                  >
                    Volume
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'activeListings'}
                    direction={orderBy === 'activeListings' ? order : 'asc'}
                    onClick={() => handleSort('activeListings')}
                  >
                    Listings
                  </TableSortLabel>
                </TableCell>
                <TableCell>Land Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.province} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {row.province}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.region}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(row.currentPrice)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      {row.priceChange24h > 0 ? (
                        <TrendingUpIcon fontSize="small" color="success" />
                      ) : (
                        <TrendingDownIcon fontSize="small" color="error" />
                      )}
                      <Typography
                        variant="body2"
                        color={row.priceChange24h > 0 ? 'success.main' : 'error.main'}
                        fontWeight="medium"
                      >
                        {row.priceChange24h > 0 ? '+' : ''}
                        {row.priceChange24h.toFixed(2)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatNumber(row.volume24h)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{row.activeListings}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.dominantLandType} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Stats */}
        <Box mt={2} p={2} bgcolor="background.default" borderRadius={1}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Market Coverage
          </Typography>
          <Typography variant="body2">
            <strong>{regionalData.length}</strong> provinces across <strong>{regionSummary.length}</strong> regions
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RegionalPricing

