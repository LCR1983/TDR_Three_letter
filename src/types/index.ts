export type Park = 'TDL' | 'TDS'

export type AttractionStatus = 'PUBLISHED' | 'DRAFT' | 'MAINTENANCE' | 'CLOSED'

export type RotationClass = 'E' | 'D' | 'C' | 'B' | 'A'

export interface AreaData {
  id: string
  park: string
  code: string
  name: string
  englishName: string
  sortOrder: number
}

export interface AttractionData {
  id: string
  park: string
  areaId: string
  area: AreaData
  threeLetterCode: string
  name: string
  englishName: string
  openDate?: string | null
  sponsor?: string | null
  rideSystem?: string | null
  isIndoor: boolean
  durationSec?: number | null
  capacity?: number | null
  vehicleNote?: string | null
  promiseTime?: number | null
  dispatchTime?: number | null
  rotationClass?: string | null
  rotationNote?: string | null
  hasDPA: boolean
  hasSingleRider: boolean
  passNote?: string | null
  heightMin?: number | null
  restrictionNote?: string | null
  bgs?: string | null
  details?: string | null
  operationNotes?: string | null
  status: string
  statusNote?: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
