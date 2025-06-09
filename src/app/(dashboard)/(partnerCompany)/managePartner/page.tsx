/**
 * ===================================================================
 * 파트너사 관리 페이지 (Partner Company Management Page)
 * ===================================================================
 *
 * ESG 경영을 위한 파트너사 등록, 조회, 수정, 삭제 기능을 제공합니다.
 * DART 데이터베이스와 연동하여 기업 정보를 자동으로 가져옵니다.
 *
 * 주요 기능:
 * - 파트너사 목록 조회 및 검색 (페이지네이션 지원)
 * - DART API를 통한 기업 정보 검색 및 등록
 * - 파트너사 정보 수정 및 삭제
 * - 실시간 검색 및 필터링
 *
 * @author ESG Project Team
 * @version 1.0
 * @since 2024
 */

'use client'

/**
 * ===================================================================
 * 라이브러리 및 컴포넌트 임포트 (Imports)
 * ===================================================================
 */

// React 핵심 라이브러리
import React, {useState, useEffect, useCallback} from 'react'

import {PageHeader} from '@/components/layout/PageHeader'

// 아이콘 라이브러리
import {
  Building2, // 빌딩 아이콘 (파트너사 표시)
  Plus, // 플러스 아이콘 (추가 버튼)
  Search, // 검색 아이콘
  X, // 닫기 아이콘
  Loader2, // 로딩 스피너
  AlertCircle, // 경고 원형 아이콘
  MoreHorizontal, // 더보기 메뉴 아이콘
  Trash, // 삭제 아이콘
  Edit3, // 편집 아이콘
  Home, // 홈 아이콘 (브레드크럼)
  ChevronRight, // 오른쪽 화살표 (브레드크럼)
  ChevronLeft, // 왼쪽 화살표 (페이지네이션)
  Users, // 사용자 그룹 아이콘
  ArrowLeft
} from 'lucide-react'

// UI 컴포넌트들
import {Badge} from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

// 파트너사 관련 컴포넌트
import {PartnerCompanyModal} from '@/components/partner/PartnerCompanyModal'
import {EditPartnerModal} from '@/components/partner/EditPartnerModal'

// 토스트 유틸리티
import {showError, showWarning, showPartnerRestore, showSuccess} from '@/util/toast'

// API 서비스 함수들
import {
  fetchPartnerCompanies, // 파트너사 목록 조회
  createPartnerCompany, // 파트너사 등록
  deletePartnerCompany, // 파트너사 삭제
  updatePartnerCompany, // 파트너사 정보 수정
  searchCompaniesFromDart, // DART API 기업 검색
  checkCompanyNameDuplicate // 회사명 중복 검사
} from '@/services/partnerCompany'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
// 디바운스 훅

// 타입 정의
import {DartCorpInfo, PartnerCompany} from '@/types/IFRS/partnerCompany'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * ===================================================================
 * 메인 컴포넌트 (Main Component)
 * ===================================================================
 */

/**
 * 파트너사 관리 페이지 메인 컴포넌트
 *
 * ESG 경영을 위한 파트너사 관리 기능을 제공합니다.
 * 주요 기능:
 * - 파트너사 목록 조회 및 검색 (페이지네이션 지원)
 * - DART API를 통한 기업 정보 검색 및 등록
 * - 파트너사 정보 수정 및 삭제
 * - 실시간 검색 및 필터링
 *
 * @returns JSX.Element
 */
export default function ManagePartnerPage() {
  /**
   * ===================================================================
   * 상태 관리 (State Management)
   * ===================================================================
   */

  // 파트너사 데이터 관련 상태
  /** 파트너사 목록 데이터 */
  const [partners, setPartners] = useState<PartnerCompany[]>([])

  // 로딩 상태 관리
  /** 일반적인 로딩 상태 (목록 조회, DART 검색 등) */
  const [isLoading, setIsLoading] = useState(false)
  /** 페이지 초기 로딩 상태 */
  const [isPageLoading, setIsPageLoading] = useState(true)
  /** 폼 제출 중 로딩 상태 (추가/수정/삭제) */
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 검색 및 필터링 상태
  /** 파트너사 목록 검색어 */
  const [searchQuery, setSearchQuery] = useState('')

  // 페이지네이션 상태
  /** 현재 페이지 번호 */
  const [currentPage, setCurrentPage] = useState(1)
  /** 전체 페이지 수 */
  const [totalPages, setTotalPages] = useState(1)
  /** 전체 아이템 수 */
  const [totalItems, setTotalItems] = useState(0)
  /** 페이지당 아이템 수 */
  const [pageSize] = useState(10)

  // 다이얼로그 상태 관리
  /** 파트너사 추가 다이얼로그 열림 상태 */
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  /** 파트너사 수정 다이얼로그 열림 상태 */
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  /** 파트너사 삭제 확인 다이얼로그 열림 상태 */
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  /** 현재 선택된 파트너사 (수정/삭제용) */
  const [selectedPartner, setSelectedPartner] = useState<PartnerCompany | null>(null)

  // 추가/수정 다이얼로그 내부 상태
  /** DART 기업 검색어 */
  const [companySearchQuery, setCompanySearchQuery] = useState('')
  /** DART API 검색 결과 목록 */
  const [dartSearchResults, setDartSearchResults] = useState<DartCorpInfo[]>([])
  /** DART에서 선택된 기업 정보 */
  const [selectedDartCompany, setSelectedDartCompany] = useState<DartCorpInfo | null>(
    null
  )

  // 폼 데이터 상태
  /** 파트너사 등록/수정 폼 데이터 */
  const [formData, setFormData] = useState({
    /** 파트너사 ID (수정 시 사용) */
    id: '',
    /** 회사명 */
    companyName: '',
    /** DART 기업 코드 */
    corpCode: '',
    /** 계약 시작일 */
    contractStartDate: new Date().toISOString().split('T')[0]
  })

  /** 다이얼로그 내 에러 메시지 */
  const [dialogError, setDialogError] = useState<string | null>(null)

  // 중복 검사 관련 상태
  /** 회사명 중복 검사 진행 중 여부 */
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false)
  /** 회사명 중복 검사 결과 */
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<{
    isDuplicate: boolean
    message: string
  } | null>(null)
  /** 마지막으로 중복 검사한 회사명 */
  const [lastCheckedCompanyName, setLastCheckedCompanyName] = useState('')

  /**
   * ===================================================================
   * 디바운스된 값들 (Debounced Values)
   * ===================================================================
   */

  /** 파트너사 목록 검색을 위한 디바운스된 검색어 (500ms 지연) */
  const debouncedMainSearchQuery = useDebounce(searchQuery, 500)
  /** DART 기업 검색을 위한 디바운스된 검색어 (500ms 지연) */
  const debouncedDartSearchQuery = useDebounce(companySearchQuery, 500)
  /** 회사명 중복 검사를 위한 디바운스된 값 (800ms 지연) */
  const debouncedCompanyName = useDebounce(formData.companyName, 800)

  /**
   * ===================================================================
   * API 호출 함수들 (API Functions)
   * ===================================================================
   */

  /**
   * 파트너사 목록을 서버에서 가져오는 함수
   * 페이지네이션과 검색 필터를 지원합니다.
   *
   * @param page - 가져올 페이지 번호 (1부터 시작)
   * @param companyNameFilter - 회사명 필터 (선택적)
   */
  const loadPartners = useCallback(
    async (page: number, companyNameFilter?: string) => {
      setIsLoading(true)
      setIsPageLoading(false) // 실제 로딩 시작 시 페이지 로딩 상태 false
      try {
        const response = await fetchPartnerCompanies(page, pageSize, companyNameFilter)

        // API 응답이 Spring Data Page 형태인지 확인하고 적절히 처리
        const partners = response.content || response.data || []

        // 백엔드 응답의 다양한 필드명 형식을 통일된 형태로 변환
        const transformedData = partners.map(p => ({
          ...p,
          companyName: p.corp_name || p.corpName || p.companyName,
          corpName: p.corp_name || p.corpName,
          corpCode: p.corp_code || p.corpCode,
          stockCode: p.stock_code || p.stockCode,
          contractStartDate: p.contract_start_date || p.contractStartDate,
          modifyDate: p.modify_date || p.modifyDate
        }))

        // 상태 업데이트
        setPartners(transformedData)
        setCurrentPage(response.number ? response.number + 1 : response.page || page)
        setTotalPages(
          response.totalPages ||
            Math.ceil(
              (response.totalElements || response.total || 0) /
                (response.size || response.pageSize || pageSize)
            )
        )
        setTotalItems(response.totalElements || response.total || 0)
      } catch (error) {
        console.error('Failed to load partner companies:', error)
        showError('파트너사 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    },
    [pageSize]
  )

  // 페이지 첫 로드 시 파트너사 목록 조회
  useEffect(() => {
    setIsPageLoading(true)
    loadPartners(1).finally(() => setIsPageLoading(false))
  }, [loadPartners])

  // 메인 검색어 변경 시 파트너사 목록 재조회
  useEffect(() => {
    // isPageLoading이 true일때는 초기 로딩이므로, 검색어 변경으로 인한 재조회를 막습니다.
    if (!isPageLoading) {
      loadPartners(1, debouncedMainSearchQuery || undefined)
    }
  }, [debouncedMainSearchQuery, loadPartners, isPageLoading])

  // DART 기업 검색 (HEAD + origin/develop 통합)
  const searchDartCompanies = useCallback(async () => {
    if (!debouncedDartSearchQuery) {
      setDartSearchResults([])
      setDialogError(null)
      return
    }

    setIsLoading(true) // DART 검색 중 로딩 상태
    setDialogError(null)
    setDartSearchResults([])
    try {
      const response = await searchCompaniesFromDart({
        page: 1, // origin/develop 에서는 페이지 없었으나, API 스펙에 따라 추가/조정 가능
        pageSize: 5, // origin/develop 에서는 10, HEAD 에서는 5. 일단 5로 통일
        listedOnly: true, // HEAD 기준
        corpNameFilter: debouncedDartSearchQuery
      })

      setDartSearchResults(response.content || response.data || []) // API 응답이 content 또는 data 배열을 포함한다고 가정
      if ((response.content || response.data || []).length === 0) {
        setDialogError(`'${debouncedDartSearchQuery}'에 대한 검색 결과가 없습니다.`)
      }
    } catch (error) {
      console.error('Failed to search companies from DART:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'DART 기업 검색 중 오류가 발생했습니다.'
      setDialogError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedDartSearchQuery])

  // DART 검색어 변경 시 또는 다이얼로그 열릴 때 DART 검색 (isAddDialogOpen || isEditDialogOpen)
  useEffect(() => {
    if (debouncedDartSearchQuery && (isAddDialogOpen || isEditDialogOpen)) {
      searchDartCompanies()
    }
  }, [debouncedDartSearchQuery, isAddDialogOpen, isEditDialogOpen, searchDartCompanies])

  /**
   * 회사명 중복 검사 함수
   * 디바운스된 회사명으로 실시간 중복 검사를 수행합니다.
   */
  const checkCompanyNameDuplicateInline = useCallback(
    async (companyName: string) => {
      if (!companyName || companyName.trim().length < 2) {
        setDuplicateCheckResult(null)
        setLastCheckedCompanyName('')
        return
      }

      // 이미 검사한 회사명인 경우 스킵
      if (companyName === lastCheckedCompanyName) {
        return
      }

      // 수정 모드에서 기존 회사명과 동일한 경우 스킵
      if (
        isEditDialogOpen &&
        selectedPartner &&
        companyName === selectedPartner.companyName
      ) {
        setDuplicateCheckResult(null)
        setLastCheckedCompanyName(companyName)
        return
      }

      setIsDuplicateChecking(true)
      try {
        const result = await checkCompanyNameDuplicate(companyName.trim())

        if (result.isDuplicate) {
          // 중복된 회사명일 때 토스트 메시지 표시
          showError('이미 추가된 파트너사입니다')
        }

        setDuplicateCheckResult({
          isDuplicate: result.isDuplicate,
          message: result.isDuplicate
            ? '이미 등록된 회사명입니다.'
            : '사용 가능한 회사명입니다.'
        })
        setLastCheckedCompanyName(companyName)
      } catch (error) {
        console.error('중복 검사 실패:', error)
        setDuplicateCheckResult({
          isDuplicate: false,
          message: '중복 검사에 실패했습니다. 다시 시도해주세요.'
        })
        showWarning('중복 검사에 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsDuplicateChecking(false)
      }
    },
    [lastCheckedCompanyName, isEditDialogOpen, selectedPartner]
  )

  // 디바운스된 회사명으로 실시간 중복 검사 실행
  useEffect(() => {
    if ((isAddDialogOpen || isEditDialogOpen) && debouncedCompanyName) {
      checkCompanyNameDuplicateInline(debouncedCompanyName)
    } else {
      setDuplicateCheckResult(null)
      setLastCheckedCompanyName('')
    }
  }, [
    debouncedCompanyName,
    isAddDialogOpen,
    isEditDialogOpen,
    checkCompanyNameDuplicateInline
  ])

  // DART 검색 결과에서 회사 선택 시 (HEAD + origin/develop)
  const handleSelectDartCompany = useCallback((company: DartCorpInfo) => {
    setSelectedDartCompany(company)
    setFormData(prev => ({
      ...prev,
      companyName: company.corpName || company.corp_name || '',
      corpCode: company.corpCode || company.corp_code || '',
      contractStartDate: new Date().toISOString().split('T')[0]
    }))
    // 선택한 회사명을 검색 필드에 유지
    setCompanySearchQuery(company.corpName || company.corp_name || '')
    // 검색 결과는 유지하되, 에러는 제거
    setDialogError(null)
  }, [])

  // 모달 상태 초기화 (HEAD + origin/develop)
  const resetModalStateAndClose = useCallback(() => {
    setFormData({
      id: '',
      companyName: '',
      corpCode: '',
      contractStartDate: new Date().toISOString().split('T')[0]
    })
    setCompanySearchQuery('')
    setDartSearchResults([])
    setSelectedDartCompany(null)
    setDialogError(null)
    setIsSubmitting(false)
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)

    // 중복 검사 상태 초기화
    setDuplicateCheckResult(null)
    setIsDuplicateChecking(false)
    setLastCheckedCompanyName('')
  }, [])

  // 파트너사 추가/수정 핸들러 (HEAD + origin/develop 통합)
  const handleSubmitPartner = useCallback(async () => {
    // 기본 유효성 검사
    if (!formData.companyName || !formData.corpCode || !formData.contractStartDate) {
      setDialogError('회사명, DART코드, 계약 시작일은 필수입니다.')
      showError('회사명, DART코드, 계약 시작일은 필수입니다.')
      return
    }

    // 중복 검사 결과 확인 (추가 모드일 때만)
    if (!isEditDialogOpen && duplicateCheckResult?.isDuplicate) {
      setDialogError('이미 등록된 회사명입니다. 다른 회사명을 입력해주세요.')
      showError('이미 추가된 파트너사입니다')
      return
    }

    // 수정 모드에서 회사명이 변경되었을 때 중복 검사
    if (
      isEditDialogOpen &&
      selectedPartner &&
      formData.companyName !== selectedPartner.companyName &&
      duplicateCheckResult?.isDuplicate
    ) {
      setDialogError('이미 등록된 회사명입니다. 다른 회사명을 입력해주세요.')
      showError('이미 추가된 파트너사입니다')
      return
    }

    setIsSubmitting(true)
    setDialogError(null)

    console.log('=== 파트너사 저장 시작 ===')
    console.log('모드:', isEditDialogOpen ? '수정' : '추가')
    console.log('formData:', formData)
    console.log('selectedDartCompany:', selectedDartCompany)
    console.log('selectedPartner:', selectedPartner)

    try {
      // 선택된 DART 회사에서 주식코드 가져오기
      const stockCode = selectedDartCompany?.stockCode || selectedDartCompany?.stock_code
      console.log('stockCode:', stockCode)

      if (isEditDialogOpen && selectedPartner?.id) {
        // 수정 모드
        const updatedPartner = await updatePartnerCompany(selectedPartner.id, {
          companyName: formData.companyName,
          corpName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate,
          stockCode: stockCode // 주식코드 추가
        })

        // 복원 여부 확인 후 적절한 토스트 표시
        if (updatedPartner?.isRestored) {
          showPartnerRestore(updatedPartner.companyName)
        } else {
          showSuccess('파트너사가 수정되었습니다.')
        }
      } else {
        // 추가 모드
        console.log('=== 파트너사 추가 API 호출 ===')
        const createData = {
          companyName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate,
          stockCode: stockCode // 주식코드 추가
        }
        console.log('createData:', createData)

        const newPartner = await createPartnerCompany(createData)
        console.log('생성된 파트너사:', newPartner)

        // 복원 여부 확인 후 적절한 토스트 표시
        if (newPartner?.isRestored) {
          // 복구된 경우: "기존 회사를 복구했습니다"
          showPartnerRestore(newPartner.companyName)
        } else {
          // 새로 생성된 경우 또는 이미 존재하는 경우: "파트너사가 추가되었습니다"
          showSuccess('파트너사가 추가되었습니다.')
        }
      }
      resetModalStateAndClose()
      await loadPartners(
        isEditDialogOpen ? currentPage : 1,
        debouncedMainSearchQuery || undefined
      )
    } catch (error: unknown) {
      console.error('Failed to save partner company:', error)
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'

      // 409 Conflict 에러 (중복 파트너사)인 경우 특별한 처리
      if (
        errorMessage.includes('이미 등록된') ||
        errorMessage.includes('이미 등록되어 있습니다')
      ) {
        showError('이미 등록된 파트너사입니다')
      } else {
        showError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    currentPage,
    debouncedMainSearchQuery,
    loadPartners,
    resetModalStateAndClose,
    isEditDialogOpen,
    selectedPartner
  ])

  // 파트너사 삭제 핸들러 (HEAD 기준)
  const handleDeletePartner = useCallback(async () => {
    if (!selectedPartner?.id) return

    setIsSubmitting(true) // 삭제 작업도 submitting 상태 사용
    try {
      await deletePartnerCompany(selectedPartner.id)

      showSuccess('파트너사가 삭제되었습니다.')

      setIsDeleteDialogOpen(false)
      setSelectedPartner(null) // 선택 해제
      // 현재 페이지의 아이템이 모두 삭제되었을 경우, 이전 페이지로 이동하거나 1페이지로 이동
      let pageToLoad = currentPage
      if (partners.length === 1 && currentPage > 1) {
        pageToLoad = currentPage - 1
      }
      await loadPartners(pageToLoad, debouncedMainSearchQuery || undefined)
    } catch (error) {
      console.error('Failed to delete partner company:', error)
      showError('파트너사 삭제에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [
    selectedPartner,
    currentPage,
    partners.length,
    debouncedMainSearchQuery,
    loadPartners
  ])

  // 페이지 이동 핸들러 (HEAD 기준)
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      loadPartners(page, debouncedMainSearchQuery || undefined)
    },
    [totalPages, currentPage, debouncedMainSearchQuery, loadPartners]
  )

  // 수정 다이얼로그 열기 핸들러
  const openEditDialog = (partner: PartnerCompany) => {
    setSelectedPartner(partner)

    setFormData({
      id: partner.id || '',
      companyName: partner.corpName || partner.companyName,
      corpCode: partner.corpCode || partner.corp_code || '',
      contractStartDate:
        partner.contract_start_date || partner.contractStartDate
          ? (partner.contract_start_date || partner.contractStartDate)
              ?.toString()
              .split('T')[0] || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
    })
    setCompanySearchQuery(partner.corpName || partner.companyName)
    setSelectedDartCompany({
      // 선택된 DART 회사 정보도 설정 (수정 시 DART 재검색 불필요하게 안 하도록)
      corpCode: partner.corpCode || partner.corp_code || '',
      corpName: partner.corpName || partner.companyName,
      stockCode: partner.stockCode || partner.stock_code,
      modifyDate: partner.modifyDate || partner.modify_date || '',
      // 백엔드 호환성
      corp_code: partner.corpCode || partner.corp_code || '',
      corp_name: partner.corpName || partner.companyName,
      stock_code: partner.stockCode || partner.stock_code,
      modify_date: partner.modifyDate || partner.modify_date || ''
    })

    // 중복 검사 상태 초기화 (수정 모드에서는 기존 회사명으로 시작하므로 중복 검사 결과 초기화)
    setDuplicateCheckResult(null)
    setIsDuplicateChecking(false)
    setLastCheckedCompanyName('')

    setIsEditDialogOpen(true)
  }

  // 추가 다이얼로그 열기 핸들러
  const openAddDialog = () => {
    resetModalStateAndClose() // 이전 상태 초기화
    setIsAddDialogOpen(true)
  }

  // 로딩 UI
  if (isPageLoading && partners.length === 0) {
    // 초기 전체 페이지 로딩
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-customG" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-4 pt-24">
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink href="/home">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/managePartner">파트너사 관리</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* PageHeader + ArrowLeft */}
      <div className="flex flex-row w-full h-full">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<Building2 className="w-8 h-8 text-customG" />}
            title="파트너사 관리"
            description="파트너사를 등록, 조회, 수정 및 삭제합니다."
            module="CSDD"
          />
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* 검색 및 필터 섹션 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* 검색 영역 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 min-w-0 sm:w-96">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex items-center gap-3">
            <Button
              onClick={openAddDialog}
              className="h-12 px-6 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 rounded-xl hover:shadow-xl hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />새 파트너사 추가
            </Button>
          </div>
        </div>

        {/* 파트너사 추가 모달 */}
        <PartnerCompanyModal
          isOpen={isAddDialogOpen}
          onClose={resetModalStateAndClose}
          onSubmit={handleSubmitPartner}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          companySearchQuery={companySearchQuery}
          onCompanySearchQueryChange={setCompanySearchQuery}
          dartSearchResults={dartSearchResults}
          selectedDartCompany={selectedDartCompany}
          onSelectDartCompany={handleSelectDartCompany}
          dialogError={dialogError}
        />

        {/* 파트너사 수정 모달 */}
        <EditPartnerModal
          isOpen={isEditDialogOpen}
          onClose={resetModalStateAndClose}
          onSubmit={handleSubmitPartner}
          isSubmitting={isSubmitting}
          formData={formData}
          onFormDataChange={data => setFormData(prev => ({...prev, ...data}))}
        />

        {isLoading && partners.length === 0 && !isPageLoading ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-customG" />
              <p className="text-lg font-medium text-slate-700">
                파트너사 목록을 불러오는 중...
              </p>
              <p className="mt-1 text-sm text-slate-500">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : partners.length === 0 && !searchQuery ? (
          <div className="bg-white border-2 shadow-sm border-slate-200 rounded-2xl">
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                아직 등록된 파트너사가 없습니다
              </h3>
              <p className="max-w-md mx-auto mb-8 text-base text-slate-500">
                ESG 경영을 함께할 파트너사를 등록해보세요. DART 데이터베이스와 연동하여
                손쉽게 관리할 수 있습니다.
              </p>
              <Button
                onClick={openAddDialog}
                className="h-12 px-8 font-semibold text-white transition-all duration-200 transform shadow-sm bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 rounded-xl hover:shadow-sm hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />첫 번째 파트너사 등록하기
              </Button>
            </div>
          </div>
        ) : partners.length === 0 && searchQuery ? (
          <div className="bg-white border-2 shadow-sm border-slate-200 rounded-2xl">
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                검색 결과가 없습니다
              </h3>
              <p className="mb-2 text-base text-slate-500">
                '<span className="font-semibold text-slate-700">{searchQuery}</span>'와
                일치하는 파트너사를 찾을 수 없습니다.
              </p>
              <p className="text-sm text-slate-400">
                다른 검색어로 시도해보시거나, 새로운 파트너사를 등록해보세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border-2 shadow-sm border-slate-200 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 border-slate-200">
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    회사명
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    DART 코드
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    상장 정보
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    계약 시작일
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold text-center h-14 text-slate-800">
                    관리
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner, index) => (
                  <TableRow
                    key={partner.id || `partner-${index}`}
                    className="transition-all duration-200 border-b hover:bg-slate-50/80 border-slate-100 last:border-b-0">
                    <TableCell className="h-16 px-6 text-base font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-customG"></div>
                        {partner.corpName || partner.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="h-16 px-6">
                      <code className="px-3 py-1 font-mono text-sm font-medium rounded-lg bg-slate-100 text-slate-700">
                        {partner.corpCode || partner.corp_code}
                      </code>
                    </TableCell>
                    <TableCell className="h-16 px-6">
                      {(() => {
                        const stockCode = partner.stockCode || partner.stock_code

                        // 개선된 주식코드 검증 로직
                        const isValidStockCode = (() => {
                          // null, undefined 체크
                          if (!stockCode) return false

                          // 문자열로 변환하여 처리
                          const codeStr = String(stockCode).trim()

                          // 빈 문자열 또는 공백만 있는 경우
                          if (codeStr === '') return false

                          // 무효한 값들 체크
                          const invalidValues = ['n/a', 'null', 'undefined', '000000']
                          if (invalidValues.includes(codeStr.toLowerCase())) return false

                          // 모든 자리가 0인 경우 (000000 외에 다른 길이도 체크)
                          if (/^0+$/.test(codeStr)) return false

                          // 유효한 주식코드로 판단 (숫자 6자리)
                          return /^\d{6}$/.test(codeStr)
                        })()

                        if (isValidStockCode) {
                          return (
                            <Badge
                              variant="outline"
                              className="px-3 py-1 font-semibold border-2 rounded-lg text-emerald-700 bg-emerald-50 border-emerald-200">
                              <div className="w-2 h-2 mr-2 rounded-full bg-emerald-500"></div>
                              {String(stockCode).trim()}
                            </Badge>
                          )
                        } else {
                          return (
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 font-semibold border-2 rounded-lg text-slate-600 bg-slate-100 border-slate-200">
                              <div className="w-2 h-2 mr-2 rounded-full bg-slate-400"></div>
                              비상장
                            </Badge>
                          )
                        }
                      })()}
                    </TableCell>
                    <TableCell className="h-16 px-6 font-medium text-slate-600">
                      {partner.contract_start_date || partner.contractStartDate
                        ? new Date(
                            (partner.contract_start_date || partner.contractStartDate)!
                          ).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="h-16 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 transition-colors rounded-lg hover:bg-slate-100">
                            <MoreHorizontal className="w-5 h-5 text-slate-600" />
                            <span className="sr-only">메뉴 열기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-2 bg-white border-2 shadow-xl border-slate-200 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(partner)}
                            className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-slate-50">
                            <Edit3 className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-700">정보 수정</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPartner(partner)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg cursor-pointer hover:bg-red-50 focus:text-red-600 focus:bg-red-50">
                            <Trash className="w-4 h-4" />
                            <span className="font-medium">파트너사 삭제</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && partners.length > 0 && (
          <div className="flex items-center justify-center gap-3 pt-8 mt-8 border-t-2 border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 px-4 font-medium transition-all duration-200 border-2 rounded-lg border-slate-200 hover:border-customG hover:bg-customG/5">
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({length: totalPages}, (_, i) => i + 1)
                .filter(
                  page =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={`page-${page}`}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-slate-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-customG text-white border-customG shadow-sm hover:bg-customGDark'
                          : 'border-2 border-slate-200 hover:border-customG hover:bg-customG/5'
                      }`}>
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 px-4 font-medium transition-all duration-200 border-2 rounded-lg border-slate-200 hover:border-customG hover:bg-customG/5">
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              파트너사 삭제 확인
            </AlertDialogTitle>
            <AlertDialogDescription>
              정말로{' '}
              <span className="font-semibold text-slate-800">
                {selectedPartner?.corpName || selectedPartner?.companyName}
              </span>{' '}
              파트너사를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 관련 데이터가
              영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setSelectedPartner(null)}
              disabled={isSubmitting}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
