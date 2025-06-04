'use client'
import {useEffect, useState} from 'react'
import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'

interface Status {
  name: string
  total: number
  completed: number
}

export default function CsdddStatusCard() {
  const [data, setData] = useState<Status[]>([])

  useEffect(() => {
    const load = async () => {
      const eudd = await fetchEuddResult()
      const hrdd = await fetchHrddResult()
      const edd = await fetchEddResult()

      setData([
        {
          name: 'EU 공급망 실사',
          total: 10,
          completed: 4 // eudd.length 또는 filter로 계산 가능
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
    }
    load()
  }, [])

  return (
    <div className="w-full space-y-4">
      {data.map(({name, total, completed}) => {
        const percentage = Math.round((completed / total) * 100)
        return (
          <div key={name} className="space-y-1">
            <div className="text-sm font-semibold text-gray-700">{name}</div>
            <div className="w-full h-2 rounded bg-amber-100">
              <div
                className="h-2 rounded bg-amber-500"
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
