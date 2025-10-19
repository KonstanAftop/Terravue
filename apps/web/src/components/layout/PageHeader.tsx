import { ReactNode } from 'react'
import { Stack, Typography, Box } from '@mui/material'

interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  actions?: ReactNode
}

export const PageHeader = ({ title, subtitle, eyebrow, actions }: PageHeaderProps) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2.5, md: 3 }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: { xs: 5, md: 7 } }}
    >
      <Stack spacing={1}>
        {eyebrow && (
          <Typography variant="overline" sx={{ letterSpacing: 3, color: 'primary.main', fontWeight: 600 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>

      {actions && (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {actions}
        </Box>
      )}
    </Stack>
  )
}

