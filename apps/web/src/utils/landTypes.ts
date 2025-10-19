export const LAND_TYPES = [
  {
    value: 'Primary Forest',
    label: 'Primary Forest',
    description: 'Undisturbed natural forest',
    carbonRate: 15,
  },
  {
    value: 'Secondary Forest',
    label: 'Secondary Forest',
    description: 'Forests that have experienced disturbance and are recovering',
    carbonRate: 10,
  },
  {
    value: 'Plantation Forest',
    label: 'Plantation Forest',
    description: 'Managed forest planted for timber production',
    carbonRate: 8,
  },
  {
    value: 'Mangrove Forest',
    label: 'Mangrove Forest',
    description: 'Coastal mangrove ecosystem',
    carbonRate: 12,
  },
  {
    value: 'Agricultural Land',
    label: 'Agricultural Land',
    description: 'Land used for farming activities',
    carbonRate: 3,
  },
  {
    value: 'Mixed-use Land',
    label: 'Mixed-use Land',
    description: 'Land supporting multiple uses',
    carbonRate: 5,
  },
  {
    value: 'Conservation Area',
    label: 'Conservation Area',
    description: 'Protected conservation area',
    carbonRate: 13,
  },
]

export function estimateCarbonPotential(area: number, landType: string): number {
  const type = LAND_TYPES.find((t) => t.value === landType)
  const rate = type?.carbonRate || 5
  return Math.round(area * rate)
}

