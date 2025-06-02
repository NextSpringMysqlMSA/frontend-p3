'use client'

import {useState, useEffect} from 'react'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {Factory} from 'lucide-react' // Scope 1을 표현하기 위한 Factory 아이콘 추가

export default function Scope1Form() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/scope1')
        const data = await response.json()
        setData(data)
      } catch (e) {
        console.error('데이터 불러오기 실패:', e)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      <PageHeader
        icon={<Factory className="w-6 h-6" />}
        title="Scope 1"
        description="직접 배출량 관리 및 모니터링"
        module="ESG"
        submodule="scope1"
      />
      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={data.length === 0}
        showFormWhenEmpty={true}
        emptyMessage="Scope 1 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => {
            /* 추가 작업 구현 */
          }
        }}>
        <div className="space-y-4">{/* 폼 컴포넌트들 */}</div>
      </LoadingState>
    </div>
  )
}
