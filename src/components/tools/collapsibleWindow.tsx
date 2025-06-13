'use client'

import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import CustomTable from './customTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '../ui/dialog'
import {PlusCircle, Edit, FileEdit} from 'lucide-react'
import {Button} from '@/components/ui/button'
import React from 'react'

type RowData = {
  id: number
  values: string[]
}

// 타입별 테마 설정 정의
export const typeThemeConfig = {
  committee: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  meeting: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  KPI: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  education: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  risk: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  scenario: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  kpiGoal: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  },
  netZero: {
    color: 'customG',
    bgLight: 'bg-customG/5',
    bgHeader: 'bg-customG/10',
    textColor: 'text-customG',
    buttonBg: 'bg-customG hover:bg-customG/90',
    border: 'border-2 border-customG/20',
    hover: 'hover:bg-customG/5'
  }
}

type CollapsibleWindowType = keyof typeof typeThemeConfig

type CollapsibleWindowProps = {
  type: CollapsibleWindowType
  headers: string[]
  data: RowData[]
  formContent: (props: {
    onClose: () => void
    row: string[]
    rowId: number
    mode: 'add' | 'edit'
  }) => React.ReactNode
  dialogTitle?: string
  description?: string
}

/**
 * CollapsibleWindow 컴포넌트
 *
 * 테이블 데이터와 항목 추가/수정 기능을 제공하는 접이식 윈도우 컴포넌트입니다.
 *
 * @param {CollapsibleWindowProps} props - 컴포넌트 속성
 * @returns {JSX.Element} 렌더링된 컴포넌트
 */
export default function CollapsibleWindow({
  type,
  headers,
  data,
  formContent,
  dialogTitle = '항목 입력',
  description
}: CollapsibleWindowProps) {
  // 상태 관리
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<{
    row: string[]
    rowId: number
  } | null>(null)

  // 테마 색상 설정 가져오기
  const theme = typeThemeConfig[type]

  // 아이콘 설정
  const icons = {
    add: <PlusCircle className={`w-4 h-4 mr-1 ${theme.textColor}`} />,
    edit: <Edit className={`w-5 h-5 mr-2 ${theme.textColor}`} />,
    empty: <FileEdit className={`w-8 h-8 text-gray-300`} />
  }

  // 항목 추가 핸들러
  const handleAdd = () => {
    setIsAddOpen(true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedRowData(null)
    setIsEditOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresence>
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3}}
          className="w-full">
          {/* 추가 버튼 */}
          <div className="flex items-center justify-between mb-4">
            {data.length > 0 && (
              <p className="text-sm text-gray-500">
                총{' '}
                <span className={`font-medium ${theme.textColor}`}>{data.length}개</span>
                의 항목이 있습니다
              </p>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-xl sr-only" hidden>
                    <FileEdit className={`w-5 h-5 mr-2 ${theme.textColor}`} />
                    {dialogTitle}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="pt-1.5">
                      {description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                <div>
                  {formContent({
                    onClose: () => setIsAddOpen(false),
                    mode: 'add',
                    row: [],
                    rowId: -1
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 수정 모달 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl sr-only" hidden>
              {icons.edit}
              항목 수정
            </DialogTitle>
            {description && (
              <DialogDescription className="pt-1.5">
                항목 정보를 수정합니다
              </DialogDescription>
            )}
          </DialogHeader>
          <div>
            {selectedRowData &&
              formContent({
                onClose: () => {
                  console.log('[CollapsibleWindow] Closing edit dialog')
                  handleCloseModal()
                },
                row: selectedRowData.row,
                rowId: selectedRowData.rowId,
                mode: 'edit'
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* 테이블 섹션 */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.4, delay: 0.1}}
        className="w-full overflow-hidden bg-white border-2 shadow-sm border-[#0D1359]/20 rounded-xl">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
            <div className="p-2 mb-4 rounded-full bg-[#0D1359]/10">{icons.empty}</div>
            <h3 className="mb-1 text-base font-medium text-slate-700">
              데이터가 없습니다
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              아직 등록된 항목이 없습니다. 새로운 항목을 추가해 보세요.
            </p>
            <Button
              onClick={handleAdd}
              className="text-white bg-[#0D1359] hover:bg-[#0D1359]/90"
              size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> 첫 항목 추가하기
            </Button>
          </div>
        ) : (
          <div className="bg-white">
            <CustomTable
              headers={headers}
              data={data}
              type={type}
              theme={{
                ...theme,
                border: 'border-2 border-[#0D1359]/20',
                bgHeader: 'bg-[#0D1359]/10',
                bgLight: 'bg-[#0D1359]/5',
                textColor: 'text-[#0D1359]'
              }}
              onRowClick={(_, row, rowId) => {
                setSelectedRowData({row, rowId})
                setIsEditOpen(true)
              }}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
