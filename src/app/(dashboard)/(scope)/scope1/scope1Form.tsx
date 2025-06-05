'use client'

import {useState, useEffect} from 'react'

import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {Home, ChevronRight, Factory, ArrowLeft} from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {DirectionButton} from '@/components/layout/direction'

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
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink href="/home">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-bold text-customG">Scope 1</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 페이지 헤더 및 뒤로가기 */}
      <div className="flex flex-row w-full h-full mb-6">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<Factory className="w-6 h-6 text-blue-600" />}
            title="Scope 1"
            description="직접 배출량 관리 및 모니터링"
            module="ESG"
            submodule="scope1"
          />
        </Link>
      </div>

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

      {/* ✅ 고정된 Scope 2 이동 버튼 */}
      <DirectionButton
        direction="right"
        tooltip="Scope 2로 이동"
        href="/scope2"
        fixed
        position="middle-right"
        size={48} // ← 16px × 3배
      />
    </div>
  )
}
