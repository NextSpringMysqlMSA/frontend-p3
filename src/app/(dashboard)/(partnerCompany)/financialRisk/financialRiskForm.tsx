/**
 * 재무 위험 분석 폼 컴포넌트
 * 파트너사의 재무 건전성과 위험을 실시간으로 분석하는 페이지
 *
 * 주요 기능:
 * - 파트너사 선택 및 재무 위험 데이터 조회
 * - 위험 항목별 상세 분석 정보 표시
 * - 확장/축소 가능한 위험 항목 목록
 * - 실시간 위험 상태 모니터링
 */
'use client'

import React, {useState, useEffect} from 'react'
import {
  ChevronRight,
  Home,
  Building2,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronsDown,
  ChevronsUp,
  FileSearch,
  Check,
  ChevronsUpDown,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {PageHeader} from '@/components/layout/PageHeader'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'
import {useToast} from '@/hooks/use-toast'
import {LoadingState} from '@/components/ui/loading-state'
import {
  fetchFinancialRiskAssessment,
  fetchPartnerCompanies
} from '@/services/partnerCompany'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import {FinancialRiskAssessment} from '@/types/IFRS/partnerCompany'
import {DirectionButton} from '@/components/layout/direction'
/**
 * 개별 위험 항목 데이터 구조
 * @interface RiskItem
 */
interface RiskItem {
  /** 위험 항목 설명 */
  description: string
  /** 실제 측정값 */
  actualValue: string
  /** 위험 기준값 */
  threshold: string
  /** 추가 설명 또는 분석 정보 */
  notes: string | null
  /** 항목 번호 (고유 식별자) */
  itemNumber: number
  /** 위험 상태 여부 (true: 위험, false: 안전) */
  atRisk: boolean
}

/**
 * 재무 위험 분석 전체 데이터 구조
 * @interface FinancialRiskData
 */
interface FinancialRiskData {
  /** 파트너사 고유 ID */
  partnerCompanyId: string
  /** 파트너사 회사명 */
  partnerCompanyName: string
  /** 분석 기준 연도 */
  assessmentYear: string
  /** DART 보고서 코드 */
  reportCode: string
  /** 위험 항목 배열 */
  riskItems: RiskItem[]
}

/**
 * ===================================================================
 * 유틸리티 함수 (Utility Functions)
 * ===================================================================
 */

/**
 * 위험 항목 개수에 따른 전체 위험 상태를 결정하는 함수
 * @param atRiskCount - 위험 상태인 항목의 개수
 * @returns 상태 라벨, 색상, 아이콘 정보
 */
function getStatusLabel(atRiskCount: number) {
  if (atRiskCount === 0) {
    return {
      label: '안전',
      color: 'text-emerald-600',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
    }
  }
  if (atRiskCount <= 2) {
    return {
      label: '주의',
      color: 'text-amber-600',
      icon: <Info className="w-5 h-5 text-amber-500" />
    }
  }
  return {
    label: '위험',
    color: 'text-red-600',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />
  }
}

/**
 * ===================================================================
 * 하위 컴포넌트 (Sub Components)
 * ===================================================================
 */

/**
 * 파트너사 선택을 위한 콤보박스 컴포넌트의 props 타입
 * @interface PartnerComboboxProps
 */
interface PartnerComboboxProps {
  /** 선택 가능한 파트너사 옵션 배열 */
  options: Array<{name: string; code: string}>
  /** 현재 선택된 파트너사의 DART 코드 */
  value: string | null
  /** 파트너사 선택 시 실행되는 콜백 함수 */
  onChange: (code: string) => void
}

/**
 * 파트너사 선택 콤보박스 컴포넌트
 * 드롭다운 형태로 파트너사 목록을 표시하고 선택할 수 있게 해주는 컴포넌트
 *
 * @param options - 선택 가능한 파트너사 목록
 * @param value - 현재 선택된 파트너사 코드
 * @param onChange - 선택 변경 시 호출되는 함수
 */
function PartnerCombobox({options, value, onChange}: PartnerComboboxProps) {
  // 드롭다운 열림/닫힘 상태
  const [open, setOpen] = useState(false)

  // 현재 선택된 옵션 찾기
  const selectedOption = options.find(option => option.code === value)

  // 디버깅용 로그 출력
  console.log('PartnerCombobox 렌더링:', {
    optionsLength: options.length,
    options: options,
    selectedValue: value,
    selectedOption: selectedOption
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full font-medium transition-all duration-200 border-2 h-11 bg-slate-50 border-slate-200 hover:border-customG hover:bg-white rounded-xl">
          {selectedOption ? (
            <span className="text-slate-800">{selectedOption.name}</span>
          ) : (
            <span className="text-slate-400">협력사를 선택해주세요...</span>
          )}
          <ChevronsUpDown className="w-4 h-4 ml-2 text-slate-400 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-white border-2 shadow-xl border-slate-200 rounded-xl"
        style={{minWidth: 'var(--radix-popover-trigger-width)'}}>
        <Command className="rounded-xl">
          <CommandInput
            placeholder="협력사 검색..."
            className="h-12 border-0 border-b border-slate-100 rounded-t-xl"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-8 text-center text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              해당하는 협력사가 없습니다.
            </CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.code}
                  value={option.name}
                  onSelect={() => {
                    onChange(option.code)
                    setOpen(false)
                  }}
                  className="flex items-center px-4 py-3 mx-2 my-1 transition-colors rounded-lg cursor-pointer hover:bg-customG/5">
                  <Check
                    className={cn(
                      'mr-3 h-4 w-4 text-customG',
                      value === option.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{option.name}</span>
                    <span className="font-mono text-xs text-slate-500">
                      코드: {option.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

/**
 * ===================================================================
 * 메인 컴포넌트 (Main Component)
 * ===================================================================
 */

/**
 * 재무 위험 분석 폼 메인 컴포넌트
 *
 * 파트너사의 재무 위험도를 분석하고 시각화하는 컴포넌트입니다.
 * 주요 기능:
 * - 파트너사 선택 및 검색
 * - 재무 위험 데이터 조회 및 표시
 * - 위험 항목별 상세 정보 확인
 * - 전체/개별 항목 확장/축소 기능
 *
 * @returns JSX.Element
 */
export default function FinancialRiskForm() {
  const {toast} = useToast()

  /**
   * ===================================================================
   * 상태 관리 (State Management)
   * ===================================================================
   */

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false)

  /** 에러 메시지 */
  const [error, setError] = useState<string | null>(null)

  /** 파트너사 옵션 목록 */
  const [partnerOptions, setPartnerOptions] = useState<
    Array<{name: string; code: string}>
  >([])

  /** 선택된 파트너사의 DART 코드 */
  const [selectedPartnerCode, setSelectedPartnerCode] = useState<string | null>(null)

  /** 선택된 파트너사의 회사명 */
  const [selectedPartnerName, setSelectedPartnerName] = useState<string | null>(null)

  /** 재무 위험 분석 데이터 */
  const [riskData, setRiskData] = useState<FinancialRiskAssessment | null>(null)

  /** 확장된 위험 항목들의 번호 Set */
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  /**
   * ===================================================================
   * 이벤트 핸들러 함수들 (Event Handlers)
   * ===================================================================
   */

  /**
   * 개별 위험 항목의 확장/축소 상태를 토글하는 함수
   * @param itemNumber - 토글할 항목의 번호
   */
  const toggleExpand = (itemNumber: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemNumber)) {
        newSet.delete(itemNumber)
      } else {
        newSet.add(itemNumber)
      }
      return newSet
    })
  }

  /**
   * 모든 위험 항목을 일괄 확장/축소하는 함수
   * @param expand - true: 모두 확장, false: 모두 축소
   */
  const toggleAllExpanded = (expand: boolean) => {
    if (riskData?.riskItems) {
      if (expand) {
        const allNumbers = new Set(riskData.riskItems.map(item => item.itemNumber))
        setExpandedItems(allNumbers)
      } else {
        setExpandedItems(new Set())
      }
    }
  }

  /**
   * ===================================================================
   * API 호출 함수들 (API Functions)
   * ===================================================================
   */

  /**
   * 파트너사 목록을 서버에서 가져오는 함수
   * 페이지네이션된 응답을 처리하고 콤보박스 옵션 형태로 변환
   */
  const loadPartnerOptions = async () => {
    try {
      setIsLoading(true)

      // 실제 파트너사 목록을 가져옵니다 (페이지네이션 포함)
      // 모든 파트너사를 가져오기 위해 큰 페이지 사이즈 사용
      const response = await fetchPartnerCompanies(1, 100)
      console.log('파트너사 목록 응답:', response)

      // 페이지네이션 응답 구조 처리
      let partnerData: any[] = []

      // response.data가 있는 경우 (기존 구조)
      if (response && response.data && Array.isArray(response.data)) {
        partnerData = response.data
      }
      // response.content가 있는 경우 (페이지네이션 구조)
      else if (
        response &&
        (response as any).content &&
        Array.isArray((response as any).content)
      ) {
        partnerData = (response as any).content
      }
      // response 자체가 배열인 경우
      else if (Array.isArray(response)) {
        partnerData = response
      }

      if (partnerData.length > 0) {
        // 파트너사 데이터를 옵션 형식으로 변환
        const options = partnerData.map((partner: any) => ({
          name: partner.corpName || partner.companyName, // 회사명 (여러 필드명 대응)
          code: partner.corpCode || partner.corp_code // DART 기업 코드 (여러 필드명 대응)
        }))

        console.log('변환된 파트너사 옵션:', options)
        console.log(
          '삼성전자 존재 여부:',
          options.find(opt => opt.name.includes('삼성'))
        )
        setPartnerOptions(options)
      } else {
        console.warn('파트너사 데이터가 없습니다. 응답 구조:', response)
        setPartnerOptions([])
      }
    } catch (err) {
      console.error('Failed to load partner options:', err)
      setError('파트너사 목록을 불러오는데 실패했습니다.')
      toast({
        variant: 'destructive',
        title: '오류',
        description: '파트너사 목록을 불러오는데 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 파트너사 선택 시 실행되는 핸들러 함수
   * 선택된 파트너사의 재무 위험 분석 데이터를 가져옴
   *
   * @param code - 선택된 파트너사의 DART 코드
   */
  const handlePartnerSelect = async (code: string) => {
    setSelectedPartnerCode(code)

    // 선택된 파트너사의 이름 찾기
    const selectedOption = partnerOptions.find(opt => opt.code === code)
    if (selectedOption) {
      setSelectedPartnerName(selectedOption.name)
    }

    try {
      setIsLoading(true)
      setError(null)
      setRiskData(null)

      // 재무 위험 분석 데이터 가져오기 - corpCode와 회사명 사용
      console.log('재무 위험 분석 요청:', {
        corpCode: code,
        companyName: selectedOption?.name
      })
      const data = await fetchFinancialRiskAssessment(code, selectedOption?.name)
      setRiskData(data)

      // 항목 확장 상태 초기화
      setExpandedItems(new Set())
    } catch (err) {
      console.error('Failed to load financial risk data:', err)
      setError('재무 위험 데이터를 불러오는데 실패했습니다.')
      toast({
        variant: 'destructive',
        title: '오류',
        description: '재무 위험 데이터를 불러오는데 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * ===================================================================
   * 생명주기 및 부수 효과 (Lifecycle & Side Effects)
   * ===================================================================
   */

  // 컴포넌트 마운트 시 파트너사 목록 로드
  useEffect(() => {
    loadPartnerOptions()
  }, [])

  /**
   * ===================================================================
   * 계산된 값들 (Computed Values)
   * ===================================================================
   */

  // 위험 항목 수 계산
  const atRiskCount = riskData?.riskItems?.filter(item => item.atRisk).length || 0

  // 전체 위험 상태 정보
  const statusInfo = getStatusLabel(atRiskCount)

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
              <BreadcrumbLink href="/financialRisk">협력사 재무 위험 분석</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row w-full h-full mb-6">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<Building2 className="w-8 h-8" />}
            title="협력사 재무 위험 분석"
            description="사의 재무 건전성과 위험을 분석합니다."
            module="CSDD"
          />
        </Link>
      </div>

      {/* 
        ===============================================================
        파트너사 선택 패널 (Partner Selection Panel)
        =============================================================== 
      */}
      <div className="relative p-8 mt-2 overflow-hidden border shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl border-slate-200/50">
        {/* 장식용 배경 요소들 */}
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-tr from-emerald-100/50 to-teal-100/50"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* 파트너사 선택 영역 */}
            <div className="flex-1 max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-lg font-bold text-slate-800">
                    분석할 파트너사 선택
                  </label>
                  <p className="text-sm text-slate-500">
                    재무 위험도를 분석할 협력사를 선택해주세요
                  </p>
                </div>
              </div>
              <PartnerCombobox
                options={partnerOptions}
                value={selectedPartnerCode}
                onChange={handlePartnerSelect}
              />
            </div>

            {/* 데이터 새로고침 버튼 */}
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true)
                loadPartnerOptions().finally(() => setIsLoading(false))
              }}
              disabled={isLoading}
              className="h-12 px-8 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/5 hover:shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
              <RefreshCcw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>데이터 새로고침</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 
        ===============================================================
        로딩 상태 및 메인 콘텐츠 (Loading State & Main Content)
        =============================================================== 
      */}
      <LoadingState isLoading={isLoading} error={error} isEmpty={!riskData}>
        {riskData && (
          <div className="mt-12 space-y-10">
            {/* 
              ==========================================================
              상태 카드들 (Status Cards)
              ========================================================== 
            */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* 파트너사 정보 카드 */}
              <Card className="relative overflow-hidden transition-all duration-300 border-2 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-3xl hover:shadow-2xl group">
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    파트너사 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div className="mb-3 text-2xl font-bold transition-colors text-slate-800 group-hover:text-blue-700">
                    {riskData.partnerCompanyName}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="px-4 py-2 font-mono text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      ID: {riskData.partnerCompanyId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 분석 기준 정보 카드 */}
              <Card className="relative overflow-hidden transition-all duration-300 border-2 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-3xl hover:shadow-2xl group">
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-4 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                      <FileSearch className="w-4 h-4 text-white" />
                    </div>
                    분석 기준
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div className="mb-3 text-2xl font-bold transition-colors text-slate-800 group-hover:text-emerald-700">
                    {riskData.assessmentYear}년도
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="px-4 py-2 font-mono text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      보고서: {riskData.reportCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 위험 상태 카드 */}
              <Card
                className={`bg-white/90 backdrop-blur-sm border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative ${
                  atRiskCount === 0
                    ? 'border-emerald-200/50'
                    : atRiskCount <= 2
                    ? 'border-amber-200/50'
                    : 'border-red-200/50'
                }`}>
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    atRiskCount === 0
                      ? 'bg-gradient-to-br from-emerald-50/80 to-green-50/80'
                      : atRiskCount <= 2
                      ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80'
                      : 'bg-gradient-to-br from-red-50/80 to-pink-50/80'
                  }`}></div>
                <CardHeader
                  className={`pb-4 rounded-t-3xl relative z-10 ${
                    atRiskCount === 0
                      ? 'bg-gradient-to-br from-emerald-50 to-green-100'
                      : atRiskCount <= 2
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-100'
                      : 'bg-gradient-to-br from-red-50 to-pink-100'
                  }`}>
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                        atRiskCount === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                          : atRiskCount <= 2
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}>
                      {React.cloneElement(statusInfo.icon, {
                        className: 'w-4 h-4 text-white'
                      })}
                    </div>
                    재무 위험 상태
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div
                    className={`text-2xl font-bold mb-3 transition-colors ${
                      statusInfo.color
                    } ${
                      atRiskCount === 0
                        ? 'group-hover:text-emerald-700'
                        : atRiskCount <= 2
                        ? 'group-hover:text-amber-700'
                        : 'group-hover:text-red-700'
                    }`}>
                    {statusInfo.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        atRiskCount === 0
                          ? 'bg-emerald-400'
                          : atRiskCount <= 2
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}></div>
                    <p className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      위험 항목: <span className="font-bold">{atRiskCount}</span> /{' '}
                      {riskData.riskItems.length} 개
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 
              ==========================================================
              제어 섹션 (Control Section)
              ========================================================== 
            */}
            <div className="relative p-8 overflow-hidden border-2 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl border-slate-200/50">
              {/* 장식용 요소 */}
              <div className="absolute top-0 right-0 w-20 h-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-amber-100/50 to-orange-100/50"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-slate-800">
                      세부 위험 분석
                    </h3>
                    <p className="text-sm text-slate-500">
                      총{' '}
                      <span className="font-semibold text-slate-700">
                        {riskData.riskItems.length}개
                      </span>{' '}
                      항목을 분석했습니다
                    </p>
                  </div>
                </div>

                {/* 전체 확장/축소 버튼들 */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllExpanded(true)}
                    className="px-6 py-3 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/10 hover:shadow-lg rounded-2xl">
                    <ChevronsDown className="w-4 h-4 mr-2" />
                    모두 펼치기
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllExpanded(false)}
                    className="px-6 py-3 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/10 hover:shadow-lg rounded-2xl">
                    <ChevronsUp className="w-4 h-4 mr-2" />
                    모두 접기
                  </Button>
                </div>
              </div>
            </div>

            {/* 
              ==========================================================
              위험 항목 목록 (Risk Items List)
              ========================================================== 
            */}
            <div className="space-y-6">
              {riskData.riskItems.map(item => (
                <Card
                  key={item.itemNumber}
                  className={`transition-all duration-300 rounded-3xl border-2 overflow-hidden group relative ${
                    item.atRisk
                      ? 'border-red-200 bg-gradient-to-r from-red-50/80 to-pink-50/80 shadow-xl hover:shadow-2xl'
                      : 'border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-xl'
                  }`}>
                  {/* 위험 항목용 장식 배경 */}
                  {item.atRisk && (
                    <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-red-100/30 to-pink-100/30"></div>
                  )}

                  {/* 위험 항목 헤더 - 클릭 시 확장/축소 */}
                  <CardHeader
                    className="relative z-10 pb-4 transition-all duration-300 cursor-pointer hover:bg-slate-50/50 rounded-t-3xl"
                    onClick={() => toggleExpand(item.itemNumber)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-4 text-lg font-bold">
                        {/* 항목 번호 표시 */}
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 text-lg font-bold rounded-2xl transition-all duration-300 ${
                            item.atRisk
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                              : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-2 border-slate-200 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-700'
                          }`}>
                          {item.itemNumber}
                        </div>

                        {/* 항목 설명 및 상태 */}
                        <div className="flex-1">
                          <span className="block text-slate-800">{item.description}</span>
                          {item.atRisk && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-4 py-2 text-xs font-bold text-white rounded-full shadow-md bg-gradient-to-r from-red-500 to-pink-500">
                                ⚠️ 위험 상태
                              </span>
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </CardTitle>

                      {/* 확장/축소 아이콘 */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            expandedItems.has(item.itemNumber)
                              ? 'bg-customG/10 text-customG'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          }`}>
                          {expandedItems.has(item.itemNumber) ? (
                            <ChevronsUp className="w-5 h-5" />
                          ) : (
                            <ChevronsDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 실제값과 기준값 표시 */}
                    <CardDescription className="mt-4 ml-16">
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        {/* 실제값 */}
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600 whitespace-nowrap">
                            실제값:
                          </span>
                          <div
                            className={`font-mono px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                              item.atRisk
                                ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                                : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700'
                            }`}>
                            {item.actualValue}
                          </div>
                        </div>

                        {/* 기준값 */}
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600 whitespace-nowrap">
                            기준값:
                          </span>
                          <div className="px-4 py-2 font-mono text-blue-700 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                            {item.threshold}
                          </div>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  {/* 
                    =======================================================
                    확장된 상세 정보 섹션 (Expanded Detail Section)
                    ======================================================= 
                  */}
                  {expandedItems.has(item.itemNumber) && (
                    <CardContent className="relative z-10 pt-0 pb-8">
                      <div className="relative p-6 mx-4 overflow-hidden border rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                        {/* 장식용 요소 */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 translate-x-8 translate-y-8 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50"></div>

                        <div className="relative z-10 flex items-start gap-4">
                          {/* 아이콘 */}
                          <div className="p-3 bg-white border shadow-sm rounded-2xl border-slate-200">
                            <FileSearch className="w-6 h-6 text-slate-500" />
                          </div>

                          {/* 상세 정보 내용 */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="text-lg font-bold text-slate-800">
                                상세 분석 정보
                              </h4>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                              <p className="text-base leading-relaxed text-slate-700">
                                {item.notes ||
                                  '추가적인 분석 정보가 제공되지 않았습니다. 기본 수치 비교를 통해 위험도를 판단했습니다.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </LoadingState>
      <DirectionButton
        direction="left"
        tooltip="파트너사 관리로 이동"
        href="/managePartner"
        fixed
        position="middle-left"
        size={48}
      />
    </div>
  )
}
