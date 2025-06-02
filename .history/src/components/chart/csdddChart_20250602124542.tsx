'use client'
import {useEffect, useState} from 'react'
import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'

interface Status {
  name: string
  total: number
  completed: number
}

interface CsdddChartProps {
  refreshTrigger?: number
}

export default function CsdddChart({refreshTrigger = 0}: CsdddChartProps) {
  const [data, setData] = useState<Status[]>([])

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
            total: 10,
            completed: eudd.length // 실제 계산 가능
          },
          {
            name: '인권 실사',
            total: 10,
            completed: hrdd.length
          },
          {
            name: '환경 실사',
            total: 10,
            completed: edd.length
          }
        ])
      } catch (err) {
        console.error('CSDDD 진행 정보 불러오기 실패:', err)
        // 더미 데이터 fallback
        setData([
          {name: 'EU 공급망 실사', total: 10, completed: 4},
          {name: '인권 실사', total: 10, completed: 7},
          {name: '환경 실사', total: 10, completed: 6}
        ])
      }
    }

    load()
  }, [refreshTrigger])

  return (
    <div className="w-full space-y-4">
      {data.map(({name, total, completed}) => {
        const percent = Math.round((completed / total) * 100) || 0
        return (
          <div key={name} className="space-y-1">
            <div className="text-sm font-semibold text-gray-700">{name}</div>
            <div className="w-full h-2 rounded bg-amber-100">
              <div
                className="h-2 transition-all duration-300 rounded bg-amber-500"
                style={{width: `${percent}%`}}
              />
            </div>
            <div className="text-xs text-gray-500">{`${percent}% (${completed}/${total})`}</div>
          </div>
        )
      })}
    </div>
  )
}
