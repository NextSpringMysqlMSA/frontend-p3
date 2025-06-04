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
  scope1: {
    direct: 800,
    indirect: 400
  },
  scope2: {
    electricity: 500,
    steam: 300
  }
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

  const total =
    data.scope1.direct +
    data.scope1.indirect +
    data.scope2.electricity +
    data.scope2.steam

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
          callback: (value: any) => `${value.toLocaleString()} tCO₂eq`
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full p-4 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <span className="text-red-500">📉</span>
          Scope별 배출량
        </div>
        <span className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
          실시간 데이터
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-[240px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Summary - 카드 내부에 포함되도록 */}
      <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
        <span>Scope 1</span>
        <span className="font-bold text-gray-900">{total.toLocaleString()} tCO₂eq</span>
      </div>
    </div>
  )
}
