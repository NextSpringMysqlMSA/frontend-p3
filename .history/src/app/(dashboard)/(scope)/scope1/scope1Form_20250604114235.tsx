'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {Home, ChevronRight, Factory, ArrowLeft} from 'lucide-react'

export default function Scope1Form() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const router = useRouter()

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
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>대시보드</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>ESG 공시</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Scope</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-customG">Scope 1</span>
      </div>

      {/* PageHeader에 화살표 + 공장 아이콘 묶음 전달 */}
      <PageHeader
        icon={
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600"
              onClick={() => router.push('/home')}
            />
            <Factory className="w-6 h-6" />
          </div>
        }
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
