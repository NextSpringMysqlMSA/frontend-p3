'use client'

import {useEffect, useState} from 'react'
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

// Chart.js 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월']

function generateRandomData(count: number, min = 0, max = 100): number[] {
  return Array.from({length: count}, () =>
    Math.floor(Math.random() * (max - min + 1) + min)
  )
}

const createInitialData = () => ({
  labels,
  datasets: [
    {
      label: 'Scope 1 - 연료 연소',
      data: generateRandomData(7),
      backgroundColor: '#3b82f6',
      stack: 'stack1'
    },
    {
      label: 'Scope 1 - 공정 배출',
      data: generateRandomData(7),
      backgroundColor: '#60a5fa',
      stack: 'stack1'
    },
    {
      label: 'Scope 2 - 전력',
      data: generateRandomData(7),
      backgroundColor: '#fbbf24',
      stack: 'stack2'
    },
    {
      label: 'Scope 2 - 열',
      data: generateRandomData(7),
      backgroundColor: '#fde68a',
      stack: 'stack2'
    }
  ]
})

interface ScopeResultChartProps {
  refreshTrigger?: number
}

export default function ScopeResultChart({refreshTrigger = 0}: ScopeResultChartProps) {
  const [chartData, setChartData] = useState(createInitialData)

  // 외부 refreshTrigger가 바뀔 때마다 새 랜덤 데이터 생성
  useEffect(() => {
    setChartData(createInitialData())
  }, [refreshTrigger])

  const handleRandomize = () => {
    setChartData({
      labels,
      datasets: chartData.datasets.map(ds => ({
        ...ds,
        data: generateRandomData(7)
      }))
    })
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Scope별 배출량 (Stacked)',
        font: {size: 18}
      },
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()} tCO₂eq`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 p-6 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Stacked Bar Chart (Scope 1 / Scope 2)
        </div>
        <button
          onClick={handleRandomize}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
          <RefreshCcw className="w-4 h-4" />
          랜덤값 생성
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
