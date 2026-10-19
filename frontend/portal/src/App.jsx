// ============================================================
//  src/App.jsx — Router Principal de la Aplicación
//  Define todas las rutas, layouts y protecciones RBAC
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute   from './components/ui/ProtectedRoute'
import HospitalLayout   from './layouts/HospitalLayout'
import PacienteLayout   from './layouts/PacienteLayout'
import LoginPage        from './modules/auth/LoginPage'
import DashboardPage    from './modules/admision/DashboardPage'
import PacienteDashboard from './modules/paciente/PacienteDashboard'

// ── Páginas placeholder para módulos futuros (Fases 3-9) ────
const Placeholder = ({ titulo }) => (
  <div className="card text-center py-16">
    <p className="text-4xl mb-4">🏗️</p>
    <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
    <p className="text-gray-500 text-sm mt-2">Este módulo se implementará en la próxima fase del proyecto.</p>
  </div>
)

// ── Página de acceso denegado ─────────────────────────────────
const AccesoDenegado = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="card text-center max-w-md">
      <p className="text-5xl mb-4">🚫</p>
      <h2 className="text-xl font-bold text-gray-900">Acceso Denegado</h2>
      <p className="text-gray-500 text-sm mt-2">
        No tiene los permisos necesarios para acceder a esta sección del sistema.
        Contacte al administrador del hospital si cree que es un error.
      </p>
    </div>
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Ruta raíz → redirigir a login ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ── Login (público) ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Error de permisos ── */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* ── Portal Hospitalario (protegido) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<HospitalLayout />}>
              <Route path="/hospital/dashboard" element={<DashboardPage />} />

              {/* Módulo M1 — Admisión (Fase 2) */}
              <Route
                path="/hospital/pacientes"
                element={<ProtectedRoute permiso="paciente:leer" />}
              >
                <Route index element={<Placeholder titulo="Módulo M1 — Admisión y Búsqueda de Pacientes" />} />
              </Route>

              {/* Módulo M2 — Historias Clínicas (Fase 3) */}
              <Route
                path="/hospital/historias"
                element={<ProtectedRoute permiso="historia:leer" />}
              >
                <Route index element={<Placeholder titulo="Módulo M2 — Historias Clínicas" />} />
              </Route>

              {/* Módulo M3 — Récipes QR (Fase 5) */}
              <Route
                path="/hospital/recetas"
                element={<ProtectedRoute permiso="receta:emitir" />}
              >
                <Route index element={<Placeholder titulo="Módulo M3 — Récipes Médicos con Código QR" />} />
              </Route>

              {/* Módulo M4 — Morbilidad (Fase 6) */}
              <Route
                path="/hospital/morbilidad"
                element={<ProtectedRoute permiso="morbilidad:generar" />}
              >
                <Route index element={<Placeholder titulo="Módulo M4 — Planilla de Morbilidad Diaria" />} />
              </Route>
            </Route>
          </Route>

          {/* ── App del Paciente (Ciudadano - Billetera Digital) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PacienteLayout />}>
              <Route path="/paciente/dashboard" element={<PacienteDashboard />} />
              <Route path="/paciente/recetas" element={<PacienteDashboard />} />
              <Route path="/paciente/historial" element={<PacienteDashboard />} />
              <Route path="/paciente/privacidad" element={<PacienteDashboard />} />
            </Route>
          </Route>

          {/* ── Ruta no encontrada ── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
