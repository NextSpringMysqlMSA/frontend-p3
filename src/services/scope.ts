import api from '@/lib/axios'
import type {
  StationaryCombustion,
  MobileCombustion,
  ElectricityUsage,
  SteamUsage,
  FuelType,
  StationaryCombustionForm,
  MobileCombustionForm,
  ElectricityUsageForm,
  SteamUsageForm,
  ScopeApiResponse,
  ScopeListResponse,
  ScopeSummary
} from '@/types/scope'

// =============================================================================
// Scope 1 - 고정연소 (Stationary Combustion) API
// =============================================================================

export const fetchStationaryCombustionList = async (): Promise<
  StationaryCombustion[]
> => {
  const response = await api.get('/api/v1/scope/stationary-combustion')
  return response.data
}

export const createStationaryCombustion = async (
  data: StationaryCombustionForm
): Promise<ScopeApiResponse<StationaryCombustion>> => {
  const response = await api.post('/api/v1/scope/stationary-combustion', data)
  return response.data
}

export const updateStationaryCombustion = async (
  id: number,
  data: StationaryCombustionForm
): Promise<ScopeApiResponse<StationaryCombustion>> => {
  const response = await api.put(`/api/v1/scope/stationary-combustion/${id}`, data)
  return response.data
}

export const deleteStationaryCombustion = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/v1/scope/stationary-combustion/${id}`)
  return response.data
}

export const getStationaryCombustionById = async (
  id: number
): Promise<StationaryCombustion> => {
  const response = await api.get(`/api/v1/scope/stationary-combustion/${id}`)
  return response.data
}

// =============================================================================
// Scope 1 - 이동연소 (Mobile Combustion) API
// =============================================================================

export const fetchMobileCombustionList = async (): Promise<MobileCombustion[]> => {
  const response = await api.get('/api/mobile-combustion')
  return response.data
}

export const createMobileCombustion = async (
  data: MobileCombustionForm
): Promise<ScopeApiResponse<MobileCombustion>> => {
  const response = await api.post('/api/mobile-combustion', data)
  return response.data
}

export const updateMobileCombustion = async (
  id: number,
  data: MobileCombustionForm
): Promise<ScopeApiResponse<MobileCombustion>> => {
  const response = await api.put(`/api/mobile-combustion/${id}`, data)
  return response.data
}

export const deleteMobileCombustion = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/mobile-combustion/${id}`)
  return response.data
}

export const getMobileCombustionById = async (id: number): Promise<MobileCombustion> => {
  const response = await api.get(`/api/mobile-combustion/${id}`)
  return response.data
}

// =============================================================================
// Scope 2 - 전력 사용량 (Electricity Usage) API
// =============================================================================

export const fetchElectricityUsageList = async (): Promise<ElectricityUsage[]> => {
  const response = await api.get('/api/v1/scope/electricity-usage')
  return response.data
}

export const createElectricityUsage = async (
  data: ElectricityUsageForm
): Promise<ScopeApiResponse<ElectricityUsage>> => {
  const response = await api.post('/api/v1/scope/electricity-usage', data)
  return response.data
}

export const updateElectricityUsage = async (
  id: number,
  data: ElectricityUsageForm
): Promise<ScopeApiResponse<ElectricityUsage>> => {
  const response = await api.put(`/api/v1/scope/electricity-usage/${id}`, data)
  return response.data
}

export const deleteElectricityUsage = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/v1/scope/electricity-usage/${id}`)
  return response.data
}

export const getElectricityUsageById = async (id: number): Promise<ElectricityUsage> => {
  const response = await api.get(`/api/v1/scope/electricity-usage/${id}`)
  return response.data
}

// =============================================================================
// Scope 2 - 스팀 사용량 (Steam Usage) API
// =============================================================================

export const fetchSteamUsageList = async (): Promise<SteamUsage[]> => {
  const response = await api.get('/api/steam-usage')
  return response.data
}

export const createSteamUsage = async (
  data: SteamUsageForm
): Promise<ScopeApiResponse<SteamUsage>> => {
  const response = await api.post('/api/steam-usage', data)
  return response.data
}

export const updateSteamUsage = async (
  id: number,
  data: SteamUsageForm
): Promise<ScopeApiResponse<SteamUsage>> => {
  const response = await api.put(`/api/steam-usage/${id}`, data)
  return response.data
}

export const deleteSteamUsage = async (id: number): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/steam-usage/${id}`)
  return response.data
}

export const getSteamUsageById = async (id: number): Promise<SteamUsage> => {
  const response = await api.get(`/api/steam-usage/${id}`)
  return response.data
}

// =============================================================================
// 연료 타입 (Fuel Type) API
// =============================================================================

export const fetchFuelTypeList = async (): Promise<FuelType[]> => {
  const response = await api.get('/api/fuel-types')
  return response.data
}

export const createFuelType = async (
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.post('/api/fuel-types', data)
  return response.data
}

export const updateFuelType = async (
  id: number,
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.put(`/api/fuel-types/${id}`, data)
  return response.data
}

export const deleteFuelType = async (id: number): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/fuel-types/${id}`)
  return response.data
}

export const getFuelTypeById = async (id: number): Promise<FuelType> => {
  const response = await api.get(`/api/fuel-types/${id}`)
  return response.data
}

// =============================================================================
// 요약 및 통계 API
// =============================================================================

export const fetchScopeSummary = async (
  reportingYear?: number
): Promise<ScopeSummary> => {
  const params = reportingYear ? `?year=${reportingYear}` : ''
  const response = await api.get(`/api/v1/scope/summary${params}`)
  return response.data
}

export const fetchScope1Summary = async (
  reportingYear?: number
): Promise<{
  totalEmission: number
  stationaryEmission: number
  mobileEmission: number
}> => {
  const params = reportingYear ? `?year=${reportingYear}` : ''
  const response = await api.get(`/api/v1/scope/scope1/summary${params}`)
  return response.data
}

export const fetchScope2Summary = async (
  reportingYear?: number
): Promise<{
  totalEmission: number
  electricityEmission: number
  steamEmission: number
  renewableUsage: number
}> => {
  const params = reportingYear ? `?year=${reportingYear}` : ''
  const response = await api.get(`/api/v1/scope/scope2/summary${params}`)
  return response.data
}

// =============================================================================
// 회사별 및 연도별 필터링 API
// =============================================================================

export const fetchStationaryCombustionByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<StationaryCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/stationary-combustion/company/${companyId}/year/${year}`
  )
  return response.data
}

export const fetchMobileCombustionByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<MobileCombustion[]> => {
  const response = await api.get(
    `/api/mobile-combustion/company/${companyId}/year/${year}`
  )
  return response.data
}

export const fetchElectricityUsageByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<ElectricityUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/electricity-usage/company/${companyId}/year/${year}`
  )
  return response.data
}

export const fetchSteamUsageByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<SteamUsage[]> => {
  const response = await api.get(`/api/steam-usage/company/${companyId}/year/${year}`)
  return response.data
}

// =============================================================================
// 협력사별 및 연도별 필터링 API (새로운 방식)
// =============================================================================

export const fetchStationaryCombustionByPartnerAndYear = async (
  partnerCompanyId: number,
  year: number
): Promise<StationaryCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/stationary-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchMobileCombustionByPartnerAndYear = async (
  partnerCompanyId: number,
  year: number
): Promise<MobileCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/mobile-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchElectricityUsageByPartnerAndYear = async (
  partnerCompanyId: number,
  year: number
): Promise<ElectricityUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/electricity-usage/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchSteamUsageByPartnerAndYear = async (
  partnerCompanyId: number,
  year: number
): Promise<SteamUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/steam-usage/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}
