import { VerificationProgress, VERIFICATION_STAGES, calculateVerificationProgress } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { landActivityService } from '../services/landActivityService.js'

class MockVerificationService {
  private verificationTimers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Start automatic verification process for a land parcel
   */
  async startVerification(landParcelId: string, userId: string): Promise<void> {
    const land = inMemoryStore.getLand(landParcelId)
    if (!land) {
      throw new Error('Land parcel not found')
    }

    // Initialize verification progress
    const progress: VerificationProgress = {
      landParcelId,
      currentStage: 'registration',
      completionPercentage: 20, // Registration is complete by default
      stageDetails: {
        registration: { completed: true, completedAt: new Date() },
        document_review: { completed: false },
        satellite_analysis: { completed: false },
        field_verification: { completed: false },
      },
      startedAt: new Date(),
    }

    inMemoryStore.setVerificationProgress(progress)

    // Log verification started activity
    landActivityService.logActivity(
      landParcelId,
      'verification_started',
      'Proses verifikasi dimulai',
      userId
    )

    // Start simulated verification stages
    this.simulateVerificationStages(landParcelId, userId)
  }

  /**
   * Simulate verification stages with realistic delays
   */
  private async simulateVerificationStages(landParcelId: string, userId: string): Promise<void> {
    const stages: Array<keyof VerificationProgress['stageDetails']> = [
      'document_review',
      'satellite_analysis',
      'field_verification',
    ]

    let cumulativeDelay = 0

    for (const stage of stages) {
      const stageConfig = VERIFICATION_STAGES[stage]
      cumulativeDelay += stageConfig.estimatedDuration * 1000

      const timer = setTimeout(() => {
        this.completeStage(landParcelId, stage, userId)
      }, cumulativeDelay)

      this.verificationTimers.set(`${landParcelId}-${stage}`, timer)
    }
  }

  /**
   * Complete a verification stage
   */
  private completeStage(
    landParcelId: string,
    stage: keyof VerificationProgress['stageDetails'],
    userId: string
  ): void {
    const progress = inMemoryStore.getVerificationProgress(landParcelId)
    if (!progress) return

    // Update stage as completed
    progress.stageDetails[stage] = {
      completed: true,
      completedAt: new Date(),
    }

    // Calculate new progress percentage
    progress.completionPercentage = calculateVerificationProgress(progress.stageDetails)

    // Update current stage
    const stages: Array<keyof VerificationProgress['stageDetails']> = [
      'registration',
      'document_review',
      'satellite_analysis',
      'field_verification',
    ]
    const nextStageIndex = stages.indexOf(stage) + 1
    if (nextStageIndex < stages.length) {
      progress.currentStage = stages[nextStageIndex]
    } else {
      progress.currentStage = 'completed'
      progress.completedAt = new Date()
    }

    inMemoryStore.setVerificationProgress(progress)

    // Log activity
    const stageConfig = VERIFICATION_STAGES[stage]
    landActivityService.logActivity(
      landParcelId,
      'status_changed',
      `${stageConfig.name} selesai`,
      userId,
      { stage, progress: progress.completionPercentage }
    )

    // If all stages complete, update land status to verified
    if (progress.currentStage === 'completed') {
      const land = inMemoryStore.getLand(landParcelId)
      if (land) {
        inMemoryStore.updateLand(landParcelId, { verificationStatus: 'verified' })
        
        landActivityService.logActivity(
          landParcelId,
          'verification_completed',
          'Verifikasi lahan berhasil diselesaikan',
          userId
        )
      }
    }
  }

  /**
   * Get verification progress for a land parcel
   */
  getVerificationProgress(landParcelId: string): VerificationProgress | undefined {
    return inMemoryStore.getVerificationProgress(landParcelId)
  }

  /**
   * Cancel ongoing verification process
   */
  cancelVerification(landParcelId: string): void {
    const stages: Array<keyof VerificationProgress['stageDetails']> = [
      'document_review',
      'satellite_analysis',
      'field_verification',
    ]

    stages.forEach(stage => {
      const timer = this.verificationTimers.get(`${landParcelId}-${stage}`)
      if (timer) {
        clearTimeout(timer)
        this.verificationTimers.delete(`${landParcelId}-${stage}`)
      }
    })
  }

  /**
   * Submit additional verification documents
   */
  submitDocuments(landParcelId: string, userId: string, documents: string[]): void {
    landActivityService.logActivity(
      landParcelId,
      'documents_uploaded',
      `${documents.length} dokumen tambahan diunggah`,
      userId,
      { documentCount: documents.length, documents }
    )
  }
}

export const mockVerificationService = new MockVerificationService()

