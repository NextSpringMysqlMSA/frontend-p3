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
import {TrendingUp} from 'lucide-react'

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
    // 추후 API 연동 시 refreshTrigger가 바뀔 때마다 갱신
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const total = data.scope1 + data.scope2
  const scope1Rate = Math.round((data.scope1 / total) * 100)
  const scope2Rate = 100 - scope1Rate

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: 'Scope별 배출 구성 비율',
        data: [data.scope1, data.scope2],
        backgroundColor: ['#3b82f6', '#bfdbfe'],
        borderRadius: 6
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {display: false},
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.label}: ${context.raw.toLocaleString()} tCO₂eq`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {display: true, text: 'tCO₂eq'}
      },
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      }
    },
    layout: {
      padding: {bottom: 30}
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 p-6 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Scope별 배출량
        </div>
        <div className="px-3 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full font-medium">
          총 {total.toLocaleString()} tCO₂eq 배출
        </div>
      </div>

      {/* Body: Chart + Info */}
      <div className="flex flex-col items-start w-full gap-6 mt-2 md:flex-row">
        {/* Chart */}
        <div className="w-full md:w-[55%] h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Scope Info */}
        <div className="w-full md:w-[45%] flex flex-col gap-4 text-sm">
          {[
            {
              label: 'Scope 1',
              value: data.scope1,
              rate: scope1Rate,
              color: 'bg-blue-500'
            },
            {
              label: 'Scope 2',
              value: data.scope2,
              rate: scope2Rate,
              color: 'bg-blue-200'
            }
          ].map(({label, value, rate, color}, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="font-medium text-gray-700">{label}</span>
              </div>
              <div className="leading-tight text-right">
                <div className="text-sm font-bold text-gray-900">
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
