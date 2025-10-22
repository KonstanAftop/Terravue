import { alpha } from '@mui/material/styles'
import { Typography, List, ListItem, ListItemText, Box, Chip, Stack, Divider } from '@mui/material'
import { Receipt, Landscape } from '@mui/icons-material'
import { RecentActivity } from '../../services/dashboardService'
import { WidgetContainer } from './WidgetContainer'

interface RecentActivityWidgetProps {
  activities: RecentActivity[]
}

export const RecentActivityWidget = ({ activities }: RecentActivityWidgetProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <Receipt fontSize="small" />
      case 'land':
        return <Landscape fontSize="small" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    }
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  return (
    <WidgetContainer
      title="Recent Activity"
      subtitle="Latest updates from your transactions and land portfolio."
      spacing={2.5}
    >
      {activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No activity yet. As soon as events are recorded they will show up here.
        </Typography>
      ) : (
        <List disablePadding>
          {activities.map((activity, index) => {
            const paletteKey = activity.type === 'transaction' ? 'primary' : 'info'
            return (
              <Box key={activity.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    py: 1.25,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
                    <Box
                      sx={(theme) => ({
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: alpha(theme.palette[paletteKey].main, 0.12),
                        color: theme.palette[paletteKey].main,
                        flexShrink: 0,
                      })}
                      aria-hidden
                    >
                      {getIcon(activity.type)}
                    </Box>

                    <ListItemText
                      primaryTypographyProps={{ fontWeight: 600, sx: { mb: 0.5 } }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                      primary={activity.description}
                      secondary={formatDate(activity.timestamp)}
                    />

                    <Chip
                      label={activity.type === 'transaction' ? 'Transaction' : 'Land'}
                      size="small"
                      sx={(theme) => ({
                        alignSelf: 'center',
                        backgroundColor: alpha(theme.palette[paletteKey].main, 0.12),
                        color: theme.palette[paletteKey].main,
                        border: `1px solid ${alpha(theme.palette[paletteKey].main, 0.3)}`,
                        fontWeight: 600,
                      })}
                    />
                  </Stack>
                </ListItem>
                {index < activities.length - 1 && <Divider sx={{ borderColor: alpha('#ffffff', 0.12) }} />}
              </Box>
            )
          })}
        </List>
      )}
    </WidgetContainer>
  )
}

