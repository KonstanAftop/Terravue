export const LAND_TYPES = [
  {
    value: 'Primary Forest',
    label: 'Hutan Primer',
    description: 'Hutan alami yang belum terganggu',
    carbonRate: 15,
  },
  {
    value: 'Secondary Forest',
    label: 'Hutan Sekunder',
    description: 'Hutan yang telah mengalami gangguan dan sedang pulih',
    carbonRate: 10,
  },
  {
    value: 'Plantation Forest',
    label: 'Hutan Tanaman',
    description: 'Hutan tanaman untuk produksi kayu',
    carbonRate: 8,
  },
  {
    value: 'Mangrove Forest',
    label: 'Hutan Mangrove',
    description: 'Hutan bakau di wilayah pesisir',
    carbonRate: 12,
  },
  {
    value: 'Agricultural Land',
    label: 'Lahan Pertanian',
    description: 'Lahan untuk kegiatan pertanian',
    carbonRate: 3,
  },
  {
    value: 'Mixed-use Land',
    label: 'Lahan Campuran',
    description: 'Lahan dengan berbagai penggunaan',
    carbonRate: 5,
  },
  {
    value: 'Conservation Area',
    label: 'Kawasan Konservasi',
    description: 'Area yang dilindungi untuk konservasi',
    carbonRate: 13,
  },
]

export function estimateCarbonPotential(area: number, landType: string): number {
  const type = LAND_TYPES.find((t) => t.value === landType)
  const rate = type?.carbonRate || 5
  return Math.round(area * rate)
}

