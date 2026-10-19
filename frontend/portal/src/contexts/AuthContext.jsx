// ============================================================
//  src/contexts/AuthContext.jsx — Contexto Global de Sesión
//  Gestiona: usuario autenticado, permisos RBAC, login, logout
//  Cualquier componente puede acceder con useAuth()
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario,   setUsuario]   = useState(null)
  const [permisos,  setPermisos]  = useState([])
  const [cargando,  setCargando]  = useState(true)   // Verifica sesión al iniciar la app

  // ── Al montar: restaurar sesión desde localStorage ────────
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getMe()
        .then(({ usuario, permisos }) => {
          setUsuario(usuario)
          setPermisos(permisos)
        })
        .catch(() => {
          // Token inválido o expirado: limpiar
          localStorage.removeItem('access_token')
          localStorage.removeItem('usuario')
        })
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (cedula, password) => {
    const result = await apiLogin(cedula, password)
    localStorage.setItem('access_token', result.access_token)
    // Cargar el perfil completo post-login
    const perfil = await getMe()
    setUsuario(perfil.usuario)
    setPermisos(perfil.permisos)
    return perfil
  }, [])

  // ── Logout ────────────────────────────────────────────────
  const logoutSession = useCallback(async () => {
    try { await apiLogout() } catch (_) {}
    setUsuario(null)
    setPermisos([])
  }, [])

  // ── Helper RBAC: ¿tiene este permiso? ────────────────────
  const tienePermiso = useCallback((permiso) => {
    return permisos.includes(permiso)
  }, [permisos])

  // ── Helper: ¿tiene este rol? ──────────────────────────────
  const tieneRol = useCallback((rol) => {
    return usuario?.rol === rol
  }, [usuario])

  const value = {
    usuario,
    permisos,
    cargando,
    estaAutenticado: !!usuario,
    login,
    logout: logoutSession,
    tienePermiso,
    tieneRol,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Hook de acceso ────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
