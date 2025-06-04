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
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const total = data.scope1 + data.scope2
  const scope1Rate = Math.round((data.scope1 / total) * 100)
  const scope2Rate = 100 - scope1Rate

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
    layout: {
      padding: {bottom: 40} // ✅ x축 레이블 보이도록 여백 추가
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // ✅ 레이블 생략 안 함
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂eq'
        }
      }
    }
  }

  return (
    <div className="flex items-start w-full gap-8">
      {/* Bar Chart - 55% 영역 */}
      <div className="w-[55%] min-w-0 h-72">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Info Box - 45% 영역 */}
      <div className="w-[45%] flex flex-col justify-start gap-6 text-sm min-w-[180px]">
        {/* 총합 배출 */}
        <div className="text-right">
          <div className="inline-block px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            총 {total.toLocaleString()} tCO₂eq 배출
          </div>
        </div>

        {/* Scope1 & Scope2 데이터 */}
        <div className="space-y-4">
          {[
            {
              label: 'Scope 1',
              value: data.scope1,
              rate: scope1Rate,
              dotColor: 'bg-blue-500'
            },
            {
              label: 'Scope 2',
              value: data.scope2,
              rate: scope2Rate,
              dotColor: 'bg-blue-100'
            }
          ].map(({label, value, rate, dotColor}, index) => (
            <div className="flex items-start justify-between" key={index}>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                <span className="font-medium text-gray-700">{label}</span>
              </div>
              <div className="leading-tight text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {value.toLocaleString()}{' '}
                  <span className="text-xs text-gray-500">tCO₂eq</span>
                </div>
                <div className="text-[11px] text-gray-500">{rate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
