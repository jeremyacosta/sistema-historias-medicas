// ============================================================
//  src/App.jsx — Router Principal de la Aplicación
//  Define todas las rutas, layouts y protecciones RBAC
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute   from './components/ui/ProtectedRoute'
import HospitalLayout   from './layouts/HospitalLayout'
import PacienteLayout   from './layouts/PacienteLayout'
import LoginPage        from './modules/auth/LoginPage'
import DashboardPage    from './modules/admision/DashboardPage'
import AdmisionPacientesPage from './modules/admision/AdmisionPacientesPage'
import PacienteDashboard from './modules/paciente/PacienteDashboard'

// ── Páginas placeholder para módulos futuros (Fases 3-9) ────
const Placeholder = ({ titulo }) => (
  <div className="card text-center py-16">
    <p className="text-4xl mb-4">🏗️</p>
    <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
    <p className="text-gray-500 text-sm mt-2">Este módulo se implementará en la próxima fase del proyecto.</p>
  </div>
)

// ── Página de control de acceso RBAC — Cosmos Medical ─────────
const AccesoDenegado = () => {
  const { usuario, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const esPaciente = usuario?.rol === 'paciente'
  const permisoRequerido = location.state?.permisoRequerido

  const handleCerrarSesion = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl max-w-lg w-full p-8 text-center space-y-6">
        
        {/* Icono de Seguridad SVG (Cero Emojis) */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Control de Acceso RBAC · Hospital Periférico de Petare
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {esPaciente ? 'Área Restringida al Personal Hospitalario' : 'Acceso Restringido'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {esPaciente ? (
              <>
                Has iniciado sesión con tu cuenta de <strong>Paciente</strong> (
                <span className="font-bold text-slate-800">{usuario?.nombre_completo || 'Jeremy Acosta'}</span> · C.I: {usuario?.cedula}).
                El módulo al que intentas acceder pertenece a la <strong>Admisión Central y Gestión Clínica</strong> del hospital, reservada exclusivamente para Médicos y Personal Acreditado.
              </>
            ) : (
              <>
                Tu cuenta de <strong className="text-slate-800">{usuario?.nombre_completo || 'Personal Clínico'}</strong> (Rol: {usuario?.rol || 'No asignado'})
                no cuenta con el permiso requerido ({permisoRequerido ? <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono text-[11px]">{permisoRequerido}</code> : 'permiso insuficiente'}).
              </>
            )}
          </p>
        </div>

        {/* Botones de Acción Inmediata */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          {esPaciente ? (
            <button
              onClick={() => navigate('/paciente/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Ir a mi Billetera de Salud
            </button>
          ) : (
            <button
              onClick={() => navigate('/hospital/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              Volver a la Estación Clínica
            </button>
          )}

          <button
            onClick={handleCerrarSesion}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
          >
            Cambiar de Usuario
          </button>
        </div>

      </div>
    </div>
  )
}

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

              {/* Módulo M1 — Admisión (Formato 052) */}
              <Route
                path="/hospital/pacientes"
                element={<ProtectedRoute permiso="paciente:leer" />}
              >
                <Route index element={<AdmisionPacientesPage />} />
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
