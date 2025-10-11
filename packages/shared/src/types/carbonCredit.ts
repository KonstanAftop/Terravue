export type CreditStatus = 'available' | 'sold' | 'reserved'

export interface CarbonCredit {
  id: string
  landParcelId: string
  quantity: number
  pricePerCredit: number // IDR
  status: CreditStatus
  validUntil: Date
  createdAt: Date
  description?: string
}


