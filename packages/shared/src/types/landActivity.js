export const VERIFICATION_STAGES = {
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
};
export function calculateVerificationProgress(stageDetails) {
    let totalWeight = 0;
    let completedWeight = 0;
    Object.entries(VERIFICATION_STAGES).forEach(([stage, config]) => {
        totalWeight += config.weight;
        if (stageDetails[stage]?.completed) {
            completedWeight += config.weight;
        }
    });
    return Math.round((completedWeight / totalWeight) * 100);
}
