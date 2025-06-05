'use client'

import {useState} from 'react'
import {Check, Database, ChevronRight, Home, BookOpen, ArrowLeft} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {motion} from 'framer-motion'
import {useRouter} from 'next/navigation'
import {PageHeader} from '@/components/layout/PageHeader'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import Link from 'next/link'
const dueDiligenceOptions = [
  {
    key: 'eudd',
    label: 'EU 공급망 실사',
    description: 'EU 공급망 실사 지침에 따른 자가진단',
    icon: '🇪🇺',
    color: 'from-blue-50 to-purple-50',
    borderColor: 'border-blue-200',
    categories: '기업 정책, 위험 평가, 시정 조치, 커뮤니케이션',
    path: '/CSDDD/eudd/result'
  },
  {
    key: 'hrdd',
    label: '인권 실사',
    description: '인권 실사 지침 요구사항 이행 자가진단',
    icon: '👥',
    color: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    categories: '생명과 안전, 차별 금지, 근로 조건, 결사의 자유',
    path: '/CSDDD/hrdd/result'
  },
  {
    key: 'edd',
    label: '환경 실사',
    description: '환경 실사 지침 요구사항 이행 자가진단',
    icon: '🌱',
    color: 'from-customGLight to-green-50',
    borderColor: 'border-customGBorder200',
    categories: '환경경영, 온실가스, 물 관리, 오염물질, 폐기물',
    path: '/CSDDD/edd/result'
  }
]
export default function CSDDD() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center px-4 py-2 mb-4 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink href="/home">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-bold text-customG">공급망 실사</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row w-full h-full mb-6">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<BookOpen className="w-6 h-6 text-customG" />}
            title="공급망 실사"
            description="공급망 실사 지침에 따른 인권 및 환경 실사 자가진단"
            module="CSDDD"
            submodule="eudd"
          />
        </Link>
      </div>

      {/* 메인 컨텐츠 카드 */}
      <Card className="bg-white border rounded-lg shadow-sm">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-xl">실사 유형 선택</CardTitle>
          <CardDescription>진행하실 실사 유형을 선택해주세요</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dueDiligenceOptions.map((option, index) => (
              <motion.div
                key={option.key}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: index * 0.1}}>
                <Card
                  className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
                    selectedOption === option.key
                      ? `border-2 ${option.borderColor} bg-gradient-to-br ${option.color}`
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption(option.key)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${option.color} ${option.borderColor} text-2xl`}>
                        {option.icon}
                      </div>
                      {selectedOption === option.key && (
                        <div className="px-2 py-1 text-xs text-white rounded-full bg-customG">
                          선택됨
                        </div>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-lg">{option.label}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="p-2 text-xs text-gray-500 rounded-md bg-white/60">
                      <strong className="text-customG">주요 항목:</strong>{' '}
                      {option.categories}
                    </div>
                  </CardContent>
                  {/* CardFooter 수정 */}
                  <CardFooter className="pt-2 border-t">
                    <div className="flex w-full gap-2">
                      <Button
                        variant={selectedOption === option.key ? 'default' : 'outline'}
                        size="sm"
                        className={
                          selectedOption === option.key
                            ? 'flex-1 bg-customG hover:bg-customG/90'
                            : 'flex-1'
                        }
                        onClick={() => router.push(`/CSDDD/${option.key}`)}>
                        {' '}
                        {/* 경로 소문자로 수정 */}
                        <Check className="w-4 h-4 mr-1" />
                        자가진단 시작
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-gray-600 hover:text-customG"
                        onClick={() => router.push(`/CSDDD/${option.key}/result`)}>
                        {' '}
                        {/* 경로 소문자로 수정 */}
                        결과 보기
                        <Database className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
