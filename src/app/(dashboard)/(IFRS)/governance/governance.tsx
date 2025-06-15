'use client'

import {useEffect, useState} from 'react'
import {format} from 'date-fns'
import {motion} from 'framer-motion'
import {
  Landmark,
  Users,
  CalendarDays,
  BarChart,
  GraduationCap,
  ChevronRight,
  Home,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
// 컴포넌트 가져오기
import Committee from './committee'
import KPI from './kpi'
import Education from './education'
import Meeting from './meeting'
import CollapsibleWindow from '@/components/tools/collapsibleWindow'

// UI 컴포넌트
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Skeleton} from '@/components/ui/skeleton'
import {PageHeader} from '@/components/layout/PageHeader'
import {LoadingState} from '@/components/ui/loading-state'

// 데이터 스토어 및 서비스
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {
  fetchCommitteeList,
  fetchMeetingList,
  fetchKpiList,
  fetchEducationList
} from '@/services/governance'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {DirectionButton} from '@/components/layout/direction'

/**
 * Governance 컴포넌트
 *
 * IFRS S2 거버넌스 관련 정보를 관리하고 표시하는 대시보드 컴포넌트입니다.
 * 위원회 구성, 회의 관리, 경영진 KPI, 환경 교육 등의 섹션으로 구성되어 있습니다.
 */
export default function Governance() {
  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 탭 상태 관리
  // const [activeTab, setActiveTab] = useState('all')

  // 데이터 스토어
  const {data: committeeData, setData} = useCommitteeStore()
  const {data: meetingData, setData: setMeetingData} = useMeetingStore()
  const {data: kpiData, setData: setKpiData} = useKPIStore()
  const {data: educationData, setData: setEducationData} = useEducationStore()

  // 데이터 통계
  const stats = {
    committees: committeeData?.length || 0,
    meetings: meetingData?.length || 0,
    kpis: kpiData?.length || 0,
    educations: educationData?.length || 0,
    total:
      (committeeData?.length || 0) +
      (meetingData?.length || 0) +
      (kpiData?.length || 0) +
      (educationData?.length || 0)
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 위원회 데이터 로드
        const committeeData = await fetchCommitteeList()
        setData(committeeData)

        // 회의 데이터 로드 및 날짜 파싱
        const meetingData = await fetchMeetingList()
        const parsedMeetingData = meetingData.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
        setMeetingData(parsedMeetingData)

        // KPI 데이터 로드
        const kpiList = await fetchKpiList()
        setKpiData(kpiList)

        // 교육 데이터 로드 및 날짜 파싱
        const educationList = await fetchEducationList()
        const parsedEducationList = educationList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
        setEducationData(parsedEducationList)
      } catch (e) {
        console.error('데이터 불러오기 실패:', e)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setData, setMeetingData, setKpiData, setEducationData])

  // 테이블 헤더 정의
  const committeeHeader = [
    '위원회 이름',
    '구성원 이름',
    '직책',
    '소속',
    '기후 관련 역할 및 책임 설명'
  ]
  const meetingHeader = ['회의 날짜', '회의 제목', '주요 안건 및 의결 내용']
  const KPIHeader = ['경영진 이름', 'KPI명', '목표율/목표값', '달성률/달성값']
  const educationHeader = ['교육 일자', '참석자 수', '교육 제목', '교육 주요 내용']

  return (
    <div className="flex flex-col w-full h-full p-4 pt-24">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="w-4 h-4 mr-1" />
              <BreadcrumbLink href="/home">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-bold text-customG">거버넌스</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 헤더 섹션 */}
      <div className="flex flex-row w-full h-full mb-6">
        <Link
          href="/home"
          className="flex flex-row items-center p-4 space-x-4 transition rounded-md cursor-pointer hover:bg-gray-200">
          <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-blue-600" />
          <PageHeader
            icon={<Landmark className="w-6 h-6 text-customG-600" />}
            title="거버넌스"
            description="IFRS S2/TCFD 기반 기후 거버넌스 체계 관리"
            module="TCFD"
            submodule="governance"
          />
        </Link>
      </div>
      {/* LoadingState 컴포넌트 활용 - 빈 상태일 때도 폼을 표시하도록 수정 */}
      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={stats.total === 0}
        showFormWhenEmpty={true}
        emptyMessage="거버넌스 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => {
            /* 추가 작업 구현 */
          }
        }}>
        {/* 통계 카드 */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.4, delay: 0.1}}
          className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-customG/20">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-customG/10">
                <Users className="w-5 h-5 text-customG" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">위원회</p>
                <h3 className="text-2xl font-bold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.committees}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-customG/20 ">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-customG/10">
                <CalendarDays className="w-5 h-5 text-customG" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">회의</p>
                <h3 className="text-2xl font-bold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.meetings}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-customG/20 ">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-customG/10">
                <BarChart className="w-5 h-5 text-customG" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">KPI</p>
                <h3 className="text-2xl font-bold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.kpis}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-customG/20 ">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-customG/10">
                <GraduationCap className="w-5 h-5 text-customG" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">교육</p>
                <h3 className="text-2xl font-bold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.educations}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 메인 콘텐츠 */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.2}}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="p-4 bg-white border-b">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-xl">거버넌스 관리</CardTitle>
                  <CardDescription>
                    지속가능성 거버넌스 구조 및 활동에 대한 정보를 관리합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="bg-white rounded-b-lg">
                <Accordion type="multiple" defaultValue={[]} className="p-4">
                  <AccordionItem
                    value="item-1"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm bg-gray-50">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium ">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className=" bg-[#0D1359] border-black">
                          <span className="text-white">{committeeData.length}</span>
                        </Badge>
                        <p className="text-sm font-medium text-[#0D1359]">위원회 구성</p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="committee"
                        headers={[
                          <div className="flex items-center justify-center w-40 h-full text-sm font-semibold">
                            위원회 이름
                          </div>,
                          <div className="flex items-center justify-center h-full text-sm font-semibold w-28">
                            구성원 이름
                          </div>,
                          <div className="flex items-center justify-center h-full text-sm font-semibold w-28">
                            직책
                          </div>,
                          <div className="flex items-center justify-center h-full text-sm font-semibold w-28">
                            소속
                          </div>,
                          <div className="w-[320px] h-full flex items-center justify-center font-semibold text-sm">
                            기후 관련 역할 및 책임 설명
                          </div>
                        ]}
                        dialogTitle="위원회 및 조직 입력"
                        data={committeeData.map(item => ({
                          id: item.id,
                          values: [
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.committeeName || '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.memberName || '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.memberPosition || '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.memberAffiliation || '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-left text-gray-800 max-w-[320px] truncate group">
                              {item.climateResponsibility || '-'}
                              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 left-0 -top-8 min-w-[200px] max-w-[400px] whitespace-normal"></span>
                            </div>
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Committee onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm bg-gray-50">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-customG-700">
                      <div className="flex items-center gap-2">
                        {/* <CalendarDays className="w-5 h-5 mr-2 text-[#0D1359]" /> */}
                        <Badge variant="outline" className=" bg-[#0D1359] border-black">
                          <span className="text-white">{meetingData.length}</span>
                        </Badge>
                        <p className="text-sm font-medium text-[#0D1359]">회의 관리</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="meeting"
                        headers={[
                          <div className="flex items-center justify-center w-[200px] h-full text-sm font-semibold">
                            회의 날짜
                          </div>,
                          <div className="flex items-center justify-center w-[200px] h-full text-sm font-semibold">
                            회의 제목
                          </div>,
                          <div className="flex items-center justify-center w-[200px] h-full text-sm font-semibold">
                            주요 안건 및 의결 내용
                          </div>
                        ]}
                        dialogTitle="회의관리"
                        data={meetingData.map(item => ({
                          id: item.id,
                          values: [
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.meetingDate
                                ? format(item.meetingDate, 'yyyy-MM-dd')
                                : '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-center text-gray-800 truncate">
                              {item.meetingName || '-'}
                            </div>,
                            <div className="w-full px-1 py-1 text-sm text-left text-gray-800 max-w-[320px] truncate group relative">
                              {item.agenda || '-'}
                              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 left-0 -top-8 min-w-[200px] max-w-[400px] whitespace-normal"></span>
                            </div>
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Meeting onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm bg-gray-50">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-customG-600">
                      <div className="flex items-center gap-2">
                        {/* <BarChart className="w-5 h-5 mr-2 text-[#0D1359]" /> */}
                        <Badge variant="outline" className=" bg-[#0D1359] border-black">
                          <span className="text-white">{kpiData.length}</span>
                        </Badge>
                        <p className="text-sm font-medium text-[#0D1359]">경영진 KPI</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="KPI"
                        headers={KPIHeader}
                        dialogTitle="경영진 KPI 입력"
                        data={kpiData.map(item => ({
                          id: item.id,
                          values: [
                            item.executiveName ?? '',
                            item.kpiName ?? '',
                            item.targetValue ?? '',
                            item.achievedValue ?? ''
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <KPI onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm bg-gray-50">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium ">
                      <div className="flex items-center gap-2">
                        {/* <GraduationCap className="w-5 h-5 mr-2 text-customG" /> */}
                        <Badge variant="outline" className="bg-[#0D1359] border-black">
                          <span className="text-white">{educationData.length}</span>
                        </Badge>
                        <span className="text-[#0D1359]">환경 교육</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="education"
                        headers={educationHeader}
                        dialogTitle="환경 교육 기록"
                        data={educationData.map(item => ({
                          id: item.id,
                          values: [
                            item.educationDate
                              ? format(item.educationDate, 'yyyy-MM-dd')
                              : '',
                            item.participantCount?.toString() ?? '',
                            item.educationTitle ?? '',
                            <div className="w-full px-1 py-1 text-sm text-left text-gray-800 max-w-[320px] truncate group relative">
                              {item.content ?? '-'}
                              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 left-0 -top-8 min-w-[200px] max-w-[400px] whitespace-normal">
                                {item.content ?? '-'}
                              </span>
                            </div>
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Education onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </LoadingState>
      <DirectionButton
        direction="right"
        tooltip="전략으로 이동"
        href="/strategy"
        fixed
        position="middle-right"
        size={48}
      />
    </div>
  )
}
