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
  Divider,
  LinearProgress,
  Chip,
  Alert,
  Card,
  CardContent,
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const ProfilePage = () => {
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
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <PersonIcon fontSize="large" color="primary" />
          <Typography variant="h4" fontWeight="bold">
            Profile & Activities
          </Typography>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<BarChartIcon />} label="Performance" />
            <Tab icon={<VerifiedUserIcon />} label="Verification" />
            <Tab icon={<TimelineIcon />} label="Activity" />
            <Tab icon={<SettingsIcon />} label="Settings" />
            <Tab icon={<DownloadIcon />} label="Export" />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={user?.fullName || ''}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="User Type"
                  value={user?.userType === 'landowner' ? 'Landowner' : 'Buyer'}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Member Since"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Account Summary
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography color="text.secondary" variant="body2">
                    Account Status
                  </Typography>
                  <Typography variant="h6">Active</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography color="text.secondary" variant="body2">
                    Last Login
                  </Typography>
                  <Typography variant="h6">
                    {user?.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'Never'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel value={tab} index={1}>
            {metrics ? (
              <Grid container spacing={3} sx={{ p: 3 }}>
                {/* Trading Metrics */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Trading Performance
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Credits Traded
                      </Typography>
                      <Typography variant="h5">
                        {formatNumber(metrics.trading.totalCreditsTraded)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Total Value
                      </Typography>
                      <Typography variant="h5">
                        {formatCurrency(metrics.trading.totalTransactionValue)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Transactions
                      </Typography>
                      <Typography variant="h5">
                        {metrics.trading.successfulTransactions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Portfolio Value
                      </Typography>
                      <Typography variant="h5">
                        {formatCurrency(metrics.trading.portfolioValue)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Environmental Impact */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Environmental Impact
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Carbon Offset
                      </Typography>
                      <Typography variant="h5">
                        {metrics.environmental.totalCarbonOffset.toFixed(1)} tons
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Projects Supported
                      </Typography>
                      <Typography variant="h5">
                        {metrics.environmental.projectsSupported}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Sustainability Goal
                      </Typography>
                      <Typography variant="h5">
                        {metrics.environmental.sustainabilityGoalProgress.toFixed(0)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={metrics.environmental.sustainabilityGoalProgress}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading metrics...</Typography>
              </Box>
            )}
          </TabPanel>

          {/* Verification Tab */}
          <TabPanel value={tab} index={2}>
            {verification ? (
              <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Account Verification</Typography>
                  <Chip
                    label={verification.overall.toUpperCase()}
                    color={
                      verification.overall === 'verified'
                        ? 'success'
                        : verification.overall === 'partial'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Completion: {verification.completionPercentage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={verification.completionPercentage}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  {Object.entries(verification.requirements).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography>
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                          </Typography>
                          <Chip
                            label={value ? 'Verified' : 'Pending'}
                            color={value ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {verification.nextSteps.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                      Next Steps
                    </Typography>
                    {verification.nextSteps.map((step: string, index: number) => (
                      <Typography key={index} variant="body2" sx={{ ml: 2, mb: 1 }}>
                        • {step}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading verification status...</Typography>
              </Box>
            )}
          </TabPanel>

          {/* Activity Tab */}
          <TabPanel value={tab} index={3}>
            <Box sx={{ p: 3 }}>
              <ActivityTimeline />
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tab} index={4}>
            {settings ? (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
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
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
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
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateSettings}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading settings...</Typography>
              </Box>
            )}
          </TabPanel>

          {/* Export Tab */}
          <TabPanel value={tab} index={5}>
            <Box sx={{ p: 3 }}>
              <DataExport />
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </AppLayout>
  )
}

