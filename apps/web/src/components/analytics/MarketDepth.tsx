import React from 'react'
import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material'
import { MarketDepth as MarketDepthType } from '@terravue/shared'
import { formatCurrency, formatNumber } from '@terravue/shared'

interface MarketDepthProps {
  marketDepth: MarketDepthType
}

const MarketDepth: React.FC<MarketDepthProps> = ({ marketDepth }) => {
  // Get best bid and ask
  const bestBid = marketDepth.bids[0]
  const bestAsk = marketDepth.asks[0]

  // Calculate max volume for scaling
  const maxBidVolume = Math.max(...marketDepth.bids.map((b) => b.quantity))
  const maxAskVolume = Math.max(...marketDepth.asks.map((a) => a.quantity))
  const maxVolume = Math.max(maxBidVolume, maxAskVolume)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Market Depth (Order Book)
        </Typography>

        {/* Spread Information */}
        <Box mb={3} p={2} bgcolor="background.default" borderRadius={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Best Bid
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {bestBid ? formatCurrency(bestBid.price) : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {bestBid ? `${formatNumber(bestBid.quantity)} credits` : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Spread
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(marketDepth.spread)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {marketDepth.spreadPercent.toFixed(2)}%
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">
                Best Ask
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="error.main">
                {bestAsk ? formatCurrency(bestAsk.price) : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {bestAsk ? `${formatNumber(bestAsk.quantity)} credits` : ''}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {/* Bids (Buy Orders) */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" color="success.main" gutterBottom>
              Bids (Buy Orders)
            </Typography>

            <Box>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption" color="text.secondary" sx={{ width: '33%' }}>
                  Price
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="right"
                  sx={{ width: '33%' }}
                >
                  Quantity
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="right"
                  sx={{ width: '33%' }}
                >
                  Total
                </Typography>
              </Box>

              <Divider sx={{ mb: 1 }} />

              {/* Bid Rows */}
              {marketDepth.bids.slice(0, 10).map((bid, index) => {
                const widthPercent = (bid.quantity / maxVolume) * 100

                return (
                  <Box
                    key={index}
                    position="relative"
                    mb={0.5}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {/* Background bar */}
                    <Box
                      position="absolute"
                      right={0}
                      top={0}
                      bottom={0}
                      width={`${widthPercent}%`}
                      bgcolor="success.light"
                      sx={{ opacity: 0.1 }}
                    />

                    {/* Content */}
                    <Box display="flex" justifyContent="space-between" position="relative" py={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ width: '33%' }}
                        color="success.main"
                        fontWeight="medium"
                      >
                        {formatCurrency(bid.price)}
                      </Typography>
                      <Typography variant="body2" align="right" sx={{ width: '33%' }}>
                        {formatNumber(bid.quantity)}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{ width: '33%' }}
                        color="text.secondary"
                      >
                        {formatCurrency(bid.price * bid.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}

              {/* Total Bid Volume */}
              <Box mt={2} p={1} bgcolor="success.light" borderRadius={1} sx={{ opacity: 0.2 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Bid Volume: {formatNumber(marketDepth.totalBidVolume)} credits
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Asks (Sell Orders) */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
              Asks (Sell Orders)
            </Typography>

            <Box>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="caption" color="text.secondary" sx={{ width: '33%' }}>
                  Price
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="right"
                  sx={{ width: '33%' }}
                >
                  Quantity
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="right"
                  sx={{ width: '33%' }}
                >
                  Total
                </Typography>
              </Box>

              <Divider sx={{ mb: 1 }} />

              {/* Ask Rows */}
              {marketDepth.asks.slice(0, 10).map((ask, index) => {
                const widthPercent = (ask.quantity / maxVolume) * 100

                return (
                  <Box
                    key={index}
                    position="relative"
                    mb={0.5}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {/* Background bar */}
                    <Box
                      position="absolute"
                      right={0}
                      top={0}
                      bottom={0}
                      width={`${widthPercent}%`}
                      bgcolor="error.light"
                      sx={{ opacity: 0.1 }}
                    />

                    {/* Content */}
                    <Box display="flex" justifyContent="space-between" position="relative" py={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ width: '33%' }}
                        color="error.main"
                        fontWeight="medium"
                      >
                        {formatCurrency(ask.price)}
                      </Typography>
                      <Typography variant="body2" align="right" sx={{ width: '33%' }}>
                        {formatNumber(ask.quantity)}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{ width: '33%' }}
                        color="text.secondary"
                      >
                        {formatCurrency(ask.price * ask.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}

              {/* Total Ask Volume */}
              <Box mt={2} p={1} bgcolor="error.light" borderRadius={1} sx={{ opacity: 0.2 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Ask Volume: {formatNumber(marketDepth.totalAskVolume)} credits
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Market Liquidity Info */}
        <Box mt={3} p={2} bgcolor="background.default" borderRadius={1}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Market Liquidity
          </Typography>
          <Typography variant="body2">
            The market depth shows <strong>{marketDepth.bids.length}</strong> bid levels and{' '}
            <strong>{marketDepth.asks.length}</strong> ask levels with a spread of{' '}
            <strong>{marketDepth.spreadPercent.toFixed(2)}%</strong>.{' '}
            {marketDepth.spreadPercent < 2
              ? 'Tight spread indicates good liquidity.'
              : marketDepth.spreadPercent < 5
                ? 'Moderate spread with fair liquidity.'
                : 'Wide spread may indicate lower liquidity.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MarketDepth

