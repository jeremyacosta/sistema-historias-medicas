// ============================================================
//  src/layouts/PacienteLayout.jsx — Portal Ciudadano de Salud
//  DISEÑO: "Cosmos Medical" — Billetera de Salud Digital
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ModalSeguridadOnboarding from '../components/seguridad/ModalSeguridadOnboarding'

const NAV_PACIENTE = [
  {
    label: 'Carnet QR & Ficha Médica',
    to: '/paciente/dashboard',
    tag: 'P1',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
  },
  {
    label: 'Mis Récipes Digitales',
    to: '/paciente/recetas',
    tag: 'P2',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Historial de Consultas',
    to: '/paciente/historial',
    tag: 'P3',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Consentimiento & Privacidad',
    to: '/paciente/privacidad',
    tag: 'P6',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

export default function PacienteLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuMovil, setMenuMovil] = useState(false)
  const [onboardingCompletado, setOnboardingCompletado] = useState(false)

  const debeOnboarding = Boolean(usuario?.debe_cambiar_pass && !onboardingCompletado)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased overflow-hidden">

      {/* ── Overlay Móvil ── */}
      {menuMovil && (
        <div
          onClick={() => setMenuMovil(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ══════════════════════════════════════════════════════
          SIDEBAR CIUDADANO — Cosmos Emerald Medical
      ══════════════════════════════════════════════════════ */}
      <aside
        style={{
          background: 'linear-gradient(180deg, #022c22 0%, #064e3b 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 flex flex-col
          border-r border-emerald-500/20
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${menuMovil ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Cabecera del Portal Paciente */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-black text-white truncate tracking-wide">
                Billetera de Salud
              </p>
              <p className="text-[10px] font-bold text-emerald-300/80 truncate uppercase tracking-wider">
                Portal Ciudadano MPPS
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuMovil(false)}
            className="md:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tarjeta del Titular de Salud */}
        <div className="p-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-md border border-white/20">
              {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold text-white truncate">{usuario?.nombre_completo}</p>
              <p className="text-[10px] font-mono font-medium text-emerald-300 mt-0.5">
                V-{usuario?.cedula}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
              Expediente Digital
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-200 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Soberanía de Datos
            </span>
          </div>
        </div>

        {/* Navegación del Paciente */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300/60 px-3 pb-2">
            Mis Servicios Clínicos
          </p>
          {NAV_PACIENTE.map((item) => {
            const activo = location.pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuMovil(false)}
                className={`
                  relative group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200
                  ${activo
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/40 font-bold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-white/[0.08]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${activo ? 'text-white' : 'text-emerald-300'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                    activo ? 'bg-white/20 text-white' : 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/50'
                  }`}
                >
                  {item.tag}
                </span>

                {activo && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-300 rounded-r-full shadow-sm" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Pie: Cerrar Sesión */}
        <div className="p-3 border-t border-white/10 bg-black/25">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Mi Sesión
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          ÁREA DE CONTENIDO DEL PACIENTE — Blanco Clínico Puro
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">

        {/* Top Bar del Paciente */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuMovil(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 hidden sm:inline-block" />
                <p className="text-sm font-black text-slate-900 tracking-tight">
                  Hospital Periférico de Petare
                </p>
                <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline italic">
                  "Dr. Ana Francisca Pérez de León"
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
                Billetera Digital y Carnet Vital · Distrito Sanitario N° 7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Paciente Ciudadano
            </span>
          </div>
        </header>

        {/* Vista Activa */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* ── Modal Onboarding Obligatorio si tiene clave provisional ── */}
      <ModalSeguridadOnboarding
        isOpen={debeOnboarding}
        onCompletado={() => setOnboardingCompletado(true)}
      />
    </div>
  )
}
