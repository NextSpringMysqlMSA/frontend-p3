'use client'

import {useState, useEffect} from 'react'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {Home, ChevronRight, Factory} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'

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
      {/* ✅ 브레드크럼 */}
      <Breadcrumb className="mt-6 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/home"
              className="flex items-center gap-1 text-gray-500 hover:text-customG">
              <Home className="w-4 h-4" />
              <span>대시보드</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-4 h-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-customG">Scope 1</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ✅ 페이지 헤더 */}
      <PageHeader
        icon={<Factory className="w-6 h-6" />}
        title="Scope 1"
        description="직접 배출량 관리 및 모니터링"
        module="ESG"
        submodule="scope1"
      />

      {/* ✅ 콘텐츠 영역 */}
      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={data.length === 0}
        showFormWhenEmpty={true}
        emptyMessage="Scope 1 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => {
            // TODO: Scope 1 항목 추가 핸들러
          }
        }}>
        <div className="space-y-4">{/* Scope 1 관련 폼들 또는 테이블 등 삽입 */}</div>
      </LoadingState>
    </div>
  )
}
