import { create } from 'zustand'
import { LandParcel, LandActivity, VerificationProgress } from '@terravue/shared'
import { landDetailService } from '../services/landDetailService'

interface LandDetailState {
  land: LandParcel | null
  activities: LandActivity[]
  verificationProgress: VerificationProgress | null
  satelliteImages: string[]
  loading: boolean
  error: string | null
  refreshInterval: NodeJS.Timeout | null

  // Actions
  fetchLandDetail: (landId: string) => Promise<void>
  updateLand: (landId: string, updates: Partial<LandParcel>) => Promise<void>
  submitDocuments: (landId: string, documents: string[]) => Promise<void>
  startAutoRefresh: (landId: string, interval?: number) => void
  stopAutoRefresh: () => void
  clearError: () => void
  reset: () => void
}

export const useLandDetailStore = create<LandDetailState>((set, get) => ({
  land: null,
  activities: [],
  verificationProgress: null,
  satelliteImages: [],
  loading: false,
  error: null,
  refreshInterval: null,

  fetchLandDetail: async (landId: string) => {
    set({ loading: true, error: null })
    try {
      const data = await landDetailService.getLandDetail(landId)
      set({
        land: data.land,
        activities: data.activities,
        verificationProgress: data.verificationProgress || null,
        satelliteImages: data.satelliteImages,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch land details',
        loading: false,
      })
    }
  },

  updateLand: async (landId: string, updates: Partial<LandParcel>) => {
    set({ loading: true, error: null })
    try {
      const updatedLand = await landDetailService.updateLand(landId, updates)
      set({ land: updatedLand, loading: false })
      
      // Refresh to get updated activities
      get().fetchLandDetail(landId)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update land',
        loading: false,
      })
      throw error
    }
  },

  submitDocuments: async (landId: string, documents: string[]) => {
    set({ loading: true, error: null })
    try {
      await landDetailService.submitDocuments(landId, documents)
      set({ loading: false })
      
      // Refresh to get updated activities
      get().fetchLandDetail(landId)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to submit documents',
        loading: false,
      })
      throw error
    }
  },

  startAutoRefresh: (landId: string, interval: number = 3000) => {
    const { stopAutoRefresh, fetchLandDetail } = get()
    
    // Clear existing interval if any
    stopAutoRefresh()
    
    // Initial fetch
    fetchLandDetail(landId)
    
    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchLandDetail(landId)
    }, interval)
    
    set({ refreshInterval: intervalId })
  },

  stopAutoRefresh: () => {
    const { refreshInterval } = get()
    if (refreshInterval) {
      clearInterval(refreshInterval)
      set({ refreshInterval: null })
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => {
    const { stopAutoRefresh } = get()
    stopAutoRefresh()
    set({
      land: null,
      activities: [],
      verificationProgress: null,
      satelliteImages: [],
      loading: false,
      error: null,
    })
  },
}))

