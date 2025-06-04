'use client'

import {Line} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
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
import type {ChartOptions, TooltipItem, ChartData} from 'chart.js'

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

interface EmissionItem {
  year: number
  emission: number
}

interface NetZeroChartProps {
  refreshTrigger?: number
}

export default function NetZeroChart({refreshTrigger = 0}: NetZeroChartProps) {
  const [data, setData] = useState<EmissionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dummy: EmissionItem[] = [
      {year: 2020, emission: 5000},
      {year: 2021, emission: 4800},
      {year: 2022, emission: 4500},
      {year: 2023, emission: 4000},
      {year: 2024, emission: 3600},
      {year: 2025, emission: 3200},
      {year: 2026, emission: 2800},
      {year: 2027, emission: 2400},
      {year: 2028, emission: 2000},
      {year: 2029, emission: 1600},
      {year: 2030, emission: 1200}
    ]
    setData(dummy)
    setLoading(false)
  }, [refreshTrigger])

  const calculateTargetPath = () => {
    if (data.length < 2) return []
    const first = data[0].emission
    const last = data[data.length - 1].emission
    const steps = data.length - 1
    return data.map((_, i) => first - ((first - last) * i) / steps)
  }

  const lineData: ChartData<'line'> = {
    labels: data.map(d => d.year.toString()),
    datasets: [
      {
        label: ' CO₂e 배출량',
        data: data.map(d => d.emission),
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#059669',
        pointBorderWidth: 2,
        fill: true
      },
      {
        label: ' 목표 경로',
        data: calculateTargetPath(),
        borderColor: '#4bc0c0',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.1,
        pointRadius: 0,
        fill: false
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
          boxWidth: 6,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        titleColor: '#333',
        bodyColor: '#333',
        callbacks: {
          label: (ctx: TooltipItem<'line'>) =>
            `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} tCO₂e`
        }
      },
      datalabels: {
        display: ctx => ctx.datasetIndex === 0,
        align: -10,
        anchor: 'end',
        offset: 4,
        color: '#059669',
        font: {
          size: 10,
          weight: 'bold'
        },
        formatter: (val: number) => val.toLocaleString()
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: v => Number(v).toLocaleString(),
          font: {size: 8}
        },
        grid: {color: 'rgba(0, 0, 0, 0.05)'},
        title: {
          display: true,
          text: 'tCO₂e',
          font: {size: 12}
        }
      },
      x: {
        ticks: {
          font: {size: 8, weight: 'bold'}
        },
        grid: {display: false},
        title: {
          display: true,
          text: '연도',
          font: {size: 12}
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-8 h-8 border-2 border-t-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Line data={lineData} options={options} />
      <div className="pt-2 mt-2 text-xs text-right text-gray-500">
        <span>
          {Math.round(
            ((data[0].emission - data[data.length - 1].emission) / data[0].emission) * 100
          )}
          % 감축 ({data[0].year} → {data[data.length - 1].year})
        </span>
      </div>
    </div>
  )
}
