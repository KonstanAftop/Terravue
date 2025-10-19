import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { ArrowForward, CheckCircle, Forest, Public, Timeline } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

const featureHighlights = [
  {
    icon: <Forest sx={{ fontSize: 32 }} />,
    title: 'Land Intelligence',
    description:
      'Digital twins of every registered land parcel with carbon potential, verification status, and conservation insights.',
  },
  {
    icon: <Public sx={{ fontSize: 32 }} />,
    title: 'Global Monitoring',
    description:
      'Satellite-powered, real-time monitoring of climate impact across 18 countries with localized compliance data.',
  },
  {
    icon: <Timeline sx={{ fontSize: 32 }} />,
    title: 'Market Transparency',
    description:
      'Live market depth, historical pricing, and predictive analytics so buyers and sellers can trade with confidence.',
  },
]

const missionPillars = [
  'Science-based MRV (Measurement, Reporting, Verification)',
  'Secure transactions with escrow and automated settlement',
  'Integrated compliance workflows for every registry',
  'Actionable insights for investors, landowners, and governments',
]

const metrics = [
  { value: '8.4M', suffix: '+', label: 'Tonnes CO₂ monitored annually' },
  { value: '1.6M', suffix: '+', label: 'Verified carbon credits listed' },
  { value: '24', suffix: '', label: 'Data partnerships across the globe' },
]

const productModules = [
  {
    title: 'Impact Analytics',
    bullets: [
      'Carbon sequestration forecasts with seasonal projections',
      'Biodiversity co-benefit indexing with ESG scoring',
      'Automated alerts for project milestones and verification cycles',
    ],
  },
  {
    title: 'Marketplace Suite',
    bullets: [
      'Programmatic trading with transparent order books',
      'Fair pricing guidance powered by machine learning',
      'Smart contract integrations for custody and settlement',
    ],
  },
  {
    title: 'Regulatory Console',
    bullets: [
      'Jurisdiction-specific compliance templates and audits',
      'Integrated MRV workflows with validator hand-off',
      'Export-ready documentation for accreditation bodies',
    ],
  },
]

export const LandingPage = () => {
  const theme = useTheme()

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Hero section */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pb: { xs: 10, md: 12 },
          pt: { xs: 6, md: 10 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top left, rgba(46,125,50,0.25), transparent 55%), radial-gradient(circle at top right, rgba(25,118,210,0.2), transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <Container sx={{ position: 'relative' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={{ xs: 3, md: 0 }}
            sx={{ mb: { xs: 6, md: 10 } }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label="Terravue"
                sx={{
                  backgroundColor: 'rgba(46,125,50,0.1)',
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Carbon Intelligence for the Planet
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="inherit"
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #27632a 0%, #388e3c 100%)',
                  },
                }}
              >
                Request a Demo
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: -1 }}>
                  The operating system for verifiable carbon projects
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Terravue connects landowners, investors, and regulators through a unified platform that
                  transforms trusted monitoring into high integrity carbon credits.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                      px: 4,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #27632a 0%, #388e3c 100%)',
                      },
                    }}
                  >
                    Explore Platform
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/carbon-market"
                    variant="outlined"
                    size="large"
                  >
                    View Marketplace
                  </Button>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
                  {metrics.map((metric) => (
                    <Box key={metric.label}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {metric.value}
                        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
                          {metric.suffix}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {metric.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 4,
                  border: '1px solid rgba(46,125,50,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Terravue Carbon Intelligence Suite
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Purpose-built to accelerate high integrity carbon projects from land registration to verified issuance.
                      </Typography>
                    </Stack>

                    <Divider flexItem />

                    <Grid container spacing={2}>
                      {featureHighlights.map((feature) => (
                        <Grid item xs={12} sm={4} key={feature.title}>
                          <Stack spacing={1.5}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(46,125,50,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: theme.palette.success.main,
                              }}
                            >
                              {feature.icon}
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {feature.description}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission section */}
      <Container sx={{ py: { xs: 10, md: 12 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Chip
                icon={<CheckCircle />}
                label="Why Terravue"
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(46,125,50,0.08)',
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Designed for the next generation of climate markets
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Terravue unifies monitoring, verification, and trading so that climate finance can scale with integrity.
                Our platform is trusted by land stewards, project developers, and institutional buyers around the world.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(25,118,210,0.12)',
                backgroundColor: '#ffffff',
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                <Stack spacing={2.5}>
                  {missionPillars.map((pillar) => (
                    <Stack key={pillar} direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          mt: 0.75,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                        }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        {pillar}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Modules section */}
      <Box sx={{ backgroundColor: '#ffffff', py: { xs: 10, md: 12 } }}>
        <Container>
          <Stack spacing={3} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              One platform, three powerful modules
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={640}>
              Built to orchestrate the full lifecycle of high-integrity climate projects, from the first satellite scan to the final trade.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {productModules.map((module) => (
              <Grid item xs={12} md={4} key={module.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid rgba(46,125,50,0.12)',
                    background: 'linear-gradient(180deg, rgba(46,125,50,0.04) 0%, rgba(255,255,255,1) 100%)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {module.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {module.bullets.map((bullet) => (
                        <Stack key={bullet} direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              mt: 0.4,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.success.main,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {bullet}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Container sx={{ py: { xs: 10, md: 12 } }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
            color: '#ffffff',
          }}
        >
          <CardContent sx={{ p: { xs: 5, md: 7 } }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Ready to accelerate your climate impact?
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Join the Terravue ecosystem and unlock a complete toolkit for credible carbon management.
                  Our team can onboard your projects, data providers, and trading partners in weeks.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: '#ffffff',
                      color: theme.palette.success.main,
                      fontWeight: 700,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.92)',
                      },
                    }}
                  >
                    Start the Conversation
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/carbon-market"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.6)',
                      color: '#ffffff',
                      '&:hover': {
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Browse Live Credits
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default LandingPage
