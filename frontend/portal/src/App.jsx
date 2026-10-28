// ============================================================
//  src/App.jsx — Router Principal de la Aplicación
//  Arquitectura RBAC Modular: 4 espacios de trabajo estrictamente aislados
//  MedicoLayout · AdmisionLayout · AdminLayout · PacienteLayout
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute        from './components/ui/ProtectedRoute'
import PacienteLayout        from './layouts/PacienteLayout'
import MedicoLayout          from './layouts/MedicoLayout'
import AdmisionLayout        from './layouts/AdmisionLayout'
import AdminLayout           from './layouts/AdminLayout'
import LoginPage             from './modules/auth/LoginPage'
// ── Módulo Médico ─────────────────────────────────────────────
import MedicoDashboard       from './modules/medico/MedicoDashboard'
import RegistroMorbilidadPage from './modules/medico/RegistroMorbilidadPage'
// ── Módulo Admisión ───────────────────────────────────────────
import DashboardPage         from './modules/admision/DashboardPage'
import AdmisionPacientesPage from './modules/admision/AdmisionPacientesPage'
// ── Módulo Admin ──────────────────────────────────────────────
import AdminDashboard        from './modules/admin/AdminDashboard'
// ── Módulo Paciente ───────────────────────────────────────────
import PacienteDashboard     from './modules/paciente/PacienteDashboard'

// ── Página placeholder para módulos en desarrollo ────────────
const Placeholder = ({ titulo }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center py-16 px-6 max-w-lg mx-auto my-8">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
    <h2 className="text-lg font-bold text-slate-800">{titulo}</h2>
    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
      Módulo oficial en fase de despliegue según el cronograma de investigación TEG 2026.
    </p>
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

  // Determinar ruta de regreso según rol
  const rutaRegreso = {
    admin:    '/admin/dashboard',
    medico:   '/medico/dashboard',
    admision: '/admision/dashboard',
    paciente: '/paciente/dashboard',
  }[usuario?.rol] || '/login'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl max-w-lg w-full p-8 text-center space-y-6">

        {/* Icono de Seguridad SVG */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Control de Acceso RBAC · Instituto Municipal de Salud Ana Francisca Pérez de León
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {esPaciente ? 'Área Restringida al Personal Hospitalario' : 'Acceso Restringido'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {esPaciente ? (
              <>
                Has iniciado sesión con tu cuenta de <strong>Paciente</strong> (
                <span className="font-bold text-slate-800">{usuario?.nombre_completo}</span> · C.I: {usuario?.cedula}).
                El módulo al que intentas acceder pertenece al área hospitalaria, reservada exclusivamente para personal acreditado.
              </>
            ) : (
              <>
                Tu cuenta de <strong className="text-slate-800">{usuario?.nombre_completo || 'Personal Clínico'}</strong> (Rol: {usuario?.rol || 'No asignado'})
                no cuenta con el permiso requerido {permisoRequerido ? <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono text-[11px]">{permisoRequerido}</code> : ''}.
              </>
            )}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => navigate(rutaRegreso)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            Volver a mi Estación
          </button>
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
          {/* ── Ruta raíz → login ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ── Login (público) ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Error de permisos ── */}
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* ══════════════════════════════════════════════════
              ESPACIO 1 — ESTACIÓN MÉDICA CLÍNICA
              Roles: medico
          ══════════════════════════════════════════════════ */}
          <Route element={<ProtectedRoute rol="medico" />}>
            <Route element={<MedicoLayout />}>
              <Route path="/medico/dashboard" element={<MedicoDashboard />} />
              <Route
                path="/medico/historias"
                element={<ProtectedRoute permiso="historia:leer" />}
              >
                <Route index element={<Placeholder titulo="Módulo M2 — Historias Clínicas" />} />
              </Route>
              <Route
                path="/medico/recetas"
                element={<ProtectedRoute permiso="receta:emitir" />}
              >
                <Route index element={<Placeholder titulo="Módulo M5 — Récipes Médicos con Código QR" />} />
              </Route>
              <Route path="/medico/notas" element={<Placeholder titulo="Notas de Evolución Clínica" />} />
              <Route path="/medico/morbilidad" element={<RegistroMorbilidadPage />} />
            </Route>
          </Route>

          {/* ══════════════════════════════════════════════════
              ESPACIO 2 — PORTAL DE ADMISIÓN & TRIAJE
              Roles: admision
          ══════════════════════════════════════════════════ */}
          <Route element={<ProtectedRoute rol="admision" />}>
            <Route element={<AdmisionLayout />}>
              <Route path="/admision/dashboard" element={<DashboardPage />} />
              <Route
                path="/admision/pacientes"
                element={<ProtectedRoute permiso="paciente:leer" />}
              >
                <Route index element={<AdmisionPacientesPage />} />
              </Route>
              <Route
                path="/admision/morbilidad"
                element={<ProtectedRoute permiso="morbilidad:generar" />}
              >
                <Route index element={<RegistroMorbilidadPage />} />
              </Route>
            </Route>
          </Route>

          {/* ══════════════════════════════════════════════════
              ESPACIO 3 — CONSOLA ADMINISTRATIVA / DIRECCIÓN
              Roles: admin (panel único exclusivo)
          ══════════════════════════════════════════════════ */}
          <Route element={<ProtectedRoute rol="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios"  element={<Placeholder titulo="Gestión de Usuarios y Roles del Sistema" />} />
              <Route path="/admin/auditoria" element={<Placeholder titulo="Registro de Auditoría Inmutable del Sistema" />} />
            </Route>
          </Route>

          {/* ══════════════════════════════════════════════════
              ESPACIO 4 — BILLETERA DIGITAL DEL PACIENTE
              Roles: paciente
          ══════════════════════════════════════════════════ */}
          <Route element={<ProtectedRoute rol="paciente" />}>
            <Route element={<PacienteLayout />}>
              <Route path="/paciente/dashboard"  element={<PacienteDashboard />} />
              <Route path="/paciente/recetas"    element={<PacienteDashboard />} />
              <Route path="/paciente/historial"  element={<PacienteDashboard />} />
              <Route path="/paciente/privacidad" element={<PacienteDashboard />} />
            </Route>
          </Route>

          {/* ── Ruta no encontrada → login ── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
