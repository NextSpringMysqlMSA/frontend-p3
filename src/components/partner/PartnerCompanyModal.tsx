'use client'

import React from 'react'
import {Building2, Search, Loader2, AlertTriangle, Plus, Check} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

import {DartCorpInfo} from '@/types/IFRS/partnerCompany'

interface AddPartnerModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean
  /** 모달 닫기 함수 */
  onClose: () => void
  /** 파트너사 저장 함수 */
  onSubmit: () => Promise<void>

  /** 로딩 상태들 */
  isLoading: boolean
  isSubmitting: boolean

  /** 검색 관련 */
  companySearchQuery: string
  onCompanySearchQueryChange: (value: string) => void
  dartSearchResults: DartCorpInfo[]
  selectedDartCompany: DartCorpInfo | null
  onSelectDartCompany: (company: DartCorpInfo) => void

  /** 에러 메시지 */
  dialogError: string | null
}

export function PartnerCompanyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  isSubmitting,
  companySearchQuery,
  onCompanySearchQueryChange,
  dartSearchResults,
  selectedDartCompany,
  onSelectDartCompany,
  dialogError
}: AddPartnerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-white border-0 shadow-2xl sm:max-w-2xl rounded-2xl">
        <DialogHeader className="pb-6 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <div className="p-2 rounded-lg bg-gradient-to-br from-customG to-emerald-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            새 파트너사 등록
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="companySearch"
              className="flex items-center gap-2 text-base font-semibold text-slate-700">
              <Search className="w-4 h-4" />
              회사 검색 (DART 데이터베이스)
            </Label>
            <div className="relative">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
              <Input
                id="companySearch"
                placeholder="검색할 회사명을 입력하세요"
                value={companySearchQuery || ''}
                onChange={e => onCompanySearchQueryChange(e.target.value)}
                className="h-12 pl-12 text-base transition-all duration-200 border-2 bg-slate-50 border-slate-200 rounded-xl focus:border-customG focus:ring-customG/20"
                disabled={isSubmitting}
              />
              {isLoading && companySearchQuery && (
                <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-customG" />
                </div>
              )}
            </div>

            {dartSearchResults.length > 0 && (
              <div className="mt-4 overflow-hidden bg-white border-2 shadow-sm border-slate-200 rounded-xl">
                <div className="overflow-y-auto max-h-64">
                  {dartSearchResults.map((company, index) => (
                    <button
                      key={`dart-${company.corpCode || company.corp_code}-${index}`}
                      type="button"
                      className={`w-full p-4 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-left transition-all duration-200 border-b border-slate-100 last:border-b-0 ${
                        (selectedDartCompany?.corpCode ||
                          selectedDartCompany?.corp_code) ===
                        (company.corpCode || company.corp_code)
                          ? 'bg-customG/5 border-l-4 border-l-customG'
                          : ''
                      }`}
                      onClick={() => onSelectDartCompany(company)}
                      disabled={isSubmitting}>
                      <div className="flex-1">
                        <p className="mb-1 text-base font-semibold text-slate-800">
                          {company.corpName || company.corp_name}
                        </p>
                        <p className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="px-2 py-1 font-mono rounded-md bg-slate-100">
                            DART: {company.corpCode || company.corp_code}
                          </span>
                          {(company.stockCode || company.stock_code) &&
                            String(company.stockCode || company.stock_code).trim() && (
                              <span className="px-2 py-1 font-mono rounded-md bg-emerald-100 text-emerald-700">
                                주식: {company.stockCode || company.stock_code}
                              </span>
                            )}
                        </p>
                      </div>
                      {(selectedDartCompany?.corpCode ||
                        selectedDartCompany?.corp_code) ===
                        (company.corpCode || company.corp_code) && (
                        <div className="p-2 ml-4 rounded-full bg-customG">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {dialogError &&
              dartSearchResults.length === 0 &&
              companySearchQuery &&
              !isLoading && (
                <div className="flex items-center gap-3 p-4 mt-4 border border-red-200 bg-red-50 rounded-xl">
                  <AlertTriangle className="flex-shrink-0 w-5 h-5 text-red-500" />
                  <p className="text-sm font-medium text-red-700">{dialogError}</p>
                </div>
              )}
          </div>

          {/* 회사 선택 안내 메시지 */}
          {!selectedDartCompany && companySearchQuery && dartSearchResults.length > 0 && (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl">
              <p className="text-sm font-medium text-blue-700">
                위 목록에서 등록할 파트너사를 선택해주세요.
              </p>
            </div>
          )}

          {selectedDartCompany && (
            <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
              <h4 className="mb-2 text-sm font-semibold text-green-700">
                선택된 파트너사
              </h4>
              <p className="font-semibold text-green-800">
                {selectedDartCompany.corpName || selectedDartCompany.corp_name}
              </p>
              <p className="text-sm text-green-600">
                DART: {selectedDartCompany.corpCode || selectedDartCompany.corp_code}
                {(selectedDartCompany.stockCode || selectedDartCompany.stock_code) &&
                  ` | 주식코드: ${
                    selectedDartCompany.stockCode || selectedDartCompany.stock_code
                  }`}
              </p>
            </div>
          )}

          {dialogError && !companySearchQuery && (
            <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-xl">
              <AlertTriangle className="flex-shrink-0 w-5 h-5 text-red-500" />
              <p className="text-sm font-medium text-red-700">{dialogError}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6 border-t border-slate-100">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 transition-all duration-200 border-2 rounded-lg h-11 border-slate-200 hover:border-slate-300">
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !selectedDartCompany}
            className="px-8 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg h-11 bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:transform-none">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 처리 중...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                파트너사 등록
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
