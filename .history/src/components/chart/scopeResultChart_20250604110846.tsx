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

interface ScopeData {
  scope1: {
    direct: number
    indirect: number
  }
  scope2: {
    electricity: number
    steam: number
  }
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

  useEffect(() => {
    setData(DEFAULT_DATA)
  }, [refreshTrigger])

  const scope1Total = data.scope1.direct + data.scope1.indirect
  const scope2Total = data.scope2.electricity + data.scope2.steam
  const total = scope1Total + scope2Total

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: '직접 배출',
        data: [data.scope1.direct, null],
        backgroundColor: '#3b82f6',
        stack: 'scope1'
      },
      {
        label: '간접 배출',
        data: [data.scope1.indirect, null],
        backgroundColor: '#60a5fa',
        stack: 'scope1'
      },
      {
        label: '전력 사용',
        data: [null, data.scope2.electricity],
        backgroundColor: '#93c5fd',
        stack: 'scope2'
      },
      {
        label: '스팀 사용',
        data: [null, data.scope2.steam],
        backgroundColor: '#bfdbfe',
        stack: 'scope2'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: {size: 12},
          padding: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw?.toLocaleString()} tCO₂eq`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {display: false}
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          callback: (v: any) => `${v.toLocaleString()} tCO₂eq`
        }
      }
    }
  }

  return (
    <div className="flex flex-col justify-between w-full h-full p-4 bg-white border shadow-sm rounded-xl">
      {/* Title (뱃지 제거됨) */}
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <span className="text-base">Scope별 배출량</span>
      </div>

      {/* Chart */}
      <div className="mt-2 h-[220px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* 수치 요약 */}
      <div className="flex flex-col gap-3 mt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Scope 1</span>
          <span className="font-bold text-gray-900">
            {scope1Total.toLocaleString()} tCO₂eq
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Scope 2</span>
          <span className="font-bold text-gray-900">
            {scope2Total.toLocaleString()} tCO₂eq
          </span>
        </div>
        <div className="pt-2 mt-2 text-sm font-medium text-right text-blue-700 border-t border-gray-100">
          총 {total.toLocaleString()} tCO₂eq 배출
        </div>
      </div>
    </div>
  )
}
