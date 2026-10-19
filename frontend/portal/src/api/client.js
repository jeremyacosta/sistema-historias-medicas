// ============================================================
//  src/api/client.js — Cliente HTTP Central
//  Contrato estándar: { status, data, message, error_code }
//  Todos los módulos importan desde aquí. NUNCA fetch directo.
// ============================================================

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// ── Instancia Axios configurada ───────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,   // 15 segundos máximo por request
})

// ── Interceptor de Request: inyecta el token JWT ─────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de Response: manejo global de errores ────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Token expirado o revocado → limpiar sesión y redirigir al login
    if (status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }

    // Acceso denegado (sin el permiso RBAC requerido)
    if (status === 403) {
      console.warn('[RBAC] Acceso denegado — permiso insuficiente.')
    }

    return Promise.reject(error)
  }
)

export default apiClient

// ============================================================
//  Helpers de respuesta estándar
// ============================================================

/** Extrae data de una respuesta exitosa { status:"success", data } */
export const getData  = (response) => response.data?.data
export const getMsg   = (response) => response.data?.message
export const getError = (error)    => error.response?.data?.message || 'Error de conexión con el servidor.'
