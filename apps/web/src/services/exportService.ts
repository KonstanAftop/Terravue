import { LandParcel } from '@terravue/shared'

export const exportService = {
  exportToCSV(lands: LandParcel[], filename: string = 'land-portfolio.csv'): void {
    // Prepare CSV headers
    const headers = [
      'Land Name',
      'Area (ha)',
      'Land Type',
      'Verification Status',
      'Carbon Potential (credits/year)',
      'Date Added',
      'Last Updated',
    ]

    // Prepare CSV rows
    const rows = lands.map((land) => [
      land.name,
      land.area.toFixed(2),
      land.landType,
      this.getStatusLabel(land.verificationStatus),
      land.carbonPotential.toString(),
      new Date(land.createdAt).toLocaleDateString('en-US'),
      new Date(land.updatedAt).toLocaleDateString('en-US'),
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
        return 'Verified'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  },
}

