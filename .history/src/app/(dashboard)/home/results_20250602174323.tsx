'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Pencil, CloudSun, FileText, Building, TrendingUp} from 'lucide-react'
import IfrsChart from '@/components/chart/IfrsChart'
import GriChart from '@/components/chart/griChart'
import PartnerCompanyChart from '@/components/chart/partnerCompanyChart'
import CsdddChart from '@/components/chart/csdddResultChart'
import ScopeResultChart from '@/components/chart/scopeResultChart'

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

export default function Results() {
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 pt-24 bg-gray-50">
      <motion.div variants={itemVariants}>
        {/* <Link href="/goal">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg text-[#4bc0c0]">
                  <Leaf className="w-5 h-5 mr-2 text-[#4bc0c0]" />
                  Net Zero 달성 경로
                  <span className="ml-2 text-xs font-normal">(단위:tCO₂e)</span>
                </CardTitle>
                <CardDescription className="text-gray-500">
                  탄소 중립 목표 및 감축 경로
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                {mounted && <NetZeroChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link> */}
        <motion.div variants={itemVariants}>
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
            <CardContent className="flex items-center justify-between h-60">
              {mounted && <GriChart refreshTrigger={refreshTrigger} />}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 하단 세 개 카드 (4번째 카드 제외) */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div variants={itemVariants}>
          <Link href="/scope1">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-sky-600" />
                    <span className="text-xl text-sky-800">Scope별 배출량</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-sky-700 bg-sky-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>Scope1 / 2 배출량 구성 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between h-60">
                  {mounted && <ScopeResultChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* 기존에 있던 CSDDD 카드 유지 */}
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-600" />
                  <span className="text-xl text-amber-800">공급망 실사 자가진단</span>
                </CardTitle>
                <Badge variant="outline" className="text-amber-700 bg-amber-50">
                  실시간 데이터
                </Badge>
              </div>
              <CardDescription>(EU공급망 / 인권 / 환경) 실사 위반 현황</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-2 h-60">
              <div className="flex flex-col gap-3 w-[280px]">
                {mounted && <CsdddChart refreshTrigger={refreshTrigger} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center justify-center pt-2 h-60">
              {/* 비워둠 */}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
