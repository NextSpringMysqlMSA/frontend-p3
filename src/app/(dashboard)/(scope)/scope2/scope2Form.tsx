'use client'

import React, {useState, useEffect, useCallback} from 'react'
import {motion} from 'framer-motion'
import {
  Building,
  Zap,
  Wind,
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
  ElectricityUsage,
  SteamUsage,
  ElectricityUsageForm,
  SteamUsageForm,
  PartnerCompany
} from '@/types/scope'

import {
  fetchElectricityUsageByPartnerAndYear,
  fetchSteamUsageByPartnerAndYear,
  createElectricityUsage,
  updateElectricityUsage,
  deleteElectricityUsage,
  createSteamUsage,
  updateSteamUsage,
  deleteSteamUsage
} from '@/services/scope'

// 폼 인터페이스 정의
interface ElectricityFormData {
  partnerCompanyId: number | null
  facilityName: string
  electricityUsage: number
  reportingMonth: number
  unit: string
  isRenewable: boolean
}

interface SteamFormData {
  partnerCompanyId: number | null
  facilityName: string
  steamUsage: number
  reportingMonth: number
  unit: string
}

const Scope2Form = () => {
  const {toast} = useToast()

  // 상태 관리
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState('electricity')

  // 데이터 상태
  const [electricityData, setElectricityData] = useState<ElectricityUsage[]>([])
  const [steamData, setSteamData] = useState<SteamUsage[]>([])
  const [loading, setLoading] = useState(false)

  // 다이얼로그 상태
  const [electricityDialogOpen, setElectricityDialogOpen] = useState(false)
  const [steamDialogOpen, setSteamDialogOpen] = useState(false)
  const [editingElectricity, setEditingElectricity] = useState<ElectricityUsage | null>(
    null
  )
  const [editingSteam, setEditingSteam] = useState<SteamUsage | null>(null)

  // 폼 상태
  const [electricityForm, setElectricityForm] = useState<ElectricityFormData>({
    partnerCompanyId: null,
    facilityName: '',
    electricityUsage: 0,
    reportingMonth: new Date().getMonth() + 1,
    unit: 'kWh',
    isRenewable: false
  })

  const [steamForm, setSteamForm] = useState<SteamFormData>({
    partnerCompanyId: null,
    facilityName: '',
    steamUsage: 0,
    reportingMonth: new Date().getMonth() + 1,
    unit: 'GJ'
  })

  // 연도 옵션
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i)

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!selectedPartnerId) return

    setLoading(true)
    try {
      const [electricityResponse, steamResponse] = await Promise.all([
        fetchElectricityUsageByPartnerAndYear(selectedPartnerId, selectedYear),
        fetchSteamUsageByPartnerAndYear(selectedPartnerId, selectedYear)
      ])

      setElectricityData(electricityResponse)
      setSteamData(steamResponse)
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

  // 파트너 선택 핸들러
  const handlePartnerSelect = (partner: PartnerCompany | null) => {
    const partnerId = partner?.id || null
    setSelectedPartnerId(partnerId)
    setElectricityForm(prev => ({...prev, partnerCompanyId: partnerId}))
    setSteamForm(prev => ({...prev, partnerCompanyId: partnerId}))
  }

  // 폼 리셋 함수
  const resetElectricityForm = () => {
    setElectricityForm({
      partnerCompanyId: selectedPartnerId,
      facilityName: '',
      electricityUsage: 0,
      reportingMonth: new Date().getMonth() + 1,
      unit: 'kWh',
      isRenewable: false
    })
    setEditingElectricity(null)
  }

  const resetSteamForm = () => {
    setSteamForm({
      partnerCompanyId: selectedPartnerId,
      facilityName: '',
      steamUsage: 0,
      reportingMonth: new Date().getMonth() + 1,
      unit: 'GJ'
    })
    setEditingSteam(null)
  }

  // CRUD 함수들 - 전력
  const handleCreateElectricity = async () => {
    if (!electricityForm.partnerCompanyId) {
      toast({
        title: '오류',
        description: '협력사를 선택해주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      const formData: ElectricityUsageForm = {
        partnerCompanyId: electricityForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: electricityForm.reportingMonth,
        facilityName: electricityForm.facilityName,
        electricityUsage: electricityForm.electricityUsage.toString(),
        unit: electricityForm.unit,
        isRenewable: electricityForm.isRenewable,
        createdBy: 'user'
      }

      await createElectricityUsage(formData)
      await loadData()
      setElectricityDialogOpen(false)
      resetElectricityForm()

      toast({
        title: '성공',
        description: '전력 사용량 데이터가 추가되었습니다.'
      })
    } catch (error) {
      console.error('전력 데이터 생성 실패:', error)
      toast({
        title: '오류',
        description: '데이터 추가에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateElectricity = async () => {
    if (!editingElectricity?.id || !electricityForm.partnerCompanyId) return

    try {
      const formData: ElectricityUsageForm = {
        partnerCompanyId: electricityForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: electricityForm.reportingMonth,
        facilityName: electricityForm.facilityName,
        electricityUsage: electricityForm.electricityUsage.toString(),
        unit: electricityForm.unit,
        isRenewable: electricityForm.isRenewable,
        createdBy: 'user'
      }

      await updateElectricityUsage(editingElectricity.id, formData)
      await loadData()
      setElectricityDialogOpen(false)
      resetElectricityForm()

      toast({
        title: '성공',
        description: '전력 사용량 데이터가 수정되었습니다.'
      })
    } catch (error) {
      console.error('전력 데이터 수정 실패:', error)
      toast({
        title: '오류',
        description: '데이터 수정에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteElectricity = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      await deleteElectricityUsage(id)
      await loadData()

      toast({
        title: '성공',
        description: '전력 사용량 데이터가 삭제되었습니다.'
      })
    } catch (error) {
      console.error('전력 데이터 삭제 실패:', error)
      toast({
        title: '오류',
        description: '데이터 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  // CRUD 함수들 - 스팀
  const handleCreateSteam = async () => {
    if (!steamForm.partnerCompanyId) {
      toast({
        title: '오류',
        description: '협력사를 선택해주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      const formData: SteamUsageForm = {
        partnerCompanyId: steamForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: steamForm.reportingMonth,
        facilityName: steamForm.facilityName,
        steamUsage: steamForm.steamUsage.toString(),
        unit: steamForm.unit,
        createdBy: 'user'
      }

      await createSteamUsage(formData)
      await loadData()
      setSteamDialogOpen(false)
      resetSteamForm()

      toast({
        title: '성공',
        description: '스팀 사용량 데이터가 추가되었습니다.'
      })
    } catch (error) {
      console.error('스팀 데이터 생성 실패:', error)
      toast({
        title: '오류',
        description: '데이터 추가에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateSteam = async () => {
    if (!editingSteam?.id || !steamForm.partnerCompanyId) return

    try {
      const formData: SteamUsageForm = {
        partnerCompanyId: steamForm.partnerCompanyId,
        reportingYear: selectedYear,
        reportingMonth: steamForm.reportingMonth,
        facilityName: steamForm.facilityName,
        steamUsage: steamForm.steamUsage.toString(),
        unit: steamForm.unit,
        createdBy: 'user'
      }

      await updateSteamUsage(editingSteam.id, formData)
      await loadData()
      setSteamDialogOpen(false)
      resetSteamForm()

      toast({
        title: '성공',
        description: '스팀 사용량 데이터가 수정되었습니다.'
      })
    } catch (error) {
      console.error('스팀 데이터 수정 실패:', error)
      toast({
        title: '오류',
        description: '데이터 수정에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteSteam = async (id: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    try {
      await deleteSteamUsage(id)
      await loadData()

      toast({
        title: '성공',
        description: '스팀 사용량 데이터가 삭제되었습니다.'
      })
    } catch (error) {
      console.error('스팀 데이터 삭제 실패:', error)
      toast({
        title: '오류',
        description: '데이터 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  // 편집 핸들러
  const handleEditElectricity = (data: ElectricityUsage) => {
    setEditingElectricity(data)
    setElectricityForm({
      partnerCompanyId: data.partnerCompanyId,
      facilityName: data.facilityName,
      electricityUsage: data.electricityUsage,
      reportingMonth: data.reportingMonth,
      unit: data.unit,
      isRenewable: data.isRenewable
    })
    setElectricityDialogOpen(true)
  }

  const handleEditSteam = (data: SteamUsage) => {
    setEditingSteam(data)
    setSteamForm({
      partnerCompanyId: data.partnerCompanyId,
      facilityName: data.facilityName,
      steamUsage: data.steamUsage,
      reportingMonth: data.reportingMonth,
      unit: data.unit
    })
    setSteamDialogOpen(true)
  }

  // 총 배출량 계산
  const getTotalEmissions = () => {
    const electricityTotal = electricityData.reduce(
      (sum, item) => sum + (item.co2Emission || 0),
      0
    )
    const steamTotal = steamData.reduce((sum, item) => sum + (item.co2Emission || 0), 0)
    return electricityTotal + steamTotal
  }

  const getTotalElectricityUsage = () => {
    return electricityData.reduce((sum, item) => sum + item.electricityUsage, 0)
  }

  const getTotalSteamUsage = () => {
    return steamData.reduce((sum, item) => sum + item.steamUsage, 0)
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
                Scope 2
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
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Scope 2 배출량 관리</h1>
              <p className="text-sm text-gray-600">
                간접 배출량 데이터를 협력사별로 관리합니다
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
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">전력사용</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getTotalElectricityUsage().toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-gray-500">kWh</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-amber-50">
                  <Wind className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">스팀사용</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getTotalSteamUsage().toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-gray-500">GJ</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 데이터 테이블 */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">배출량 데이터</h2>
                <p className="text-gray-600">협력사의 간접 배출량 데이터를 관리하세요</p>
              </div>
            </div>

            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50">
                  <TabsTrigger
                    value="electricity"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200">
                    <Zap className="w-4 h-4 mr-2" />
                    전력사용
                  </TabsTrigger>
                  <TabsTrigger
                    value="steam"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm transition-all duration-200">
                    <Wind className="w-4 h-4 mr-2" />
                    스팀사용
                  </TabsTrigger>
                </TabsList>

                {/* 전력사용 탭 */}
                <TabsContent value="electricity" className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">전력 사용량</h3>
                    <Button
                      onClick={() => {
                        resetElectricityForm()
                        setElectricityDialogOpen(true)
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
                  ) : electricityData.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="inline-flex p-4 mb-4 rounded-full bg-blue-50">
                        <Zap className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-gray-900">
                        등록된 전력 사용량 데이터가 없습니다
                      </h4>
                      <p className="mb-6 text-gray-600">
                        새로운 전력 사용량 데이터를 추가해보세요
                      </p>
                      <Button
                        onClick={() => {
                          resetElectricityForm()
                          setElectricityDialogOpen(true)
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
                              보고월
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              전력사용량
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              재생에너지
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
                          {electricityData.map(item => (
                            <TableRow
                              key={item.id}
                              className="transition-colors hover:bg-blue-50/30">
                              <TableCell className="font-medium text-gray-900">
                                {item.facilityName}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.reportingMonth}월
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.electricityUsage?.toLocaleString()} kWh
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    item.isRenewable
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {item.isRenewable ? '재생' : '일반'}
                                </span>
                              </TableCell>
                              <TableCell className="font-semibold text-blue-600">
                                {item.co2Emission?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditElectricity(item)}
                                    className="text-blue-600 transition-colors border-blue-200 hover:bg-blue-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      item.id && handleDeleteElectricity(item.id)
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

                {/* 스팀사용 탭 */}
                <TabsContent value="steam" className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">스팀 사용량</h3>
                    <Button
                      onClick={() => {
                        resetSteamForm()
                        setSteamDialogOpen(true)
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
                  ) : steamData.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="inline-flex p-4 mb-4 rounded-full bg-amber-50">
                        <Wind className="w-8 h-8 text-amber-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-gray-900">
                        등록된 스팀 사용량 데이터가 없습니다
                      </h4>
                      <p className="mb-6 text-gray-600">
                        새로운 스팀 사용량 데이터를 추가해보세요
                      </p>
                      <Button
                        onClick={() => {
                          resetSteamForm()
                          setSteamDialogOpen(true)
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
                              시설명
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              보고월
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">
                              스팀사용량
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
                          {steamData.map(item => (
                            <TableRow
                              key={item.id}
                              className="transition-colors hover:bg-amber-50/30">
                              <TableCell className="font-medium text-gray-900">
                                {item.facilityName}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.reportingMonth}월
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {item.steamUsage?.toLocaleString()} GJ
                              </TableCell>
                              <TableCell className="font-semibold text-amber-600">
                                {item.co2Emission?.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditSteam(item)}
                                    className="transition-colors text-amber-600 border-amber-200 hover:bg-amber-50">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => item.id && handleDeleteSteam(item.id)}
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

      {/* 전력사용 다이얼로그 */}
      <Dialog open={electricityDialogOpen} onOpenChange={setElectricityDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingElectricity
                    ? '전력 사용량 데이터 수정'
                    : '전력 사용량 데이터 추가'}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingElectricity
                    ? '전력 사용량 데이터를 수정합니다'
                    : '새로운 전력 사용량 데이터를 추가합니다'}
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
                  value={electricityForm.facilityName}
                  onChange={e =>
                    setElectricityForm({...electricityForm, facilityName: e.target.value})
                  }
                  placeholder="시설명을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="reportingMonth" className="text-sm font-medium">
                  보고월
                </Label>
                <MonthSelector
                  selectedMonth={electricityForm.reportingMonth}
                  onSelect={(month: number) =>
                    setElectricityForm({...electricityForm, reportingMonth: month})
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="electricityUsage" className="text-sm font-medium">
                  전력사용량
                </Label>
                <Input
                  id="electricityUsage"
                  type="number"
                  value={electricityForm.electricityUsage}
                  onChange={e =>
                    setElectricityForm({
                      ...electricityForm,
                      electricityUsage: parseFloat(e.target.value) || 0
                    })
                  }
                  placeholder="전력사용량을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="unit" className="text-sm font-medium">
                  단위
                </Label>
                <Input
                  id="unit"
                  value={electricityForm.unit}
                  onChange={e =>
                    setElectricityForm({...electricityForm, unit: e.target.value})
                  }
                  placeholder="단위를 입력하세요"
                  className="bg-white border border-gray-200 hover:border-blue-300 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRenewable"
                checked={electricityForm.isRenewable}
                onChange={e =>
                  setElectricityForm({...electricityForm, isRenewable: e.target.checked})
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="isRenewable" className="text-sm font-medium">
                재생에너지 사용
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setElectricityDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900">
              취소
            </Button>
            <Button
              onClick={
                editingElectricity ? handleUpdateElectricity : handleCreateElectricity
              }
              className="text-white bg-blue-600 shadow-sm hover:bg-blue-700">
              {editingElectricity ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 스팀사용 다이얼로그 */}
      <Dialog open={steamDialogOpen} onOpenChange={setSteamDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <Wind className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingSteam ? '스팀 사용량 데이터 수정' : '스팀 사용량 데이터 추가'}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingSteam
                    ? '스팀 사용량 데이터를 수정합니다'
                    : '새로운 스팀 사용량 데이터를 추가합니다'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="steamFacilityName" className="text-sm font-medium">
                  시설명
                </Label>
                <Input
                  id="steamFacilityName"
                  value={steamForm.facilityName}
                  onChange={e =>
                    setSteamForm({...steamForm, facilityName: e.target.value})
                  }
                  placeholder="시설명을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="steamReportingMonth" className="text-sm font-medium">
                  보고월
                </Label>
                <MonthSelector
                  selectedMonth={steamForm.reportingMonth}
                  onSelect={(month: number) =>
                    setSteamForm({...steamForm, reportingMonth: month})
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="steamUsage" className="text-sm font-medium">
                  스팀사용량
                </Label>
                <Input
                  id="steamUsage"
                  type="number"
                  value={steamForm.steamUsage}
                  onChange={e =>
                    setSteamForm({
                      ...steamForm,
                      steamUsage: parseFloat(e.target.value) || 0
                    })
                  }
                  placeholder="스팀사용량을 입력하세요"
                  className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="steamUnit" className="text-sm font-medium">
                  단위
                </Label>
                <Input
                  id="steamUnit"
                  value={steamForm.unit}
                  onChange={e => setSteamForm({...steamForm, unit: e.target.value})}
                  placeholder="단위를 입력하세요"
                  className="bg-white border border-gray-200 hover:border-amber-300 focus-visible:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setSteamDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900">
              취소
            </Button>
            <Button
              onClick={editingSteam ? handleUpdateSteam : handleCreateSteam}
              className="text-white shadow-sm bg-amber-600 hover:bg-amber-700">
              {editingSteam ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Scope2Form
