'use client'
import {useEffect, useState} from 'react'
import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'

interface ViolationStatus {
  name: string
  total: number
  violations: number
}

interface CsdddChartProps {
  refreshTrigger?: number
}

export default function CsdddChart({refreshTrigger = 0}: CsdddChartProps) {
  const [data, setData] = useState<ViolationStatus[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [eudd, hrdd, edd] = await Promise.all([
          fetchEuddResult(),
          fetchHrddResult(),
          fetchEddResult()
        ])

        setData([
          {
            name: 'EU 공급망 실사',
            total: 50,
            violations: Array.isArray(eudd) ? eudd.length : 0
          },
          {
            name: '인권 실사',
            total: 55,
            violations: Array.isArray(hrdd) ? hrdd.length : 0
          },
          {
            name: '환경 실사',
            total: 33,
            violations: Array.isArray(edd) ? edd.length : 0
          }
        ])
      } catch (err) {
        console.error('CSDDD 위반 항목 불러오기 실패:', err)
        // fallback 더미
        setData([
          {name: 'EU 공급망 실사', total: 50, violations: 8},
          {name: '인권 실사', total: 55, violations: 12},
          {name: '환경 실사', total: 33, violations: 5}
        ])
      }
    }

    load()
  }, [refreshTrigger])

  return (
    <div className="w-full space-y-4">
      {data.map(({name, total, violations}) => {
        const percent =
          total > 0 && violations >= 0 ? Math.round((violations / total) * 100) : 0
        return (
          <div key={name} className="space-y-1">
            <div className="text-sm font-semibold text-amber-800">{name}</div>
            <div className="w-full h-2 rounded bg-amber-100">
              <div
                className="h-2 transition-all duration-300 rounded bg-amber-500"
                style={{width: `${percent}%`}}
              />
            </div>
            <div className="text-xs text-right text-amber-700">
              {violations}건 위반 (총 {total}문항 중 {percent}%)
            </div>
          </div>
        )
      })}
    </div>
  )
}
