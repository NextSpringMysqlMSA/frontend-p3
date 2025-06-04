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
import {Badge} from '@/components/ui/badge'

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
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'scope1',
        barPercentage: 0.8
      },
      {
        label: '간접 배출',
        data: [data.scope1.indirect, null],
        backgroundColor: 'rgba(96, 165, 250, 0.9)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'scope1',
        barPercentage: 0.8
      },
      {
        label: '전력 사용',
        data: [null, data.scope2.electricity],
        backgroundColor: 'rgba(147, 197, 253, 0.9)',
        borderColor: 'rgba(96, 165, 250, 1)',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'scope2',
        barPercentage: 0.8
      },
      {
        label: '스팀 사용',
        data: [null, data.scope2.steam],
        backgroundColor: 'rgba(191, 219, 254, 0.9)',
        borderColor: 'rgba(147, 197, 253, 1)',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'scope2',
        barPercentage: 0.8
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        bodyFont: {
          size: 12
        },
        padding: 12,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw?.toLocaleString() || 0} tCO₂eq`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            size: 13,
            weight: '500'
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          padding: 8,
          font: {
            size: 11
          },
          callback: (v: any) => `${v.toLocaleString()} tCO₂eq`
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 p-4 bg-white border shadow-sm rounded-xl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-lg font-semibold text-gray-900">Scope별 배출량</span>
        </div>
        <Badge variant="outline" className="text-blue-700 bg-blue-50">
          실시간 데이터
        </Badge>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="h-[320px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 p-4 min-w-[220px] bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Scope 1</span>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {scope1Total.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-gray-500">tCO₂eq</span>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((scope1Total / total) * 100)}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Scope 2</span>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {scope2Total.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-gray-500">tCO₂eq</span>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((scope2Total / total) * 100)}%
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 text-sm font-medium text-center text-blue-700 bg-blue-50 rounded-lg border border-blue-100">
            총 배출량: {total.toLocaleString()} tCO₂eq
          </div>
        </div>
      </div>
    </div>
  )
}
