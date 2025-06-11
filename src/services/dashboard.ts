'use client'

import api from '@/lib/axios'
import {useAuthStore} from '@/stores/authStore'

export const fetchTcfdProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/tcfd/progress`)
  return response.data
}

export const fetchGriProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/gri/progress`)
  return response.data
}

export const fetchScopeProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/scope/progress`)
  return response.data
}

export const fetchCsdddProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/csddd/progress`)
  return response.data
}

export const fetchPartnerCompanyProgress = async () => {
  const response = await api.get(`/api/v1/partners/partner-companies`)
  return response.data
}

export const fetchNetZeroEmission = async () => {
  const response = await api.get(`/api/v1/dashboard/tcfd/progress/netzero`)
  return response.data
}

// SSE 기반 실시간 알림 연결 (Gateway 인증 기반)
export const connectReminderSSE = (
  onAlert?: (alert: any) => void,
  onError?: (error: Event) => void
): EventSource | null => {
  try {
    // Gateway를 통한 인증된 SSE 연결
    // Gateway에서 JWT 토큰을 검증하고 X-MEMBER-ID 헤더를 설정
    const url = '/api/v1/dashboard/reminder/stream'
    
    const eventSource = new EventSource(url, {
      withCredentials: true  // Gateway 인증을 위해 쿠키 포함
    })
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.eventType === 'news-alert' && typeof data.message === 'object') {
          onAlert?.(data.message)
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', event.data, err)
      }
    }
    
    eventSource.onerror = (event) => {
      console.error('SSE connection error:', event)
      onError?.(event)
    }
    
    return eventSource
  } catch (err) {
    console.error('Failed to create SSE connection:', err)
    return null
  }
}

// 기존 폴링 기반 fetchReminder (fallback용으로 유지)
export const fetchReminder = async () => {
  const response = await api.get(`/api/v1/dashboard/reminder`)
  return response.data
}

export const fetchCsdddResultProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/csdddresult/progress`)
  return response.data
}

export const fetchScopeResultProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/scoperesult/progress`)
  return response.data
}
