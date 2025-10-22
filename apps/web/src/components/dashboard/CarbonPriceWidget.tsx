import { Stack, Typography, Box } from '@mui/material'
import { alpha, useTheme, type Theme } from '@mui/material/styles'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { MarketSummary } from '../../services/dashboardService'
import { WidgetContainer } from './WidgetContainer'

interface CarbonPriceWidgetProps {
  marketSummary: MarketSummary | null
}

export const CarbonPriceWidget = ({ marketSummary }: CarbonPriceWidgetProps) => {
  const theme = useTheme()

  const changeLabel =
    marketSummary && `${marketSummary.priceChange24h >= 0 ? '+' : ''}${marketSummary.priceChange24h.toFixed(2)}%`

  return (
    <WidgetContainer
      eyebrow="Market Pulse"
      title="Carbon Price Snapshot"
      spacing={2.5}
      sx={[
        (themeArg: Theme) => ({
          color: themeArg.palette.common.white,
          background: 'linear-gradient(140deg, rgba(18,82,60,0.96) 0%, rgba(33,122,88,0.94) 52%, rgba(30,104,129,0.9) 100%)',
          borderColor: alpha(themeArg.palette.common.white, 0.18),
          boxShadow: `0 30px 70px ${alpha(themeArg.palette.primary.dark, 0.45)}`,
          '&::after': { display: 'none' },
          '& .MuiTypography-overline': {
            color: alpha(themeArg.palette.common.white, 0.75),
          },
        }),
      ]}
    >
      <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
        Real-time carbon credit price with 24h movement.
      </Typography>
      {marketSummary ? (
        <Stack spacing={2.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: theme.palette.common.white,
                }}
              >
                IDR {marketSummary.currentPrice.toLocaleString('en-US')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: theme.palette.common.white }}>
                Spot price - refreshed moments ago
              </Typography>
            </Box>

            {changeLabel && (
              <Stack direction="row" spacing={1} alignItems="center">
        {marketSummary.priceChange24h >= 0 ? (
          <TrendingUp sx={{ fontSize: 20, color: alpha(theme.palette.success.light, 0.9) }} />
        ) : (
          <TrendingDown sx={{ fontSize: 20, color: alpha(theme.palette.error.light, 0.9) }} />
        )}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: theme.palette.common.white,
          }}
        >
          {changeLabel}
        </Typography>
              </Stack>
            )}
          </Stack>

          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.common.white }}>
              24h volume
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: theme.palette.common.white }}
            >
              {marketSummary.volume24h.toLocaleString('en-US')} credits
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: theme.palette.common.white }}>
            Market confidence remains {marketSummary.priceChange24h >= 0 ? 'positive' : 'cautious'} over the last 24 hours.
          </Typography>
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: theme.palette.common.white }}>
          Fetching the latest carbon market price...
        </Typography>
      )}
    </WidgetContainer>
  )
}

