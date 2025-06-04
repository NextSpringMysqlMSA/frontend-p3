'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {Home, ChevronRight, Factory, ArrowLeft} from 'lucide-react'
import Link from 'next/link'

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

      {/* ← PageHeader 왼쪽에 위치한 뒤로가기 아이콘 */}
      {/* <div
        onClick={() => router.push('/home')}
        className="flex items-center gap-2 p-2 mb-2 transition rounded-md cursor-pointer hover:bg-gray-200 w-fit"> */}
      <Link
        href="/home"
        className="flex flex-row items-center w-full gap-2 p-2 mb-2 transition rounded-md cursor-pointer hover:bg-gray-200">
        <div className="mt-4">
          <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
        </div>

        <PageHeader
          icon={<Factory className="w-6 h-6 text-blue-600" />}
          title="Scope 1"
          description="직접 배출량 관리 및 모니터링"
          module="ESG"
          submodule="scope1"
        />
      </Link>
      {/* </div> */}

      {/* 데이터 로딩 및 표시 */}
      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={data.length === 0}
        showFormWhenEmpty={true}
        emptyMessage="Scope 1 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => {
            // TODO: 데이터 추가 로직
          }
        }}>
        <div className="space-y-4">{/* 폼 컴포넌트들 */}</div>
      </LoadingState>
    </div>
  )
}
