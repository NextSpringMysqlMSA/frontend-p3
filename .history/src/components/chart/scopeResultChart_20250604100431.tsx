'use client'

import {useEffect, useState} from 'react'
import {Bar} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

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
    // 추후 API 연동 가능
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const chartData = {
    labels: ['Scope1', 'Scope2'],
    datasets: [
      {
        label: '배출량 (tCO₂eq)',
        data: [data.scope1, data.scope2],
        backgroundColor: ['#3b82f6', '#dbeafe'],
        borderColor: ['#2563eb', '#bfdbfe'],
        borderWidth: 1
      }
    ]
  }

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
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂eq'
        }
      }
    }
  }

  const total = data.scope1 + data.scope2
  const scope1Rate = Math.round((data.scope1 / total) * 100)
  const scope2Rate = 100 - scope1Rate

  return (
    <div className="flex items-center justify-between w-full">
      {/* Bar Chart */}
      <div className="relative w-64 h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* 정렬된 텍스트 */}
      <div className="space-y-3 text-sm text-gray-800 min-w-[140px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 mr-2 bg-blue-500 rounded-full" />
            <span>Scope1</span>
          </div>
          <div className="leading-tight text-right">
            <div className="text-sm font-bold text-gray-900">
              {data.scope1.toLocaleString()} tCO₂eq
            </div>
            <div className="text-[11px] text-gray-500">{scope1Rate}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 mr-2 bg-blue-100 rounded-full" />
            <span>Scope2</span>
          </div>
          <div className="leading-tight text-right">
            <div className="text-sm font-bold text-gray-900">
              {data.scope2.toLocaleString()} tCO₂eq
            </div>
            <div className="text-[11px] text-gray-500">{scope2Rate}%</div>
          </div>
        </div>

        <div className="pt-2 mt-2 text-[11px] text-right text-gray-500 border-t border-gray-100">
          <div className="inline-block px-2 py-1 text-[11px] font-medium text-blue-700 border border-blue-200 rounded bg-blue-50">
            총 {total.toLocaleString()} tCO₂eq 배출
          </div>
        </div>
      </div>
    </div>
  )
}
