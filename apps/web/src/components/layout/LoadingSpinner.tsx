import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <CircularProgress size={48} sx={{ color: '#2e7d32' }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

