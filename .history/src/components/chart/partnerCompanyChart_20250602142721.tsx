// components/chart/partnerCompanyChart.tsx
'use client'
import {useEffect, useState} from 'react'
import {fetchPartnerCompanyProgress} from '@/services/dashboard'

interface PartnerCompanyProgress {
  totalCount: number
  registeredCount: number
  unregisteredCount: number
  registeredRate: number
}

export default function PartnerCompanyChart({
  refreshTrigger = 0
}: {
  refreshTrigger?: number
}) {
  const [data, setData] = useState<PartnerCompanyProgress>({
    totalCount: 0,
    registeredCount: 0,
    unregisteredCount: 0,
    registeredRate: 0
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchPartnerCompanyProgress()
        setData(res)
      } catch (err) {
        console.error('협력사 등록 현황 불러오기 실패:', err)
        setData({
          totalCount: 20,
          registeredCount: 12,
          unregisteredCount: 8,
          registeredRate: 60
        })
      }
    }

    loadData()
  }, [refreshTrigger])

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative w-48 h-48">
        <div className="absolute text-3xl font-bold text-center text-blue-600 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          {data.registeredRate}%
        </div>
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#93c5fd"
            strokeWidth="10%"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="#3b82f6"
            strokeWidth="10%"
            fill="none"
            strokeDasharray={`${data.registeredRate} ${100 - data.registeredRate}`}
            strokeDashoffset="25"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
          <span className="mr-2 text-sm">등록 완료</span>
          <span className="text-sm font-bold">
            {data.registeredCount}개 ({data.registeredRate}%)
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-blue-100 rounded-full"></div>
          <span className="mr-2 text-sm">미등록</span>
          <span className="text-sm font-bold">
            {data.unregisteredCount}개 ({100 - data.registeredRate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal text-blue-600 border border-blue-200 rounded-md shadow-sm bg-blue-50">
            총 {data.totalCount}개 협력사 중 {data.registeredRate}% 등록 완료
          </div>
        </div>
      </div>
    </div>
  )
}
