'use client'

import React, {useState, useEffect} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {Badge} from '@/components/ui/badge'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {
  Home,
  Zap,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Wind,
  TrendingUp,
  Factory,
  Building
} from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

// 타입과 서비스 import
import type {
  ElectricityUsage,
  SteamUsage,
  PartnerCompany,
  ElectricityUsageForm,
  SteamUsageForm
} from '@/types/scope'
import {
  fetchElectricityUsageByPartnerAndYear,
  fetchSteamUsageByPartnerAndYear,
  createElectricityUsage,
  createSteamUsage,
  updateElectricityUsage,
  updateSteamUsage,
  deleteElectricityUsage,
  deleteSteamUsage
} from '@/services/scope'
import {fetchActivePartnerCompanies} from '@/services/partner'
import {PartnerSelector} from '@/components/scope/PartnerSelector'
import {MonthSelector} from '@/components/scope/MonthSelector'

// 폼 데이터 타입 정의
interface ElectricityFormData {
  partnerCompanyId: number
  partnerCompanyName: string
  reportingMonth: string
  facilityName: string
  usage: string
  isRenewable: boolean
}

interface SteamFormData {
  partnerCompanyId: number
  partnerCompanyName: string
  reportingMonth: string
  facilityName: string
  usage: string
}

export default function Scope2Form() {
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('electricity')

  // Partner and year selection
  const [selectedPartner, setSelectedPartner] = useState<PartnerCompany | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Data states
  const [electricityData, setElectricityData] = useState<ElectricityUsage[]>([])
  const [steamData, setSteamData] = useState<SteamUsage[]>([])

  // Form states
  const [showElectricityDialog, setShowElectricityDialog] = useState(false)
  const [showSteamDialog, setShowSteamDialog] = useState(false)
  const [editingElectricityId, setEditingElectricityId] = useState<number | null>(null)
  const [editingSteamId, setEditingSteamId] = useState<number | null>(null)

  // Form data
  const [electricityForm, setElectricityForm] = useState({
    partnerCompanyId: 0,
    partnerCompanyName: '',
    reportingMonth: '',
    facilityName: '',
    usage: '',
    isRenewable: false
  })

  const [steamForm, setSteamForm] = useState({
    partnerCompanyId: 0,
    partnerCompanyName: '',
    reportingMonth: '',
    facilityName: '',
    usage: ''
  })

  // API 호출 함수들
  const fetchElectricityData = async () => {
    if (!selectedPartner) return

    try {
      const data = await fetchElectricityUsageByPartnerAndYear(
        selectedPartner.id,
        selectedYear
      )
      setElectricityData(data)
    } catch (err) {
      console.error('전력 사용량 데이터 조회 실패:', err)
      setElectricityData([])
    }
  }

  const fetchSteamData = async () => {
    if (!selectedPartner) return

    try {
      const data = await fetchSteamUsageByPartnerAndYear(selectedPartner.id, selectedYear)
      setSteamData(data)
    } catch (err) {
      console.error('스팀 사용량 데이터 조회 실패:', err)
      setSteamData([])
    }
  }

  // 폼 제출 함수들
  const handleElectricitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPartner) return

    try {
      const formData: ElectricityUsage = {
        partnerCompanyId: selectedPartner.id,
        partnerCompanyName: selectedPartner.name,
        reportingYear: selectedYear,
        reportingMonth: parseInt(electricityForm.reportingMonth),
        facilityName: electricityForm.facilityName,
        electricityUsage: parseFloat(electricityForm.usage),
        unit: 'kWh',
        isRenewable: electricityForm.isRenewable,
        createdBy: 'current-user'
      }

      if (editingElectricityId) {
        await updateElectricityUsage(editingElectricityId, formData)
      } else {
        await createElectricityUsage(formData)
      }

      await fetchElectricityData()
      setShowElectricityDialog(false)
      resetElectricityForm()
    } catch (err) {
      console.error('저장 실패:', err)
      setError('저장 중 오류가 발생했습니다.')
    }
  }

  const handleSteamSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPartner) return

    try {
      const formData: SteamUsage = {
        partnerCompanyId: selectedPartner.id,
        partnerCompanyName: selectedPartner.name,
        reportingYear: selectedYear,
        reportingMonth: parseInt(steamForm.reportingMonth),
        facilityName: steamForm.facilityName,
        steamUsage: parseFloat(steamForm.usage),
        unit: 'GJ',
        createdBy: 'current-user'
      }

      if (editingSteamId) {
        await updateSteamUsage(editingSteamId, formData)
      } else {
        await createSteamUsage(formData)
      }

      await fetchSteamData()
      setShowSteamDialog(false)
      resetSteamForm()
    } catch (err) {
      console.error('저장 실패:', err)
      setError('저장 중 오류가 발생했습니다.')
    }
  }

  // 폼 리셋 함수들
  const resetElectricityForm = () => {
    setElectricityForm({
      partnerCompanyId: selectedPartner?.id || 0,
      partnerCompanyName: selectedPartner?.name || '',
      reportingMonth: '',
      facilityName: '',
      usage: '',
      isRenewable: false
    })
    setEditingElectricityId(null)
  }

  const resetSteamForm = () => {
    setSteamForm({
      partnerCompanyId: selectedPartner?.id || 0,
      partnerCompanyName: selectedPartner?.name || '',
      reportingMonth: '',
      facilityName: '',
      usage: ''
    })
    setEditingSteamId(null)
  }

  // 편집 함수들
  const handleEditElectricity = (item: ElectricityUsage) => {
    setElectricityForm({
      partnerCompanyId: item.partnerCompanyId,
      partnerCompanyName: item.partnerCompanyName || '',
      reportingMonth: item.reportingMonth.toString(),
      facilityName: item.facilityName,
      usage: item.electricityUsage.toString(),
      isRenewable: item.isRenewable
    })
    setEditingElectricityId(item.id!)
    setShowElectricityDialog(true)
  }

  const handleEditSteam = (item: SteamUsage) => {
    setSteamForm({
      partnerCompanyId: item.partnerCompanyId,
      partnerCompanyName: item.partnerCompanyName || '',
      reportingMonth: item.reportingMonth.toString(),
      facilityName: item.facilityName,
      usage: item.steamUsage.toString()
    })
    setEditingSteamId(item.id!)
    setShowSteamDialog(true)
  }

  // 삭제 함수들
  const handleDeleteElectricity = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await deleteElectricityUsage(id)
      await fetchElectricityData()
    } catch (err) {
      console.error('삭제 실패:', err)
      setError('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteSteam = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await deleteSteamUsage(id)
      await fetchSteamData()
    } catch (err) {
      console.error('삭제 실패:', err)
      setError('삭제 중 오류가 발생했습니다.')
    }
  }

  // 요약 데이터 계산
  const totalElectricityUsage = electricityData.reduce(
    (sum, item) => sum + item.electricityUsage,
    0
  )
  const renewableElectricityUsage = electricityData
    .filter(item => item.isRenewable)
    .reduce((sum, item) => sum + item.electricityUsage, 0)
  const totalElectricityCO2 = electricityData.reduce(
    (sum, item) => sum + (item.co2Emission || 0),
    0
  )
  const totalSteamCO2 = steamData.reduce((sum, item) => sum + (item.co2Emission || 0), 0)

  // 초기 데이터 로드
  useEffect(() => {
    setLoading(false)
  }, [])

  // 협력사나 연도 변경 시 데이터 다시 로드
  useEffect(() => {
    if (selectedPartner && selectedYear) {
      const loadPartnerData = async () => {
        setLoading(true)
        try {
          await Promise.all([fetchElectricityData(), fetchSteamData()])
        } catch (e) {
          console.error('협력사 데이터 불러오기 실패:', e)
          setError('데이터를 불러오는 중 오류가 발생했습니다.')
        } finally {
          setLoading(false)
        }
      }

      loadPartnerData()
    }
  }, [selectedPartner, selectedYear])

  // 협력사 선택 핸들러
  const handlePartnerSelect = (partner: PartnerCompany | null) => {
    setSelectedPartner(partner)
    setElectricityData([])
    setSteamData([])
    setError(null)
  }

  if (loading) {
    return (
      <LoadingState
        isLoading={true}
        error={null}
        emptyMessage=""
        isEmpty={false}
        showFormWhenEmpty={false}>
        <div />
      </LoadingState>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink href="/home">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scope 2</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 페이지 헤더 */}
      <div className="flex flex-row items-center mb-6">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<Factory className="w-6 h-6 text-blue-600" />}
            title="Scope 2"
            description="간접 배출량 관리 및 모니터링"
            module="ESG"
            submodule="scope2"
          />
        </Link>
      </div>

      {/* 협력사 및 연도 선택 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            협력사 및 연도 선택
          </CardTitle>
          <CardDescription>데이터를 조회할 협력사와 연도를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>협력사</Label>
              <PartnerSelector
                selectedPartnerId={selectedPartner?.id}
                onSelect={handlePartnerSelect}
                placeholder="협력사를 선택하세요"
              />
            </div>
            <div className="space-y-2">
              <Label>연도</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={value => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 5}, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 협력사가 선택되지 않은 경우 */}
      {!selectedPartner && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              협력사를 선택하세요
            </h3>
            <p className="text-gray-500 text-center">
              Scope 2 데이터를 조회하려면 먼저 협력사를 선택해주세요.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 협력사가 선택된 경우 데이터 표시 */}
      {selectedPartner && (
        <>
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 전력 사용량</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalElectricityUsage.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">kWh</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">재생에너지</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {renewableElectricityUsage.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">kWh</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">전력 CO2 배출량</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalElectricityCO2.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">tCO2eq</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">스팀 CO2 배출량</CardTitle>
                <Factory className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSteamCO2.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">tCO2eq</p>
              </CardContent>
            </Card>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 탭 컨텐츠 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="electricity">전력 사용량</TabsTrigger>
              <TabsTrigger value="steam">스팀 사용량</TabsTrigger>
            </TabsList>

            {/* 전력 사용량 탭 */}
            <TabsContent value="electricity" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>전력 사용량 관리</CardTitle>
                      <CardDescription>시설별 전력 사용량을 관리합니다</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        resetElectricityForm()
                        setShowElectricityDialog(true)
                      }}>
                      <Plus className="mr-2 h-4 w-4" />
                      전력 사용량 추가
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>보고월</TableHead>
                        <TableHead>시설명</TableHead>
                        <TableHead>사용량 (kWh)</TableHead>
                        <TableHead>재생에너지</TableHead>
                        <TableHead>CO2 배출량 (tCO2eq)</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {electricityData.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.reportingMonth}월</TableCell>
                          <TableCell>{item.facilityName}</TableCell>
                          <TableCell>{item.electricityUsage.toLocaleString()}</TableCell>
                          <TableCell>
                            {item.isRenewable ? (
                              <Badge variant="secondary">재생에너지</Badge>
                            ) : (
                              <Badge variant="outline">일반전력</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.co2Emission?.toFixed(2) || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditElectricity(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteElectricity(item.id!)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 스팀 사용량 탭 */}
            <TabsContent value="steam" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>스팀 사용량 관리</CardTitle>
                      <CardDescription>시설별 스팀 사용량을 관리합니다</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        resetSteamForm()
                        setShowSteamDialog(true)
                      }}>
                      <Plus className="mr-2 h-4 w-4" />
                      스팀 사용량 추가
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시설명</TableHead>
                        <TableHead>보고월</TableHead>
                        <TableHead>사용량 (GJ)</TableHead>
                        <TableHead>CO2 배출량 (tCO2eq)</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {steamData.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.facilityName}</TableCell>
                          <TableCell>{`${item.reportingMonth}월`}</TableCell>
                          <TableCell>{item.steamUsage.toLocaleString()}</TableCell>
                          <TableCell>{item.co2Emission?.toFixed(2) || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSteam(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSteam(item.id!)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* 전력 사용량 대화상자 */}
      <Dialog open={showElectricityDialog} onOpenChange={setShowElectricityDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingElectricityId ? '전력 사용량 수정' : '전력 사용량 추가'}
            </DialogTitle>
            <DialogDescription>시설의 전력 사용량 정보를 입력하세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleElectricitySubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportingMonth" className="text-right">
                보고 월
              </Label>
              <MonthSelector
                selectedMonth={
                  electricityForm.reportingMonth
                    ? parseInt(electricityForm.reportingMonth)
                    : undefined
                }
                onSelect={month =>
                  setElectricityForm({
                    ...electricityForm,
                    reportingMonth: month.toString()
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facilityName" className="text-right">
                시설명
              </Label>
              <Input
                id="facilityName"
                value={electricityForm.facilityName}
                onChange={e =>
                  setElectricityForm({...electricityForm, facilityName: e.target.value})
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usage" className="text-right">
                사용량 (kWh)
              </Label>
              <Input
                id="usage"
                type="number"
                step="0.01"
                value={electricityForm.usage}
                onChange={e =>
                  setElectricityForm({...electricityForm, usage: e.target.value})
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isRenewable" className="text-right">
                재생에너지
              </Label>
              <Select
                value={electricityForm.isRenewable ? 'true' : 'false'}
                onValueChange={value =>
                  setElectricityForm({
                    ...electricityForm,
                    isRenewable: value === 'true'
                  })
                }>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">재생에너지</SelectItem>
                  <SelectItem value="false">일반전력</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">{editingElectricityId ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 스팀 사용량 대화상자 */}
      <Dialog open={showSteamDialog} onOpenChange={setShowSteamDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSteamId ? '스팀 사용량 수정' : '스팀 사용량 추가'}
            </DialogTitle>
            <DialogDescription>시설의 스팀 사용량 정보를 입력하세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSteamSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="steamReportingMonth" className="text-right">
                보고 월
              </Label>
              <MonthSelector
                selectedMonth={
                  steamForm.reportingMonth
                    ? parseInt(steamForm.reportingMonth)
                    : undefined
                }
                onSelect={month =>
                  setSteamForm({...steamForm, reportingMonth: month.toString()})
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="steamFacilityName" className="text-right">
                시설명
              </Label>
              <Input
                id="steamFacilityName"
                value={steamForm.facilityName}
                onChange={e => setSteamForm({...steamForm, facilityName: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="steamUsage" className="text-right">
                사용량 (GJ)
              </Label>
              <Input
                id="steamUsage"
                type="number"
                step="0.01"
                value={steamForm.usage}
                onChange={e => setSteamForm({...steamForm, usage: e.target.value})}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">{editingSteamId ? '수정' : '추가'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
