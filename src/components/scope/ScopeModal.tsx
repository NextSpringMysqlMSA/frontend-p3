'use client'

import {useState, useEffect} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
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
import {Checkbox} from '@/components/ui/checkbox'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import {
  Building2,
  Fuel,
  Zap,
  Cloud,
  Car,
  Factory,
  Plane,
  Ship,
  AlertCircle,
  Calculator,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'

import type {
  PartnerCompany,
  ScopeFormData,
  EmissionActivityType,
  StationaryCombustionType,
  MobileCombustionType,
  SteamType,
  FuelType,
  EmissionCalculationResult
} from '@/types/scope'

import {
  fetchFuelsByActivityType,
  calculateEmissions,
  submitScopeData,
  validateScopeFormData
} from '@/services/scope'
import {useToast} from '@/util/toast'

interface ScopeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ScopeFormData) => void
  partnerCompanies: PartnerCompany[]
  defaultPartnerId?: string
  defaultYear?: number
  defaultMonth?: number
  scope: 'SCOPE1' | 'SCOPE2'
}

const EMISSION_ACTIVITY_TYPES: Array<{
  value: EmissionActivityType
  label: string
  description: string
  icon: React.ReactNode
  scope: 'SCOPE1' | 'SCOPE2'
}> = [
  {
    value: 'STATIONARY_COMBUSTION',
    label: '고정연소',
    description: '보일러, 발전기 등 고정 설비에서의 연료 연소',
    icon: <Factory className="w-4 h-4" />,
    scope: 'SCOPE1'
  },
  {
    value: 'MOBILE_COMBUSTION',
    label: '이동연소',
    description: '차량, 항공기, 선박 등 이동수단에서의 연료 연소',
    icon: <Car className="w-4 h-4" />,
    scope: 'SCOPE1'
  },
  {
    value: 'ELECTRICITY',
    label: '전력 사용',
    description: '외부에서 구매한 전력 사용',
    icon: <Zap className="w-4 h-4" />,
    scope: 'SCOPE2'
  },
  {
    value: 'STEAM',
    label: '스팀 사용',
    description: '외부에서 구매한 스팀 사용',
    icon: <Cloud className="w-4 h-4" />,
    scope: 'SCOPE2'
  }
]

const STATIONARY_COMBUSTION_TYPES: Array<{
  value: StationaryCombustionType
  label: string
  description: string
}> = [
  {
    value: 'LIQUID',
    label: '액체연료',
    description: '석유계 연료 (휘발유, 경유, 중유 등)'
  },
  {
    value: 'SOLID',
    label: '고체연료',
    description: '석탄계 연료 (무연탄, 유연탄, 코크스 등)'
  },
  {value: 'GAS', label: '가스연료', description: '가스계 연료 (천연가스, LPG, LNG 등)'}
]

const MOBILE_COMBUSTION_TYPES: Array<{
  value: MobileCombustionType
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    value: 'ROAD',
    label: '도로교통',
    description: '승용차, 화물차, 버스 등',
    icon: <Car className="w-4 h-4" />
  },
  {
    value: 'AVIATION',
    label: '항공',
    description: '항공기 연료 사용',
    icon: <Plane className="w-4 h-4" />
  }
]

const STEAM_TYPES: Array<{
  value: SteamType
  label: string
  description: string
  factor: number
}> = [
  {value: 'TYPE_A', label: 'A타입', description: '일반 스팀', factor: 56.452},
  {value: 'TYPE_B', label: 'B타입', description: '고압 스팀', factor: 60.974},
  {value: 'TYPE_C', label: 'C타입', description: '초고압 스팀', factor: 59.685}
]

const MONTHS = [
  {value: 1, label: '1월'},
  {value: 2, label: '2월'},
  {value: 3, label: '3월'},
  {value: 4, label: '4월'},
  {value: 5, label: '5월'},
  {value: 6, label: '6월'},
  {value: 7, label: '7월'},
  {value: 8, label: '8월'},
  {value: 9, label: '9월'},
  {value: 10, label: '10월'},
  {value: 11, label: '11월'},
  {value: 12, label: '12월'}
]

export default function ScopeModal({
  isOpen,
  onClose,
  onSubmit,
  partnerCompanies,
  defaultPartnerId,
  defaultYear = new Date().getFullYear(),
  defaultMonth = new Date().getMonth() + 1,
  scope
}: ScopeModalProps) {
  const toast = useToast()

  // scope에 따라 활동 유형 필터링
  const filteredActivityTypes = EMISSION_ACTIVITY_TYPES.filter(
    type => type.scope === scope
  )

  const [formData, setFormData] = useState<ScopeFormData>({
    partnerCompanyId: defaultPartnerId || '',
    reportingYear: defaultYear,
    reportingMonth: defaultMonth,
    emissionActivityType: scope === 'SCOPE1' ? 'STATIONARY_COMBUSTION' : 'ELECTRICITY'
  })

  const [availableFuels, setAvailableFuels] = useState<FuelType[]>([])
  const [calculationResult, setCalculationResult] =
    useState<EmissionCalculationResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // 연료 목록 불러오기
  useEffect(() => {
    const loadFuels = async () => {
      if (!formData.emissionActivityType) return

      try {
        let subType: string | undefined

        if (
          formData.emissionActivityType === 'STATIONARY_COMBUSTION' &&
          formData.stationaryCombustion
        ) {
          subType = formData.stationaryCombustion.combustionType
        } else if (
          formData.emissionActivityType === 'MOBILE_COMBUSTION' &&
          formData.mobileCombustion
        ) {
          subType = formData.mobileCombustion.transportType
        }

        const fuels = await fetchFuelsByActivityType(
          formData.emissionActivityType,
          subType
        )
        setAvailableFuels(fuels)
      } catch (error) {
        console.error('연료 목록 불러오기 실패:', error)
        toast.error('연료 목록을 불러오는데 실패했습니다.')
      }
    }

    loadFuels()
  }, [
    formData.emissionActivityType,
    formData.stationaryCombustion?.combustionType,
    formData.mobileCombustion?.transportType
  ])

  // 배출량 계산
  const handleCalculateEmissions = async () => {
    let fuelId: string | undefined
    let usage: number | undefined

    if (
      formData.emissionActivityType === 'STATIONARY_COMBUSTION' &&
      formData.stationaryCombustion
    ) {
      fuelId = formData.stationaryCombustion.fuelId
      usage = parseFloat(formData.stationaryCombustion.fuelUsage)
    } else if (
      formData.emissionActivityType === 'MOBILE_COMBUSTION' &&
      formData.mobileCombustion
    ) {
      fuelId = formData.mobileCombustion.fuelId
      usage = parseFloat(formData.mobileCombustion.fuelUsage)
    } else if (formData.emissionActivityType === 'ELECTRICITY' && formData.electricity) {
      fuelId = 'ELECTRICITY_KWH'
      usage = parseFloat(formData.electricity.electricityUsage)
    } else if (formData.emissionActivityType === 'STEAM' && formData.steam) {
      fuelId = `STEAM_${formData.steam.steamType}`
      usage = parseFloat(formData.steam.steamUsage)
    }

    if (!fuelId || !usage || usage <= 0) {
      toast.warning('연료와 사용량을 올바르게 입력해주세요.')
      setErrors(['연료와 사용량을 올바르게 입력해주세요.'])
      return
    }

    setIsCalculating(true)
    try {
      const result = await calculateEmissions(fuelId, usage)
      setCalculationResult(result)
      setErrors([])
      toast.success('배출량이 성공적으로 계산되었습니다.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '계산 중 오류가 발생했습니다.'
      setErrors([errorMessage])
      setCalculationResult(null)
      toast.error(errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }

  // 폼 제출
  const handleSubmit = async () => {
    const validationErrors = validateScopeFormData(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      toast.warning('입력값을 확인해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await submitScopeData(formData)
      onSubmit(formData)
      onClose()
      // 성공 토스트는 submitScopeData 내부에서 이미 처리됨
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.'
      setErrors([errorMessage])
      // 에러 토스트는 submitScopeData 내부에서 이미 처리됨
    } finally {
      setIsLoading(false)
    }
  }

  // 배출활동 타입 변경
  const handleActivityTypeChange = (activityType: EmissionActivityType) => {
    setFormData({
      ...formData,
      emissionActivityType: activityType,
      stationaryCombustion: undefined,
      mobileCombustion: undefined,
      electricity: undefined,
      steam: undefined
    })
    setCalculationResult(null)
    setErrors([])
  }

  const renderBasicInfo = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">기본 정보</h3>
            <p className="text-sm font-normal text-gray-600">
              보고 기간 및 협력사 정보를 입력하세요
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="partner"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              협력사
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.partnerCompanyId}
              onValueChange={value =>
                setFormData({...formData, partnerCompanyId: value})
              }>
              <SelectTrigger className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="협력사를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {partnerCompanies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="year"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              보고연도
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.reportingYear}
              onChange={e =>
                setFormData({...formData, reportingYear: parseInt(e.target.value)})
              }
              min="2020"
              max="2030"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="month"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              보고월
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.reportingMonth.toString()}
              onValueChange={value =>
                setFormData({...formData, reportingMonth: parseInt(value)})
              }>
              <SelectTrigger className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="월을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-gray-50">
              <span className="font-medium">{scope}</span> 배출량 데이터 입력
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderActivityTypeSelector = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Factory className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">배출활동 유형 선택</h3>
            <p className="text-sm font-normal text-gray-600">
              {scope}에 해당하는 배출활동을 선택하세요
            </p>
          </div>
          <span className="ml-auto text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredActivityTypes.map(type => (
            <div
              key={type.value}
              className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                formData.emissionActivityType === type.value
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleActivityTypeChange(type.value)}>
              {/* 선택 표시 */}
              {formData.emissionActivityType === type.value && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    formData.emissionActivityType === type.value
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                  {type.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-semibold text-base ${
                        formData.emissionActivityType === type.value
                          ? 'text-gray-800'
                          : 'text-gray-800 group-hover:text-gray-800'
                      }`}>
                      {type.label}
                    </h4>
                    <Badge
                      variant={type.scope === 'SCOPE1' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        type.scope === 'SCOPE1'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                      {type.scope}
                    </Badge>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      formData.emissionActivityType === type.value
                        ? 'text-gray-600'
                        : 'text-gray-600 group-hover:text-gray-600'
                    }`}>
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderStationaryCombustionForm = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Factory className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">고정연소 정보</h3>
            <p className="text-sm font-normal text-gray-600">
              보일러, 발전기 등 고정 설비 연료 사용량을 입력하세요
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="flex items-center gap-1 mb-3 text-sm font-medium text-gray-700">
            연료 유형
            <span className="text-red-500">*</span>
          </Label>{' '}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {STATIONARY_COMBUSTION_TYPES.map(type => (
              <div
                key={type.value}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.stationaryCombustion?.combustionType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    stationaryCombustion: {
                      ...formData.stationaryCombustion!,
                      combustionType: type.value,
                      facilityName: formData.stationaryCombustion?.facilityName || '',
                      fuelId: '',
                      fuelUsage: '',
                      unit: '',
                      createdBy: 'system'
                    }
                  })
                }>
                {/* 선택 표시 */}
                {formData.stationaryCombustion?.combustionType === type.value && (
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      formData.stationaryCombustion?.combustionType === type.value
                        ? 'text-blue-800'
                        : 'text-gray-800 group-hover:text-blue-800'
                    }`}>
                    {type.label}
                  </div>
                  <div
                    className={`text-xs leading-relaxed ${
                      formData.stationaryCombustion?.combustionType === type.value
                        ? 'text-blue-600'
                        : 'text-gray-600 group-hover:text-blue-600'
                    }`}>
                    {type.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="facilityName"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              시설명
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="facilityName"
              value={formData.stationaryCombustion?.facilityName || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  stationaryCombustion: {
                    ...formData.stationaryCombustion!,
                    facilityName: e.target.value
                  }
                })
              }
              placeholder="예: 보일러 #1"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="facilityLocation"
              className="text-sm font-medium text-gray-700">
              시설 위치
            </Label>
            <Input
              id="facilityLocation"
              value={formData.stationaryCombustion?.facilityLocation || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  stationaryCombustion: {
                    ...formData.stationaryCombustion!,
                    facilityLocation: e.target.value
                  }
                })
              }
              placeholder="예: 공장 1동"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="fuel"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              연료
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.stationaryCombustion?.fuelId || ''}
              onValueChange={value => {
                const fuel = availableFuels.find(f => f.id === value)
                setFormData({
                  ...formData,
                  stationaryCombustion: {
                    ...formData.stationaryCombustion!,
                    fuelId: value,
                    unit: fuel?.unit || ''
                  }
                })
              }}>
              <SelectTrigger className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="연료를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {availableFuels.map(fuel => (
                  <SelectItem key={fuel.id} value={fuel.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{fuel.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({fuel.unit})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="usage"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              사용량
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="usage"
                type="number"
                step="0.001"
                value={formData.stationaryCombustion?.fuelUsage || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    stationaryCombustion: {
                      ...formData.stationaryCombustion!,
                      fuelUsage: e.target.value
                    }
                  })
                }
                placeholder="0.000"
                className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-md bg-gray-50 min-w-[80px]">
                {formData.stationaryCombustion?.unit || '단위'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderMobileCombustionForm = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Car className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">이동연소 정보</h3>
            <p className="text-sm font-normal text-gray-600">
              차량, 항공기 등 이동 수단의 연료 사용량을 입력하세요
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="flex items-center gap-1 mb-3 text-sm font-medium text-gray-700">
            교통수단 유형
            <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {MOBILE_COMBUSTION_TYPES.map(type => (
              <div
                key={type.value}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.mobileCombustion?.transportType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    mobileCombustion: {
                      ...formData.mobileCombustion!,
                      transportType: type.value,
                      vehicleType: formData.mobileCombustion?.vehicleType || '',
                      fuelId: '',
                      fuelUsage: '',
                      unit: '',
                      createdBy: 'system'
                    }
                  })
                }>
                {/* 선택 표시 */}
                {formData.mobileCombustion?.transportType === type.value && (
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        formData.mobileCombustion?.transportType === type.value
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                      {type.icon}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        formData.mobileCombustion?.transportType === type.value
                          ? 'text-blue-800'
                          : 'text-gray-800 group-hover:text-blue-800'
                      }`}>
                      {type.label}
                    </div>
                  </div>
                  <div
                    className={`text-xs leading-relaxed ${
                      formData.mobileCombustion?.transportType === type.value
                        ? 'text-blue-600'
                        : 'text-gray-600 group-hover:text-blue-600'
                    }`}>
                    {type.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="vehicleType"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              차량/장비명
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vehicleType"
              value={formData.mobileCombustion?.vehicleType || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  mobileCombustion: {
                    ...formData.mobileCombustion!,
                    vehicleType: e.target.value
                  }
                })
              }
              placeholder="예: 승용차, 화물차, 항공기"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm font-medium text-gray-700">
              이동거리 (km)
            </Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              value={formData.mobileCombustion?.distance || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  mobileCombustion: {
                    ...formData.mobileCombustion!,
                    distance: e.target.value
                  }
                })
              }
              placeholder="0.0"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="fuel"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              연료
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.mobileCombustion?.fuelId || ''}
              onValueChange={value => {
                const fuel = availableFuels.find(f => f.id === value)
                setFormData({
                  ...formData,
                  mobileCombustion: {
                    ...formData.mobileCombustion!,
                    fuelId: value,
                    unit: fuel?.unit || ''
                  }
                })
              }}>
              <SelectTrigger className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="연료를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {availableFuels.map(fuel => (
                  <SelectItem key={fuel.id} value={fuel.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{fuel.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({fuel.unit})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="usage"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              사용량
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="usage"
                type="number"
                step="0.001"
                value={formData.mobileCombustion?.fuelUsage || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    mobileCombustion: {
                      ...formData.mobileCombustion!,
                      fuelUsage: e.target.value
                    }
                  })
                }
                placeholder="0.000"
                className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-md bg-gray-50 min-w-[80px]">
                {formData.mobileCombustion?.unit || '단위'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderElectricityForm = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Zap className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">전력 사용량 정보</h3>
            <p className="text-sm font-normal text-gray-600">
              사업장의 전력 사용량을 입력하세요
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="facilityName"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              시설명
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="facilityName"
              value={formData.electricity?.facilityName || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  electricity: {
                    ...formData.electricity!,
                    facilityName: e.target.value
                  }
                })
              }
              placeholder="예: 본사 사무동"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="facilityLocation"
              className="text-sm font-medium text-gray-700">
              시설 위치
            </Label>
            <Input
              id="facilityLocation"
              value={formData.electricity?.facilityLocation || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  electricity: {
                    ...formData.electricity!,
                    facilityLocation: e.target.value
                  }
                })
              }
              placeholder="예: 본사 3층"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="electricityUsage"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              전력 사용량
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="electricityUsage"
                type="number"
                step="0.001"
                value={formData.electricity?.electricityUsage || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    electricity: {
                      ...formData.electricity!,
                      electricityUsage: e.target.value,
                      unit: 'kWh'
                    }
                  })
                }
                placeholder="0.000"
                className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-md bg-gray-50 min-w-[80px]">
                kWh
              </div>
            </div>
          </div>
          <div className="flex items-center pt-8 space-x-3">
            <Checkbox
              id="isRenewable"
              checked={formData.electricity?.isRenewable || false}
              onCheckedChange={(checked: boolean) =>
                setFormData({
                  ...formData,
                  electricity: {
                    ...formData.electricity!,
                    isRenewable: checked as boolean
                  }
                })
              }
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor="isRenewable"
              className="text-sm font-medium text-gray-700 cursor-pointer">
              재생에너지 전력
            </Label>
          </div>
        </div>

        {formData.electricity?.isRenewable && (
          <div className="space-y-2">
            <Label htmlFor="renewableType" className="text-sm font-medium text-gray-700">
              재생에너지 유형
            </Label>
            <Select
              value={formData.electricity?.renewableType || ''}
              onValueChange={value =>
                setFormData({
                  ...formData,
                  electricity: {
                    ...formData.electricity!,
                    renewableType: value
                  }
                })
              }>
              <SelectTrigger className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="재생에너지 유형을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar">태양광</SelectItem>
                <SelectItem value="wind">풍력</SelectItem>
                <SelectItem value="hydro">수력</SelectItem>
                <SelectItem value="biomass">바이오매스</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSteamForm = () => (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-white border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 rounded-lg bg-gray-50">
            <Cloud className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">스팀 사용량 정보</h3>
            <p className="text-sm font-normal text-gray-600">
              외부에서 구매한 스팀 사용량을 입력하세요
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <Label className="flex items-center gap-1 mb-3 text-sm font-medium text-gray-700">
            스팀 타입
            <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {STEAM_TYPES.map(type => (
              <div
                key={type.value}
                className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.steam?.steamType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    steam: {
                      ...formData.steam!,
                      steamType: type.value,
                      facilityName: formData.steam?.facilityName || '',
                      steamUsage: '',
                      unit: 'GJ',
                      createdBy: 'system'
                    }
                  })
                }>
                {/* 선택 표시 */}
                {formData.steam?.steamType === type.value && (
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      formData.steam?.steamType === type.value
                        ? 'text-blue-800'
                        : 'text-gray-800 group-hover:text-blue-800'
                    }`}>
                    {type.label}
                  </div>
                  <div
                    className={`text-xs leading-relaxed mb-2 ${
                      formData.steam?.steamType === type.value
                        ? 'text-blue-600'
                        : 'text-gray-600 group-hover:text-blue-600'
                    }`}>
                    {type.description}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      formData.steam?.steamType === type.value
                        ? 'text-blue-700'
                        : 'text-gray-700 group-hover:text-blue-700'
                    }`}>
                    {type.factor} tCO₂/GJ
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="facilityName"
              className="flex items-center gap-1 text-sm font-medium text-gray-700">
              시설명
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="facilityName"
              value={formData.steam?.facilityName || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  steam: {
                    ...formData.steam!,
                    facilityName: e.target.value
                  }
                })
              }
              placeholder="예: 스팀 보일러"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="facilityLocation"
              className="text-sm font-medium text-gray-700">
              시설 위치
            </Label>
            <Input
              id="facilityLocation"
              value={formData.steam?.facilityLocation || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  steam: {
                    ...formData.steam!,
                    facilityLocation: e.target.value
                  }
                })
              }
              placeholder="예: 공장 지하 1층"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="steamUsage"
            className="flex items-center gap-1 text-sm font-medium text-gray-700">
            스팀 사용량
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="steamUsage"
              type="number"
              step="0.001"
              value={formData.steam?.steamUsage || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  steam: {
                    ...formData.steam!,
                    steamUsage: e.target.value
                  }
                })
              }
              placeholder="0.000"
              className="border-gray-300 h-11 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-md bg-gray-50 min-w-[80px]">
              GJ
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCalculationResult = () => {
    if (!calculationResult) return null

    return (
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-blue-500 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">배출량 계산 결과</h3>
              <p className="text-sm font-normal text-gray-600">
                입력된 데이터를 기반으로 계산된 CO₂ 배출량입니다
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* 총 배출량 - 메인 결과 */}
            <div className="p-6 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">총 CO₂ 배출량</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-blue-700">
                      {calculationResult.totalCo2Equivalent.toFixed(3)}
                    </span>
                    <span className="text-lg text-blue-600">tCO₂eq</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                    <Calculator className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 배출량 (가스별) */}
            {calculationResult.ch4Emission && calculationResult.n2oEmission && (
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h4 className="mb-4 text-base font-semibold text-gray-800">
                  가스별 배출량 상세
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 text-center border border-red-100 rounded-lg bg-red-50">
                    <div className="mb-1 text-sm font-medium text-red-600">CO₂</div>
                    <div className="text-lg font-bold text-red-700">
                      {calculationResult.co2Emission.toFixed(3)}
                    </div>
                    <div className="text-xs text-red-500">tCO₂</div>
                  </div>
                  <div className="p-4 text-center border border-blue-100 rounded-lg bg-blue-50">
                    <div className="mb-1 text-sm font-medium text-blue-600">CH₄</div>
                    <div className="text-lg font-bold text-blue-700">
                      {calculationResult.ch4Emission.toFixed(6)}
                    </div>
                    <div className="text-xs text-blue-500">tCH₄</div>
                  </div>
                  <div className="p-4 text-center border border-purple-100 rounded-lg bg-purple-50">
                    <div className="mb-1 text-sm font-medium text-purple-600">N₂O</div>
                    <div className="text-lg font-bold text-purple-700">
                      {calculationResult.n2oEmission.toFixed(6)}
                    </div>
                    <div className="text-xs text-purple-500">tN₂O</div>
                  </div>
                </div>
              </div>
            )}

            {/* 계산식 */}
            {calculationResult.calculationFormula && (
              <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Calculator className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      계산 공식
                    </div>
                    <div className="p-3 overflow-x-auto font-mono text-sm text-gray-600 bg-white border border-gray-200 rounded">
                      {calculationResult.calculationFormula}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({
        partnerCompanyId: defaultPartnerId || '',
        reportingYear: defaultYear,
        reportingMonth: defaultMonth,
        emissionActivityType: 'STATIONARY_COMBUSTION'
      })
      setCalculationResult(null)
      setErrors([])
    }
  }, [isOpen, defaultPartnerId, defaultYear, defaultMonth])

  // 배출활동별 기본 데이터 설정
  useEffect(() => {
    if (!formData.emissionActivityType) return

    const commonData = {
      partnerCompanyId: formData.partnerCompanyId,
      reportingYear: formData.reportingYear,
      reportingMonth: formData.reportingMonth,
      createdBy: 'system'
    }

    switch (formData.emissionActivityType) {
      case 'STATIONARY_COMBUSTION':
        if (!formData.stationaryCombustion) {
          setFormData({
            ...formData,
            stationaryCombustion: {
              ...commonData,
              facilityName: '',
              combustionType: 'LIQUID',
              fuelId: '',
              fuelUsage: '',
              unit: ''
            }
          })
        }
        break
      case 'MOBILE_COMBUSTION':
        if (!formData.mobileCombustion) {
          setFormData({
            ...formData,
            mobileCombustion: {
              ...commonData,
              vehicleType: '',
              transportType: 'ROAD',
              fuelId: '',
              fuelUsage: '',
              unit: ''
            }
          })
        }
        break
      case 'ELECTRICITY':
        if (!formData.electricity) {
          setFormData({
            ...formData,
            electricity: {
              ...commonData,
              facilityName: '',
              electricityUsage: '',
              unit: 'kWh',
              isRenewable: false
            }
          })
        }
        break
      case 'STEAM':
        if (!formData.steam) {
          setFormData({
            ...formData,
            steam: {
              ...commonData,
              facilityName: '',
              steamType: 'TYPE_A',
              steamUsage: '',
              unit: 'GJ'
            }
          })
        }
        break
    }
  }, [formData.emissionActivityType])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Cloud className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1>{scope} 배출량 데이터 입력</h1>
              <p className="mt-1 text-sm font-normal text-gray-600">
                온실가스 배출량 데이터를 정확히 입력해주세요
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-8">
          {/* 오류 메시지 */}
          {errors.length > 0 && (
            <Alert className="border-red-200 shadow-sm bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="mb-2 font-medium">다음 항목을 확인해주세요:</div>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 기본 정보 */}
          {renderBasicInfo()}

          {/* 배출활동 타입 선택 */}
          {renderActivityTypeSelector()}

          {/* 배출활동별 상세 폼 */}
          {formData.emissionActivityType === 'STATIONARY_COMBUSTION' &&
            renderStationaryCombustionForm()}
          {formData.emissionActivityType === 'MOBILE_COMBUSTION' &&
            renderMobileCombustionForm()}
          {formData.emissionActivityType === 'ELECTRICITY' && renderElectricityForm()}
          {formData.emissionActivityType === 'STEAM' && renderSteamForm()}

          {/* 계산 결과 */}
          {renderCalculationResult()}
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-6 border-t border-gray-100 sm:flex-row">
          <div className="flex flex-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCalculateEmissions}
              disabled={isCalculating}
              className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400">
              <Calculator className="w-4 h-4" />
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  계산 중...
                </>
              ) : (
                '배출량 계산 미리 보기'
              )}
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-700 border-gray-300 hover:bg-gray-50">
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="text-white bg-blue-600 shadow-sm hover:bg-blue-700">
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export {ScopeModal}
