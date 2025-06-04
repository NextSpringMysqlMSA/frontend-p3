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

  useEffect(() => {
    setData(DEFAULT_DATA)
  }, [refreshTrigger])

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: '직접 배출',
        data: [data.scope1.direct, null],
        backgroundColor: '#3b82f6',
        stack: 'scope1',
        borderRadius: 8
      },
      {
        label: '간접 배출',
        data: [data.scope1.indirect, null],
        backgroundColor: '#60a5fa',
        stack: 'scope1',
        borderRadius: 8
      },
      {
        label: '전력 사용',
        data: [null, data.scope2.electricity],
        backgroundColor: '#93c5fd',
        stack: 'scope2',
        borderRadius: 8
      },
      {
        label: '스팀 사용',
        data: [null, data.scope2.steam],
        backgroundColor: '#bfdbfe',
        stack: 'scope2',
        borderRadius: 8
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
          boxWidth: 10,
          font: {size: 12},
          padding: 8,
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
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
        ticks: {
          font: {size: 13, weight: 500},
          color: '#334155',
          padding: 8
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        ticks: {
          font: {size: 12},
          color: '#64748b',
          padding: 6,
          callback: (v: any) => `${v.toLocaleString()}`
        }
      }
    },
    layout: {
      padding: {
        top: 12,
        bottom: 0,
        left: 0,
        right: 0
      }
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-4 bg-white border shadow-sm rounded-xl">
      {/* Title */}
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <span className="text-base">Scope별 배출량</span>
      </div>

      {/* Chart only */}
      <div className="mt-4 h-[240px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
