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
