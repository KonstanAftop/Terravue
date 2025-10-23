import { useEffect, useMemo, useRef, useState, type ElementType } from 'react'

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
import {
  ArrowForward,
  CheckCircle,
  Forest,
  Insights,
  Language,
  Public,
  Shield,
  Timeline,
} from '@mui/icons-material'
import { keyframes } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

const palette = {
  mist: '#F2F7F4',
  whisper: '#E7F2EE',
  pine: '#0A5C36',
  evergreen: '#0F5132',
  canopy: '#14452F',
  dusk: '#18392B',
  midnight: '#1D2E28',
  accent: '#B493FF',
}

const navItems = [
  { id: 'hero', label: 'Overview' },
  { id: 'platform', label: 'Platform' },
  { id: 'why', label: 'Why Terravue' },
  { id: 'partners', label: 'Alliances' },
  { id: 'modules', label: 'Modules' },
  { id: 'stories', label: 'Impact' },
]

const featureHighlights: Array<{ icon: ElementType; title: string; description: string }> = [
  {
    icon: Forest,
    title: 'Land Intelligence',
    description:
      'Digital twins of each registered land parcel with carbon potential, verification status, and conservation insights.',
  },
  {
    icon: Public,
    title: 'Global Monitoring',
    description:
      'Satellite-powered, real-time monitoring of climate impact across 18 countries with localized compliance data.',
  },
  {
    icon: Timeline,
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
  { value: '8.4M', suffix: '+', label: 'Tonnes CO2 monitored annually' },
  { value: '1.6M', suffix: '+', label: 'Verified carbon credits listed' },
  { value: '24', suffix: '', label: 'Data partnerships across the globe' },
]

const productModules = [
  {
    title: 'Impact Analytics',
    icon: Insights,
    bullets: [
      'Carbon sequestration forecasts with seasonal projections',
      'Biodiversity co-benefit indexing with ESG scoring',
      'Automated alerts for project milestones and verification cycles',
    ],
  },
  {
    title: 'Marketplace Suite',
    icon: Language,
    bullets: [
      'Programmatic trading with transparent order books',
      'Fair pricing guidance powered by machine learning',
      'Smart contract integrations for custody and settlement',
    ],
  },
  {
    title: 'Regulatory Console',
    icon: Shield,
    bullets: [
      'Jurisdiction-specific compliance templates and audits',
      'Integrated MRV workflows with validator hand-off',
      'Export-ready documentation for accreditation bodies',
    ],
  },
]

const partnerSignals = [
  'Verra & VCS aligned pipelines',
  'Gold Standard data exchange',
  'UNFCCC collaborative pilots',
  'IFC climate innovation network',
  'Jurisdictional REDD+ programs',
  'Regional MRV collaborators',
]

const impactStories = [
  {
    title: 'Mangrove Revival, Indonesia',
    stat: '46k credits issued',
    description:
      'Community-led blue carbon project backed by drone LiDAR, continuous satellite monitoring, and validator-ready MRV packages.',
  },
  {
    title: 'Savanna Regeneration, Kenya',
    stat: '18% yield uplift',
    description:
      'Blended finance program linking carbon returns with regenerative agriculture for rural cooperatives.',
  },
  {
    title: 'Forestry Stewardship, Brazil',
    stat: '24 regions onboarded',
    description:
      'Jurisdictional program harmonising compliance baselines, indigenous stewardship, and transparent credit issuance.',
  },
]

const float = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.45; }
  50% { transform: translate3d(14px, -18px, 0) scale(1.06); opacity: 0.7; }
  100% { transform: translate3d(-10px, 12px, 0) scale(0.96); opacity: 0.45; }
`

const pulse = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { opacity: 0.4; }
`

const revealStyles = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0px)' : 'translateY(32px)',
  transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
})

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25, rootMargin: '0px 0px -10%' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

export const LandingPage = () => {
  const theme = useTheme()
  const [activeSection, setActiveSection] = useState('hero')
  const sections = useMemo(() => [...navItems.map((item) => item.id), 'cta'], [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => setActiveSection(entry.target.id))
      },
      { threshold: 0.4, rootMargin: '-64px 0px -40%' },
    )

    sections.forEach((sectionId) => {
      const node = document.getElementById(sectionId)
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [sections])

  const handleNavClick = (sectionId: string) => {
    const node = document.getElementById(sectionId)
    if (!node) return

    const headerOffset = 84
    const elementPosition = node.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(elementPosition - headerOffset, 0), behavior: 'smooth' })
  }

  const heroReveal = useScrollReveal()
  const metricsReveal = useScrollReveal()
  const platformReveal = useScrollReveal()
  const missionReveal = useScrollReveal()
  const partnerReveal = useScrollReveal()
  const modulesReveal = useScrollReveal()
  const storiesReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  return (
    <Box sx={{ backgroundColor: palette.mist, minHeight: '100vh', fontFamily: '"DM Sans", Inter, sans-serif' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar,
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderBottom: '1px solid rgba(20,98,74,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Container sx={{ py: 2.25 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src="/assets/logo.png"
                alt="Terravue"
                sx={{
                  width: { xs: 32, md: 40 },
                  height: 'auto',
                }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
                  Terravue
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monitor / Verify / Trade
                </Typography>
              </Box>
            </Stack>

            <Stack component="nav" direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    aria-label={`Scroll to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                    sx={{
                      position: 'relative',
                      border: 0,
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                      paddingBlock: 0.5,
                      color: isActive ? palette.pine : 'text.secondary',
                      transition: 'color 0.2s ease, transform 0.2s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: -6,
                        height: 3,
                        width: isActive ? '100%' : '0%',
                        borderRadius: 999,
                        background: `linear-gradient(135deg, ${palette.pine} 0%, ${palette.accent} 100%)`,
                        transition: 'width 0.25s ease',
                      },
                      '&:hover': {
                        color: palette.pine,
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                      '&:focus-visible': {
                        outline: `2px solid ${palette.accent}`,
                        outlineOffset: 4,
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                )
              })}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/create-listing"
                variant="contained"
                sx={{
                  px: 3.5,
                  py: 1,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${palette.pine} 0%, ${palette.accent} 100%)`,
                  boxShadow: '0 16px 32px rgba(16,81,50,0.25)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${palette.midnight} 0%, ${palette.pine} 100%)`,
                  },
                }}
              >
                Request a Demo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box component="main">
        <Box
          id="hero"
          component="section"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            color: '#F5FBF7',
            background: `linear-gradient(135deg, rgba(13,45,33,0.95) 0%, ${palette.midnight} 40%, ${palette.canopy} 100%)`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(180deg, rgba(26,82,54,0.72) 0%, rgba(26,82,54,0.15) 60%, rgba(4,18,12,0.75) 100%), url("/assets/bg-forest.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.65,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 240,
              height: 240,
              top: '8%',
              left: '6%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(180,147,255,0.45) 0%, transparent 65%)',
              animation: `${float} 16s ease-in-out infinite`,
              filter: 'blur(0.2px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 320,
              height: 320,
              bottom: '-12%',
              right: '4%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, rgba(10,92,54,0.5) 0%, transparent 70%)',
              animation: `${float} 22s ease-in-out infinite reverse`,
              pointerEvents: 'none',
            }}
          />
          <Container sx={{ position: 'relative', zIndex: 1, py: { xs: 12, md: 16 } }} ref={heroReveal.ref}>
            <Grid container spacing={{ xs: 8, md: 6 }} alignItems="center" sx={revealStyles(heroReveal.visible)}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Chip
                    label="Carbon intelligence for the planet"
                    sx={{
                      alignSelf: 'flex-start',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      color: '#F5FBF7',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Unlocking Indonesia's carbon potential
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(245,251,247,0.82)', fontWeight: 400 }}>
                    Empowering land stewards, investors, and regulators with transparent MRV, responsible financing, and
                    verifiable climate outcomes.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={1}>
                    <Button
                      component={RouterLink}
                      to="/dashboard"
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        px: 4,
                        py: 1.75,
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${palette.pine} 0%, ${palette.accent} 100%)`,
                        boxShadow: '0 20px 40px rgba(10,92,54,0.35)',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${palette.midnight} 0%, ${palette.pine} 100%)`,
                        },
                      }}
                    >
                      Explore Platform
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/carbon-market"
                      variant="outlined"
                      sx={{
                        px: 4,
                        py: 1.75,
                        fontWeight: 700,
                        borderColor: 'rgba(245,251,247,0.6)',
                        color: '#F5FBF7',
                        '&:hover': {
                          borderColor: '#ffffff',
                          backgroundColor: 'rgba(245,251,247,0.12)',
                        },
                      }}
                    >
                      View Marketplace
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack
                  spacing={3}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  sx={{
                    textAlign: { xs: 'left', md: 'center' },
                    px: { xs: 0, md: 4 },
                    ...revealStyles(heroReveal.visible, 0.2),
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/logo-nobg.PNG"
                    alt="Terravue mark"
                    sx={{
                      width: { xs: 240, sm: 300, md: 360 },
                      height: 'auto',
                      filter: 'drop-shadow(0 28px 48px rgba(4,18,12,0.5))',
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Container sx={{ py: { xs: 8, md: 10 } }} ref={metricsReveal.ref}>
          <Grid container spacing={3} sx={revealStyles(metricsReveal.visible)}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={4} key={metric.label}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid rgba(10,92,54,0.14)',
                    backgroundColor: '#ffffff',
                    textAlign: 'center',
                    py: 5,
                    ...revealStyles(metricsReveal.visible, index * 0.12),
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: palette.pine }}>
                      {metric.value}
                      <Typography component="span" variant="h4" sx={{ fontWeight: 600 }}>
                        {metric.suffix}
                      </Typography>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                      {metric.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box id="platform" component="section" sx={{ backgroundColor: '#ffffff', py: { xs: 10, md: 14 } }}>
          <Container ref={platformReveal.ref}>
            <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 7, ...revealStyles(platformReveal.visible) }}>
              <Typography variant="overline" sx={{ letterSpacing: 6, fontWeight: 700, color: palette.pine }}>
                PLATFORM
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Terravue Carbon Intelligence Suite
              </Typography>
              <Typography variant="h6" color="text.secondary" maxWidth={760}>
                Purpose-built to accelerate high integrity carbon projects from land registration to verified issuance.
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {featureHighlights.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Grid item xs={12} md={4} key={feature.title} sx={revealStyles(platformReveal.visible, index * 0.1)}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid rgba(10,92,54,0.12)',
                        p: { xs: 3.5, md: 4 },
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        background: 'linear-gradient(180deg, rgba(10,92,54,0.06) 0%, rgba(255,255,255,1) 100%)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 28px 60px rgba(15,61,45,0.22)',
                          borderColor: 'rgba(10,92,54,0.35)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(10,92,54,0.12)',
                          mb: 3,
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: palette.pine }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Container>
        </Box>

        <Box
          id="why"
          component="section"
          sx={{
            background: `linear-gradient(135deg, ${palette.evergreen} 0%, ${palette.midnight} 85%)`,
            color: '#F4FBF6',
            position: 'relative',
            overflow: 'hidden',
            py: { xs: 10, md: 14 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.22,
              background: `radial-gradient(circle at 20% 25%, rgba(180,147,255,0.5), transparent 55%), radial-gradient(circle at 80% 70%, rgba(10,92,54,0.65), transparent 60%)`,
              animation: `${pulse} 12s ease-in-out infinite`,
            }}
          />
          <Container sx={{ position: 'relative', zIndex: 1 }} ref={missionReveal.ref}>
            <Grid container spacing={8} alignItems="center" sx={revealStyles(missionReveal.visible)}>
              <Grid item xs={12} md={5}>
                <Stack spacing={3}>
                  <Chip
                    label="Why Terravue"
                    sx={{
                      alignSelf: 'flex-start',
                      backgroundColor: 'rgba(255,255,255,0.14)',
                      color: '#F4FBF6',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    Designed for the next generation of climate markets
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(244,251,246,0.75)' }}>
                    Terravue unifies monitoring, verification, and trading so climate finance can scale with integrity.
                    Our platform is trusted by land stewards, project developers, and institutional buyers around the world.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={7}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.18)',
                    backgroundColor: 'rgba(13,45,33,0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                    <Stack spacing={2.5}>
                      {missionPillars.map((pillar, index) => (
                        <Stack
                          key={pillar}
                          direction="row"
                          spacing={2.5}
                          alignItems="flex-start"
                          sx={revealStyles(missionReveal.visible, index * 0.08)}
                        >
                          <CheckCircle sx={{ color: '#B9F6CA', mt: 0.4 }} />
                          <Typography variant="body1" sx={{ color: 'rgba(244,251,246,0.85)' }}>
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
        </Box>

        <Box id="partners" component="section" sx={{ backgroundColor: '#ffffff', py: { xs: 10, md: 14 } }}>
          <Container ref={partnerReveal.ref}>
            <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6, ...revealStyles(partnerReveal.visible) }}>
              <Typography variant="overline" sx={{ letterSpacing: 6, fontWeight: 700, color: palette.accent }}>
                TRUSTED ALLIANCES
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Partnerships accelerating credible carbon markets
              </Typography>
              <Typography variant="body1" color="text.secondary" maxWidth={720}>
                Terravue integrates with leading registries, financial institutions, and jurisdictional programs to make
                climate action verifiable at scale.
              </Typography>
            </Stack>

            <Grid container spacing={2.5} justifyContent="center">
              {partnerSignals.map((partner, index) => (
                <Grid item xs={12} sm={6} md={4} key={partner} sx={revealStyles(partnerReveal.visible, index * 0.08)}>
                  <Card
                    elevation={0}
                    sx={{
                      textAlign: 'center',
                      borderRadius: 3,
                      border: '1px solid rgba(10,92,54,0.14)',
                      backgroundColor: 'rgba(10,92,54,0.06)',
                      py: 3.5,
                      px: 2.5,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {partner}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Box
          id="modules"
          component="section"
          sx={{
            background: `linear-gradient(135deg, ${palette.midnight} 0%, ${palette.canopy} 100%)`,
            color: '#F2FBF7',
            py: { xs: 10, md: 14 },
          }}
        >
          <Container ref={modulesReveal.ref}>
            <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6, ...revealStyles(modulesReveal.visible) }}>
              <Typography variant="overline" sx={{ letterSpacing: 6, fontWeight: 700, color: palette.accent }}>
                PRODUCT STACK
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                One platform, three powerful modules
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(242,251,247,0.75)', maxWidth: 720 }}>
                Built to orchestrate the full lifecycle of high-integrity climate projects, from the first satellite scan to the final trade.
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {productModules.map((module, index) => {
                const Icon = module.icon
                return (
                  <Grid item xs={12} md={4} key={module.title} sx={revealStyles(modulesReveal.visible, index * 0.1)}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'linear-gradient(180deg, rgba(24,57,43,0.75) 0%, rgba(10,53,33,0.85) 100%)',
                        boxShadow: '0 28px 60px rgba(6,25,21,0.45)',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                        <Stack spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(244,251,246,0.12)',
                              }}
                            >
                              <Icon sx={{ color: '#F4FBF6' }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {module.title}
                            </Typography>
                          </Box>
                          <Stack spacing={2} alignItems="flex-start">
                            {module.bullets.map((bullet) => (
                              <Stack key={bullet} direction="row" spacing={2} alignItems="flex-start">
                                <Box
                                  sx={{
                                    mt: 0.8,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#B9F6CA',
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: 'rgba(244,251,246,0.78)' }}>
                                  {bullet}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Container>
        </Box>

        <Box id="stories" component="section" sx={{ backgroundColor: '#ffffff', py: { xs: 10, md: 14 } }}>
          <Container ref={storiesReveal.ref}>
            <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6, ...revealStyles(storiesReveal.visible) }}>
              <Typography variant="overline" sx={{ letterSpacing: 6, fontWeight: 700, color: palette.pine }}>
                IMPACT IN MOTION
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Where Terravue is reshaping climate finance
              </Typography>
              <Typography variant="body1" color="text.secondary" maxWidth={720}>
                From blue carbon corridors to regenerative agriculture, Terravue powers projects that blend ecological integrity with market confidence.
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {impactStories.map((story, index) => (
                <Grid item xs={12} md={4} key={story.title} sx={revealStyles(storiesReveal.visible, index * 0.1)}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid rgba(10,92,54,0.14)',
                      backgroundColor: 'rgba(10,92,54,0.05)',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {story.stat}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                        {story.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container
          id="cta"
          sx={{
            py: { xs: 10, md: 14 },
            position: 'relative',
          }}
          ref={ctaReveal.ref}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(140deg, rgba(12,59,43,0.96) 0%, rgba(9,31,29,0.92) 55%, rgba(20,98,74,0.88) 100%)',
              color: '#ffffff',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 32px 90px rgba(9,31,29,0.35)',
              ...revealStyles(ctaReveal.visible),
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 55%)',
                pointerEvents: 'none',
              }}
            />
            <CardContent sx={{ p: { xs: 5, md: 7 }, position: 'relative' }}>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    Ready to accelerate your climate impact?
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.85 }}>
                    Join the Terravue ecosystem and unlock a complete toolkit for credible carbon management. Our team can onboard your projects, data providers, and trading partners in weeks.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(180,255,218,0.32) 100%)',
                        color: '#ffffff',
                        '& .MuiButton-startIcon': { color: '#ffffff' },
                        fontWeight: 700,
                        boxShadow: '0 18px 36px rgba(4,18,12,0.25)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(180,255,218,0.38) 100%)',
                        },
                      }}
                    >
                      Start the Conversation
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/carbon-market"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.6)',
                        color: '#ffffff',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: '#ffffff',
                          backgroundColor: 'rgba(255,255,255,0.12)',
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

      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #0B3D2D 0%, #0F5132 60%, #0A3324 100%)',
          color: '#ffffff',
        }}
      >
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="img"
                    src="/assets/logo-nobg.PNG"
                    alt="Terravue"
                    sx={{ width: 44, height: 'auto' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Terravue
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Carbon intelligence for the planet
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Platform
              </Typography>
              <Stack spacing={1.5}>
                <Typography component={RouterLink} to="/dashboard" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Overview
                </Typography>
                <Typography component={RouterLink} to="/market-analytics" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Analytics
                </Typography>
                <Typography component={RouterLink} to="/carbon-market" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Marketplace
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                About Terravue
              </Typography>
              <Stack spacing={1.5}>
                <Box component="a" href="#why" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Mission & Vision
                </Box>
                <Box component="a" href="#stories" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Impact Stories
                </Box>
                <Box component="a" href="#platform" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Product Tour
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Contact
              </Typography>
              <Stack spacing={1.5}>
                <Box component="a" href="mailto:hello@terravue.com" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  hello@terravue.com
                </Box>
                <Box component="a" href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Main Office
                </Box>
                <Box component="a" href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}>
                  Regional Hubs
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 6, md: 8 }, borderColor: 'rgba(255,255,255,0.12)' }} />

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            Copyright {new Date().getFullYear()} Terravue. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
