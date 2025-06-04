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
        borderWidth: 1,
        barThickness: 80 // 바 두께 조정
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
            return `${value.toLocaleString()} tCO₂eq`
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
          text: 'tCO₂eq',
          font: {
            size: 12
          }
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  }

  const total = data.scope1 + data.scope2
  const scope1Rate = Math.round((data.scope1 / total) * 100)
  const scope2Rate = 100 - scope1Rate

  return (
    <div className="flex items-center w-full gap-12">
      {/* Bar Chart */}
      <div className="flex-1 h-[280px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* 데이터 표시 */}
      <div className="flex flex-col gap-4 min-w-[200px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span className="text-sm font-semibold">Scope 1</span>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">{data.scope1.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{scope1Rate}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-100 rounded-full" />
              <span className="text-sm font-semibold">Scope 2</span>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">{data.scope2.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{scope2Rate}%</div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto border-t border-gray-200">
          <div className="flex justify-end">
            <div className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
              총 {total.toLocaleString()} tCO₂eq
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
