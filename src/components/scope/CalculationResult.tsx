'use client'

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {CheckCircle2, Calculator} from 'lucide-react'
import type {EmissionCalculationResult} from '@/types/scopeType'

interface CalculationResultProps {
  /** 계산 결과 데이터 */
  calculationResult: EmissionCalculationResult
}

/**
 * 배출량 계산 결과 표시 컴포넌트
 *
 * 주요 기능:
 * - 총 CO₂ 배출량 표시 (메인 결과)
 * - 가스별 상세 배출량 표시 (CH₄, N₂O 등)
 * - 계산식 표시 (사용된 계산 공식)
 * - 시각적으로 구분된 카드 UI 제공
 * - 수치 포맷팅 및 단위 표시
 */
export default function CalculationResult({calculationResult}: CalculationResultProps) {
  /**
   * 숫자를 천 단위 콤마와 함께 포맷팅
   */
  const formatNumber = (value: number): string => {
    return value.toLocaleString('ko-KR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    })
  }

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
                  <span className="text-3xl font-bold text-blue-900">
                    {formatNumber(calculationResult.totalCo2Equivalent)}
                  </span>
                  <span className="text-lg font-medium text-blue-700">tCO₂eq</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* 상세 배출량 (가스별) - CH₄, N₂O 배출량이 있는 경우에만 표시 */}
          {(calculationResult.ch4Emission || calculationResult.n2oEmission) && (
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h4 className="mb-4 text-base font-semibold text-gray-800">
                가스별 배출량 상세
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {/* CO₂ 배출량 */}
                <div className="text-center">
                  <div className="mb-1 text-sm text-gray-600">CO₂</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(calculationResult.co2Emission || 0)}
                  </div>
                  <div className="text-xs text-gray-500">tCO₂</div>
                </div>

                {/* CH₄ 배출량 */}
                {calculationResult.ch4Emission && (
                  <div className="text-center">
                    <div className="mb-1 text-sm text-gray-600">CH₄</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(calculationResult.ch4Emission)}
                    </div>
                    <div className="text-xs text-gray-500">tCO₂eq</div>
                  </div>
                )}

                {/* N₂O 배출량 */}
                {calculationResult.n2oEmission && (
                  <div className="text-center">
                    <div className="mb-1 text-sm text-gray-600">N₂O</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(calculationResult.n2oEmission)}
                    </div>
                    <div className="text-xs text-gray-500">tCO₂eq</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 계산식 표시 */}
          {calculationResult.calculationFormula && (
            <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 mt-0.5">
                  <Calculator className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm font-medium text-gray-700">계산식</div>
                  <div className="p-2 font-mono text-sm text-gray-600 bg-white border rounded">
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
