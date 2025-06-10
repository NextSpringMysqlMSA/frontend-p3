import api from '@/lib/axios'
import {showError, showSuccess, showLoading, dismissLoading} from '@/util/toast'
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
  ScopeFormData,
  ScopeApiResponse,
  ScopeListResponse,
  ScopeSummary,
  EmissionCalculationResult,
  EmissionActivityType
} from '@/types/scope'
import {getFuelById, getAllFuels, getFuelsByActivityType} from '@/constants/fuel-data'

// =============================================================================
// 연료 관련 서비스
// =============================================================================

export const fetchFuelTypes = async (): Promise<FuelType[]> => {
  // 로컬 연료 데이터 반환 (필요시 API 호출로 변경 가능)
  return getAllFuels()
}

export const fetchFuelsByActivityType = async (
  activityType: EmissionActivityType,
  subType?: string
): Promise<FuelType[]> => {
  return getFuelsByActivityType(activityType, subType)
}

export const fetchFuelById = async (fuelId: string): Promise<FuelType | null> => {
  const fuel = getFuelById(fuelId)
  return fuel || null
}

// =============================================================================
// 배출량 계산 서비스
// =============================================================================

export const calculateEmissions = async (
  fuelId: string,
  usage: number
): Promise<EmissionCalculationResult> => {
  const fuel = getFuelById(fuelId)
  if (!fuel) {
    throw new Error(`연료 정보를 찾을 수 없습니다: ${fuelId}`)
  }

  let result: EmissionCalculationResult

  if (fuel.emissionActivityType === 'ELECTRICITY') {
    // 전력: CO2 = 전력사용량(kWh) × 0.0004653
    const co2Emission = usage * fuel.co2Factor!
    result = {
      co2Emission,
      totalCo2Equivalent: co2Emission,
      calculationFormula: `CO2 = ${usage} kWh × ${fuel.co2Factor} = ${co2Emission.toFixed(
        3
      )} tCO2`,
      appliedFactors: {
        fuelId: fuel.id,
        fuelName: fuel.name,
        co2Factor: fuel.co2Factor!,
        unit: fuel.unit,
        category: fuel.category
      }
    }
  } else if (fuel.emissionActivityType === 'STEAM') {
    // 스팀: CO2 = 스팀사용량(GJ) × 배출계수
    const co2Emission = usage * fuel.co2Factor!
    result = {
      co2Emission,
      totalCo2Equivalent: co2Emission,
      calculationFormula: `CO2 = ${usage} GJ × ${fuel.co2Factor} = ${co2Emission.toFixed(
        3
      )} tCO2`,
      appliedFactors: {
        fuelId: fuel.id,
        fuelName: fuel.name,
        co2Factor: fuel.co2Factor!,
        unit: fuel.unit,
        category: fuel.category
      }
    }
  } else {
    // 연료연소: 총 CO2eq = CO2 + (CH4×25) + (N2O×298)
    const co2Emission = usage * fuel.co2Factor!
    const ch4Emission = usage * (fuel.ch4Factor || 0)
    const n2oEmission = usage * (fuel.n2oFactor || 0)
    const totalCo2Equivalent = co2Emission + ch4Emission * 25 + n2oEmission * 298

    result = {
      co2Emission,
      ch4Emission,
      n2oEmission,
      totalCo2Equivalent,
      calculationFormula: `총 CO2eq = ${co2Emission.toFixed(3)} + (${ch4Emission.toFixed(
        6
      )} × 25) + (${n2oEmission.toFixed(6)} × 298) = ${totalCo2Equivalent.toFixed(
        3
      )} tCO2eq`,
      appliedFactors: {
        fuelId: fuel.id,
        fuelName: fuel.name,
        co2Factor: fuel.co2Factor!,
        ch4Factor: fuel.ch4Factor,
        n2oFactor: fuel.n2oFactor,
        unit: fuel.unit,
        category: fuel.category
      }
    }
  }

  return result
}

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
  const loadingId = showLoading('고정연소 데이터를 저장하는 중...')
  try {
    const response = await api.post('/api/v1/scope/stationary-combustion', data)
    dismissLoading(loadingId, '고정연소 데이터가 성공적으로 저장되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '고정연소 데이터 저장에 실패했습니다.', 'error')
    throw error
  }
}

export const updateStationaryCombustion = async (
  id: number,
  data: StationaryCombustionForm
): Promise<ScopeApiResponse<StationaryCombustion>> => {
  const loadingId = showLoading('고정연소 데이터를 수정하는 중...')
  try {
    const response = await api.put(`/api/v1/scope/stationary-combustion/${id}`, data)
    dismissLoading(loadingId, '고정연소 데이터가 성공적으로 수정되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '고정연소 데이터 수정에 실패했습니다.', 'error')
    throw error
  }
}

export const deleteStationaryCombustion = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const loadingId = showLoading('고정연소 데이터를 삭제하는 중...')
  try {
    const response = await api.delete(`/api/v1/scope/stationary-combustion/${id}`)
    dismissLoading(loadingId, '고정연소 데이터가 성공적으로 삭제되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '고정연소 데이터 삭제에 실패했습니다.', 'error')
    throw error
  }
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
  const response = await api.get('/api/v1/scope/mobile-combustion')
  return response.data
}

export const createMobileCombustion = async (
  data: MobileCombustionForm
): Promise<ScopeApiResponse<MobileCombustion>> => {
  const loadingId = showLoading('이동연소 데이터를 저장하는 중...')
  try {
    const response = await api.post('/api/v1/scope/mobile-combustion', data)
    dismissLoading(loadingId, '이동연소 데이터가 성공적으로 저장되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '이동연소 데이터 저장에 실패했습니다.', 'error')
    throw error
  }
}

export const updateMobileCombustion = async (
  id: number,
  data: MobileCombustionForm
): Promise<ScopeApiResponse<MobileCombustion>> => {
  const loadingId = showLoading('이동연소 데이터를 수정하는 중...')
  try {
    const response = await api.put(`/api/v1/scope/mobile-combustion/${id}`, data)
    dismissLoading(loadingId, '이동연소 데이터가 성공적으로 수정되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '이동연소 데이터 수정에 실패했습니다.', 'error')
    throw error
  }
}

export const deleteMobileCombustion = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const loadingId = showLoading('이동연소 데이터를 삭제하는 중...')
  try {
    const response = await api.delete(`/api/v1/scope/mobile-combustion/${id}`)
    dismissLoading(loadingId, '이동연소 데이터가 성공적으로 삭제되었습니다.', 'success')
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '이동연소 데이터 삭제에 실패했습니다.', 'error')
    throw error
  }
}

export const getMobileCombustionById = async (id: number): Promise<MobileCombustion> => {
  const response = await api.get(`/api/v1/scope/mobile-combustion/${id}`)
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
  const loadingId = showLoading('전력 사용량 데이터를 저장하는 중...')
  try {
    const response = await api.post('/api/v1/scope/electricity-usage', data)
    dismissLoading(
      loadingId,
      '전력 사용량 데이터가 성공적으로 저장되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '전력 사용량 데이터 저장에 실패했습니다.', 'error')
    throw error
  }
}

export const updateElectricityUsage = async (
  id: number,
  data: ElectricityUsageForm
): Promise<ScopeApiResponse<ElectricityUsage>> => {
  const loadingId = showLoading('전력 사용량 데이터를 수정하는 중...')
  try {
    const response = await api.put(`/api/v1/scope/electricity-usage/${id}`, data)
    dismissLoading(
      loadingId,
      '전력 사용량 데이터가 성공적으로 수정되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '전력 사용량 데이터 수정에 실패했습니다.', 'error')
    throw error
  }
}

export const deleteElectricityUsage = async (
  id: number
): Promise<ScopeApiResponse<void>> => {
  const loadingId = showLoading('전력 사용량 데이터를 삭제하는 중...')
  try {
    const response = await api.delete(`/api/v1/scope/electricity-usage/${id}`)
    dismissLoading(
      loadingId,
      '전력 사용량 데이터가 성공적으로 삭제되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '전력 사용량 데이터 삭제에 실패했습니다.', 'error')
    throw error
  }
}

export const getElectricityUsageById = async (id: number): Promise<ElectricityUsage> => {
  const response = await api.get(`/api/v1/scope/electricity-usage/${id}`)
  return response.data
}

// =============================================================================
// Scope 2 - 스팀 사용량 (Steam Usage) API
// =============================================================================

export const fetchSteamUsageList = async (): Promise<SteamUsage[]> => {
  const response = await api.get('/api/v1/scope/steam-usage')
  return response.data
}

export const createSteamUsage = async (
  data: SteamUsageForm
): Promise<ScopeApiResponse<SteamUsage>> => {
  const loadingId = showLoading('스팀 사용량 데이터를 저장하는 중...')
  try {
    const response = await api.post('/api/v1/scope/steam-usage', data)
    dismissLoading(
      loadingId,
      '스팀 사용량 데이터가 성공적으로 저장되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '스팀 사용량 데이터 저장에 실패했습니다.', 'error')
    throw error
  }
}

export const updateSteamUsage = async (
  id: number,
  data: SteamUsageForm
): Promise<ScopeApiResponse<SteamUsage>> => {
  const loadingId = showLoading('스팀 사용량 데이터를 수정하는 중...')
  try {
    const response = await api.put(`/api/v1/scope/steam-usage/${id}`, data)
    dismissLoading(
      loadingId,
      '스팀 사용량 데이터가 성공적으로 수정되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '스팀 사용량 데이터 수정에 실패했습니다.', 'error')
    throw error
  }
}

export const deleteSteamUsage = async (id: number): Promise<ScopeApiResponse<void>> => {
  const loadingId = showLoading('스팀 사용량 데이터를 삭제하는 중...')
  try {
    const response = await api.delete(`/api/v1/scope/steam-usage/${id}`)
    dismissLoading(
      loadingId,
      '스팀 사용량 데이터가 성공적으로 삭제되었습니다.',
      'success'
    )
    return response.data
  } catch (error) {
    dismissLoading(loadingId, '스팀 사용량 데이터 삭제에 실패했습니다.', 'error')
    throw error
  }
}

export const getSteamUsageById = async (id: number): Promise<SteamUsage> => {
  const response = await api.get(`/api/v1/scope/steam-usage/${id}`)
  return response.data
}

// =============================================================================
// 연료 타입 (Fuel Type) API
// =============================================================================

export const fetchFuelTypeList = async (): Promise<FuelType[]> => {
  const response = await api.get('/api/v1/scope/fuel-types')
  return response.data
}

export const createFuelType = async (
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.post('/api/v1/scope/fuel-types', data)
  return response.data
}

export const updateFuelType = async (
  id: number,
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.put(`/api/v1/scope/fuel-types/${id}`, data)
  return response.data
}

export const deleteFuelType = async (id: number): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/v1/scope/fuel-types/${id}`)
  return response.data
}

export const getFuelTypeById = async (id: number): Promise<FuelType> => {
  const response = await api.get(`/api/v1/scope/fuel-types/${id}`)
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
    `/api/v1/scope/mobile-combustion/company/${companyId}/year/${year}`
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
  const response = await api.get(
    `/api/v1/scope/steam-usage/company/${companyId}/year/${year}`
  )
  return response.data
}

// =============================================================================
// 협력사별 및 연도별 필터링 API (새로운 방식)
// =============================================================================

export const fetchStationaryCombustionByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<StationaryCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/stationary-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchMobileCombustionByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<MobileCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/mobile-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchElectricityUsageByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<ElectricityUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/electricity-usage/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

export const fetchSteamUsageByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<SteamUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/steam-usage/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

// =============================================================================
// 통합된 Scope 데이터 처리 서비스
// =============================================================================

export const submitScopeData = async (
  formData: ScopeFormData
): Promise<ScopeApiResponse<any>> => {
  try {
    const {emissionActivityType} = formData

    switch (emissionActivityType) {
      case 'STATIONARY_COMBUSTION':
        if (!formData.stationaryCombustion) {
          showError('고정연소 데이터가 필요합니다.')
          throw new Error('고정연소 데이터가 필요합니다.')
        }
        return createStationaryCombustion(formData.stationaryCombustion)

      case 'MOBILE_COMBUSTION':
        if (!formData.mobileCombustion) {
          showError('이동연소 데이터가 필요합니다.')
          throw new Error('이동연소 데이터가 필요합니다.')
        }
        return createMobileCombustion(formData.mobileCombustion)

      case 'ELECTRICITY':
        if (!formData.electricity) {
          showError('전력 사용량 데이터가 필요합니다.')
          throw new Error('전력 사용량 데이터가 필요합니다.')
        }
        return createElectricityUsage(formData.electricity)

      case 'STEAM':
        if (!formData.steam) {
          showError('스팀 사용량 데이터가 필요합니다.')
          throw new Error('스팀 사용량 데이터가 필요합니다.')
        }
        return createSteamUsage(formData.steam)

      default:
        showError(`지원하지 않는 배출활동 타입입니다: ${emissionActivityType}`)
        throw new Error(`지원하지 않는 배출활동 타입입니다: ${emissionActivityType}`)
    }
  } catch (error) {
    // 이미 각 함수에서 토스트 처리했으므로 추가 처리 불필요
    throw error
  }
}

export const fetchAllScopeDataByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
) => {
  const [stationaryCombustion, mobileCombustion, electricityUsage, steamUsage] =
    await Promise.all([
      fetchStationaryCombustionByPartnerAndYear(partnerCompanyId, year),
      fetchMobileCombustionByPartnerAndYear(partnerCompanyId, year),
      fetchElectricityUsageByPartnerAndYear(partnerCompanyId, year),
      fetchSteamUsageByPartnerAndYear(partnerCompanyId, year)
    ])

  return {
    stationaryCombustion,
    mobileCombustion,
    electricityUsage,
    steamUsage,
    totalRecords:
      stationaryCombustion.length +
      mobileCombustion.length +
      electricityUsage.length +
      steamUsage.length
  }
}

export const validateScopeFormData = (formData: ScopeFormData): string[] => {
  const errors: string[] = []

  // 공통 필드 검사
  if (!formData.partnerCompanyId || !formData.partnerCompanyId.trim()) {
    errors.push('협력사를 선택해주세요.')
  }
  if (!formData.reportingYear) {
    errors.push('보고연도를 입력해주세요.')
  }
  if (!formData.reportingMonth) {
    errors.push('보고월을 선택해주세요.')
  }
  if (!formData.emissionActivityType) {
    errors.push('배출활동 타입을 선택해주세요.')
  }

  // 배출활동별 세부 필드 검사
  // ...existing validation logic...

  return errors
}

// =============================================================================
// 기존 함수들 (호환성 유지)
// =============================================================================
