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

/**
 * 모든 연료 타입 목록을 가져옵니다
 * 사용처: ScopeModal 컴포넌트에서 연료 선택 옵션 제공
 * 백엔드 필요: 아니요 (로컬 상수 데이터 사용)
 */
export const fetchFuelTypes = async (): Promise<FuelType[]> => {
  // 로컬 연료 데이터 반환 (필요시 API 호출로 변경 가능)
  return getAllFuels()
}

/**
 * 배출활동 타입별 연료 목록을 가져옵니다
 * 사용처: ScopeModal에서 활동 타입 변경 시 해당하는 연료만 필터링
 * 백엔드 필요: 아니요 (로컬 상수 데이터 사용)
 */
export const fetchFuelsByActivityType = async (
  activityType: EmissionActivityType,
  subType?: string
): Promise<FuelType[]> => {
  return getFuelsByActivityType(activityType, subType)
}

/**
 * 특정 ID의 연료 정보를 가져옵니다
 * 사용처: 배출량 계산 시 연료 정보 조회
 * 백엔드 필요: 아니요 (로컬 상수 데이터 사용)
 */
export const fetchFuelById = async (fuelId: string): Promise<FuelType | null> => {
  const fuel = getFuelById(fuelId)
  return fuel || null
}

// =============================================================================
// 배출량 계산 서비스
// =============================================================================

/**
 * 연료 사용량을 기반으로 CO₂ 배출량을 계산합니다
 * 사용처: ScopeModal에서 '배출량 계산 미리 보기' 버튼 클릭 시
 * 백엔드 필요: 아니요 (프론트엔드에서 계산 처리)
 */
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

/**
 * 모든 고정연소 데이터 목록을 가져옵니다
 * 사용처: 현재 사용 안함 (필요시 백엔드 구현)
 * 백엔드 필요: 예 (전체 목록 조회)
 */
export const fetchStationaryCombustionList = async (): Promise<
  StationaryCombustion[]
> => {
  const response = await api.get('/api/v1/scope/stationary-combustion')
  return response.data
}

/**
 * 새로운 고정연소 데이터를 생성합니다
 * 사용처: ScopeModal에서 고정연소 데이터 저장 시 (submitScopeData 함수에서 호출)
 * 백엔드 필요: 예 (고정연소 데이터 생성 API)
 */
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

/**
 * 고정연소 데이터를 수정합니다
 * 사용처: 현재 사용 안함 (편집 기능 미구현)
 * 백엔드 필요: 예 (향후 편집 기능 구현 시)
 */
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

/**
 * 고정연소 데이터를 삭제합니다
 * 사용처: scope1Form.tsx의 handleDeleteStationary 함수에서 호출
 * 백엔드 필요: 예 (고정연소 데이터 삭제 API)
 */
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

/**
 * 특정 ID의 고정연소 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (상세 조회 기능 미구현)
 * 백엔드 필요: 예 (향후 상세 조회 기능 구현 시)
 */
export const getStationaryCombustionById = async (
  id: number
): Promise<StationaryCombustion> => {
  const response = await api.get(`/api/v1/scope/stationary-combustion/${id}`)
  return response.data
}

// =============================================================================
// Scope 1 - 이동연소 (Mobile Combustion) API
// =============================================================================

/**
 * 모든 이동연소 데이터 목록을 가져옵니다
 * 사용처: 현재 사용 안함 (필요시 백엔드 구현)
 * 백엔드 필요: 예 (전체 목록 조회)
 */
export const fetchMobileCombustionList = async (): Promise<MobileCombustion[]> => {
  const response = await api.get('/api/v1/scope/mobile-combustion')
  return response.data
}

/**
 * 새로운 이동연소 데이터를 생성합니다
 * 사용처: ScopeModal에서 이동연소 데이터 저장 시 (submitScopeData 함수에서 호출)
 * 백엔드 필요: 예 (이동연소 데이터 생성 API)
 */
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

/**
 * 이동연소 데이터를 수정합니다
 * 사용처: 현재 사용 안함 (편집 기능 미구현)
 * 백엔드 필요: 예 (향후 편집 기능 구현 시)
 */
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

/**
 * 이동연소 데이터를 삭제합니다
 * 사용처: scope1Form.tsx의 handleDeleteMobile 함수에서 호출
 * 백엔드 필요: 예 (이동연소 데이터 삭제 API)
 */
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

/**
 * 특정 ID의 이동연소 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (상세 조회 기능 미구현)
 * 백엔드 필요: 예 (향후 상세 조회 기능 구현 시)
 */
export const getMobileCombustionById = async (id: number): Promise<MobileCombustion> => {
  const response = await api.get(`/api/v1/scope/mobile-combustion/${id}`)
  return response.data
}

// =============================================================================
// Scope 2 - 전력 사용량 (Electricity Usage) API
// =============================================================================

/**
 * 모든 전력 사용량 데이터 목록을 가져옵니다
 * 사용처: 현재 사용 안함 (필요시 백엔드 구현)
 * 백엔드 필요: 예 (전체 목록 조회)
 */
export const fetchElectricityUsageList = async (): Promise<ElectricityUsage[]> => {
  const response = await api.get('/api/v1/scope/electricity-usage')
  return response.data
}

/**
 * 새로운 전력 사용량 데이터를 생성합니다
 * 사용처: ScopeModal에서 전력 데이터 저장 시 (submitScopeData 함수에서 호출)
 * 백엔드 필요: 예 (전력 사용량 데이터 생성 API)
 */
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

/**
 * 전력 사용량 데이터를 수정합니다
 * 사용처: 현재 사용 안함 (편집 기능 미구현)
 * 백엔드 필요: 예 (향후 편집 기능 구현 시)
 */
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

/**
 * 전력 사용량 데이터를 삭제합니다
 * 사용처: scope2Form.tsx의 handleDeleteElectricity 함수에서 호출 (현재 TODO 상태)
 * 백엔드 필요: 예 (전력 사용량 데이터 삭제 API)
 */
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

/**
 * 특정 ID의 전력 사용량 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (상세 조회 기능 미구현)
 * 백엔드 필요: 예 (향후 상세 조회 기능 구현 시)
 */
export const getElectricityUsageById = async (id: number): Promise<ElectricityUsage> => {
  const response = await api.get(`/api/v1/scope/electricity-usage/${id}`)
  return response.data
}

// =============================================================================
// Scope 2 - 스팀 사용량 (Steam Usage) API
// =============================================================================

/**
 * 모든 스팀 사용량 데이터 목록을 가져옵니다
 * 사용처: 현재 사용 안함 (필요시 백엔드 구현)
 * 백엔드 필요: 예 (전체 목록 조회)
 */
export const fetchSteamUsageList = async (): Promise<SteamUsage[]> => {
  const response = await api.get('/api/v1/scope/steam-usage')
  return response.data
}

/**
 * 새로운 스팀 사용량 데이터를 생성합니다
 * 사용처: ScopeModal에서 스팀 데이터 저장 시 (submitScopeData 함수에서 호출)
 * 백엔드 필요: 예 (스팀 사용량 데이터 생성 API)
 */
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

/**
 * 스팀 사용량 데이터를 수정합니다
 * 사용처: 현재 사용 안함 (편집 기능 미구현)
 * 백엔드 필요: 예 (향후 편집 기능 구현 시)
 */
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

/**
 * 스팀 사용량 데이터를 삭제합니다
 * 사용처: scope2Form.tsx의 handleDeleteSteam 함수에서 호출 (현재 TODO 상태)
 * 백엔드 필요: 예 (스팀 사용량 데이터 삭제 API)
 */
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

/**
 * 특정 ID의 스팀 사용량 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (상세 조회 기능 미구현)
 * 백엔드 필요: 예 (향후 상세 조회 기능 구현 시)
 */
export const getSteamUsageById = async (id: number): Promise<SteamUsage> => {
  const response = await api.get(`/api/v1/scope/steam-usage/${id}`)
  return response.data
}

// =============================================================================
// 연료 타입 (Fuel Type) API - 필요없음 (로컬 상수 데이터 사용)
// =============================================================================

/**
 * 모든 연료 타입 목록을 가져옵니다
 * 사용처: 현재 사용 안함 (로컬 상수 데이터로 대체)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const fetchFuelTypeList = async (): Promise<FuelType[]> => {
  const response = await api.get('/api/v1/scope/fuel-types')
  return response.data
}

/**
 * 새로운 연료 타입을 생성합니다
 * 사용처: 현재 사용 안함 (로컬 상수 데이터로 대체)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const createFuelType = async (
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.post('/api/v1/scope/fuel-types', data)
  return response.data
}

/**
 * 연료 타입을 수정합니다
 * 사용처: 현재 사용 안함 (로컬 상수 데이터로 대체)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const updateFuelType = async (
  id: number,
  data: Omit<FuelType, 'id'>
): Promise<ScopeApiResponse<FuelType>> => {
  const response = await api.put(`/api/v1/scope/fuel-types/${id}`, data)
  return response.data
}

/**
 * 연료 타입을 삭제합니다
 * 사용처: 현재 사용 안함 (로컬 상수 데이터로 대체)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const deleteFuelType = async (id: number): Promise<ScopeApiResponse<void>> => {
  const response = await api.delete(`/api/v1/scope/fuel-types/${id}`)
  return response.data
}

/**
 * 특정 ID의 연료 타입을 가져옵니다
 * 사용처: 현재 사용 안함 (로컬 상수 데이터로 대체)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const getFuelTypeById = async (id: number): Promise<FuelType> => {
  const response = await api.get(`/api/v1/scope/fuel-types/${id}`)
  return response.data
}

// =============================================================================
// 요약 및 통계 API - 필요없음 (현재 미사용)
// =============================================================================

/**
 * Scope 전체 요약 통계를 가져옵니다
 * 사용처: 현재 사용 안함 (대시보드 미구현)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const fetchScopeSummary = async (
  reportingYear?: number
): Promise<ScopeSummary> => {
  const params = reportingYear ? `?year=${reportingYear}` : ''
  const response = await api.get(`/api/v1/scope/summary${params}`)
  return response.data
}

/**
 * Scope 1 요약 통계를 가져옵니다
 * 사용처: 현재 사용 안함 (대시보드 미구현)
 * 백엔드 필요: 아니요 (필요없음)
 */
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

/**
 * Scope 2 요약 통계를 가져옵니다
 * 사용처: 현재 사용 안함 (대시보드 미구현)
 * 백엔드 필요: 아니요 (필요없음)
 */
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
// 회사별 및 연도별 필터링 API - 필요없음 (협력사별 API로 대체)
// =============================================================================

/**
 * 회사별 고정연소 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (협력사별 API로 대체됨)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const fetchStationaryCombustionByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<StationaryCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/stationary-combustion/company/${companyId}/year/${year}`
  )
  return response.data
}

/**
 * 회사별 이동연소 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (협력사별 API로 대체됨)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const fetchMobileCombustionByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<MobileCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/mobile-combustion/company/${companyId}/year/${year}`
  )
  return response.data
}

/**
 * 회사별 전력 사용량 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (협력사별 API로 대체됨)
 * 백엔드 필요: 아니요 (필요없음)
 */
export const fetchElectricityUsageByCompanyAndYear = async (
  companyId: number,
  year: number
): Promise<ElectricityUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/electricity-usage/company/${companyId}/year/${year}`
  )
  return response.data
}

/**
 * 회사별 스팀 사용량 데이터를 가져옵니다
 * 사용처: 현재 사용 안함 (협력사별 API로 대체됨)
 * 백엔드 필요: 아니요 (필요없음)
 */
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
// 협력사별 및 연도별 필터링 API (실제 사용 중인 핵심 API)
// =============================================================================

/**
 * 협력사별 고정연소 데이터를 연도로 필터링하여 가져옵니다
 * 사용처: scope1Form.tsx의 loadData 함수에서 호출
 * 백엔드 필요: 예 (고정연소 데이터 조회 API - 핵심)
 */
export const fetchStationaryCombustionByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<StationaryCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/stationary-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

/**
 * 협력사별 이동연소 데이터를 연도로 필터링하여 가져옵니다
 * 사용처: scope1Form.tsx의 loadData 함수에서 호출
 * 백엔드 필요: 예 (이동연소 데이터 조회 API - 핵심)
 */
export const fetchMobileCombustionByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<MobileCombustion[]> => {
  const response = await api.get(
    `/api/v1/scope/mobile-combustion/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

/**
 * 협력사별 전력 사용량 데이터를 연도로 필터링하여 가져옵니다
 * 사용처: scope2Form.tsx의 loadData 함수에서 호출
 * 백엔드 필요: 예 (전력 사용량 데이터 조회 API - 핵심)
 */
export const fetchElectricityUsageByPartnerAndYear = async (
  partnerCompanyId: string,
  year: number
): Promise<ElectricityUsage[]> => {
  const response = await api.get(
    `/api/v1/scope/electricity-usage/partner/${partnerCompanyId}/year/${year}`
  )
  return response.data
}

/**
 * 협력사별 스팀 사용량 데이터를 연도로 필터링하여 가져옵니다
 * 사용처: scope2Form.tsx의 loadData 함수에서 호출
 * 백엔드 필요: 예 (스팀 사용량 데이터 조회 API - 핵심)
 */
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

/**
 * 폼 데이터의 활동 타입에 따라 적절한 API를 호출하여 데이터를 저장합니다
 * 사용처: ScopeModal의 handleSubmit 함수에서 호출 (핵심 저장 로직)
 * 백엔드 필요: 예 (위의 create 함수들 필요)
 */
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

/**
 * Scope 폼 데이터의 유효성을 검사합니다
 * 사용처: ScopeModal의 handleSubmit 함수에서 호출
 * 백엔드 필요: 아니요 (프론트엔드 유효성 검사)
 */
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

  return errors
}
