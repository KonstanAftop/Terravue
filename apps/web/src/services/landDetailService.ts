import { api } from './api'
import { LandParcel, LandActivity, VerificationProgress } from '@terravue/shared'

export interface LandDetailResponse {
  land: LandParcel
  activities: LandActivity[]
  verificationProgress?: VerificationProgress
  satelliteImages: string[]
}

class LandDetailService {
  /**
   * Get detailed information about a specific land parcel
   */
  async getLandDetail(landId: string): Promise<LandDetailResponse> {
    const response = await api.get<{ success: boolean; data: LandDetailResponse }>(`/lands/${landId}`)
    return response.data.data
  }

  /**
   * Update land parcel information
   */
  async updateLand(landId: string, updates: Partial<LandParcel>): Promise<LandParcel> {
    const response = await api.put<{ success: boolean; data: LandParcel }>(`/lands/${landId}`, updates)
    return response.data.data
  }

  /**
   * Submit verification documents
   */
  async submitDocuments(landId: string, documents: string[]): Promise<void> {
    await api.post(`/lands/${landId}/submit-documents`, { documents })
  }
}

export const landDetailService = new LandDetailService()

