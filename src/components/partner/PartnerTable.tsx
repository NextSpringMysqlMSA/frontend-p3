/**
 * 파트너사 테이블 컴포넌트
 */

import React from 'react'
import {MoreHorizontal, Edit3, Trash} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {PartnerCompany} from '@/types/IFRS/partnerCompany'

interface PartnerTableProps {
  partners: PartnerCompany[]
  onEditPartner: (partner: PartnerCompany) => void
  onDeletePartner: (partner: PartnerCompany) => void
}

export function PartnerTable({
  partners,
  onEditPartner,
  onDeletePartner
}: PartnerTableProps) {
  return (
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
                      onClick={() => onEditPartner(partner)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-slate-50">
                      <Edit3 className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-700">정보 수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeletePartner(partner)}
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
  )
}
