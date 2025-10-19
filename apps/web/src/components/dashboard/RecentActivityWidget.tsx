import { alpha } from '@mui/material/styles'
import { Paper, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material'
import { Receipt, Landscape } from '@mui/icons-material'
import { RecentActivity } from '../../services/dashboardService'

interface RecentActivityWidgetProps {
  activities: RecentActivity[]
}

export const RecentActivityWidget = ({ activities }: RecentActivityWidgetProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <Receipt color="primary" />
      case 'land':
        return <Landscape color="info" />
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
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    } else {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Recent Activity
      </Typography>
      {activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No activity yet
        </Typography>
      ) : (
        <List>
          {activities.map((activity) => (
            <ListItem key={activity.id} sx={{ px: 0 }}>
              <Box sx={{ mr: 2 }}>{getIcon(activity.type)}</Box>
              <ListItemText
                primary={activity.description}
                secondary={formatDate(activity.timestamp)}
              />
              <Chip
                label={activity.type === 'transaction' ? 'Transaction' : 'Land'}
                size="small"
                sx={(theme) => {
                  const paletteColor =
                    activity.type === 'transaction'
                      ? theme.palette.primary.main
                      : theme.palette.info.main
                  return {
                    backgroundColor: alpha(paletteColor, 0.18),
                    color: paletteColor,
                    border: `1px solid ${alpha(paletteColor, 0.35)}`,
                    fontWeight: 600,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )
}

