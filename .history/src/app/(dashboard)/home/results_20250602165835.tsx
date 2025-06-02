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
import {Pencil} from 'lucide-react'
import CsdddChart from '@/components/chart/csdddResultChart'

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
      {/* 상단 두 개 카드 */}
      <motion.div variants={itemVariants}>
          <Link href="/governance">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                   
                    <span className="text-xl text-indigo-800">IFRS S2 (TCFD) 현황</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-indigo-700 bg-indigo-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>기후 관련 공시(TCFD) 작성 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between h-full">
                  
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center justify-center pt-2 h-60">
              {/* 두 번째 카드 내용 (비워둠) */}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 하단 세 개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center justify-center pt-2 h-60">
              {/* 세 번째 카드 내용 (비워둠) */}
            </CardContent>
          </Card>
        </motion.div>
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
              {/* 다섯 번째 카드 내용 (비워둠) */}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
