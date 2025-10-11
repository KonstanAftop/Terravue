import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material'
import {
  Login,
  Landscape,
  ShowChart,
  Payment,
  Person,
  Settings,
} from '@mui/icons-material'
import { api } from '../../services/api'
import { UserActivity } from '@terravue/shared'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'login':
    case 'logout':
      return <Login />
    case 'land_registration':
    case 'land_update':
    case 'land_verification':
      return <Landscape />
    case 'credit_listing':
    case 'credit_purchase':
    case 'credit_sale':
      return <ShowChart />
    case 'transaction_initiated':
    case 'transaction_completed':
    case 'transaction_failed':
      return <Payment />
    case 'profile_update':
      return <Person />
    case 'settings_change':
      return <Settings />
    default:
      return <Settings />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'login':
      return 'primary'
    case 'land_registration':
    case 'credit_listing':
      return 'success'
    case 'transaction_completed':
      return 'info'
    case 'transaction_failed':
      return 'error'
    default:
      return 'grey'
  }
}

export const ActivityTimeline = () => {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await api.get('/activity')
      const timeline = response.data.data.timeline
      // Flatten the timeline object into an array
      const allActivities: UserActivity[] = []
      Object.values(timeline).forEach((dayActivities: any) => {
        allActivities.push(...dayActivities)
      })
      setActivities(allActivities)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
    setLoading(false)
  }

  const handleInitializeSampleData = async () => {
    setInitializing(true)
    try {
      await api.post('/activity/initialize')
      await fetchActivities()
    } catch (error) {
      console.error('Failed to initialize sample data:', error)
    }
    setInitializing(false)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No activities yet
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your platform activities will appear here
        </Typography>
        <Button
          variant="outlined"
          onClick={handleInitializeSampleData}
          disabled={initializing}
          sx={{ mt: 2 }}
        >
          {initializing ? 'Loading...' : 'Load Sample Data'}
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Activity Timeline</Typography>
        <Button size="small" onClick={fetchActivities}>
          Refresh
        </Button>
      </Box>
      <List>
        {activities.map((activity, index) => (
          <Box key={activity.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ListItemIcon sx={{ mt: 1 }}>
                <Box
                  sx={{
                    bgcolor: `${getActivityColor(activity.type)}.main`,
                    color: 'white',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {activity.type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Typography>
                    <Chip
                      label={activity.type}
                      size="small"
                      color={getActivityColor(activity.type) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <Box sx={{ mt: 1, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <Typography
                            key={key}
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            <strong>{key}:</strong> {JSON.stringify(value)}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  )
}

