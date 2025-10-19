import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tab,
  Tabs,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  LinearProgress,
  Chip,
  Alert,
  Stack,
  useTheme,
} from '@mui/material'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../stores/authStore'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import BarChartIcon from '@mui/icons-material/BarChart'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import TimelineIcon from '@mui/icons-material/Timeline'
import DownloadIcon from '@mui/icons-material/Download'
import { api } from '../services/api'
import { formatCurrency, formatNumber } from '@terravue/shared'
import { ActivityTimeline } from '../components/profile/ActivityTimeline'
import { DataExport } from '../components/profile/DataExport'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <Box
          sx={{
            pt: { xs: 2, md: 3 },
            pb: { xs: 3, md: 4 },
            px: { xs: 1.5, md: 3 },
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

export const ProfilePage = () => {
  const theme = useTheme()
  const { user } = useAuthStore()
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [metrics, setMetrics] = useState<any>(null)
  const [verification, setVerification] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetchMetrics()
    fetchVerification()
    fetchSettings()
  }, [])

  const cardPaperStyles = {
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 16px 32px rgba(22,36,39,0.08)',
    p: { xs: 2.5, md: 3 },
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 40px rgba(22,36,39,0.1)',
    },
  }

  const metricCardStyles = {
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 36px rgba(22,36,39,0.12)',
    },
  }

  const requirementCardStyles = {
    borderRadius: 2,
    border: `1px dashed ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    p: { xs: 2, md: 2.5 },
  }

  const sectionTitleStyles = {
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: theme.palette.text.primary,
  }

  const sectionSubtitleStyles = {
    color: theme.palette.text.secondary,
  }

  const infoFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: theme.palette.action.hover,
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-root.Mui-disabled fieldset': {
      borderStyle: 'dashed',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.primary,
      opacity: 1,
    },
    '& .MuiInputLabel-root.Mui-disabled': {
      color: theme.palette.text.secondary,
      opacity: 0.85,
    },
  }

  const tabStyles = {
    textTransform: 'none' as const,
    fontWeight: 600,
    alignItems: 'center',
    gap: theme.spacing(1),
    minHeight: 64,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
    '& .MuiTab-iconWrapper': {
      fontSize: '1.35rem',
      marginBottom: '0!important',
    },
  }

  const tabsStyles = {
    px: { xs: 1, md: 2 },
    borderBottom: 1,
    borderColor: 'divider',
    '& .MuiTabs-indicator': {
      height: 3,
      borderRadius: 3,
    },
    '& .MuiTabs-scrollButtons.Mui-disabled': {
      opacity: 0.3,
    },
  }

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/users/metrics')
      setMetrics(response.data.data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }

  const fetchVerification = async () => {
    try {
      const response = await api.get('/users/verification')
      setVerification(response.data.data)
    } catch (error) {
      console.error('Failed to fetch verification:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await api.get('/users/settings')
      setSettings(response.data.data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleUpdateSettings = async () => {
    setLoading(true)
    try {
      await api.put('/users/settings', settings)
      setSuccessMessage('Settings updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
    setLoading(false)
  }

  return (
    <AppLayout>
      <Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          mb={4}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PersonIcon fontSize="large" color="primary" />
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Profile & Activity
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Manage your identity, track performance, and tailor your account preferences.
          </Typography>
        </Stack>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={tabsStyles}
          >
            <Tab icon={<PersonIcon />} label="Profile" disableRipple sx={tabStyles} iconPosition="start" />
            <Tab icon={<BarChartIcon />} label="Performance" disableRipple sx={tabStyles} iconPosition="start" />
            <Tab icon={<VerifiedUserIcon />} label="Verification" disableRipple sx={tabStyles} iconPosition="start" />
            <Tab icon={<TimelineIcon />} label="Activity" disableRipple sx={tabStyles} iconPosition="start" />
            <Tab icon={<SettingsIcon />} label="Settings" disableRipple sx={tabStyles} iconPosition="start" />
            <Tab icon={<DownloadIcon />} label="Export" disableRipple sx={tabStyles} iconPosition="start" />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Basic Information
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Key account details synced with the Terravue platform.
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={user?.fullName || ''}
                        disabled
                        sx={infoFieldStyles}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        value={user?.email || ''}
                        disabled
                        sx={infoFieldStyles}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="User Type"
                        value={user?.userType === 'landowner' ? 'Landowner' : 'Buyer'}
                        disabled
                        sx={infoFieldStyles}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Member Since"
                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                        disabled
                        sx={infoFieldStyles}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Account Summary
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        A quick overview and your latest account activity.
                      </Typography>
                    </Box>
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                          Account Status
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Active
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                          Last Login
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {user?.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : 'Never'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel value={tab} index={1}>
            {metrics ? (
              <Stack spacing={3.5}>
                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Trading Performance
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Summary of your portfolio's most recent trading activity.
                      </Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Credits Traded
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {formatNumber(metrics.trading.totalCreditsTraded)}
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Cumulative credits traded
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Total Value
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {formatCurrency(metrics.trading.totalTransactionValue)}
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Realized transaction value
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Transactions
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {metrics.trading.successfulTransactions}
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Successful transaction closures
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Portfolio Value
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {formatCurrency(metrics.trading.portfolioValue)}
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Current estimated value
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>

                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Environmental Impact
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Sustainability impact from the projects you support.
                      </Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Carbon Offset
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {metrics.environmental.totalCarbonOffset.toFixed(1)} t
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Tons of carbon reduced
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Projects Supported
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {metrics.environmental.projectsSupported}
                            </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Active projects
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={metricCardStyles}>
                          <Stack spacing={1.5} sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: 2 }}>
                              Sustainability Goal
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {metrics.environmental.sustainabilityGoalProgress.toFixed(0)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={metrics.environmental.sustainabilityGoalProgress}
                              sx={{
                                mt: 0.5,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.action.hover,
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                },
                              }}
                            />
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              Sustainability goal progress
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Loading metrics...
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Verification Tab */}
          <TabPanel value={tab} index={2}>
            {verification ? (
              <Paper sx={cardPaperStyles}>
                <Stack spacing={3}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 3 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Account Verification
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Ensure every requirement is complete so your account stays verified.
                      </Typography>
                    </Box>
                    <Chip
                      label={verification.overall.toUpperCase()}
                      color={
                        verification.overall === 'verified'
                          ? 'success'
                          : verification.overall === 'partial'
                            ? 'warning'
                            : 'error'
                      }
                      sx={{ fontWeight: 600, letterSpacing: 1 }}
                    />
                  </Stack>

                  <Box>
                    <Typography variant="body2" sx={sectionSubtitleStyles} gutterBottom>
                      Completion {verification.completionPercentage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={verification.completionPercentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: theme.palette.action.hover,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={2.5}>
                    {Object.entries(verification.requirements).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Paper sx={requirementCardStyles}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Typography sx={{ fontWeight: 500 }}>
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                            </Typography>
                            <Chip
                              label={value ? 'Verified' : 'Pending'}
                              color={value ? 'success' : 'default'}
                              size="small"
                            />
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {verification.nextSteps.length > 0 && (
                    <Stack spacing={1.5}>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Next Steps
                      </Typography>
                      <Stack spacing={1}>
                        {verification.nextSteps.map((step: string, index: number) => (
                          <Typography key={index} variant="body2" sx={sectionSubtitleStyles}>
                            • {step}
                          </Typography>
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Loading verification status...
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Activity Tab */}
          <TabPanel value={tab} index={3}>
            <Paper sx={cardPaperStyles}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={sectionTitleStyles}>
                    Activity Timeline
                  </Typography>
                  <Typography variant="body2" sx={sectionSubtitleStyles}>
                    Review a complete record of your transactions and account updates.
                  </Typography>
                </Box>
                <ActivityTimeline />
              </Stack>
            </Paper>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tab} index={4}>
            {settings ? (
              <Stack spacing={3.5}>
                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Notification Settings
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Choose how we send updates and market alerts to you.
                      </Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={settings.notifications.email.transactionUpdates}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    email: {
                                      ...settings.notifications.email,
                                      transactionUpdates: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          }
                          label="Transaction Updates (Email)"
                          sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            '& .MuiFormControlLabel-label': { color: theme.palette.text.primary, fontWeight: 500 },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={settings.notifications.email.marketAlerts}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    email: {
                                      ...settings.notifications.email,
                                      marketAlerts: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          }
                          label="Market Alerts (Email)"
                          sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            '& .MuiFormControlLabel-label': { color: theme.palette.text.primary, fontWeight: 500 },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={settings.notifications.browser.priceAlerts}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    browser: {
                                      ...settings.notifications.browser,
                                      priceAlerts: e.target.checked,
                                    },
                                  },
                                })
                              }
                            />
                          }
                          label="Price Alerts (Browser)"
                          sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            '& .MuiFormControlLabel-label': { color: theme.palette.text.primary, fontWeight: 500 },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>

                <Paper sx={cardPaperStyles}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={sectionTitleStyles}>
                        Privacy Settings
                      </Typography>
                      <Typography variant="body2" sx={sectionSubtitleStyles}>
                        Control who can see your portfolio information and history.
                      </Typography>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={settings.privacy.showTransactionHistory}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  privacy: {
                                    ...settings.privacy,
                                    showTransactionHistory: e.target.checked,
                                  },
                                })
                              }
                            />
                          }
                          label="Show Transaction History"
                          sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            '& .MuiFormControlLabel-label': { color: theme.palette.text.primary, fontWeight: 500 },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={settings.privacy.showLandHoldings}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  privacy: {
                                    ...settings.privacy,
                                    showLandHoldings: e.target.checked,
                                  },
                                })
                              }
                            />
                          }
                          label="Show Land Holdings"
                          sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            '& .MuiFormControlLabel-label': { color: theme.palette.text.primary, fontWeight: 500 },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>

                <Box display="flex" justifyContent={{ xs: 'stretch', sm: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateSettings}
                    disabled={loading}
                    sx={{
                      minWidth: { xs: '100%', sm: 200 },
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Loading settings...
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Export Tab */}
          <TabPanel value={tab} index={5}>
            <Paper sx={cardPaperStyles}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={sectionTitleStyles}>
                    Data Export
                  </Typography>
                  <Typography variant="body2" sx={sectionSubtitleStyles}>
                    Download your activity and transaction history in multiple formats.
                  </Typography>
                </Box>
                <DataExport />
              </Stack>
            </Paper>
          </TabPanel>
        </Paper>
      </Box>
    </AppLayout>
  )
}
