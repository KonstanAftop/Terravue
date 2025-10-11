import { create } from 'zustand'
import { PriceAlert } from '@terravue/shared'
import { priceAlertService } from '../services/priceAlertService'

interface CreateAlertData {
  targetPrice: number
  condition: 'above' | 'below' | 'crosses'
  region?: string
  notificationMethods: ('browser' | 'email')[]
}

interface AlertStatistics {
  total: number
  active: number
  triggered: number
}

interface PriceAlertState {
  // Data
  alerts: PriceAlert[]
  statistics: AlertStatistics | null

  // UI State
  isLoading: boolean
  error: string | null

  // Actions
  fetchAlerts: () => Promise<void>
  fetchStatistics: () => Promise<void>
  createAlert: (alertData: CreateAlertData) => Promise<PriceAlert | null>
  updateAlert: (
    alertId: string,
    updates: { targetPrice?: number; condition?: 'above' | 'below' | 'crosses'; isActive?: boolean },
  ) => Promise<void>
  deleteAlert: (alertId: string) => Promise<void>
  toggleAlert: (alertId: string, isActive: boolean) => Promise<void>
  reset: () => void
}

const initialState = {
  alerts: [],
  statistics: null,
  isLoading: false,
  error: null,
}

export const usePriceAlertStore = create<PriceAlertState>((set, get) => ({
  ...initialState,

  fetchAlerts: async () => {
    set({ isLoading: true, error: null })

    try {
      const alerts = await priceAlertService.getUserAlerts()
      set({ alerts, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching alerts:', error)
      set({
        error: error.response?.data?.error || 'Failed to fetch alerts',
        isLoading: false,
      })
    }
  },

  fetchStatistics: async () => {
    try {
      const statistics = await priceAlertService.getAlertStatistics()
      set({ statistics })
    } catch (error: any) {
      console.error('Error fetching alert statistics:', error)
      set({ error: error.response?.data?.error || 'Failed to fetch statistics' })
    }
  },

  createAlert: async (alertData: CreateAlertData) => {
    set({ isLoading: true, error: null })

    try {
      const newAlert = await priceAlertService.createAlert(alertData)
      set((state) => ({
        alerts: [newAlert, ...state.alerts],
        isLoading: false,
      }))

      // Refresh statistics
      get().fetchStatistics()

      return newAlert
    } catch (error: any) {
      console.error('Error creating alert:', error)
      set({
        error: error.response?.data?.error || 'Failed to create alert',
        isLoading: false,
      })
      return null
    }
  },

  updateAlert: async (alertId: string, updates) => {
    try {
      const updatedAlert = await priceAlertService.updateAlert(alertId, updates)
      set((state) => ({
        alerts: state.alerts.map((alert) => (alert.id === alertId ? updatedAlert : alert)),
      }))

      // Refresh statistics
      get().fetchStatistics()
    } catch (error: any) {
      console.error('Error updating alert:', error)
      set({ error: error.response?.data?.error || 'Failed to update alert' })
    }
  },

  deleteAlert: async (alertId: string) => {
    try {
      await priceAlertService.deleteAlert(alertId)
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== alertId),
      }))

      // Refresh statistics
      get().fetchStatistics()
    } catch (error: any) {
      console.error('Error deleting alert:', error)
      set({ error: error.response?.data?.error || 'Failed to delete alert' })
    }
  },

  toggleAlert: async (alertId: string, isActive: boolean) => {
    try {
      await get().updateAlert(alertId, { isActive })
    } catch (error: any) {
      console.error('Error toggling alert:', error)
    }
  },

  reset: () => {
    set(initialState)
  },
}))

