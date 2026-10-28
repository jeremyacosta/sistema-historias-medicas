// ============================================================
//  src/components/ui/ProtectedRoute.jsx
//  Guarda de ruta RBAC Modular — Cosmos Medical
//  Soporta: permiso específico, rol específico, y admin bypass
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * @param {string}  permiso  - Código RBAC requerido (opcional)
 * @param {string}  rol      - Rol requerido para este espacio de trabajo (opcional)
 *                             El rol 'admin' siempre pasa todas las restricciones.
 * @param {string}  redirect - Ruta de redirección si no autenticado
 */
export default function ProtectedRoute({
  permiso  = null,
  rol      = null,
  redirect = '/login',
}) {
  const { estaAutenticado, cargando, tienePermiso, tieneRol, usuario } = useAuth()

  // Mientras verifica sesión → spinner institucional
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Verificando sesión · MPPS DS-7...</p>
        </div>
      </div>
    )
  }

  // No autenticado → login
  if (!estaAutenticado) return <Navigate to={redirect} replace />

  // El rol 'admin' tiene bypass total sobre cualquier restricción de rol o permiso
  const esAdmin = usuario?.rol === 'admin'

  // Verifica rol del espacio de trabajo si se especificó
  // admin siempre pasa; si el rol no coincide → acceso denegado
  if (rol && !esAdmin && !tieneRol(rol)) {
    return <Navigate to="/acceso-denegado" state={{ rolRequerido: rol }} replace />
  }

  // Verifica permiso RBAC específico si se especificó
  // admin siempre tiene todos los permisos (tienePermiso ya lo maneja en AuthContext)
  if (permiso && !tienePermiso(permiso)) {
    return <Navigate to="/acceso-denegado" state={{ permisoRequerido: permiso }} replace />
  }

  return <Outlet />
}
