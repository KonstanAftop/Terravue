import { LandParcel } from '@terravue/shared'

export const exportService = {
  exportToCSV(lands: LandParcel[], filename: string = 'land-portfolio.csv'): void {
    // Prepare CSV headers
    const headers = [
      'Nama Lahan',
      'Luas (Ha)',
      'Jenis Lahan',
      'Status Verifikasi',
      'Potensi Karbon (kredit/tahun)',
      'Tanggal Daftar',
      'Terakhir Diperbarui',
    ]

    // Prepare CSV rows
    const rows = lands.map((land) => [
      land.name,
      land.area.toFixed(2),
      land.landType,
      this.getStatusLabel(land.verificationStatus),
      land.carbonPotential.toString(),
      new Date(land.createdAt).toLocaleDateString('id-ID'),
      new Date(land.updatedAt).toLocaleDateString('id-ID'),
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  getStatusLabel(status: string): string {
    switch (status) {
      case 'verified':
        return 'Terverifikasi'
      case 'pending':
        return 'Menunggu'
      case 'rejected':
        return 'Ditolak'
      default:
        return status
    }
  },
}

