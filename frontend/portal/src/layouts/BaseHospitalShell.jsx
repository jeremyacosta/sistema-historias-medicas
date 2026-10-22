// ============================================================
//  src/layouts/BaseHospitalShell.jsx
//  SHELL REUTILIZABLE — Cosmos Medical Enterprise Hospital Shell
//  Recibe: navGroups, colorAccento (hex), rolDisplay, servicioActivo
//  Usado por: MedicoLayout, AdmisionLayout, AdminLayout
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ── Icono SVG Cruz Médica Institucional ──────────────────────
const IconCruzMedica = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

// ── Icono Salir ───────────────────────────────────────────────
const IconSalir = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

// ── Icono Hamburguesa ─────────────────────────────────────────
const IconMenu = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

// ── Icono Cerrar ──────────────────────────────────────────────
const IconCerrar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * BaseHospitalShell
 * @param {Array}  navGroups      - Grupos de navegación del layout específico
 * @param {string} colorAccento   - Color hex del acento del rol (ej: '#2563EB')
 * @param {string} rolDisplay     - Texto legible del rol (ej: 'Médico de Guardia')
 * @param {string} servicioActivo - Nombre del servicio activo del rol
 */
export default function BaseHospitalShell({
  navGroups = [],
  colorAccento = '#2563EB',
  rolDisplay = 'Personal Hospitalario',
  servicioActivo = 'Emergencia Adultos',
}) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarAbierto, setSidebarAbierto] = useState(true)
  const [menuMovil,      setMenuMovil]      = useState(false)
  const [horaActual,     setHoraActual]     = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Convierte el hex del acento en variantes de estilo inline
  const estiloActivo = {
    background: colorAccento,
    boxShadow:  `0 4px 14px ${colorAccento}44`,
  }
  const estiloRolBadge = {
    background:  `${colorAccento}18`,
    color:        colorAccento,
    borderColor:  `${colorAccento}44`,
  }
  const estiloIndicador = {
    background: colorAccento,
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased overflow-hidden">

      {/* ── OVERLAY MÓVIL ── */}
      {menuMovil && (
        <div
          onClick={() => setMenuMovil(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* ══════════════════════════════════════════════════════
          SIDEBAR INSTITUCIONAL — Cosmos Deep Navy
      ══════════════════════════════════════════════════════ */}
      <aside
        style={{
          background:  'linear-gradient(180deg, #091528 0%, #060e1d 100%)',
          boxShadow:   '4px 0 24px rgba(0,0,0,0.15)',
        }}
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col
          border-r border-white/10
          transition-all duration-300 ease-in-out
          ${menuMovil ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${sidebarAbierto ? 'md:w-64' : 'md:w-[68px]'}
        `}
      >
        {/* ── Cabecera del Sidebar ── */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            {/* Logo institucional con aura del color del rol */}
            <div
              className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${colorAccento}CC, ${colorAccento}88)`,
                boxShadow:  `0 4px 16px ${colorAccento}44`,
              }}
            >
              <IconCruzMedica />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {(sidebarAbierto || menuMovil) && (
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-black text-white tracking-wide truncate">
                  Hosp. Pérez de León
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-semibold text-blue-300/80 uppercase tracking-wider truncate">
                    MPPS · Distrito 7
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle sidebar desktop */}
          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={sidebarAbierto ? 'Contraer menú' : 'Expandir menú'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={sidebarAbierto ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
              />
            </svg>
          </button>

          {/* Cerrar en móvil */}
          <button
            onClick={() => setMenuMovil(false)}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <IconCerrar />
          </button>
        </div>

        {/* ── Servicio Activo & Nodo ── */}
        {(sidebarAbierto || menuMovil) && (
          <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Servicio Activo
                </p>
                <p className="text-xs font-bold text-white mt-0.5">{servicioActivo}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                24H ACTIVO
              </span>
            </div>
          </div>
        )}

        {/* ── Navegación por Grupos ── */}
        <nav className="flex-1 py-4 px-2.5 space-y-6 overflow-y-auto">
          {navGroups.map((grupo) => (
            <div key={grupo.titulo} className="space-y-1">
              {(sidebarAbierto || menuMovil) && (
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400/80 px-3 pb-1">
                  {grupo.titulo}
                </p>
              )}
              {grupo.items.map((item) => {
                const activo = location.pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuMovil(false)}
                    title={!sidebarAbierto ? item.label : undefined}
                    className={`
                      relative group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                      transition-all duration-200
                      ${activo
                        ? 'text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }
                    `}
                    style={activo ? estiloActivo : {}}
                  >
                    <div className={`flex items-center min-w-0 ${sidebarAbierto || menuMovil ? 'gap-3' : 'justify-center w-full'}`}>
                      <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${activo ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      {(sidebarAbierto || menuMovil) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {(sidebarAbierto || menuMovil) && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                          activo ? 'bg-white/20 text-white' : item.badgeClass || 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {activo && (
                      <span
                        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full shadow-sm"
                        style={estiloIndicador}
                      />
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Perfil Autenticado & Cierre ── */}
        <div className="p-3 border-t border-white/10 bg-black/25">
          {(sidebarAbierto || menuMovil) ? (
            <div className="flex items-center gap-2.5 mb-3 p-1.5 rounded-xl bg-white/[0.04] border border-white/5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-md"
                style={{ background: `linear-gradient(135deg, ${colorAccento}CC, ${colorAccento}88)` }}
              >
                {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{usuario?.nombre_completo}</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">{rolDisplay}</p>
              </div>
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white mx-auto mb-3 shadow-md"
              style={{ background: `linear-gradient(135deg, ${colorAccento}CC, ${colorAccento}88)` }}
            >
              {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <IconSalir />
            {(sidebarAbierto || menuMovil) && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          ÁREA CENTRAL DE TRABAJO — Blanco Clínico Institucional
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">

        {/* ── Topbar Clínico HUD ── */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuMovil(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <IconMenu />
            </button>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full hidden sm:inline-block"
                  style={{ background: colorAccento }}
                />
                <h1 className="text-sm font-black text-slate-900 tracking-tight">
                  Hospital Periférico de Petare
                </h1>
                <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline italic">
                  "Dr. Ana Francisca Pérez de León"
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">
                Ministerio del Poder Popular para la Salud · Distrito Sanitario N° 7 · Red Pública
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Reloj clínico en vivo */}
            <div className="text-right hidden md:block px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl">
              <p className="text-xs font-mono font-black text-slate-800 tabular-nums">
                {horaActual.toLocaleTimeString('es-VE')}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {horaActual.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short' })}
              </p>
            </div>

            {/* Nodo PostgreSQL */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-emerald-800">PostgreSQL 16</span>
            </div>

            {/* Badge del rol activo — color del acento */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm"
              style={estiloRolBadge}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: colorAccento }} />
              {rolDisplay}
            </span>
          </div>
        </header>

        {/* ── Contenido Principal de las Vistas ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
