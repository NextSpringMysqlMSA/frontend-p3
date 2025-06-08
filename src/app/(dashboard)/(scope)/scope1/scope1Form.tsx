'use client'

import React, {useState, useEffect} from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Badge} from '@/components/ui/badge'
import {LoadingState} from '@/components/ui/loading-state'
import {Plus, Edit, Trash2, Search} from 'lucide-react'
import {useToast} from '@/hooks/use-toast'
import {
  StationaryCombustion,
  MobileCombustion,
  PartnerCompany,
  StationaryCombustionForm,
  MobileCombustionForm
} from '@/types/scope'
import {PartnerSelector} from '@/components/scope/PartnerSelector'
import {MonthSelector} from '@/components/scope/MonthSelector'
import {
  fetchStationaryCombustionList,
  createStationaryCombustion,
  updateStationaryCombustion,
  deleteStationaryCombustion,
  fetchMobileCombustionList,
  createMobileCombustion,
  updateMobileCombustion,
  deleteMobileCombustion
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

  // 연료 타입 옵션
  const fuelTypes = [
    {id: 1, name: '경유'},
    {id: 2, name: '휘발유'},
    {id: 3, name: '천연가스'},
    {id: 4, name: '석탄'},
    {id: 5, name: 'LPG'}
  ]

  // 데이터 로드
  const loadData = async () => {
    if (!selectedPartnerId) return

    setLoading(true)
    try {
      const [stationaryResponse, mobileResponse] = await Promise.all([
        fetchStationaryCombustionList(),
        fetchMobileCombustionList()
      ])

      // 선택된 파트너와 연도에 맞는 데이터 필터링
      const filteredStationary = stationaryResponse.filter(
        item =>
          item.partnerCompanyId === selectedPartnerId &&
          item.reportingYear === selectedYear
      )
      const filteredMobile = mobileResponse.filter(
        item =>
          item.partnerCompanyId === selectedPartnerId &&
          item.reportingYear === selectedYear
      )

      setStationaryData(filteredStationary)
      setMobileData(filteredMobile)
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
  }

  // 파트너 또는 연도 변경 시 데이터 로드
  useEffect(() => {
    if (selectedPartnerId) {
      loadData()
    }
  }, [selectedPartnerId, selectedYear])

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
        createdBy: 'user' // 임시 사용자 ID
      }

      const response = await createStationaryCombustion(formData)

      await loadData() // 데이터 다시 로드
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
        createdBy: 'user' // 임시 사용자 ID
      }

      await updateStationaryCombustion(editingStationary.id, formData)

      await loadData() // 데이터 다시 로드
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
      await loadData() // 데이터 다시 로드

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
        createdBy: 'user' // 임시 사용자 ID
      }

      await createMobileCombustion(formData)

      await loadData() // 데이터 다시 로드
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
        createdBy: 'user' // 임시 사용자 ID
      }

      await updateMobileCombustion(editingMobile.id, formData)

      await loadData() // 데이터 다시 로드
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
      await loadData() // 데이터 다시 로드

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
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scope 1 배출량 관리</h1>
          <p className="text-muted-foreground">
            직접 배출량 데이터를 협력사별로 관리합니다
          </p>
        </div>
      </div>

      {/* 필터 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 협력사 선택 */}
            <div className="space-y-2">
              <Label>협력사 선택</Label>
              <PartnerSelector
                selectedPartnerId={selectedPartnerId || undefined}
                onSelect={handlePartnerSelect}
              />
            </div>

            {/* 연도 선택 */}
            <div className="space-y-2">
              <Label>보고연도</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={value => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* 메인 콘텐츠 */}
      {!selectedPartnerId ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">협력사를 선택해주세요</h3>
              <p className="text-muted-foreground">
                먼저 협력사를 선택하여 해당 협력사의 배출량 데이터를 관리하세요
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">총 배출량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalEmissions().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">tCO2eq</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">고정연소</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stationaryData
                    .reduce((sum, item) => sum + (item.totalCo2Equivalent || 0), 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">tCO2eq</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">이동연소</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mobileData
                    .reduce((sum, item) => sum + (item.totalCo2Equivalent || 0), 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">tCO2eq</p>
              </CardContent>
            </Card>
          </div>

          {/* 데이터 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>배출량 데이터</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stationary">고정연소</TabsTrigger>
                  <TabsTrigger value="mobile">이동연소</TabsTrigger>
                </TabsList>

                {/* 고정연소 탭 */}
                <TabsContent value="stationary" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">고정연소 배출량</h3>
                    <Button
                      onClick={() => {
                        resetStationaryForm()
                        setStationaryDialogOpen(true)
                      }}>
                      <Plus className="w-4 h-4 mr-2" />
                      데이터 추가
                    </Button>
                  </div>

                  {loading ? (
                    <LoadingState
                      isLoading={true}
                      error={null}
                      children={<div>데이터를 불러오는 중...</div>}
                    />
                  ) : stationaryData.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">
                        등록된 고정연소 데이터가 없습니다.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>시설명</TableHead>
                          <TableHead>연료종류</TableHead>
                          <TableHead>보고월</TableHead>
                          <TableHead>연료사용량</TableHead>
                          <TableHead>배출량 (tCO2eq)</TableHead>
                          <TableHead>작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stationaryData.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.facilityName}
                            </TableCell>
                            <TableCell>
                              {fuelTypes.find(f => f.id === item.fuelTypeId)?.name ||
                                '알 수 없음'}
                            </TableCell>
                            <TableCell>{item.reportingMonth}월</TableCell>
                            <TableCell>{item.fuelUsage?.toLocaleString()}</TableCell>
                            <TableCell>{item.totalCo2Equivalent?.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditStationary(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    item.id && handleDeleteStationary(item.id)
                                  }>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                {/* 이동연소 탭 */}
                <TabsContent value="mobile" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">이동연소 배출량</h3>
                    <Button
                      onClick={() => {
                        resetMobileForm()
                        setMobileDialogOpen(true)
                      }}>
                      <Plus className="w-4 h-4 mr-2" />
                      데이터 추가
                    </Button>
                  </div>

                  {loading ? (
                    <LoadingState
                      isLoading={true}
                      error={null}
                      children={<div>데이터를 불러오는 중...</div>}
                    />
                  ) : mobileData.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">
                        등록된 이동연소 데이터가 없습니다.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>차량종류</TableHead>
                          <TableHead>연료종류</TableHead>
                          <TableHead>보고월</TableHead>
                          <TableHead>연료사용량</TableHead>
                          <TableHead>배출량 (tCO2eq)</TableHead>
                          <TableHead>작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mobileData.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.vehicleType}
                            </TableCell>
                            <TableCell>
                              {fuelTypes.find(f => f.id === item.fuelTypeId)?.name ||
                                '알 수 없음'}
                            </TableCell>
                            <TableCell>{item.reportingMonth}월</TableCell>
                            <TableCell>{item.fuelUsage?.toLocaleString()}</TableCell>
                            <TableCell>{item.totalCo2Equivalent?.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditMobile(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => item.id && handleDeleteMobile(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 고정연소 다이얼로그 */}
      <Dialog open={stationaryDialogOpen} onOpenChange={setStationaryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStationary ? '고정연소 데이터 수정' : '고정연소 데이터 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityName">시설명</Label>
                <Input
                  id="facilityName"
                  value={stationaryForm.facilityName}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, facilityName: e.target.value})
                  }
                  placeholder="시설명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilityType">시설유형</Label>
                <Input
                  id="facilityType"
                  value={stationaryForm.facilityType}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, facilityType: e.target.value})
                  }
                  placeholder="시설유형을 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">연료종류</Label>
                <Select
                  value={stationaryForm.fuelTypeId.toString()}
                  onValueChange={value =>
                    setStationaryForm({...stationaryForm, fuelTypeId: parseInt(value)})
                  }>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="reportingMonth">보고월</Label>
                <MonthSelector
                  selectedMonth={stationaryForm.reportingMonth}
                  onSelect={(month: number) =>
                    setStationaryForm({...stationaryForm, reportingMonth: month})
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelUsage">연료사용량</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">단위</Label>
                <Input
                  id="unit"
                  value={stationaryForm.unit}
                  onChange={e =>
                    setStationaryForm({...stationaryForm, unit: e.target.value})
                  }
                  placeholder="단위를 입력하세요"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStationaryDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={
                editingStationary ? handleUpdateStationary : handleCreateStationary
              }>
              {editingStationary ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이동연소 다이얼로그 */}
      <Dialog open={mobileDialogOpen} onOpenChange={setMobileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMobile ? '이동연소 데이터 수정' : '이동연소 데이터 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">차량종류</Label>
                <Input
                  id="vehicleType"
                  value={mobileForm.vehicleType}
                  onChange={e =>
                    setMobileForm({...mobileForm, vehicleType: e.target.value})
                  }
                  placeholder="차량종류를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileFuelType">연료종류</Label>
                <Select
                  value={mobileForm.fuelTypeId.toString()}
                  onValueChange={value =>
                    setMobileForm({...mobileForm, fuelTypeId: parseInt(value)})
                  }>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="mobileReportingMonth">보고월</Label>
                <MonthSelector
                  selectedMonth={mobileForm.reportingMonth}
                  onSelect={(month: number) =>
                    setMobileForm({...mobileForm, reportingMonth: month})
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileFuelUsage">연료사용량</Label>
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileUnit">단위</Label>
              <Input
                id="mobileUnit"
                value={mobileForm.unit}
                onChange={e => setMobileForm({...mobileForm, unit: e.target.value})}
                placeholder="단위를 입력하세요"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMobileDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={editingMobile ? handleUpdateMobile : handleCreateMobile}>
              {editingMobile ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Scope1Form
