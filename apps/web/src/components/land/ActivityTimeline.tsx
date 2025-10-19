import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab'
import { Paper, Typography, Box, Chip } from '@mui/material'
import {
  Add,
  Edit,
  VerifiedUser,
  CheckCircle,
  UploadFile,
  ChangeCircle,
} from '@mui/icons-material'
import { LandActivity } from '@terravue/shared'

interface ActivityTimelineProps {
  activities: LandActivity[]
}

const activityConfig = {
  created: {
    icon: Add,
    color: 'primary' as const,
    label: 'Created',
  },
  updated: {
    icon: Edit,
    color: 'info' as const,
    label: 'Updated',
  },
  verification_started: {
    icon: VerifiedUser,
    color: 'warning' as const,
    label: 'Verification Started',
  },
  verification_completed: {
    icon: CheckCircle,
    color: 'success' as const,
    label: 'Verification Completed',
  },
  documents_uploaded: {
    icon: UploadFile,
    color: 'secondary' as const,
    label: 'Documents Uploaded',
  },
  status_changed: {
    icon: ChangeCircle,
    color: 'info' as const,
    label: 'Status Updated',
  },
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  if (activities.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Activity History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No activity yet
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Activity History
      </Typography>

      <Timeline sx={{ p: 0, m: 0 }}>
        {activities.map((activity, index) => {
          const config = activityConfig[activity.activityType]
          const Icon = config.icon
          const isLast = index === activities.length - 1

          return (
            <TimelineItem key={activity.id}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0', flex: 0.3, pr: 2 }}
                variant="caption"
                color="text.secondary"
              >
                {new Date(activity.createdAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color={config.color} sx={{ boxShadow: 2 }}>
                  <Icon sx={{ fontSize: 18 }} />
                </TimelineDot>
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: 1.5, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip
                    label={config.label}
                    size="small"
                    color={config.color}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {activity.description}
                </Typography>
                
                {activity.userName && (
                  <Typography variant="caption" color="text.secondary">
                    by {activity.userName}
                  </Typography>
                )}
                
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </Typography>
                  </Box>
                )}
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Paper>
  )
}

