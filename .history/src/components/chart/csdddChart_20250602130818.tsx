// 'use client'
// import {useEffect, useState} from 'react'
// import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'

// interface ViolationStatus {
//   name: string
//   total: number
//   violations: number
// }

// interface CsdddChartProps {
//   refreshTrigger?: number
// }

// export default function CsdddChart({refreshTrigger = 0}: CsdddChartProps) {
//   const [data, setData] = useState<ViolationStatus[]>([])

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [eudd, hrdd, edd] = await Promise.all([
//           fetchEuddResult(),
//           fetchHrddResult(),
//           fetchEddResult()
//         ])

//         setData([
//           {
//             name: 'EU 공급망 실사',
//             total: 50,
//             violations: Array.isArray(eudd) ? eudd.length : 0
//           },
//           {
//             name: '인권 실사',
//             total: 55,
//             violations: Array.isArray(hrdd) ? hrdd.length : 0
//           },
//           {
//             name: '환경 실사',
//             total: 33,
//             violations: Array.isArray(edd) ? edd.length : 0
//           }
//         ])
//       } catch (err) {
//         console.error('CSDDD 위반 항목 불러오기 실패:', err)
//         // fallback 더미
//         setData([
//           {name: 'EU 공급망 실사', total: 50, violations: 8},
//           {name: '인권 실사', total: 55, violations: 12},
//           {name: '환경 실사', total: 33, violations: 5}
//         ])
//       }
//     }

//     load()
//   }, [refreshTrigger])

//   return (
//     <div className="w-full space-y-4">
//       {data.map(({name, total, violations}) => {
//         const percent =
//           total > 0 && violations >= 0 ? Math.round((violations / total) * 100) : 0
//         return (
//           <div key={name} className="space-y-1">
//             <div className="text-sm font-semibold text-amber-800">{name}</div>
//             <div className="w-full h-2 rounded bg-amber-100">
//               <div
//                 className="h-2 transition-all duration-300 rounded bg-amber-500"
//                 style={{width: `${percent}%`}}
//               />
//             </div>
//             <div className="text-xs text-right text-amber-700">
//               {violations}건 위반 (총 {total}문항 중 {percent}%)
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
'use client'
import {useEffect, useState} from 'react'
import {fetchEuddResult, fetchHrddResult, fetchEddResult} from '@/services/csddd'
import {CheckCircle, XCircle} from 'lucide-react'

interface Status {
  name: string
  isCompleted: boolean
}

export default function CsdddChart({refreshTrigger = 0}: {refreshTrigger?: number}) {
  const [data, setData] = useState<Status[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [eudd, hrdd, edd] = await Promise.all([
          fetchEuddResult(),
          fetchHrddResult(),
          fetchEddResult()
        ])

        // 진단 완료 여부: length > 0 으로 간주
        setData([
          {
            name: 'EU 공급망 실사',
            isCompleted: Array.isArray(eudd) && eudd.length >= 0 // ❗ 서버 구현에 따라 0도 완료로 볼 수 있음
          },
          {
            name: '인권 실사',
            isCompleted: Array.isArray(hrdd) && hrdd.length >= 0
          },
          {
            name: '환경 실사',
            isCompleted: Array.isArray(edd) && edd.length >= 0
          }
        ])
      } catch (err) {
        console.error('자가진단 상태 로딩 실패:', err)
        // 더미 fallback
        setData([
          {name: 'EU 공급망 실사', isCompleted: true},
          {name: '인권 실사', isCompleted: false},
          {name: '환경 실사', isCompleted: true}
        ])
      }
    }

    load()
  }, [refreshTrigger])

  return (
    <div className="flex flex-col items-center w-full space-y-3">
      {data.map(({name, isCompleted}) => (
        <div
          key={name}
          className="flex items-center justify-between px-3 py-2 border rounded w-80 border-amber-100 bg-amber-50">
          <span className="text-sm font-semibold text-amber-900">{name}</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-600">완료</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">미완료</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
