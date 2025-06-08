// 파트너사 관련 API 서비스
import {PartnerCompany} from '@/types/scope'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'

// 활성 파트너사 목록 조회 (OpenFeign을 통해 company-api에서 데이터 가져오기)
export const fetchActivePartnerCompanies = async (): Promise<PartnerCompany[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/partners/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // TODO: 인증 헤더 추가
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || data // API 응답 구조에 따라 조정
  } catch (error) {
    console.error('파트너사 목록 조회 실패:', error)
    // 임시 더미 데이터 반환 (개발용)
    return [
      {
        id: 1,
        name: '협력사 A',
        businessNumber: '123-45-67890',
        status: 'ACTIVE',
        companyType: '제조업',
        contactEmail: 'contact@partner-a.com',
        contactPhone: '02-1234-5678'
      },
      {
        id: 2,
        name: '협력사 B',
        businessNumber: '234-56-78901',
        status: 'ACTIVE',
        companyType: '서비스업',
        contactEmail: 'contact@partner-b.com',
        contactPhone: '02-2345-6789'
      },
      {
        id: 3,
        name: '협력사 C',
        businessNumber: '345-67-89012',
        status: 'ACTIVE',
        companyType: '물류업',
        contactEmail: 'contact@partner-c.com',
        contactPhone: '02-3456-7890'
      }
    ]
  }
}

// 특정 파트너사 정보 조회
export const fetchPartnerCompanyById = async (
  id: number
): Promise<PartnerCompany | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/partners/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // TODO: 인증 헤더 추가
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('파트너사 정보 조회 실패:', error)
    return null
  }
}

// 파트너사 검색
export const searchPartnerCompanies = async (
  searchTerm: string
): Promise<PartnerCompany[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/partners/search?q=${encodeURIComponent(searchTerm)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // TODO: 인증 헤더 추가
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('파트너사 검색 실패:', error)
    return []
  }
}
