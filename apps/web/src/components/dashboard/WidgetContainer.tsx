import { ReactNode } from 'react'
import { Paper, Stack, Typography, Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { type SxProps, type Theme } from '@mui/system'

interface WidgetContainerProps {
  title?: string
  subtitle?: string
  eyebrow?: string
  actions?: ReactNode
  children: ReactNode
  spacing?: number
  id?: string
  sx?: SxProps<Theme>
}

/**
 * Standard dashboard card shell that applies consistent padding, glassmorphism,
 * and typography treatment to all dashboard widgets.
 */
export const WidgetContainer = ({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
  spacing = 3,
  id,
  sx,
}: WidgetContainerProps) => {
  const theme = useTheme()

  const baseStyles = {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: { xs: 3, md: 3.5 },
    px: { xs: 2.25, sm: 2.75, md: 3.5 },
    py: { xs: 2.5, md: 3.25 },
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing,
    backgroundColor: alpha(theme.palette.background.paper, 0.68),
    border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
    boxShadow: `0 28px 60px ${alpha(theme.palette.common.black, 0.22)}`,
    backdropFilter: 'blur(14px)',
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(circle at 16% 12%, ${alpha(theme.palette.primary.light, 0.22)} 0%, transparent 60%), radial-gradient(circle at 82% 6%, ${alpha(
        theme.palette.secondary.main,
        0.18
      )} 0%, transparent 58%)`,
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 32px 72px ${alpha(theme.palette.common.black, 0.28)}`,
    },
  }

  const mergedSx = Array.isArray(sx) ? [baseStyles, ...sx] : sx ? [baseStyles, sx] : baseStyles

  return (
    <Paper
      id={id}
      component="section"
      elevation={0}
      sx={mergedSx}
    >
      {(eyebrow || title || subtitle || actions) && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.5, md: 2 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            {eyebrow && (
              <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                {eyebrow}
              </Typography>
            )}
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.015em' }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && (
            <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
              {actions}
            </Stack>
          )}
        </Stack>
      )}

      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Paper>
  )
}
