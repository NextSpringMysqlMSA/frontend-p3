'use client'
import {Pie} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

interface CsdddChartProps {
  refreshTrigger?: number
}

interface ProgressData {
  totalCount: number
  completedCount: number
  incompleteCount: number
  completedRate: number
}

export default function CsdddChart({refreshTrigger = 0}: CsdddChartProps) {
  const [data, setData] = useState<ProgressData>({
    totalCount: 100,
    completedCount: 40,
    incompleteCount: 60,
    completedRate: 40
  })

  const [loading, setLoading] = useState(false)

  const chartData = {
    labels: ['자가진단 완료', '미완료'],
    datasets: [
      {
        label: '공급망 실사 자가진단',
        data: [data.completedCount, data.incompleteCount],
        backgroundColor: ['#f59e0b', '#fef3c7'],
        borderColor: ['#d97706', '#fde68a'],
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 10
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {display: false},
      datalabels: {display: false},
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.raw || 0
            const total = data.totalCount
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value}개 (${percentage}%)`
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative w-48 h-48">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-2 border-t-2 rounded-full border-amber-200 border-t-amber-500 animate-spin"></div>
          </div>
        ) : (
          <>
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute text-3xl font-bold text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-amber-600">
              {data.completedRate}%
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-full bg-amber-500"></div>
          <span className="mr-2 text-sm">자가진단 완료</span>
          <span className="text-sm font-bold">
            {data.completedCount}개 ({data.completedRate}%)
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-full bg-amber-100"></div>
          <span className="mr-2 text-sm">미완료</span>
          <span className="text-sm font-bold">
            {data.incompleteCount}개 ({100 - data.completedRate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal border rounded-md shadow-sm text-amber-600 border-amber-200 bg-amber-50">
            총 {data.totalCount}개 항목 중 {data.completedRate}% 완료
          </div>
        </div>
      </div>
    </div>
  )
}
