'use client'

import dynamic from 'next/dynamic'
import {useEffect, useState} from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type {ChartOptions, TooltipItem, ChartData} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
)

// Line 컴포넌트 동적 로딩 (Next.js SSR 대응)
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-60">
      <div className="w-6 h-6 border-2 border-t-2 border-blue-300 rounded-full animate-spin border-t-blue-600"></div>
    </div>
  )
})

interface EmissionItem {
  year: number
  emission: number
}

interface NetZeroChartProps {
  refreshTrigger?: number
}

export default function NetZeroChart({refreshTrigger = 0}: NetZeroChartProps) {
  const [data, setData] = useState<EmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ 더미 데이터
        const dummyData: EmissionItem[] = [
          {year: 2020, emission: 9500},
          {year: 2021, emission: 8800},
          {year: 2022, emission: 8300},
          {year: 2023, emission: 7900},
          {year: 2024, emission: 7300},
          {year: 2025, emission: 6700},
          {year: 2026, emission: 6000},
          {year: 2027, emission: 5300},
          {year: 2028, emission: 4500},
          {year: 2029, emission: 3800},
          {year: 2030, emission: 3000}
        ]

        setData(dummyData)
      } catch (err) {
        console.error('넷제로 배출량 데이터를 불러오는 데 실패했습니다.', err)
        setError('데이터를 불러오는 데 실패했습니다')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [refreshTrigger])

  const calculateTargetPath = () => {
    if (data.length < 2) return []
    const first = data[0].emission
    const last = data[data.length - 1].emission
    const total = data.length - 1
    return data.map((_, i) => first - (first - last) * (i / total))
  }

  const lineData: ChartData<'line'> = {
    labels: data.map(item => item.year.toString()),
    datasets: [
      {
        label: ' CO₂e 배출량',
        data: data.map(item => item.emission),
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#059669',
        pointBorderWidth: 2,
        fill: true
      },
      {
        label: ' 목표 경로',
        data: calculateTargetPath(),
        borderColor: '#10b981',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.1,
        pointRadius: 0,
        fill: false
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 12
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => {
            const value = ctx.raw as number
            return `${ctx.dataset.label}: ${value.toLocaleString()} tCO₂e`
          }
        }
      },
      datalabels: {
        display: ctx => ctx.datasetIndex === 0,
        align: -10,
        anchor: 'end',
        offset: 4,
        color: '#059669',
        font: {size: 10, weight: 'bold'},
        formatter: (v: number) => v.toLocaleString()
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val: string | number) => Number(val).toLocaleString(),
          font: {size: 8}
        },
        grid: {color: 'rgba(0, 0, 0, 0.04)'},
        title: {display: true, text: 'tCO₂e', font: {size: 12}}
      },
      x: {
        ticks: {font: {size: 8, weight: 'bold'}},
        grid: {display: false},
        title: {display: true, text: '연도', font: {size: 12}}
      }
    },
    interaction: {mode: 'index', intersect: false}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-60">
        <div className="w-6 h-6 border-2 border-t-2 border-blue-300 rounded-full animate-spin border-t-blue-600"></div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-8 text-center h-60">
        <p className="mb-2 text-gray-600">{error || '넷제로 배출량 데이터가 없습니다'}</p>
        <p className="text-xs text-gray-400">
          IFRS S2 Net Zero 섹션에서 목표를 설정하시면 이곳에 표시됩니다
        </p>
      </div>
    )
  }

  const first = data[0]!
  const last = data[data.length - 1]!
  const reductionRate = Math.round(
    ((first.emission - last.emission) / first.emission) * 100
  )

  return (
    <div className="relative w-full h-60">
      <div className="absolute z-10 text-xs text-gray-500 right-2 top-2">
        📉 {reductionRate}% 감축 예정 ({first.year} → {last.year})
      </div>

      {/* 차트 렌더링 */}
      <Line data={lineData} options={options} />
    </div>
  )
}

// 'use client'

// import {Line} from 'react-chartjs-2'
// import {useEffect, useState} from 'react'
// import {fetchNetZeroEmission} from '@/services/dashboard'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js'
// import ChartDataLabels from 'chartjs-plugin-datalabels'
// import type {ChartOptions, TooltipItem, ChartData} from 'chart.js'

// // Chart.js 요소 등록
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ChartDataLabels // datalabels 플러그인 등록
// )

// interface EmissionItem {
//   year: number
//   emission: number
// }

// interface NetZeroChartProps {
//   refreshTrigger?: number
// }

// export default function NetZeroChart({refreshTrigger = 0}: NetZeroChartProps) {
//   const [data, setData] = useState<EmissionItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true)
//         setError(null)
//         const res = await fetchNetZeroEmission()
//         if (Array.isArray(res) && res.length > 0) {
//           // 연도 기준으로 오름차순 정렬
//           const sortedData = [...res].sort((a, b) => a.year - b.year)
//           setData(sortedData)
//         } else {
//           setError('데이터가 없습니다')
//           setData([])
//         }
//       } catch (err) {
//         console.error('넷제로 배출량 데이터를 불러오는 데 실패했습니다.', err)
//         setError('데이터를 불러오는 데 실패했습니다')
//         setData([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     load()
//   }, [refreshTrigger])

//   // 직선형 목표 경로 계산 (첫 값에서 마지막 값까지 직선)
//   const calculateTargetPath = () => {
//     if (data.length < 2) return []

//     const firstValue = data[0].emission
//     const lastValue = data[data.length - 1].emission
//     const totalSteps = data.length - 1

//     return data.map((_, index) => {
//       return firstValue - (firstValue - lastValue) * (index / totalSteps)
//     })
//   }

//   // 데이터셋에 datalabels 속성 제거하고 옵션에서 처리
//   const lineData: ChartData<'line'> = {
//     labels: data.map(item => item.year.toString()),
//     datasets: [
//       {
//         label: ' CO₂e 배출량',
//         data: data.map(item => item.emission),
//         borderColor: '#4bc0c0',
//         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//         tension: 0.3,
//         pointRadius: 6,
//         pointBackgroundColor: '#ffffff',
//         pointBorderColor: '#059669',
//         pointBorderWidth: 2,
//         fill: true
//       },
//       {
//         label: ' 목표 경로',
//         data: calculateTargetPath(),
//         borderColor: '#4bc0c0',
//         borderDash: [5, 5],
//         backgroundColor: 'transparent',
//         tension: 0.1,
//         pointRadius: 0,
//         fill: false
//       }
//     ]
//   }

//   // options 부분 수정
//   const options: ChartOptions<'line'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'bottom',
//         labels: {
//           usePointStyle: true,
//           boxWidth: 6,
//           padding: 15
//         }
//       },
//       tooltip: {
//         enabled: true, // 툴팁 활성화 유지
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         titleColor: '#333',
//         bodyColor: '#333',
//         borderColor: '#e5e7eb',
//         borderWidth: 1,
//         padding: 10,
//         callbacks: {
//           label: (context: TooltipItem<'line'>) => {
//             const value = context.raw as number
//             return ${context.dataset.label}: ${value.toLocaleString()} tCO₂e
//           }
//         }
//       },
//       title: {
//         display: false // 제목은 카드 헤더에 있으므로 여기서는 표시 안 함
//       },
//       datalabels: {
//         // 데이터 라벨 표시 조건: 첫 번째 데이터셋(실제 배출량)에만 표시
//         display: function (context) {
//           return context.datasetIndex === 0
//         },
//         align: -10,
//         anchor: 'end',
//         offset: 4,
//         color: '#059669',
//         font: {
//           size: 10,
//           weight: 'bold'
//         },
//         formatter: (value: number) => {
//           return value.toLocaleString()
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: (value: string | number) => Number(value).toLocaleString(),
//           font: {size: 8}
//         },
//         grid: {color: 'rgba(0, 0, 0, 0.05)'},
//         title: {
//           display: true,
//           text: 'tCO₂e',
//           font: {
//             size: 12
//           }
//         }
//       },
//       x: {
//         ticks: {
//           font: {size: 8, weight: 'bold'}
//         },
//         grid: {display: false},
//         title: {
//           display: true,
//           text: '연도',
//           font: {
//             size: 12
//           }
//         }
//       }
//     },
//     interaction: {
//       mode: 'index',
//       intersect: false
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center w-full h-full">
//         <div className="w-8 h-8 border-2 border-t-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
//       </div>
//     )
//   }

//   if (error || data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
//         <p className="mb-2 text-gray-600">{error || '넷제로 배출량 데이터가 없습니다'}</p>
//         <p className="text-xs text-gray-400">
//           IFRS S2 Net Zero 섹션에서 목표를 설정하시면 이곳에 표시됩니다
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full h-full">
//       <Line data={lineData} options={options} />
//       <div className="pt-2 mt-2 text-xs text-right text-gray-500">
//         <span>
//           {Math.round(
//             ((data[0].emission - data[data.length - 1].emission) / data[0].emission) * 100
//           )}
//           % 감축 ({data[0].year} → {data[data.length - 1].year})
//         </span>
//       </div>
//     </div>
//   )
// }
