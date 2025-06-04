'use client'

import {useEffect, useState, useCallback} from 'react'
import {Bar} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {TrendingUp} from 'lucide-react'
import {Badge} from '@/components/ui/badge'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ScopeData {
  scope1: {direct: number; indirect: number}
  scope2: {electricity: number; steam: number}
}

const DEFAULT_DATA: ScopeData = {
  scope1: {direct: 800, indirect: 400},
  scope2: {electricity: 500, steam: 300}
}

export default function ScopeResultChart({
  refreshTrigger = 0
}: {
  refreshTrigger?: number
}) {
  const [data, setData] = useState<ScopeData>(DEFAULT_DATA)

  const updateData = useCallback(() => {
    setData(DEFAULT_DATA)
  }, [])

  useEffect(() => {
    updateData()
  }, [refreshTrigger, updateData])

  const total =
    Object.values(data.scope1).reduce((a, b) => a + b, 0) +
    Object.values(data.scope2).reduce((a, b) => a + b, 0)

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: '직접 배출',
        data: [data.scope1.direct, null],
        backgroundColor: '#3b82f6',
        stack: 'stack1'
      },
      {
        label: '간접 배출',
        data: [data.scope1.indirect, null],
        backgroundColor: '#60a5fa',
        stack: 'stack1'
      },
      {
        label: '전력 사용',
        data: [null, data.scope2.electricity],
        backgroundColor: '#93c5fd',
        stack: 'stack2'
      },
      {
        label: '스팀 사용',
        data: [null, data.scope2.steam],
        backgroundColor: '#bfdbfe',
        stack: 'stack2'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {size: 12}
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw?.toLocaleString() || 0} tCO₂eq`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {display: false},
        border: {display: false}
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          font: {size: 12},
          callback: (v: any) => `${v.toLocaleString()} tCO₂eq`
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 p-4 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-lg font-semibold text-gray-900">Scope별 배출량</span>
        </div>
        <Badge variant="outline" className="text-blue-700 bg-blue-50">
          실시간 데이터
        </Badge>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Chart */}
        <div className="flex-1 h-[280px]">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-center gap-3 px-4 py-3 bg-white border rounded-md shadow-sm min-w-[200px]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Scope 1</span>
            <span className="font-semibold text-gray-900">
              {(data.scope1.direct + data.scope1.indirect).toLocaleString()} tCO₂eq
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Scope 2</span>
            <span className="font-semibold text-gray-900">
              {(data.scope2.electricity + data.scope2.steam).toLocaleString()} tCO₂eq
            </span>
          </div>
          <div className="py-2 mt-2 text-sm font-medium text-center text-blue-700 border border-blue-100 rounded-md bg-blue-50">
            총 배출량: {total.toLocaleString()} tCO₂eq
          </div>
        </div>
      </div>
    </div>
  )
}
