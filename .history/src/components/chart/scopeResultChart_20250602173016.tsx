'use client'

import {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Activity} from 'lucide-react'

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend)

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
    // 추후 API로 대체 가능
    setData({scope1: 1200, scope2: 800})
  }, [refreshTrigger])

  const chartData = {
    labels: ['Scope1', 'Scope2'],
    datasets: [
      {
        data: [data.scope1, data.scope2],
        backgroundColor: ['#38bdf8', '#bae6fd'], // 파랑 계열
        borderColor: ['#0ea5e9', '#7dd3fc'],
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 10
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'left' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          color: '#333',
          font: {size: 14}
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw
            return `${context.label}: ${value.toLocaleString()} tCO₂eq`
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-sky-800">
            <Activity className="w-5 h-5 text-sky-600" />
            Scope별 배출량
          </CardTitle>
          <Badge variant="outline" className="text-sky-700 bg-sky-50">
            실시간 데이터
          </Badge>
        </div>
        <CardDescription>Scope1 / 2 배출량 구성 비율 (단위: tCO₂eq)</CardDescription>
      </CardHeader>

      <CardContent className="h-60">
        <Pie data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  )
}
