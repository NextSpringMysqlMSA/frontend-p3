'use client'
import {useState, useEffect, useCallback} from 'react'
import {Pencil, Building2, ChevronRight} from 'lucide-react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {RefreshCcw, FileText, CloudSun, TrendingUp} from 'lucide-react'
import {motion} from 'framer-motion'
import GriChart from '@/components/chart/griChart'
import IfrsChart from '@/components/chart/IfrsChart'
import ScopeChart from '@/components/chart/scopeChart'
import CsdddChart from '@/components/chart/csdddResultChart'
import PartnerCompanyChart from '@/components/chart/partnerCompanyChart'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

// 차트 설정
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ChartDataLabels
)

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 데이터 새로고침 함수
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // 협력사 ESG 데이터
  const supplierData = {
    labels: ['정보 수집 완료', '미수집'],
    datasets: [
      {
        label: '수집 현황',
        data: [80, 20],
        backgroundColor: ['rgba(159, 18, 57, 0.8)', 'rgba(254, 205, 211, 0.8)'],
        borderColor: ['rgba(159, 18, 57, 1)', 'rgba(254, 205, 211, 1)'],
        borderWidth: 1,
        cutout: '70%',
        borderRadius: 5,
        hoverOffset: 10
      }
    ]
  }

  // 협력사 세부 데이터
  const companyData = {
    labels: ['기업 A', '기업 B', '기업 C'],
    datasets: [
      {
        label: '진행률',
        data: [80, 30, 80],
        backgroundColor: [
          'rgba(159, 18, 57, 0.8)',
          'rgba(159, 18, 57, 0.6)',
          'rgba(159, 18, 57, 0.8)'
        ],
        borderColor: [
          'rgba(159, 18, 57, 1)',
          'rgba(159, 18, 57, 1)',
          'rgba(159, 18, 57, 1)'
        ],
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 25
      }
    ]
  }

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            return ` ${context.label}: ${context.raw}%`
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  }

  const companyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            return ` 진행률: ${context.raw}%`
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const
        },
        formatter: (value: any) => {
          return `${value}%`
        },
        display: function (context: any) {
          return context.dataset.data[context.dataIndex] >= 30
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  }

  // ESG 세부 점수 데이터
  const esgScoreData = {
    labels: ['환경(E)', '사회(S)', '지배구조(G)'],
    datasets: [
      {
        label: '목표 점수',
        data: [8, 7.5, 8.5],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(99, 102, 241, 0.5)',
        pointBorderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 3
      },
      {
        label: '현재 점수',
        data: [7.5, 3, 7.5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        borderWidth: 1,
        pointBackgroundColor: '#fff',
        pointBorderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const esgScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }

  // Framer Motion 애니메이션 설정
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  // 애니메이션 효과로 현재 날짜 표시
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col w-full h-screen max-h-screen p-4 pt-24">
      {/* 상단 제목 및 설명 ============================================================= */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            ESG 공시 대시보드
          </h1>
          <p className="text-gray-500">
            {currentDate} 기준 지속가능경영 보고서 및 기후 관련 정보 공시 현황
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-1 mt-2 text-gray-500 hover:text-gray-700 md:mt-0">
          <RefreshCcw className="w-4 h-4" />
          데이터 새로고침
        </Button>
      </motion.div>
      <motion.div
        className="flex flex-row justify-between w-full h-full space-x-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <div className="flex flex-col flex-1">
          {/* 상단 두 개 카드  ==============================================================================================================================*/}
          <motion.div
            className="flex flex-row justify-between w-full h-full mb-4 space-x-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {/* Scope 섹션 ================================================================= */}
            <motion.div variants={itemVariants} className="flex-1">
              <Link href="/scope1">
                <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-sky-600" />
                        <span className="text-xl text-sky-800">Scope 작성 현황</span>
                      </CardTitle>
                      <Badge variant="outline" className="text-sky-700 bg-sky-50">
                        실시간 데이터
                      </Badge>
                    </div>
                    <CardDescription>Scope1 / 2 작성 진행률</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center flex-1 p-4">
                    <div className="flex items-center justify-between w-full h-full">
                      {mounted && <ScopeChart refreshTrigger={refreshTrigger} />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            {/* IFRS S2 섹션 ================================ */}
            <motion.div variants={itemVariants} className="flex-1">
              <Link href="/governance">
                <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CloudSun className="w-5 h-5 text-indigo-600" />
                        <span className="text-xl text-indigo-800">
                          IFRS S2 (TCFD) 현황
                        </span>
                      </CardTitle>
                      <Badge variant="outline" className="text-indigo-700 bg-indigo-50">
                        실시간 데이터
                      </Badge>
                    </div>
                    <CardDescription>기후 관련 공시(TCFD) 작성 현황</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center flex-1 p-4">
                    <div className="flex items-center justify-between w-full h-full">
                      {mounted && <IfrsChart refreshTrigger={refreshTrigger} />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
          {/* 하단 두개 카드 ====================================================================================================================================*/}
          <motion.div
            className="flex flex-row justify-between w-full h-full space-x-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {/* GRI 섹션 ================================================================= */}
            <motion.div variants={itemVariants} className="flex-1">
              <Link href="/GRI">
                <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-xl text-green-800">GRI 작성 현황</span>
                      </CardTitle>
                      <Badge variant="outline" className="text-green-700 bg-green-50">
                        실시간 데이터
                      </Badge>
                    </div>
                    <CardDescription>
                      Global Reporting Initiative 지표 작성 현황
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center flex-1 p-4">
                    <div className="flex items-center justify-between w-full h-full">
                      {mounted && <GriChart refreshTrigger={refreshTrigger} />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            {/* CSDDD 섹션 ================================================================= */}
            <motion.div variants={itemVariants} className="flex-1">
              <Link href="/CSDDD">
                <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-amber-600" />{' '}
                        <span className="text-xl text-amber-800">
                          공급망 실사 자가진단
                        </span>
                      </CardTitle>
                      <Badge variant="outline" className="text-amber-700 bg-amber-50">
                        실시간 데이터
                      </Badge>
                    </div>
                    <CardDescription>
                      (EU공급망 / 인권 / 환경) 실사 위반 현황
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <div className="flex-1 w-full h-full px-4">
                      {mounted && <CsdddChart refreshTrigger={refreshTrigger} />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* 협력사 등록 현황 섹션 ================================================================= */}
        <motion.div variants={itemVariants}>
          <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex flex-row items-center justify-between w-[340px]">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#e60073]" />
                  <span className="text-xl text-[#e60073]">협력사 부정 뉴스 알림</span>
                </CardTitle>
                <Badge variant="outline" className="text-[#d10068] bg-[#ffe0ef]">
                  실시간 데이터
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center flex-1 h-full p-4">
              <div className="flex flex-col w-full h-full border rounded-lg"></div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
