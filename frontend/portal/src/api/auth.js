// ============================================================
//  src/api/auth.js — Servicios de Autenticación
//  Conecta con los endpoints de /api/v1/auth/
// ============================================================

import apiClient, { getData, getMsg } from './client'

/**
 * Iniciar sesión con cédula y contraseña.
 * @returns {{ tokens, rol, permisos, message }}
 */
export const login = async (cedula, password) => {
  const response = await apiClient.post('/auth/login', { cedula, password })
  const data = getData(response)
  return {
    access_token:  data.access_token,
    refresh_token: data.refresh_token,
    rol:           data.rol,
    permisos:      data.permisos,
    expires_in:    data.expires_in,
    message:       getMsg(response),
  }
}

/**
 * Cerrar sesión — revoca el token JWT en el servidor.
 */
export const logout = async () => {
  await apiClient.post('/auth/logout')
  localStorage.removeItem('access_token')
  localStorage.removeItem('usuario')
}

/**
 * Obtener el perfil del usuario autenticado.
 * @returns {{ usuario, permisos }}
 */
export const getMe = async () => {
  const response = await apiClient.get('/auth/me')
  return getData(response)
}
