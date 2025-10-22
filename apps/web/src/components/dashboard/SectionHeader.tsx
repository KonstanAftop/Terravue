import { ReactNode } from 'react'
import { Stack, Typography, Box } from '@mui/material'

interface SectionHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  id?: string
}

export const SectionHeader = ({ title, description, eyebrow, actions, id }: SectionHeaderProps) => {
  return (
    <Stack
      id={id}
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 1.5, md: 2.5 }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
    >
      <Box>
        {eyebrow && (
          <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: 3 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>

      {actions && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          {actions}
        </Stack>
      )}
    </Stack>
  )
}

