'use client'

import {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend)

// 타입 정의
interface ScopeEmissionData {
  scope1: number
  scope2: number
}

interface ScopeResultChartProps {
  refreshTrigger?: number
}

export default function ScopeResultChart({refreshTrigger = 0}: ScopeResultChartProps) {
  const [data, setData] = useState<ScopeEmissionData>({
    scope1: 1200,
    scope2: 800
  })

  useEffect(() => {
    // 추후 API로 대체 가능
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const chartData = {
    labels: ['Scope1', 'Scope2'],
    datasets: [
      {
        data: [data.scope1, data.scope2],
        backgroundColor: ['#0ea5e9', '#bae6fd'], // sky-500, sky-200
        borderColor: ['#0284c7', '#7dd3fc'], // sky-600, sky-300
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 10
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'left' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          color: '#333',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw
            return `${context.label}: ${value.toLocaleString()} tCO₂eq`
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <div className="relative w-full h-60">
      <div className="absolute text-center -translate-x-1/2 top-4 left-1/2">
        <div className="text-base font-semibold">Scope별 배출량</div>
        <div className="mt-1 text-xs text-gray-400">단위: tCO₂eq</div>
      </div>
      <div className="h-full pt-6">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
