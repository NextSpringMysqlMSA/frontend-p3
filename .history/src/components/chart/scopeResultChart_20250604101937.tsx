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
    labels: ['Scope 1', 'Scope 2'],
    datasets: [
      {
        label: '배출량',
        data: [data.scope1, data.scope2],
        backgroundColor: ['#3b82f6', '#dbeafe'],
        borderColor: ['#2563eb', '#bfdbfe'],
        borderWidth: 1,
        barThickness: 80,
        borderRadius: 4
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {display: false},
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${context.raw.toLocaleString()} tCO₂eq`
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
          padding: {top: 10},
          font: {size: 12}
        },
        grid: {
          color: '#e2e8f0',
          drawBorder: false
        },
        ticks: {
          font: {size: 11},
          padding: 6
        }
      },
      x: {
        grid: {display: false},
        ticks: {
          font: {size: 12, weight: '500'},
          padding: 8
        }
      }
    }
  }

  return (
    <div className="flex items-center justify-between w-full gap-8 px-2">
      {/* Bar Chart */}
      <div className="flex-1 h-[280px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Data Summary */}
      <div className="flex flex-col gap-6 min-w-[220px]">
        {/* Total Emissions */}
        <div className="flex justify-end">
          <div className="px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 rounded-full bg-blue-50">
            총 배출량: {total.toLocaleString()} tCO₂eq
          </div>
        </div>

        {/* Scope Details */}
        <div className="space-y-5">
          {[
            {
              label: 'Scope 1',
              value: data.scope1,
              rate: scope1Rate,
              color: '#3b82f6'
            },
            {
              label: 'Scope 2',
              value: data.scope2,
              rate: scope2Rate,
              color: '#dbeafe'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{backgroundColor: item.color}}
                />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {item.value.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-gray-500">tCO₂eq</span>
                </div>
                <div className="text-xs font-medium text-gray-500">{item.rate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
