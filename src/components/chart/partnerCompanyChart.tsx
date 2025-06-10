'use client'

import {useEffect, useState} from 'react'
import {Skeleton} from '@/components/ui/skeleton'
import {fetchPartnerCompanyProgress} from '@/services/dashboard'
import {Building2, Calendar} from 'lucide-react'

import {ScrollArea} from '@/components/ui/scroll-area'
import {Badge} from '@/components/ui/badge'

interface PartnerCompany {
  id: string
  name: string
  registeredAt: string
}

export default function PartnerCompanyChart({refreshTrigger}: {refreshTrigger: number}) {
  const [data, setData] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const responseData = await fetchPartnerCompanyProgress()

        // 응답 데이터 가공 (백엔드 응답: corp_name, contract_start_date)
        const mapped: PartnerCompany[] = responseData.data.map((item: any) => ({
          id: item.id,
          name: item.corp_name,
          registeredAt: item.contract_start_date
        }))

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

  return loading ? (
    <div className="p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <ScrollArea className="h-[300px] w-full rounded-md border border-gray-100">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">등록된 협력사 목록</h3>
          <Badge variant="outline" className="text-xs">
            총 {data.length}개사
          </Badge>
        </div>
        <div className="space-y-4">
          {data.map(company => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 transition-all bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <Building2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{company.name}</h4>
                  <div className="flex items-center mt-1 space-x-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {company.registeredAt ? (
                        new Date(company.registeredAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      ) : (
                        <span className="text-gray-400">미등록</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant={company.registeredAt ? 'default' : 'secondary'}
                className="text-xs">
                {company.registeredAt ? '등록 완료' : '진행중'}
              </Badge>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-gray-500">등록된 협력사가 없습니다.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
