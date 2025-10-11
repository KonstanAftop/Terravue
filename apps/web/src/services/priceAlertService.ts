import { api } from './api'
import { PriceAlert } from '@terravue/shared'

interface CreateAlertRequest {
  targetPrice: number
  condition: 'above' | 'below' | 'crosses'
  region?: string
  notificationMethods: ('browser' | 'email')[]
}

interface UpdateAlertRequest {
  targetPrice?: number
  condition?: 'above' | 'below' | 'crosses'
  isActive?: boolean
}

interface AlertStatistics {
  total: number
  active: number
  triggered: number
}

class PriceAlertService {
  /**
   * Create a new price alert
   */
  async createAlert(alertData: CreateAlertRequest): Promise<PriceAlert> {
    const response = await api.post('/alerts', alertData)
    return response.data.data
  }

  /**
   * Get all alerts for current user
   */
  async getUserAlerts(): Promise<PriceAlert[]> {
    const response = await api.get('/alerts')
    return response.data.data
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(): Promise<AlertStatistics> {
    const response = await api.get('/alerts/stats')
    return response.data.data
  }

  /**
   * Get a specific alert
   */
  async getAlert(alertId: string): Promise<PriceAlert> {
    const response = await api.get(`/alerts/${alertId}`)
    return response.data.data
  }

  /**
   * Update an alert
   */
  async updateAlert(alertId: string, updates: UpdateAlertRequest): Promise<PriceAlert> {
    const response = await api.patch(`/alerts/${alertId}`, updates)
    return response.data.data
  }

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<void> {
    await api.delete(`/alerts/${alertId}`)
  }
}

export const priceAlertService = new PriceAlertService()

