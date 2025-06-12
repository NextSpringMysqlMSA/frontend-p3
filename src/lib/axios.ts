import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

// 중복 요청 방지를 위한 처리중인 요청 저장소
const pendingRequests = new Map<string, AbortController>()

// 요청 키 생성 함수
const generateRequestKey = (config: any): string => {
  const {method, url, data} = config
  return `${method?.toUpperCase()}_${url}_${JSON.stringify(data || {})}`
}

// API URL 동적 결정 함수
const getApiBaseUrl = () => {
  // 환경변수 확인
  const configuredUrl = process.env.NEXT_PUBLIC_SPRING_API_URL

  // 환경변수가 없거나 ${GATEWAY_URL}와 같은 미치환 변수가 있는 경우
  if (!configuredUrl || configuredUrl.includes('${') || configuredUrl === 'undefined') {
    // 브라우저 환경인 경우 현재 호스트 기반으로 URL 생성
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const protocol = window.location.protocol
      // 게이트웨이 서비스는 8080 포트에서 실행
      return `${protocol}//${hostname}:8080`
    }
    // 서버사이드 렌더링 환경 - Kubernetes 내부 서비스 이름 사용
    return 'http://gateway-service:8080'
  }

  return configuredUrl
}

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true // 쿠키 사용할 경우 필요
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // 매 요청마다 baseURL 재확인 (SPA에서 필요할 경우)
    if (typeof window !== 'undefined') {
      config.baseURL = getApiBaseUrl()
    }

    const getAuthHeader = useAuthStore.getState().getAuthorizationHeader
    const token = getAuthHeader?.()

    if (token) {
      config.headers.Authorization = token
    }

    // 중복 요청 방지 로직
    const requestKey = generateRequestKey(config)

    // 이미 처리중인 동일한 요청이 있다면 취소
    if (pendingRequests.has(requestKey)) {
      const existingController = pendingRequests.get(requestKey)
      existingController?.abort('Duplicate request cancelled')
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController()
    config.signal = abortController.signal
    pendingRequests.set(requestKey, abortController)

    console.log('🔗 API URL:', config.baseURL)
    console.log('🔑 Request Key:', requestKey)

    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터 - 완료된 요청을 pendingRequests에서 제거
api.interceptors.response.use(
  response => {
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)
    console.log('✅ Request completed:', requestKey)
    return response
  },
  error => {
    if (error.config) {
      const requestKey = generateRequestKey(error.config)
      pendingRequests.delete(requestKey)
      console.log('❌ Request failed:', requestKey)
    }

    // 사용자 인증 관련 에러 처리는 주석 처리
    // if (error.response?.status === 401 || error.response?.status === 403) {
    //   if (typeof window !== 'undefined') {
    //     useAuthStore.getState().logout()
    //     window.location.href = '/login?error=unauthorized'
    //   }
    // }

    return Promise.reject(error)
  }
)

export default api
