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
import {TrendingUp, RefreshCcw} from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ScopeData {
  scope1: number
  scope2: number
}

interface ScopeResultChartProps {
  refreshTrigger?: number
}

const DEFAULT_DATA: ScopeData = {
  scope1: 1200,
  scope2: 800
}

export default function ScopeResultChart({refreshTrigger = 0}: ScopeResultChartProps) {
  const [data, setData] = useState<ScopeData>(DEFAULT_DATA)

  const updateData = useCallback(() => {
    setData(DEFAULT_DATA)
  }, [])

  useEffect(() => {
    updateData()
  }, [refreshTrigger, updateData])

  const total = data.scope1 + data.scope2
  const scope1Percentage = Math.round((data.scope1 / total) * 100)
  const scope2Percentage = 100 - scope1Percentage

  const chartData = {
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        data: [data.scope1, data.scope2],
        backgroundColor: ['#3b82f6', '#93c5fd'],
        borderColor: ['#2563eb', '#60a5fa'],
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 60
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {display: false},
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.raw.toLocaleString()} tCO₂eq`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {display: false},
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          font: {size: 12},
          padding: 8,
          callback: (value: number) => `${value.toLocaleString()} tCO₂eq`
        }
      },
      x: {
        grid: {display: false},
        border: {display: false},
        ticks: {
          font: {size: 13, weight: '500'}
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-lg font-semibold text-gray-900">Scope별 배출량</span>
        </div>
        <button
          onClick={updateData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart */}
        <div className="h-[280px] lg:col-span-2">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Data Summary */}
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-4">
            {[
              {
                label: 'Scope 1',
                value: data.scope1,
                percent: scope1Percentage,
                color: '#3b82f6'
              },
              {
                label: 'Scope 2',
                value: data.scope2,
                percent: scope2Percentage,
                color: '#93c5fd'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{backgroundColor: item.color}}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {item.value.toLocaleString()}
                    <span className="ml-1 text-xs font-medium text-gray-500">tCO₂eq</span>
                  </div>
                  <div className="text-xs text-gray-500">{item.percent}%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 text-sm font-medium text-center text-blue-700 rounded-lg bg-blue-50">
            총 배출량: {total.toLocaleString()} tCO₂eq
          </div>
        </div>
      </div>
    </div>
  )
}
