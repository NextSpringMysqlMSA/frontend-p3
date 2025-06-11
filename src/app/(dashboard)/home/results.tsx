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
import {Pencil, CloudSun, FileText, TrendingUp, Leaf, Building} from 'lucide-react'
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
        className="flex flex-row justify-between w-full h-full mb-4 space-x-4"
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

        {/* GRI =================================================================*/}
        <motion.div variants={itemVariants}>
          <Card className="flex flex-col w-[406px] h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-xl text-green-800">여기도 아직 미정입니다.</span>
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
        </motion.div>
      </motion.div>

      {/* 하단 세 개 카드 ====================================================================================================================================*/}
      <motion.div
        className="flex flex-row justify-between w-full h-full space-x-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
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
            <CardContent className="flex flex-col items-center justify-center flex-1 p-4">
              <div className="flex items-center justify-between w-full h-full">
                {mounted && <ScopeResultChart refreshTrigger={refreshTrigger} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CSDDD 결과 ============================================================*/}
        <motion.div variants={itemVariants} className="flex-1">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
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
            <CardContent className="flex items-center justify-center flex-1 p-4">
              <div className="flex items-center justify-between w-full h-full">
                {mounted && <CsdddChart refreshTrigger={refreshTrigger} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 협력사 등록 현황 ==========================================================*/}
        <motion.div variants={itemVariants} className="flex-1">
          <Card className="flex flex-col w-full h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#ff1493]" />
                  <span className="text-xl text-[#e60073]">
                    이 부분은 아직 미정입니다
                  </span>
                </CardTitle>
                <Badge variant="outline" className="text-[#d10068] bg-[#ffe0ef]">
                  실시간 데이터
                </Badge>
              </div>
              <CardDescription>등록된 협력사 리스트와 상태 확인</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-1 p-4">
              <div className="w-full h-48 p-4 overflow-y-auto border-2 rounded-lg">
                {mounted && <PartnerCompanyChart refreshTrigger={refreshTrigger} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
