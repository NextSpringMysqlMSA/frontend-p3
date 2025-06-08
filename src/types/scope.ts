// Scope 관련 타입 정의

// 파트너 회사 정보
export interface PartnerCompany {
  id: number
  name: string
  businessNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  companyType: string
  contactEmail?: string
  contactPhone?: string
  createdAt?: string
  updatedAt?: string
}

// 월별 데이터 입력을 위한 기본 인터페이스
export interface MonthlyData {
  month: number
  value: number
  unit?: string
}

// Scope 1 - 고정연소 (Stationary Combustion)
export interface StationaryCombustion {
  id?: number
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityType: string
  fuelTypeId: number
  fuelTypeName?: string
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

// Scope 1 - 이동연소 (Mobile Combustion)
export interface MobileCombustion {
  id?: number
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  vehicleType: string
  fuelTypeId: number
  fuelTypeName?: string
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

// Scope 2 - 전력 사용량 (Electricity Usage)
export interface ElectricityUsage {
  id?: number
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  electricityUsage: number
  unit: string
  isRenewable: boolean
  co2Emission?: number
  totalEmission?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

// Scope 2 - 스팀 사용량 (Steam Usage)
export interface SteamUsage {
  id?: number
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  steamUsage: number
  unit: string
  co2Emission?: number
  calculatedAt?: string
  createdAt?: string
  createdBy?: string
}

// 연료 타입 (Fuel Type)
export interface FuelType {
  id: number
  name: string
  category: string
  unit: string
  description?: string
}

// 폼 데이터 타입들
export interface StationaryCombustionForm {
  partnerCompanyId: number
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityType: string
  fuelTypeId: string
  fuelUsage: string
  createdBy: string
}

export interface MobileCombustionForm {
  partnerCompanyId: number
  reportingYear: number
  reportingMonth: number
  vehicleType: string
  fuelTypeId: string
  fuelUsage: string
  createdBy: string
}

export interface ElectricityUsageForm {
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  electricityUsage: number
  unit?: string
  isRenewable: boolean
  createdBy?: string
}

export interface SteamUsageForm {
  partnerCompanyId: number
  partnerCompanyName?: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  steamUsage: number
  unit?: string
  createdBy?: string
}

// API 응답 타입들
export interface ScopeApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ScopeListResponse<T> extends ScopeApiResponse<T[]> {
  totalCount?: number
  pageSize?: number
  currentPage?: number
}

// 요약 데이터 타입
export interface ScopeSummary {
  totalScope1Emission: number
  totalScope2Emission: number
  totalElectricityUsage: number
  renewableElectricityUsage: number
  totalStationaryCombustionEmission: number
  totalMobileCombustionEmission: number
  totalSteamEmission: number
  reportingYear: number
}
