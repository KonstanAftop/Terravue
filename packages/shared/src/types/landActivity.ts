export interface LandActivity {
  id: string
  landParcelId: string
  activityType: 'created' | 'updated' | 'verification_started' | 'verification_completed' | 'documents_uploaded' | 'status_changed'
  description: string
  userId: string
  userName?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface VerificationProgress {
  landParcelId: string
  currentStage: 'registration' | 'document_review' | 'satellite_analysis' | 'field_verification' | 'completed'
  completionPercentage: number
  stageDetails: {
    registration: { completed: boolean; completedAt?: Date }
    document_review: { completed: boolean; completedAt?: Date }
    satellite_analysis: { completed: boolean; completedAt?: Date }
    field_verification: { completed: boolean; completedAt?: Date }
  }
  startedAt: Date
  completedAt?: Date
}

export interface VerificationStageConfig {
  name: string
  weight: number
  description: string
  estimatedDuration: number // in seconds
}

export const VERIFICATION_STAGES: Record<string, VerificationStageConfig> = {
  registration: {
    name: 'Pendaftaran Lengkap',
    weight: 20,
    description: 'Informasi lahan telah terdaftar',
    estimatedDuration: 0,
  },
  document_review: {
    name: 'Tinjauan Dokumen',
    weight: 30,
    description: 'Dokumen kepemilikan sedang ditinjau',
    estimatedDuration: 5,
  },
  satellite_analysis: {
    name: 'Analisis Satelit',
    weight: 30,
    description: 'Analisis citra satelit untuk verifikasi area',
    estimatedDuration: 3,
  },
  field_verification: {
    name: 'Verifikasi Lapangan',
    weight: 20,
    description: 'Verifikasi kondisi lahan di lapangan',
    estimatedDuration: 2,
  },
}

export function calculateVerificationProgress(stageDetails: VerificationProgress['stageDetails']): number {
  let totalWeight = 0
  let completedWeight = 0

  Object.entries(VERIFICATION_STAGES).forEach(([stage, config]) => {
    totalWeight += config.weight
    if (stageDetails[stage as keyof typeof stageDetails]?.completed) {
      completedWeight += config.weight
    }
  })

  return Math.round((completedWeight / totalWeight) * 100)
}

