import { create } from 'zustand'
import { LandParcel } from '@terravue/shared'
import { landService, LandQueryParams } from '../services/landService'

interface LandState {
  lands: LandParcel[]
  total: number
  page: number
  totalPages: number
  limit: number
  loading: boolean
  error: string | null
  searchParams: LandQueryParams
  selectedLands: string[]
  fetchLands: (params?: LandQueryParams) => Promise<void>
  setSearchParams: (params: LandQueryParams) => void
  setSelectedLands: (ids: string[]) => void
  toggleLandSelection: (id: string) => void
  selectAllLands: () => void
  clearSelection: () => void
}

export const useLandStore = create<LandState>((set, get) => ({
  lands: [],
  total: 0,
  page: 1,
  totalPages: 0,
  limit: 50,
  loading: false,
  error: null,
  searchParams: {},
  selectedLands: [],

  fetchLands: async (params?: LandQueryParams) => {
    set({ loading: true, error: null })
    try {
      const combinedParams = { ...get().searchParams, ...params }
      const data = await landService.getUserLands(combinedParams)
      set({
        lands: data.lands,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        limit: data.limit,
        loading: false,
        searchParams: combinedParams,
      })
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch lands',
        loading: false,
      })
    }
  },

  setSearchParams: (params: LandQueryParams) => {
    set({ searchParams: params })
    get().fetchLands(params)
  },

  setSelectedLands: (ids: string[]) => {
    set({ selectedLands: ids })
  },

  toggleLandSelection: (id: string) => {
    const { selectedLands } = get()
    if (selectedLands.includes(id)) {
      set({ selectedLands: selectedLands.filter((landId) => landId !== id) })
    } else {
      set({ selectedLands: [...selectedLands, id] })
    }
  },

  selectAllLands: () => {
    const { lands } = get()
    set({ selectedLands: lands.map((land) => land.id) })
  },

  clearSelection: () => {
    set({ selectedLands: [] })
  },
}))

