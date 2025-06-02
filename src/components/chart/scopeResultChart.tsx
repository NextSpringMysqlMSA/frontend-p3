'use client'

import {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

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
    // 추후 API 대체 가능
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const chartData = {
    labels: ['Scope1', 'Scope2'],
    datasets: [
      {
        data: [data.scope1, data.scope2],
        backgroundColor: ['#3b82f6', '#dbeafe'],
        borderColor: ['#2563eb', '#bfdbfe'],
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 10
      }
    ]
  }

  const total = data.scope1 + data.scope2
  const scope1Rate = Math.round((data.scope1 / total) * 100)
  const scope2Rate = 100 - scope1Rate

  const chartOptions = {
    plugins: {
      legend: {display: false},
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
    <div className="flex items-center justify-between w-full">
      <div className="relative w-48 h-48">
        <Pie data={chartData} options={chartOptions} />
        <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <div className="text-2xl font-bold text-gray-800">Scope</div>
          <div className="text-xs text-gray-400">단위: tCO₂eq</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
            <span className="mr-2 text-sm text-gray-800">Scope1</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {data.scope1.toLocaleString()} ({scope1Rate}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-blue-100 rounded-full"></div>
            <span className="mr-2 text-sm text-gray-800">Scope2</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {data.scope2.toLocaleString()} ({scope2Rate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal text-blue-700 border border-blue-200 rounded-md shadow-sm bg-blue-50">
            총 {total.toLocaleString()} tCO₂eq 배출
          </div>
        </div>
      </div>
    </div>
  )
}
