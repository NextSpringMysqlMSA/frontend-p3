'use client'

import {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {fetchCsdddProgress} from '@/services/dashboard'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ProgressData {
  total: number
  completed: number
  incomplete: number
  completionRate: number
}

export default function CsdddChart({refreshTrigger = 0}: {refreshTrigger?: number}) {
  const [data, setData] = useState<ProgressData>({
    total: 0,
    completed: 0,
    incomplete: 0,
    completionRate: 0
  })

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCsdddProgress()
      const completed = result.completed
      const total = result.total
      const incomplete = total - completed
      const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
      setData({total, completed, incomplete, completionRate})
    }
    loadData()
  }, [refreshTrigger])

  const chartData = {
    labels: ['자가진단 완료', '미완료'],
    datasets: [
      {
        label: '공급망 실사',
        data: [data.completed, data.incomplete],
        backgroundColor: ['#f59e0b', '#fef3c7'], // amber 계열
        borderColor: ['#d97706', '#fde68a'],
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 8
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {display: false},
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}개`
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (