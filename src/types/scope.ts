// Scope 관련 타입 정의

// 파트너 회사 정보 (확장된 형태)
export interface PartnerCompany {
  id: string // UUID 형태
  name: string
  businessNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  companyType: string
  contactEmail?: string
  contactPhone?: string
  createdAt?: string
  updatedAt?: string

  // 추가: DART 및 회사 정보 필드들
  companyName?: string // 회사명 (name과 동일할 수 있음)
  corpName?: string // 법인명
  corpCode?: string // DART 기업 코드
  corp_code?: string // 서버 호환성을 위한 필드
  corp_name?: string // 서버 호환성을 위한 필드
  stockCode?: string // 주식 코드
}

// Scope에서 사용하는 간소화된 협력사 정보
export interface PartnerCompanyForScope {
  id: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

// === 배출활동 타입 정의 ===
export type EmissionActivityType =
  | 'STATIONARY_COMBUSTION' // 고정연소
  | 'MOBILE_COMBUSTION' // 이동연소
  | 'ELECTRICITY' // 전력
  | 'STEAM' // 스팀

// 고정연소 세부 타입
export type StationaryCombustionType =
  | 'LIQUID' // 액체연료
  | 'SOLID' // 고체연료
  | 'GAS' // 가스연료

// 이동연소 세부 타입
export type MobileCombustionType =
  | 'ROAD' // 도로교통
  | 'AVIATION' // 항공

// 스팀 타입
export type SteamType = 'TYPE_A' | 'TYPE_B' | 'TYPE_C'

// === 연료 타입 정의 ===
export interface FuelType {
  id: string
  name: string
  category: string
  subcategory?: string
  unit: string
  description?: string
  co2Factor?: number
  ch4Factor?: number
  n2oFactor?: number
  emissionActivityType: EmissionActivityType
  subcategoryType?: string
}

// === 연료 카테고리 상수 ===
export const FUEL_CATEGORIES = {
  // 고정연소 - 액체연료 (석유계 29개)
  LIQUID_PETROLEUM: [
    'CRUDE_OIL',
    'NAPHTHA',
    'GASOLINE',
    'AVIATION_GASOLINE',
    'JET_FUEL_KEROSENE',
    'JET_FUEL_GASOLINE',
    'KEROSENE',
    'DIESEL',
    'HEAVY_OIL_A',
    'HEAVY_OIL_B',
    'HEAVY_OIL_C',
    'BUNKER_A_OIL',
    'BUNKER_B_OIL',
    'BUNKER_C_OIL',
    'LUBRICANTS',
    'BITUMEN_ASPHALT',
    'PETROLEUM_COKE',
    'REFINERY_FEEDSTOCK',
    'REFINERY_GAS',
    'ETHANE',
    'LIQUEFIED_PETROLEUM_GAS',
    'PARAFFIN_WAXES',
    'WHITE_SPIRIT_SBP',
    'OTHER_PETROLEUM_PRODUCTS',
    'ANTHRACITE',
    'BITUMINOUS_COAL',
    'SUB_BITUMINOUS_COAL',
    'LIGNITE',
    'OIL_SHALE'
  ],

  // 고정연소 - 고체연료 (석탄계 15개)
  SOLID_COAL: [
    'COKING_COAL',
    'OTHER_BITUMINOUS_COAL',
    'SUB_BITUMINOUS_COAL_SOLID',
    'LIGNITE_SOLID',
    'ANTHRACITE_SOLID',
    'COAL_TAR',
    'GAS_COKE',
    'COKE_OVEN_COKE',
    'PATENT_FUEL',
    'BKB_OVOIDS',
    'CHARCOAL',
    'BLAST_FURNACE_GAS',
    'OXYGEN_STEEL_FURNACE_GAS',
    'NATURAL_GAS_SOLID',
    'REFINERY_GAS_SOLID'
  ],

  // 고정연소 - 가스연료 (11개)
  GAS_FUEL: [
    'NATURAL_GAS',
    'LIQUEFIED_NATURAL_GAS',
    'TOWN_GAS',
    'COKE_OVEN_GAS',
    'BLAST_FURNACE_GAS_FUEL',
    'OXYGEN_STEEL_FURNACE_GAS_FUEL',
    'REFINERY_GAS_FUEL',
    'ETHANE_GAS',
    'PROPANE',
    'BUTANE',
    'OTHER_HYDROCARBON_GAS'
  ],

  // 이동연소 - 차량전용연료 (3개)
  VEHICLE_FUEL: [
    'MOTOR_GASOLINE',
    'AUTOMOTIVE_DIESEL',
    'LIQUEFIED_PETROLEUM_GAS_VEHICLE'
  ],

  // 이동연소 - 일반연료 (4개)
  GENERAL_FUEL: [
    'KEROSENE_MOBILE',
    'HEAVY_OIL_MOBILE',
    'NATURAL_GAS_MOBILE',
    'LUBRICANTS_MOBILE'
  ],

  // 이동연소 - 항공용연료 (3개)
  AVIATION_FUEL: [
    'AVIATION_GASOLINE_MOBILE',
    'JET_FUEL_KEROSENE_MOBILE',
    'JET_FUEL_GASOLINE_MOBILE'
  ],

  // 이동연소 - 바이오연료 (2개)
  BIO_FUEL: ['BIODIESEL', 'BIOETHANOL'],

  // 전력 (1개)
  ELECTRICITY: ['ELECTRICITY_KWH'],

  // 스팀 (3개)
  STEAM: ['STEAM_TYPE_A', 'STEAM_TYPE_B', 'STEAM_TYPE_C']
} as const

// === Scope 1 데이터 타입 ===
export interface StationaryCombustion {
  id?: number
  companyId: string // UUID 형태 (협력사 ID)
  partnerCompany?: PartnerCompanyForScope // 협력사 정보 (조회 시 포함)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  combustionType: StationaryCombustionType
  fuelId: string
  fuelName?: string
  fuelUsage: number
  unit: string
  co2Emission?: number
  ch4Emission?: number
  n2oEmission?: number
  totalCo2Equivalent?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

export interface MobileCombustion {
  id?: number
  companyId: string // UUID 형태 (협력사 ID)
  partnerCompany?: PartnerCompanyForScope // 협력사 정보 (조회 시 포함)
  reportingYear: number
  reportingMonth: number
  vehicleType: string
  transportType: MobileCombustionType
  fuelId: string
  fuelName?: string
  fuelUsage: number
  unit: string
  distance?: number // 거리 (km)
  co2Emission?: number
  ch4Emission?: number
  n2oEmission?: number
  totalCo2Equivalent?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

// === Scope 2 데이터 타입 ===
export interface ElectricityUsage {
  id?: number
  companyId: string // UUID 형태 (협력사 ID)
  partnerCompany?: PartnerCompanyForScope // 협력사 정보 (조회 시 포함)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  electricityUsage: number
  unit: string // 'KWH'
  isRenewable: boolean
  renewableType?: string // 재생에너지 타입 (태양광, 풍력 등)
  co2Emission?: number
  totalEmission?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

export interface SteamUsage {
  id?: number
  companyId: string // UUID 형태 (협력사 ID)
  partnerCompany?: PartnerCompanyForScope // 협력사 정보 (조회 시 포함)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  steamType: SteamType
  steamUsage: number
  unit: string // 'GJ'
  co2Emission?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

// === 폼 데이터 타입들 (백엔드 API 요청용) ===
export interface StationaryCombustionForm {
  memberId: number
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  combustionType: StationaryCombustionType
  fuelId: string
  fuelName: string
  fuelUsage: number // 숫자 타입
  unit: string
  createdBy: string
  notes?: string
}

export interface MobileCombustionForm {
  memberId: number
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  vehicleType: string
  transportType: MobileCombustionType
  fuelId: string
  fuelName: string
  fuelUsage: number // 숫자 타입
  unit: string
  distance?: number // 숫자 타입
  createdBy: string
  notes?: string
}

export interface ElectricityUsageForm {
  memberId: number
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  electricityUsage: number // 숫자 타입
  unit: string
  isRenewable: boolean
  renewableType?: string
  createdBy: string
  notes?: string
}

export interface SteamUsageForm {
  memberId: number
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  steamType: SteamType
  steamUsage: number // 숫자 타입
  unit: string
  createdBy: string
  notes?: string
}

// === 통합 폼 데이터 타입 (UI용 - 문자열 타입) ===
export interface ScopeFormData {
  // 공통 정보
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  emissionActivityType: EmissionActivityType

  // 배출활동별 세부 정보 (UI용 - 일부 필드는 문자열)
  stationaryCombustion?: StationaryCombustionFormUI
  mobileCombustion?: MobileCombustionFormUI
  electricity?: ElectricityUsageFormUI
  steam?: SteamUsageFormUI
}

// === UI 폼 데이터 타입들 (폼 입력용 - 일부 문자열 타입) ===
export interface StationaryCombustionFormUI {
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  combustionType: StationaryCombustionType
  fuelId: string
  fuelName?: string
  fuelUsage: string | number // UI에서는 문자열, API에서는 숫자
  unit: string
  createdBy: string
  notes?: string
}

export interface MobileCombustionFormUI {
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  vehicleType: string
  transportType: MobileCombustionType
  fuelId: string
  fuelName?: string
  fuelUsage: string | number // UI에서는 문자열, API에서는 숫자
  unit: string
  distance?: string | number // UI에서는 문자열, API에서는 숫자
  createdBy: string
  notes?: string
}

export interface ElectricityUsageFormUI {
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  electricityUsage: string | number // UI에서는 문자열, API에서는 숫자
  unit: string
  isRenewable: boolean
  renewableType?: string
  createdBy: string
  notes?: string
}

export interface SteamUsageFormUI {
  companyId: string // UUID 형태 (협력사 ID)
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  steamType: SteamType
  steamUsage: string | number // UI에서는 문자열, API에서는 숫자
  unit: string
  createdBy: string
  notes?: string
}

// === API 응답 타입들 ===
export interface ScopeApiResponse<T> {
  data: T
  message?: string
  success: boolean
  timestamp?: string
}

export interface ScopeListResponse<T> extends ScopeApiResponse<T[]> {
  totalCount?: number
  pageSize?: number
  currentPage?: number
  totalPages?: number
}

// === 요약 데이터 타입 ===
export interface ScopeSummary {
  totalScope1Emission: number
  totalScope2Emission: number
  totalElectricityUsage: number
  renewableElectricityUsage: number
  totalStationaryCombustionEmission: number
  totalMobileCombustionEmission: number
  totalSteamEmission: number
  reportingYear: number
  reportingMonth?: number
  companyId?: string // UUID 형태 (협력사 ID)
}

// === 배출계수 타입 ===
export interface EmissionFactor {
  fuelId: string
  fuelName: string
  co2Factor: number
  ch4Factor?: number
  n2oFactor?: number
  unit: string
  category: string
  description?: string
}

// === 계산 결과 타입 ===
export interface EmissionCalculationResult {
  co2Emission: number
  ch4Emission?: number
  n2oEmission?: number
  totalCo2Equivalent: number
  calculationFormula?: string
  appliedFactors?: EmissionFactor
}
