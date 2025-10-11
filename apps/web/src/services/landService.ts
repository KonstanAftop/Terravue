import { api } from './api'
import { LandParcel } from '@terravue/shared'

export interface LandListResponse {
  lands: LandParcel[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export interface LandQueryParams {
  search?: string
  status?: 'pending' | 'verified' | 'rejected'
  sortBy?: 'name' | 'area' | 'createdAt' | 'verificationStatus'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export const landService = {
  async getUserLands(params?: LandQueryParams): Promise<LandListResponse> {
    const response = await api.get('/lands', { params })
    return response.data.data
  },

  async getLandById(id: string): Promise<LandParcel> {
    const response = await api.get(`/lands/${id}`)
    return response.data.data
  },

  async createLand(landData: Partial<LandParcel>): Promise<LandParcel> {
    const response = await api.post('/lands', landData)
    return response.data.data
  },

  async updateLand(id: string, updates: Partial<LandParcel>): Promise<LandParcel> {
    const response = await api.put(`/lands/${id}`, updates)
    return response.data.data
  },

  async deleteLand(id: string): Promise<void> {
    await api.delete(`/lands/${id}`)
  },
}

