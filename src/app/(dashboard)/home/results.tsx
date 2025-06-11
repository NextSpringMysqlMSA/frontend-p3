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
import {
  Pencil,
  CloudSun,
  FileText,
  TrendingUp,
  Leaf,
  Building,
  ChevronRight,
  Building2
} from 'lucide-react'
import IfrsChart from '@/components/chart/IfrsChart'
import GriChart from '@/components/chart/griChart'
import CsdddChart from '@/components/chart/csdddResultChart'
import ScopeResultChart from '@/components/chart/scopeResultChart'
import NetZeroChart from '@/components/chart/netZeroChart'
import PartnerCompanyChart from '@/components/chart/partnerCompanyChart'

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
    <div className="flex flex-col w-full h-screen max-h-screen p-4 pt-24">
      {/* 상단 두 개 카드  ==============================================================================================================================*/}
      <motion.div
        className="flex flex-row justify-between w-full h-full space-x-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* 상단 두 개 카드  ==============================================================================================================================*/}
        <motion.div
          className="flex flex-col w-full h-full space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {/* Net Zero =============================================================*/}
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
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
              <CardContent className="flex items-center justify-center flex-1 p-4">
                <div className="flex items-center justify-between w-full h-full">
                  {mounted && <NetZeroChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Scope 결과 ============================================================*/}
          <motion.div variants={itemVariants} className="flex-1">
            <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
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
              <CardContent className="flex items-center justify-center flex-1 p-4">
                <div className="flex items-center justify-between w-full h-full">
                  {mounted && <ScopeResultChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        {/* 협력사 등록 현황 ==========================================================*/}
        <motion.div variants={itemVariants}>
          <Card className="flex flex-col w-[450px] h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#e60073]" />
                  <span className="text-xl text-[#e60073]">협력사 등록 현황</span>
                </CardTitle>
                <Badge variant="outline" className="text-[#d10068] bg-[#ffe0ef]">
                  실시간 데이터
                </Badge>
              </div>
            </CardHeader>
            <div className="flex justify-center w-full h-full">
              <CardContent className="flex flex-col justify-center flex-1 h-full ">
                <div className="w-full h-full p-4 pb-0 overflow-hidden allow-scroll">
                  {mounted && <PartnerCompanyChart refreshTrigger={refreshTrigger} />}
                </div>
                <div className="p-4 pt-0 pb-20">
                  <Link
                    href="/managePartner"
                    className="flex items-center justify-between w-full px-6 py-2 transition-all duration-200 border-b border-gray-200 rounded-b-lg border-x hover:bg-gray-100">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                        전체 협력사 관리
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        협력사 등록 및 상세 정보를 관리할 수 있습니다
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 transition-colors bg-gray-200 rounded-full">
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
