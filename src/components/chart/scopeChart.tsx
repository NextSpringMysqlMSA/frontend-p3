'use client'
import {Pie} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import {fetchScopeProgress} from '@/services/dashboard'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

interface ScopeChartProps {
  refreshTrigger?: number
}

interface ProgressData {
  totalCount: number
  completedCount: number
  incompleteCount: number
  completedRate: number
}

export default function ScopeChart({refreshTrigger = 0}: ScopeChartProps) {
  const [data, setData] = useState<ProgressData>({
    totalCount: 100,
    completedCount: 66,
    incompleteCount: 34,
    completedRate: 66
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchScopeProgress()
        setData(result)
      } catch (error) {
        console.error('Scope 진행 상황을 불러오는 데 실패했습니다:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshTrigger])

  const chartData = {
    labels: ['작성 완료', '미완료'],
    datasets: [
      {
        label: 'Scope 작성 상태',
        data: [data.completedCount, data.incompleteCount],
        backgroundColor: ['#3b82f6', '#dbeafe'],
        borderColor: ['#2563eb', '#bfdbfe'],
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
            <div className="w-8 h-8 border-2 border-t-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
          </div>
        ) : (
          <>
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute text-3xl font-bold text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              {data.completedRate}%
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-start pl-4">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
            <span className="mr-2 text-sm text-gray-800">작성 완료</span>
          </div>
          <span className="pl-5 text-sm font-bold">
            {data.completedCount}개 ({data.completedRate}%)
          </span>
        </div>
        <div className="flex flex-col items-start pl-4">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-blue-100 rounded-full"></div>
            <span className="mr-2 text-sm text-gray-800">미완료</span>
          </div>
          <span className="pl-5 text-sm font-bold">
            {data.incompleteCount}개 ({100 - data.completedRate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal text-blue-700 border border-blue-200 rounded-md shadow-sm bg-blue-50">
            총 {data.totalCount}개 항목 중 {data.completedRate}% 완료
          </div>
        </div>
      </div>
    </div>
  )
}
