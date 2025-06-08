'use client'

import React, {useState, useEffect, useCallback} from 'react'
import {motion} from 'framer-motion'
import {
  Building,
  Car,
  Factory,
  Fuel,
  Plus,
  Search,
  TrendingUp,
  Edit,
  Trash2,
  Home,
  ArrowLeft,
  Landmark,
  BarChart,
  CalendarDays,
  GraduationCap
} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink
} from '@/components/ui/breadcrumb'
import {useToast} from '@/hooks/use-toast'
import Link from 'next/link'

import {LoadingState} from '@/components/ui/loading-state'
import {PartnerSelector} from '@/components/scope/PartnerSelector'
import {MonthSelector} from '@/components/scope/MonthSelector'

import {
  StationaryCombustion,
  MobileCombustion,
  StationaryCombustionForm,
  MobileCombustionForm,
  FuelType,
  PartnerCompany
} from '@/types/scope'

import {
  fetchStationaryCombustionByPartnerAndYear,
  fetchMobileCombustionByPartnerAndYear,
  createStationaryCombustion,
  updateStationaryCombustion,
  deleteStationaryCombustion,
  createMobileCombustion,
  updateMobileCombustion,
  deleteMobileCombustion,
  fetchFuelTypeList
} from '@/services/scope'

// 폼 인터페이스 정의
interface StationaryCombustionFormData {
  partnerCompanyId: number | null
  facilityName: string
  facilityType: string
  fuelTypeId: number
  fuelUsage: number
  reportingMonth: number
  unit: string
}

interface MobileCombustionFormData {
  partnerCompanyId: number | null
  vehicleType: string
  fuelTypeId: number
  fuelUsage: number
  reportingMonth: number
  unit: string
}

const Scope1Form = () => {
  const {toast} = useToast()

  // 상태 관리
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState('stationary')

  // 데이터 상태
  const [stationaryData, setStationaryData] = useState<StationaryCombustion[]>([])
  const [mobileData, setMobileData] = useState<MobileCombustion[]>([])
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([])
  const [loading, setLoading] = useState(false)

  // 다이얼로그 상태
  const [stationaryDialogOpen, setStationaryDialogOpen] = useState(false)
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false)
  const [editingStationary, setEditingStationary] = useState<StationaryCombustion | null>(
    null
  )
  const [editingMobile, setEditingMobile] = useState<MobileCombustion | null>(null)

  // 폼 상태
  const [stationaryForm, setStationaryForm] = useState<StationaryCombustionFormData>({
    partnerCompanyId: null,
    facilityName: '',
    facilityType: '',
    fuelTypeId: 1,
    fuelUsage: 0,
    reportingMonth: new Date().getMonth() + 1,
    unit: 'L'
  })

  const [mobileForm, setMobileForm] = useState<MobileCombustionFormData>({
    partnerCompanyId: null,
    vehicleType: '',
    fuelTypeId: 1,
    fuelUsage: 0,
    reportingMonth: new Date().getMonth() + 1,
    unit: 'L'
  })

  // 연도 옵션
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i)

  // 연료 타입 로드
  const loadFuelTypes = useCallback(async () => {
    try {
      const response = await fetchFuelTypeList()
      setFuelTypes(response)
    } catch (error) {
      console.error('연료 타입 로드 실패:', error)
      toast({
        title: '오류',
        description: '연료 타입 로드에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }, [toast])

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!selectedPartnerId) return

    setLoading(true)
    try {
      const [stationaryResponse, mobileResponse] = await Promise.all([
        fetchStationaryCombustionByPartnerAndYear(selectedPartnerId, selectedYear),
        fetchMobileCombustionByPartnerAndYear(selectedPartnerId, selectedYear)
      ])

      setStationaryData(stationaryResponse)
      setMobileData(mobileResponse)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      toast({
        title: '오류',
        description: '데이터를 불러오는데 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [selectedPartnerId, selectedYear, toast])

  // 효과
  useEffect(() => {
    if (selectedPartnerId) {
      loadData()
    }
  }, [selectedPartnerId, selectedYear, loadData])

  useEffect(() => {
    loadFuelTypes()
  }, [loadFuelTypes])

  // 파트너 선택 핸들러
  const handlePartnerSelect = (partner: PartnerCompany | null) => {
    const partnerId = partner?.id || null
    setSelectedPartnerId(partnerId)
    setStationaryForm(prev => ({...prev, partnerCompanyId: partnerId}))
    setMobileForm(prev => ({...prev, partnerCompanyId: partnerId}))
  }

  // 폼 리셋 함수
  const resetStationaryForm = () => {
    setStationaryForm({
      partnerCompanyId: selectedPartnerId,
      facilityName: '',
      facilityType: '',
      fuelTypeId: 1,
      fuelUsage: 0,
      reportingMonth: new Date().getMonth() + 1,
      unit: 'L'
    })
    setEditingStationary(null)
  }

  const resetMobileForm = () => {
    setMobileForm({
      partnerCompanyId: selectedPartnerId,
      vehicleType: '',
      fuelTypeId: 1,
      fuelUsage: 0,
      reportingMonth: new Date().getMonth() + 1,
      unit: 'L'
    })
    setEditingMobile(null)
  }

  // CRUD 함수들
  const handleCreateStationary = async () => {
    if (!stationaryForm.partnerCompanyId) {
      toast({
        title: '오류',
        description: '협력사를 선택해주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      const formData: StationaryCombustionForm = {
        partnerCompanyId: stationaryForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: stationaryForm.reportingMonth,
        facilityName: stationaryForm.facilityName,
        facilityType: stationaryForm.facilityType,
        fuelTypeId: stationaryForm.fuelTypeId.toString(),
        fuelUsage: stationaryForm.fuelUsage.toString(),
        unit: stationaryForm.unit,
        createdBy: 'user'
      }

      await createStationaryCombustion(formData)
      await loadData()
      setStationaryDialogOpen(false)
      resetStationaryForm()

      toast({
        title: '성공',
        description: '고정연소 데이터가 추가되었습니다.'
      })
    } catch (error) {
      console.error('고정연소 데이터 생성 실패:', error)
      toast({
        title: '오류',
        description: '데이터 추가에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateStationary = async () => {
    if (!editingStationary?.id || !stationaryForm.partnerCompanyId) return

    try {
      const formData: StationaryCombustionForm = {
        partnerCompanyId: stationaryForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: stationaryForm.reportingMonth,
        facilityName: stationaryForm.facilityName,
        facilityType: stationaryForm.facilityType,
        fuelTypeId: stationaryForm.fuelTypeId.toString(),
        fuelUsage: stationaryForm.fuelUsage.toString(),
        unit: stationaryForm.unit,
        createdBy: 'user'
      }

      await updateStationaryCombustion(editingStationary.id, formData)
      await loadData()
      setStationaryDialogOpen(false)
      resetStationaryForm()

      toast({
        title: '성공',
        description: '고정연소 데이터가 수정되었습니다.'
      })
    } catch (error) {
      console.error('고정연소 데이터 수정 실패:', error)
      toast({
        title: '오류',
        description: '데이터 수정에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteStationary = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      await deleteStationaryCombustion(id)
      await loadData()

      toast({
        title: '성공',
        description: '고정연소 데이터가 삭제되었습니다.'
      })
    } catch (error) {
      console.error('고정연소 데이터 삭제 실패:', error)
      toast({
        title: '오류',
        description: '데이터 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleCreateMobile = async () => {
    if (!mobileForm.partnerCompanyId) {
      toast({
        title: '오류',
        description: '협력사를 선택해주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      const formData: MobileCombustionForm = {
        partnerCompanyId: mobileForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: mobileForm.reportingMonth,
        vehicleType: mobileForm.vehicleType,
        fuelTypeId: mobileForm.fuelTypeId.toString(),
        fuelUsage: mobileForm.fuelUsage.toString(),
        unit: mobileForm.unit,
        createdBy: 'user'
      }

      await createMobileCombustion(formData)
      await loadData()
      setMobileDialogOpen(false)
      resetMobileForm()

      toast({
        title: '성공',
        description: '이동연소 데이터가 추가되었습니다.'
      })
    } catch (error) {
      console.error('이동연소 데이터 생성 실패:', error)
      toast({
        title: '오류',
        description: '데이터 추가에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateMobile = async () => {
    if (!editingMobile?.id || !mobileForm.partnerCompanyId) return

    try {
      const formData: MobileCombustionForm = {
        partnerCompanyId: mobileForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: mobileForm.reportingMonth,
        vehicleType: mobileForm.vehicleType,
        fuelTypeId: mobileForm.fuelTypeId.toString(),
        fuelUsage: mobileForm.fuelUsage.toString(),
        unit: mobileForm.unit,
        createdBy: 'user'
      }

      await updateMobileCombustion(editingMobile.id, formData)
      await loadData()
      setMobileDialogOpen(false)
      resetMobileForm()

      toast({
        title: '성공',
        description: '이동연소 데이터가 수정되었습니다.'
      })
    } catch (error) {
      console.error('이동연소 데이터 수정 실패:', error)
      toast({
        title: '오류',
        description: '데이터 수정에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteMobile = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      await deleteMobileCombustion(id)
      await loadData()

      toast({
        title: '성공',
        description: '이동연소 데이터가 삭제되었습니다.'
      })
    } catch (error) {
      console.error('이동연소 데이터 삭제 실패:', error)
      toast({
        title: '오류',
        description: '데이터 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  // 편집 핸들러
  const handleEditStationary = (data: StationaryCombustion) => {
    setEditingStationary(data)
    setStationaryForm({
      partnerCompanyId: data.partnerCompanyId,
      facilityName: data.facilityName,
      facilityType: data.facilityType,
      fuelTypeId: data.fuelTypeId,
      fuelUsage: data.fuelUsage,
      reportingMonth: data.reportingMonth,
      unit: data.unit
    })
    setStationaryDialogOpen(true)
  }

  const handleEditMobile = (data: MobileCombustion) => {
    setEditingMobile(data)
    setMobileForm({
      partnerCompanyId: data.partnerCompanyId,
      vehicleType: data.vehicleType,
      fuelTypeId: data.fuelTypeId,
      fuelUsage: data.fuelUsage,
      reportingMonth: data.reportingMonth,
      unit: data.unit
    })
    setMobileDialogOpen(true)
  }

  // 총 배출량 계산
  const getTotalEmissions = () => {
    const stationaryTotal = stationaryData.reduce(
      (sum, item) => sum + (item.totalCo2Equivalent || 0),
      0
    )
    const mobileTotal = mobileData.reduce(
      (sum, item) => sum + (item.totalCo2Equivalent || 0),
      0
    )
    return stationaryTotal + mobileTotal
  }

  return (
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink
                href="/home"
                className="text-gray-600 transition-colors hover:text-blue-600">
                대시보드
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/scope"
                className="text-gray-600 transition-colors hover:text-blue-600">
                Scope
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-blue-600">
                Scope 1
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 헤더 섹션 */}
      <div className="flex flex-row w-full h-full mb-6">
        <Link
          href="/scope"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-blue-50">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Scope 1 배출량 관리</h1>
              <p className="text-sm text-gray-600">
                직접 배출량 데이터를 협력사별로 관리합니다
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* 협력사 및 연도 선택 섹션 */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-2 rounded-full bg-blue-50">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">협력사 및 연도 선택</h2>
            <p className="text-gray-600">
              배출량 데이터를 관리할 협력사와 연도를 선택하세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 협력사 선택 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">협력사 선택</Label>
            <PartnerSelector
              selectedPartnerId={selectedPartnerId || undefined}
              onSelect={handlePartnerSelect}
            />
          </div>

          {/* 연도 선택 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">보고연도</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={value => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500">
                <SelectValue placeholder="연도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      {!selectedPartnerId ? (
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="inline-flex p-6 mb-6 rounded-full bg-blue-50">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                협력사를 선택해주세요
              </h3>
              <p className="max-w-md text-gray-600">
                먼저 협력사를 선택하여 해당 협력사의 배출량 데이터를 관리하세요
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">총 배출량</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getTotalEmissions().toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-gray-500">tCO2eq</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Factory className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">고정연소</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stationaryData
                      .reduce((sum, item) => sum + (item.totalCo2Equivalent || 0), 0)
                      .toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-gray-500">tCO2eq</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-amber-50">
                  <Car className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">이동연소</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mobileData
                      .reduce((sum, item) => sum + (item.totalCo2Equivalent || 0), 0)
                      .toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-gray-500">tCO2eq</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 데이터 테이블 */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Fuel className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">배출량 데이터</h2>
                <p className="text-gray-600">협력사의 직접 배출량 데이터를 관리하세요</p>
              </div>
            </div>

            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50">
                  <TabsTrigger
                    value="stationary"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200">
                    <Factory className="w-4 h-4 mr-2" />
                    고정연소
                  </TabsTrigger>
                  <TabsTrigger
                    value="mobile"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all duration-200">
                    <Car className="w-4 h-4 mr-2" />
                    이동연소
                  </TabsTrigger>
                </TabsList>

                {/* 고정연소 탭 */}
                <TabsContent value="stationary" className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      고정연소 배출량
                    </h3>
                    <Button
                      onClick={() => {
                        resetStationaryForm()
                        setStationaryDialogOpen(true)
                      }}
                      className="text-white bg-blue-600 shadow-sm hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      데이터 추가
                    </Button>
                  </div>

                  {loading ? (
                    <LoadingState isLoading={true} error={null}>
                      <div>데이터를 불러오는 중...</div>
                    </LoadingState>
                  ) : stationaryData.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="inline-flex p-4 mb-4 rounded-full bg-blue-50">
                        <Factory className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-gray-900">
                        등록된 고정연소 데이터가 없습니다
                      </h4>
                      <p className="mb-6 text-gray-600">
                        새로운 고정연소 배출량 데이터를 추가해보세요
                      </p>
                      <Button
                        onClick={() => {
                          resetStationaryForm()
                          setStationaryDialogOpen(true)
                        }}
                        className="text-white bg-blue-600 shadow-sm hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />첫 번째 데이터 추가
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="py-3 font-medium text-gray-700">
                              시설명
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              연료종류
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              보고월
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              연료사용량
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              배출량 (tCO2eq)
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              작업
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stationaryData.map(item => (
                            <TableRow
                              key={item.id}
                              className="transition-colors hover:bg-blue-50/30">
                              <TableCell className="font-medium text-gray-900">
                                {item.facilityName}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {fuelTypes.find(f => f.id === item.fuelTypeId)?.name ||
                                  '알 수 없음'}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.reportingMonth}월
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.fuelUsage?.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-semibold text-blue-600">
                                {item.totalCo2Equivalent?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditStationary(item)}
                                    className="text-blue-600 transition-colors border-blue-200 hover:bg-blue-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      item.id && handleDeleteStationary(item.id)
                                    }
                                    className="text-red-600 transition-colors border-red-200 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* 이동연소 탭 */}
                <TabsContent value="mobile" className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      이동연소 배출량
                    </h3>
                    <Button
                      onClick={() => {
                        resetMobileForm()
                        setMobileDialogOpen(true)
                      }}
                      className="text-white shadow-sm bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      데이터 추가
                    </Button>
                  </div>

                  {loading ? (
                    <LoadingState isLoading={true} error={null}>
                      <div>데이터를 불러오는 중...</div>
                    </LoadingState>
                  ) : mobileData.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="inline-flex p-4 mb-4 rounded-full bg-amber-50">
                        <Car className="w-8 h-8 text-amber-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-gray-900">
                        등록된 이동연소 데이터가 없습니다
                      </h4>
                      <p className="mb-6 text-gray-600">
                        새로운 이동연소 배출량 데이터를 추가해보세요
                      </p>
                      <Button
                        onClick={() => {
                          resetMobileForm()
                          setMobileDialogOpen(true)
                        }}
                        className="text-white shadow-sm bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />첫 번째 데이터 추가
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="py-3 font-medium text-gray-700">
                              차량종류
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              연료종류
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              보고월
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              연료사용량
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              배출량 (tCO2eq)
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              작업
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mobileData.map(item => (
                            <TableRow
                              key={item.id}
                              className="transition-colors hover:bg-amber-50/30">
                              <TableCell className="font-medium text-gray-900">
                                {item.vehicleType}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {fuelTypes.find(f => f.id === item.fuelTypeId)?.name ||
                                  '알 수 없음'}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.reportingMonth}월
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.fuelUsage?.toLocaleString()}
                              </TableCell>
                              <TableCell className="font-semibold text-amber-600">
                                {item.totalCo2Equivalent?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditMobile(item)}
                                    className="transition-colors text-amber-600 border-amber-200 hover:bg-amber-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => item.id && handleDeleteMobile(item.id)}
                                    className="text-red-600 transition-colors border-red-200 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* 고정연소 다이얼로그 */}
      <Dialog open={stationaryDialogOpen} onOpenChange={setStationaryDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Factory className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingStationary ? '고정연소 데이터 수정' : '고정연소 데이터 추가'}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingStationary
                    ? '고정연소 배출량 데이터를 수정합니다'
                    : '새로운 고정연소 배출량 데이터를 추가합니다'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="facilityName" className="text-sm font-medium">
                  시설명
                </Label>
                <Input
                  id="facilityName"
                  value={stationaryForm.facilityName}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, facilityName: e.target.value})
                  }
                  placeholder="시설명을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="facilityType" className="text-sm font-medium">
                  시설유형
                </Label>
                <Input
                  id="facilityType"
                  value={stationaryForm.facilityType}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, facilityType: e.target.value})
                  }
                  placeholder="시설유형을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="fuelType" className="text-sm font-medium">
                  연료종류
                </Label>
                <Select
                  value={stationaryForm.fuelTypeId.toString()}
                  onValueChange={value =>
                    setStationaryForm({...stationaryForm, fuelTypeId: parseInt(value)})
                  }>
                  <SelectTrigger className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500">
                    <SelectValue placeholder="연료종류를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.id} value={fuel.id.toString()}>
                        {fuel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="reportingMonth" className="text-sm font-medium">
                  보고월
                </Label>
                <MonthSelector
                  selectedMonth={stationaryForm.reportingMonth}
                  onSelect={(month: number) =>
                    setStationaryForm({...stationaryForm, reportingMonth: month})
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="fuelUsage" className="text-sm font-medium">
                  연료사용량
                </Label>
                <Input
                  id="fuelUsage"
                  type="number"
                  value={stationaryForm.fuelUsage}
                  onChange={e =>
                    setStationaryForm({
                      ...stationaryForm,
                      fuelUsage: parseFloat(e.target.value) || 0
                    })
                  }
                  placeholder="연료사용량을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="unit" className="text-sm font-medium">
                  단위
                </Label>
                <Input
                  id="unit"
                  value={stationaryForm.unit}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, unit: e.target.value})
                  }
                  placeholder="단위를 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setStationaryDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900">
              취소
            </Button>
            <Button
              onClick={
                editingStationary ? handleUpdateStationary : handleCreateStationary
              }
              className="text-white bg-blue-600 shadow-sm hover:bg-blue-700">
              {editingStationary ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이동연소 다이얼로그 */}
      <Dialog open={mobileDialogOpen} onOpenChange={setMobileDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <Car className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingMobile ? '이동연소 데이터 수정' : '이동연소 데이터 추가'}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingMobile
                    ? '이동연소 배출량 데이터를 수정합니다'
                    : '새로운 이동연소 배출량 데이터를 추가합니다'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="vehicleType" className="text-sm font-medium">
                  차량종류
                </Label>
                <Input
                  id="vehicleType"
                  value={mobileForm.vehicleType}
                  onChange={e =>
                    setMobileForm({...mobileForm, vehicleType: e.target.value})
                  }
                  placeholder="차량종류를 입력하세요"
                  className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="mobileFuelType" className="text-sm font-medium">
                  연료종류
                </Label>
                <Select
                  value={mobileForm.fuelTypeId.toString()}
                  onValueChange={value =>
                    setMobileForm({...mobileForm, fuelTypeId: parseInt(value)})
                  }>
                  <SelectTrigger className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500">
                    <SelectValue placeholder="연료종류를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel.id} value={fuel.id.toString()}>
                        {fuel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="mobileReportingMonth" className="text-sm font-medium">
                  보고월
                </Label>
                <MonthSelector
                  selectedMonth={mobileForm.reportingMonth}
                  onSelect={(month: number) =>
                    setMobileForm({...mobileForm, reportingMonth: month})
                  }
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="mobileFuelUsage" className="text-sm font-medium">
                  연료사용량
                </Label>
                <Input
                  id="mobileFuelUsage"
                  type="number"
                  value={mobileForm.fuelUsage}
                  onChange={e =>
                    setMobileForm({
                      ...mobileForm,
                      fuelUsage: parseFloat(e.target.value) || 0
                    })
                  }
                  placeholder="연료사용량을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mobileUnit" className="text-sm font-medium">
                단위
              </Label>
              <Input
                id="mobileUnit"
                value={mobileForm.unit}
                onChange={e => setMobileForm({...mobileForm, unit: e.target.value})}
                placeholder="단위를 입력하세요"
                className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setMobileDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900">
              취소
            </Button>
            <Button
              onClick={editingMobile ? handleUpdateMobile : handleCreateMobile}
              className="text-white shadow-sm bg-amber-600 hover:bg-amber-700">
              {editingMobile ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Scope1Form
