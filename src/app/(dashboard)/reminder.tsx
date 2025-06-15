'use client'

import {useEffect, useRef, useState} from 'react'
import {AlertTriangle, X, ExternalLink, Clock, Building2} from 'lucide-react'
import {connectReminderSSE} from '@/services/dashboard'
import clsx from 'clsx'

interface NewsAlert {
  id: string
  url: string
  title: string
  companyName: string
  category: string
  publishedAt?: string
  sentiment?: string
}

export default function Reminder() {
  const [visible, setVisible] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<NewsAlert | null>(null)
  const lastAlertIdRef = useRef<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // SSE 연결 초기화 (보안 개선: 사용자 ID 제거)
  useEffect(() => {
    const eventSource = connectReminderSSE(
      (alert: NewsAlert) => {
        console.log('New alert received:', alert)

        // 중복 알림 방지
        if (alert.id !== lastAlertIdRef.current) {
          lastAlertIdRef.current = alert.id
          setCurrentAlert(alert)
          setVisible(true)

          // 기존 타이머 클리어
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          // 7초 후 자동으로 숨김
          timeoutRef.current = setTimeout(() => {
            setVisible(false)
          }, 7000)
        }
      },
      event => {
        console.error('SSE connection error:', event)
      }
    )

    eventSourceRef.current = eventSource

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 뉴스 URL로 이동
  const handleNewsClick = () => {
    if (currentAlert?.url && currentAlert.url !== '정보 없음') {
      window.open(currentAlert.url, '_blank', 'noopener,noreferrer')
    }
  }

  // 알림 닫기
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // 감성 분석 결과에 따른 스타일
  const getSentimentStyle = (sentiment?: string) => {
    if (!sentiment || sentiment === '분석 정보 없음') return 'border-red-500'

    const sentimentLower = sentiment.toLowerCase()
    if (sentimentLower.includes('negative') || sentimentLower.includes('부정')) {
      return 'border-red-500'
    } else if (sentimentLower.includes('positive') || sentimentLower.includes('긍정')) {
      return 'border-green-500'
    }
    return 'border-yellow-500'
  }

  // 발행 시간 포맷팅
  const formatPublishedTime = (publishedAt?: string) => {
    if (!publishedAt) return null

    try {
      const date = new Date(publishedAt)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffDays > 0) {
        return `${diffDays}일 전`
      } else if (diffHours > 0) {
        return `${diffHours}시간 전`
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return `${diffMinutes}분 전`
      }
    } catch {
      return null
    }
  }

  // 개발 모드에서 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Reminder component rendered with SSE connection')
  }

  if (!currentAlert) return null

  const hasValidUrl = currentAlert.url && currentAlert.url !== '정보 없음'
  const publishedTime = formatPublishedTime(currentAlert.publishedAt)

  return (
    <div
      onClick={hasValidUrl ? handleNewsClick : undefined}
      className={clsx(
        'fixed top-4 right-4 z-50 w-[400px] mt-16 p-4 bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-500',
        hasValidUrl && 'cursor-pointer hover:shadow-2xl hover:scale-[1.02]',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      )}>
      {/* 개발 모드 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
      )}

      <div className="flex items-start">
        <div
          className={clsx(
            'flex flex-col w-full h-full pl-4 border-l-8',
            getSentimentStyle(currentAlert.sentiment)
          )}>
          {/* 헤더 */}
          <div className="flex flex-row w-full items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <h3 className="text-base font-semibold text-gray-900">
              협력사 ESG 리스크 알림
            </h3>
          </div>

          {/* 회사명과 카테고리 */}
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {currentAlert.companyName}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {currentAlert.category.toUpperCase()}
            </span>
          </div>

          {/* 뉴스 제목 */}
          <h4 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
            {currentAlert.title}
          </h4>

          {/* 뉴스 URL 또는 상태 */}
          {hasValidUrl ? (
            <div className="flex items-center space-x-1 mb-2">
              <ExternalLink className="w-3 h-3 text-blue-500" />
              <p className="text-xs text-blue-600 underline break-all line-clamp-1">
                뉴스 기사 보기
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-2">링크 정보 없음</p>
          )}

          {/* 추가 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              {publishedTime && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{publishedTime}</span>
                </>
              )}
            </div>
            {currentAlert.sentiment && currentAlert.sentiment !== '분석 정보 없음' && (
              <span className="px-2 py-1 bg-gray-50 rounded text-xs">
                {currentAlert.sentiment}
              </span>
            )}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
