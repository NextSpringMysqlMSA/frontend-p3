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
  scope1A: number
  scope1B: number
  scope2A: number
  scope2B: number
}

interface ScopeResultChartProps {
  refreshTrigger?: number
}

export default function ScopeResultChart({refreshTrigger = 0}: ScopeResultChartProps) {
  const [data, setData] = useState<ScopeEmissionData>({
    scope1A: 500,
    scope1B: 700,
    scope2A: 300,
    scope2B: 500
  })

  useEffect(() => {
    setData({
      scope1A: 500,
      scope1B: 700,
      scope2A: 300,
      scope2B: 500
    })
  }, [refreshTrigger])

  const scope1Total = data.scope1A + data.scope1B
  const scope2Total = data.scope2A + data.scope2B
  const total = scope1Total + scope2Total

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: 'Scope 1 - 연료 연소',
        data: [data.scope1A, 0],
        backgroundColor: '#3b82f6',
        stack: 'stack1'
      },
      {
        label: 'Scope 1 - 공정 배출',
        data: [data.scope1B, 0],
        backgroundColor: '#60a5fa',
        stack: 'stack1'
      },
      {
        label: 'Scope 2 - 전력',
        data: [0, data.scope2A],
        backgroundColor: '#fbbf24',
        stack: 'stack2'
      },
      {
        label: 'Scope 2 - 열',
        data: [0, data.scope2B],
        backgroundColor: '#fde68a',
        stack: 'stack2'
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {position: 'top' as const},
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()} tCO₂eq`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂eq'
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 p-6 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Scope별 배출량 (스택형)
        </div>
        <div className="px-3 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full font-medium">
          총 {total.toLocaleString()} tCO₂eq 배출
        </div>
      </div>

      {/* Body: Chart */}
      <div className="w-full h-80">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
