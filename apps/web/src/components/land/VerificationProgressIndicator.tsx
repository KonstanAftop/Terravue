import { Box, Typography, LinearProgress, Chip, Paper, Stack } from '@mui/material'
import { CheckCircle, RadioButtonUnchecked, Schedule } from '@mui/icons-material'
import { VerificationProgress, VERIFICATION_STAGES } from '@terravue/shared'

interface VerificationProgressIndicatorProps {
  progress: VerificationProgress
}

export const VerificationProgressIndicator = ({ progress }: VerificationProgressIndicatorProps) => {
  const getStageIcon = (stageName: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
    }
    if (progress.currentStage === stageName) {
      return <Schedule sx={{ color: 'warning.main', fontSize: 20 }} />
    }
    return <RadioButtonUnchecked sx={{ color: 'grey.400', fontSize: 20 }} />
  }

  const getStageColor = (stageName: string, completed: boolean): 'success' | 'warning' | 'default' => {
    if (completed) return 'success'
    if (progress.currentStage === stageName) return 'warning'
    return 'default'
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Progress Verifikasi
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {progress.completionPercentage}% Selesai
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.currentStage === 'completed' ? 'Verifikasi Selesai' : 'Sedang Proses'}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress.completionPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              bgcolor: progress.currentStage === 'completed' ? 'success.main' : 'primary.main',
            },
          }}
        />
      </Box>

      <Stack spacing={2}>
        {Object.entries(VERIFICATION_STAGES).map(([stageKey, stageConfig]) => {
          const stageDetail = progress.stageDetails[stageKey as keyof typeof progress.stageDetails]
          const isCompleted = stageDetail?.completed || false
          const isCurrent = progress.currentStage === stageKey

          return (
            <Box
              key={stageKey}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: isCurrent ? 'action.hover' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              {getStageIcon(stageKey, isCompleted)}
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: isCurrent ? 600 : 400 }}>
                  {stageConfig.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stageConfig.description}
                </Typography>
              </Box>

              <Chip
                label={isCompleted ? 'Selesai' : isCurrent ? 'Sedang Proses' : 'Menunggu'}
                size="small"
                color={getStageColor(stageKey, isCompleted)}
                variant={isCompleted || isCurrent ? 'filled' : 'outlined'}
              />
            </Box>
          )
        })}
      </Stack>

      {progress.completedAt && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
            ✓ Verifikasi selesai pada{' '}
            {new Date(progress.completedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

