'use client'

import dynamic from 'next/dynamic'
import {useEffect, useState, useRef} from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type {ChartData, ChartOptions, TooltipItem} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
)

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-60">
      <div className="w-6 h-6 border-2 border-t-2 border-blue-300 rounded-full animate-spin border-t-blue-600"></div>
    </div>
  )
})

interface EmissionItem {
  year: number
  emission: number
}

interface NetZeroChartProps {
  refreshTrigger?: number
}

export default function NetZeroChart({refreshTrigger = 0}: NetZeroChartProps) {
  const [data, setData] = useState<EmissionItem[]>([])
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const dummyData: EmissionItem[] = [
      {year: 2020, emission: 9500},
      {year: 2021, emission: 8800},
      {year: 2022, emission: 8300},
      {year: 2023, emission: 7900},
      {year: 2024, emission: 7300},
      {year: 2025, emission: 6700},
      {year: 2026, emission: 6000},
      {year: 2027, emission: 5300},
      {year: 2028, emission: 4500},
      {year: 2029, emission: 3800},
      {year: 2030, emission: 3000}
    ]
    setData(dummyData)
  }, [refreshTrigger])

  const calculateTargetPath = () => {
    if (data.length < 2) return []
    const start = data[0].emission
    const end = data[data.length - 1].emission
    return data.map((_, i) => start - ((start - end) * i) / (data.length - 1))
  }

  const gradientFill = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.3)')
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0.05)')
    return gradient
  }

  const lineData: ChartData<'line'> = {
    labels: data.map(d => d.year.toString()),
    datasets: [
      {
        label: 'CO₂e 배출량',
        data: data.map(d => d.emission),
        borderColor: '#10b981', // emerald-500
        backgroundColor: context =>
          chartRef.current
            ? gradientFill(chartRef.current.ctx)
            : 'rgba(16, 185, 129, 0.2)',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4,
        fill: true
      },
      {
        label: '목표 경로',
        data: calculateTargetPath(),
        borderColor: '#a5f3fc',
        borderDash: [6, 6],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.2
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          boxWidth: 8,
          font: {size: 12}
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#111',
        bodyColor: '#111',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 8,
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => {
            const value = ctx.raw as number // 👈 여기서 명시적 단언
            return `${ctx.dataset.label}: ${value.toLocaleString()} tCO₂e`
          }
        }
      },
      datalabels: {
        display: ctx => ctx.datasetIndex === 0,
        align: 'top',
        anchor: 'end',
        offset: 4,
        font: {size: 10, weight: 'bold'},
        color: '#10b981',
        formatter: val => val.toLocaleString()
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: val => Number(val).toLocaleString(),
          font: {size: 9}
        },
        grid: {color: 'rgba(0,0,0,0.05)'},
        title: {display: true, text: 'tCO₂e', font: {size: 12}}
      },
      x: {
        ticks: {font: {size: 10}},
        grid: {display: false},
        title: {display: true, text: '연도', font: {size: 12}}
      }
    },
    interaction: {mode: 'index', intersect: false}
  }

  return (
    <div className="relative w-full h-60">
      <Line ref={chartRef} data={lineData} options={options} />
      <div className="absolute bottom-0 text-xs text-gray-500 right-2">
        📉{' '}
        {Math.round(
          ((data[0].emission - data[data.length - 1].emission) / data[0].emission) * 100
        )}
        % 감축 예정 ({data[0].year} → {data[data.length - 1].year})
      </div>
    </div>
  )
}
