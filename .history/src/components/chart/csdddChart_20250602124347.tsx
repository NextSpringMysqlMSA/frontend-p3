'use client'
import {useEffect, useState} from 'react'
import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'

interface Status {
  name: string
  total: number
  completed: number
}

export default function CsdddChart({refreshTrigger = 0}: {refreshTrigger?: number}) {
  const [data, setData] = useState<Status[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const eudd = await fetchEuddResult()
        const hrdd = await fetchHrddResult()
        const edd = await fetchEddResult()

        // 실제로는 응답 데이터에서 필터하거나 길이 계산해도 됨
        setData([
          {
            name: 'EU 공급망 실사',
            total: 10,
            completed: 4 // 예: eudd.filter(x => x.answered).length
          },
          {
            name: '인권 실사',
            total: 10,
            completed: 7
          },
          {
            name: '환경 실사',
            total: 10,
            completed: 6
          }
        ])
      } catch (err) {
        console.error('자가진단 현황 로딩 실패:', err)
      }
    }

    load()
  }, [refreshTrigger])

  return (
    <div className="w-full space-y-4">
      {data.map(({name, total, completed}) => {
        const percentage = Math.round((completed / total) * 100)
        return (
          <div key={name} className="space-y-1">
            <div className="text-sm font-semibold text-gray-700">{name}</div>
            <div className="w-full h-2 rounded bg-amber-100">
              <div
                className="h-2 transition-all duration-300 rounded bg-amber-500"
                style={{width: `${percentage}%`}}
              />
            </div>
            <div className="text-xs text-gray-500">{`${percentage}% (${completed}/${total})`}</div>
          </div>
        )
      })}
    </div>
  )
}
