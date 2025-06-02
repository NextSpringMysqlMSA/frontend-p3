// 전체 구조 정렬 및 스타일 통일 완료
// 페이지 최상단에 위치할 use client 선언
'use client'

// ------------------ Imports ------------------
import {useState, useEffect, useCallback} from 'react'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import GriChart from '@/components/chart/griChart'
import IfrsChart from '@/components/chart/IfrsChart'
import ScopeChart from '@/components/chart/scopeChart'
import CsdddChart from '@/components/chart/csdddChart'
import PartnerCompanyChart from '@/components/chart/partnerCompanyChart'
import NetZeroChart from '@/components/chart/netZeroChart'
import {
  Factory,
  Building,
  RefreshCcw,
  Zap,
  FileText,
  CloudSun,
  TrendingUp
} from 'lucide-react'

// chart.js
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
import {Pie, Bar, PolarArea} from 'react-chartjs-2'

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

// ------------------ Component ------------------
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {staggerChildren: 0.1}
    }
  }

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {duration: 0.5}
    }
  }

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 pt-24 bg-gray-50">
      {/* 상단 제목 + 버튼 */}
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

      {/* 상단 2개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* IFRS S2 카드 */}
        <motion.div variants={itemVariants}>
          <Link href="/governance">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-indigo-600" />
                    <span className="text-xl text-indigo-800">IFRS S2 (TCFD) 현황</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-indigo-700 bg-indigo-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>기후 관련 공시(TCFD) 작성 현황</CardDescription>
              </CardHeader>
              <CardContent>
                {mounted && <IfrsChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* GRI 카드 */}
        <motion.div variants={itemVariants}>
          <Link href="/GRI">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
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
              <CardContent>
                {mounted && <GriChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* 하단 3개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* Scope */}
        <motion.div variants={itemVariants}>
          <Link href="/scope1">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
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
              <CardContent>
                {mounted && <ScopeChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* CSDDD */}
        <motion.div variants={itemVariants}>
          <Link href="/CSDDD">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="text-xl text-amber-800">공급망 실사 자가진단</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-amber-700 bg-amber-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>
                  (EU공급망 / 인권 / 환경) 실사 자가진단 현황
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mounted && <CsdddChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* 협력사 등록 현황 */}
        <motion.div variants={itemVariants}>
          <Link href="/partner-company">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-blue-600" />
                    <span className="text-xl text-blue-800">협력사 등록 현황</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-700 bg-blue-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>등록된 협력사 비율 확인</CardDescription>
              </CardHeader>
              <CardContent>
                {mounted && <PartnerCompanyChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* 협력사 관리 카드 */}
        <motion.div variants={itemVariants}>
          <Link href="/managePartner">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-600" />
                    <span className="text-xl text-orange-800">협력사 관리</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-orange-700 bg-orange-50">
                    이동 버튼
                  </Badge>
                </div>
                <CardDescription>협력사 정보를 추가하거나 편집하세요</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-sm font-semibold text-orange-700">
                  클릭 시 협력사 관리 페이지로 이동
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
