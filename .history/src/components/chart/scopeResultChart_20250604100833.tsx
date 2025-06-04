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
    // API 연동 예정
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
    <div className="flex items-center w-full gap-8">
      {/* Bar Chart */}
      <div className="flex-1 h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* 텍스트 박스 */}
      <div className="flex flex-col justify-between gap-6 min-w-[180px]">
        <div className="space-y-4 text-sm text-gray-800">
          {/* Scope1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">Scope 1</span>
            </div>
            <div className="leading-tight text-right">
              <div className="font-semibold text-gray-900">
                {data.scope1.toLocaleString()}{' '}
                <span className="text-xs text-gray-500">tCO₂eq</span>
              </div>
              <div className="text-[11px] text-gray-500">{scope1Rate}%</div>
            </div>
          </div>

          {/* Scope2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded-full" />
              <span className="text-sm font-medium">Scope 2</span>
            </div>
            <div className="leading-tight text-right">
              <div className="font-semibold text-gray-900">
                {data.scope2.toLocaleString()}{' '}
                <span className="text-xs text-gray-500">tCO₂eq</span>
              </div>
              <div className="text-[11px] text-gray-500">{scope2Rate}%</div>
            </div>
          </div>
        </div>

        {/* 총합 */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="px-3 py-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
              총 {total.toLocaleString()} tCO₂eq 배출
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
