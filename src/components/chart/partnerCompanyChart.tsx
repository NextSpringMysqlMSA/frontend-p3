'use client'

import {useEffect, useState} from 'react'
import {Skeleton} from '@/components/ui/skeleton'
import {fetchPartnerCompaniesForScope} from '@/services/partnerCompany'
import {Building2, Calendar, ArrowUpRight, Search} from 'lucide-react'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'
import {useRouter} from 'next/navigation'

interface PartnerCompany {
  id: string
  name: string
  registeredAt: string
  corpCode: string
  stockCode: string
  status: string
}

export default function PartnerCompanyChart({refreshTrigger}: {refreshTrigger: number}) {
  const router = useRouter()
  const [data, setData] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // fetchPartnerCompanyProgress 대신 fetchPartnerCompaniesForScope 사용
        const response = await fetchPartnerCompaniesForScope(1, 100, '', false)

        // 응답 데이터 매핑
        const mapped: PartnerCompany[] = (response.data || response.content || []).map(
          item => ({
            id: item.id ?? '',
            name: item.corpName || item.corp_name || '',
            registeredAt: String(
              item.contractStartDate || item.contract_start_date || ''
            ),
            corpCode: item.corpCode || item.corp_code || '',
            stockCode: item.stockCode || item.stock_code || '',
            status: item.status || 'ACTIVE'
          })
        )

        // 등록일 기준 정렬 (최신순)
        const sorted = mapped.sort((a, b) => {
          if (!a.registeredAt) return 1
          if (!b.registeredAt) return -1
          return b.registeredAt.localeCompare(a.registeredAt)
        })

        setData(sorted)
      } catch (err) {
        console.error('협력사 데이터 로딩 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshTrigger])

  const filteredData = data.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCompanyClick = (
    e: React.MouseEvent,
    corpCode: string,
    companyName: string
  ) => {
    e.preventDefault()
    router.push(
      `/financialRisk?companyId=${corpCode}&companyName=${encodeURIComponent(
        companyName
      )}`
    )
  }

  // 상장 여부 확인 함수 추가
  const isListed = (stockCode: string | null | undefined) => {
    return stockCode && stockCode.trim() !== ''
  }

  return loading ? (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">등록된 협력사 목록</h3>
          <p className="mt-1 text-sm text-gray-500">전체 {data.length}개 협력사</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Skeleton className="w-full h-9" />
        </div>
      </div>
      <ScrollArea className="flex-1 border border-gray-100 rounded-md">
        <div className="p-4 space-y-3 min-h-[400px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[250px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <Skeleton className="w-20 h-6" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ) : (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">등록된 협력사 목록</h3>
          <p className="mt-1 text-sm text-gray-500">전체 {data.length}개 협력사</p>
        </div>
        <div className="relative w-52" onClick={e => e.preventDefault()}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="협력사 검색..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={e => {
              e.preventDefault()
              setSearchTerm(e.target.value)
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 border border-gray-200 rounded-t-lg">
        <div className="h-full p-4 space-y-3">
          {filteredData.map(company => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 py-4 transition-all duration-200 bg-white border border-gray-100 rounded-lg cursor-pointer group hover:bg-gray-50 hover:border-gray-200"
              onClick={e => handleCompanyClick(e, company.corpCode, company.name)}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-green-50 group-hover:bg-green-100">
                  <Building2 className="w-5 h-5 text-customG" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{company.name}</h4>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center mt-1 space-x-3">
                    {/* DART 코드 */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-gray-500">DART:</span>
                      <span className="font-mono text-xs text-customG">
                        {company.corpCode}
                      </span>
                    </div>
                    <span className="text-gray-300">|</span>
                    {/* 종목코드 - 없을 경우 '-' 표시 */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-gray-500">종목코드:</span>
                      <span className="font-mono text-xs text-customG">
                        {company.stockCode ? company.stockCode : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">계약일:</span>
                      <span className="text-xs text-gray-900">
                        {company.registeredAt
                          ? new Date(company.registeredAt).toLocaleDateString('ko-KR')
                          : '미등록'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs px-2 py-0.5',
                  isListed(company.stockCode)
                    ? 'bg-green-50 text-customG border-green-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                )}>
                {isListed(company.stockCode) ? '상장기업' : '비상장기업'}
              </Badge>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Search className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">
                {searchTerm ? '검색 결과가 없습니다' : '등록된 협력사가 없습니다'}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {searchTerm && '다른 검색어를 시도해보세요'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
