// ============================================================
//  src/components/ui/ProtectedRoute.jsx
//  Guarda de ruta: redirige al login si no hay sesión.
//  Opcionalmente verifica un permiso RBAC específico.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * @param {string}  permiso  - Código RBAC requerido (opcional)
 * @param {string}  rol      - Rol requerido (opcional)
 * @param {string}  redirect - Ruta de redirección si no autenticado
 */
export default function ProtectedRoute({
  permiso  = null,
  rol      = null,
  redirect = '/login',
}) {
  const { estaAutenticado, cargando, tienePermiso, tieneRol } = useAuth()

  // Mientras verifica sesión → spinner de carga
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-hospital-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // No autenticado → login
  if (!estaAutenticado) return <Navigate to={redirect} replace />

  // Verifica permiso RBAC si se especificó
  if (permiso && !tienePermiso(permiso)) {
    return <Navigate to="/acceso-denegado" state={{ permisoRequerido: permiso }} replace />
  }

  // Verifica rol si se especificó
  if (rol && !tieneRol(rol)) {
    return <Navigate to="/acceso-denegado" state={{ rolRequerido: rol }} replace />
  }

  return <Outlet />
}
