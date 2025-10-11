import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Switch,
  Alert,
} from '@mui/material'
import { PriceAlert } from '@terravue/shared'
import { formatCurrency } from '@terravue/shared'
import AddAlertIcon from '@mui/icons-material/AddAlert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'

interface PriceAlertsProps {
  alerts: PriceAlert[]
  currentPrice: number
  onCreateAlert: (alertData: {
    targetPrice: number
    condition: 'above' | 'below' | 'crosses'
    region?: string
    notificationMethods: ('browser' | 'email')[]
  }) => Promise<PriceAlert | null>
  onUpdateAlert: (
    alertId: string,
    updates: { targetPrice?: number; condition?: 'above' | 'below' | 'crosses'; isActive?: boolean },
  ) => Promise<void>
  onDeleteAlert: (alertId: string) => Promise<void>
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({
  alerts,
  currentPrice,
  onCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    targetPrice: '',
    condition: 'above' as 'above' | 'below' | 'crosses',
    region: '',
    browserNotification: true,
    emailNotification: false,
  })
  const [error, setError] = useState('')

  const handleOpenDialog = () => {
    setFormData({
      targetPrice: currentPrice.toString(),
      condition: 'above',
      region: '',
      browserNotification: true,
      emailNotification: false,
    })
    setError('')
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setError('')
  }

  const handleSubmit = async () => {
    const targetPrice = parseFloat(formData.targetPrice)

    if (isNaN(targetPrice) || targetPrice <= 0) {
      setError('Please enter a valid price greater than 0')
      return
    }

    if (!formData.browserNotification && !formData.emailNotification) {
      setError('Please select at least one notification method')
      return
    }

    const notificationMethods: ('browser' | 'email')[] = []
    if (formData.browserNotification) notificationMethods.push('browser')
    if (formData.emailNotification) notificationMethods.push('email')

    try {
      await onCreateAlert({
        targetPrice,
        condition: formData.condition,
        region: formData.region || undefined,
        notificationMethods,
      })
      handleCloseDialog()
    } catch (err) {
      setError('Failed to create alert. Please try again.')
    }
  }

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    await onUpdateAlert(alertId, { isActive: !isActive })
  }

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'above':
        return 'Above'
      case 'below':
        return 'Below'
      case 'crosses':
        return 'Crosses'
      default:
        return condition
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'above':
        return 'success'
      case 'below':
        return 'error'
      case 'crosses':
        return 'info'
      default:
        return 'default'
    }
  }

  const activeAlerts = alerts.filter((a) => a.isActive)
  const triggeredAlerts = alerts.filter((a) => a.triggeredAt)

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActiveIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Price Alerts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddAlertIcon />}
            onClick={handleOpenDialog}
            size="small"
          >
            New Alert
          </Button>
        </Box>

        {/* Statistics */}
        <Box display="flex" gap={2} mb={3}>
          <Chip label={`${activeAlerts.length} Active`} color="primary" />
          <Chip label={`${triggeredAlerts.length} Triggered`} color="default" />
          <Chip label={`${alerts.length} Total`} variant="outlined" />
        </Box>

        {/* Alert List */}
        {alerts.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No price alerts set</Typography>
            <Typography variant="caption" color="text.secondary">
              Create an alert to get notified when prices reach your target
            </Typography>
          </Box>
        ) : (
          <List>
            {alerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  bgcolor: alert.isActive ? 'background.paper' : 'action.disabledBackground',
                  borderRadius: 1,
                  mb: 1,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(alert.targetPrice)}
                      </Typography>
                      <Chip
                        label={getConditionLabel(alert.condition)}
                        color={getConditionColor(alert.condition) as any}
                        size="small"
                      />
                      {alert.triggeredAt && (
                        <Chip label="Triggered" color="success" size="small" />
                      )}
                      {alert.region && (
                        <Chip label={alert.region} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </Typography>
                      {alert.triggeredAt && (
                        <>
                          {' • '}
                          <Typography variant="caption" color="success.main">
                            Triggered: {new Date(alert.triggeredAt).toLocaleString()}
                          </Typography>
                        </>
                      )}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Notifications:{' '}
                        {alert.notificationMethods.map((m) => m.toUpperCase()).join(', ')}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Switch
                      edge="end"
                      checked={alert.isActive}
                      onChange={() => handleToggleAlert(alert.id, alert.isActive)}
                      disabled={!!alert.triggeredAt}
                    />
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDeleteAlert(alert.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        {/* Current Price Info */}
        <Box mt={2} p={2} bgcolor="primary.light" borderRadius={1} sx={{ opacity: 0.1 }}>
          <Typography variant="caption" color="text.secondary">
            Current Price: <strong>{formatCurrency(currentPrice)}</strong>
          </Typography>
        </Box>
      </CardContent>

      {/* Create Alert Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Price Alert</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Target Price (IDR)"
            type="number"
            value={formData.targetPrice}
            onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
            margin="normal"
            helperText={`Current price: ${formatCurrency(currentPrice)}`}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select
              value={formData.condition}
              label="Condition"
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value as any })
              }
            >
              <MenuItem value="above">Price goes above target</MenuItem>
              <MenuItem value="below">Price goes below target</MenuItem>
              <MenuItem value="crosses">Price crosses target (either direction)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Region (Optional)"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            margin="normal"
            placeholder="e.g., Java, Sumatra"
          />

          <FormGroup sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Methods
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.browserNotification}
                  onChange={(e) =>
                    setFormData({ ...formData, browserNotification: e.target.checked })
                  }
                />
              }
              label="Browser Notification"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.emailNotification}
                  onChange={(e) =>
                    setFormData({ ...formData, emailNotification: e.target.checked })
                  }
                />
              }
              label="Email Notification"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default PriceAlerts

