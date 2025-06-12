'use client'

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Checkbox} from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {Zap} from 'lucide-react'
import type {ScopeFormData} from '@/types/scopeType'

interface ElectricityFormProps {
  /** 현재 폼 데이터 */
  formData: ScopeFormData
  /** 폼 데이터 업데이트 핸들러 */
  setFormData: (data: ScopeFormData) => void
}

/**
 * 전력사용 데이터 입력 폼 컴포넌트 (Scope 2)
 *
 * 주요 기능:
 * - 시설명, 시설 위치 입력
 * - 전력 사용량 입력 (kWh 단위 고정)
 * - 재생에너지 여부 선택
 * - 재생에너지 유형 선택 (재생에너지인 경우)
 * - 실시간 유효성 검사 및 시각적 피드백
 */
export default function ElectricityForm({formData, setFormData}: ElectricityFormProps) {
  /**
   * 재생에너지 여부 변경 핸들러
   * 재생에너지가 아닌 경우 재생에너지 유형 초기화
   */
  const handleRenewableChange = (checked: boolean) => {
    setFormData({
      ...formData,
      electricity: {
        ...formData.electricity!,
        isRenewable: checked,
        renewableType: checked ? formData.electricity?.renewableType || '' : ''
      }
    })
  }

  return (
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
        {/* 시설 정보 입력 */}
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

        {/* 전력 사용량 및 재생에너지 여부 */}
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
                      unit: 'kWh' // 전력은 항상 kWh 단위
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

          {/* 재생에너지 여부 체크박스 */}
          <div className="flex items-center pt-8 space-x-3">
            <Checkbox
              id="isRenewable"
              checked={formData.electricity?.isRenewable || false}
              onCheckedChange={handleRenewableChange}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor="isRenewable"
              className="text-sm font-medium text-gray-700 cursor-pointer">
              재생에너지 전력
            </Label>
          </div>
        </div>

        {/* 재생에너지 유형 선택 (재생에너지인 경우에만 표시) */}
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
}
