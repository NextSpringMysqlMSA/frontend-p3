'use client'

import {useEffect, useRef, useState} from 'react'
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

function randomValues(count: number, min: number, max: number): number[] {
  return Array.from({length: count}, () =>
    Math.floor(Math.random() * (max - min + 1) + min)
  )
}

const initialData = () => ({
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: randomValues(7, -100, 100),
      backgroundColor: '#ef4444' // red
    },
    {
      label: 'Dataset 2',
      data: randomValues(7, -100, 100),
      backgroundColor: '#3b82f6' // blue
    },
    {
      label: 'Dataset 3',
      data: randomValues(7, -100, 100),
      backgroundColor: '#22c55e' // green
    }
  ]
})

export default function ScopeResultChart() {
  const [chartData, setChartData] = useState(initialData)

  const handleRandomize = () => {
    setChartData({
      labels,
      datasets: chartData.datasets.map(ds => ({
        ...ds,
        data: randomValues(7, -100, 100)
      }))
    })
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked',
        font: {size: 18}
      },
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-white border shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Stacked Bar Chart 예시
        </div>
        <button
          onClick={handleRandomize}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
          <RefreshCcw className="w-4 h-4" />
          Randomize
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
