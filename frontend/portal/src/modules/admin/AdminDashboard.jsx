// ============================================================
//  src/modules/admin/AdminDashboard.jsx
//  Consola Administrativa — Cosmos Clinical Command
//  Acento: Violeta Gestión #7C3AED
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// ── Datos del sistema (demo) ──────────────────────────────────
const REGISTROS_AUDITORIA = [
  { id: 1, usuario: 'Dr. H. Morales',   cedula: '18.765.432', accion: 'HISTORIA_LEIDA',   modulo: 'Historias M2', ip: '192.168.1.12', ts: '16:42:11', nivel: 'info' },
  { id: 2, usuario: 'Adm. Eli Araujo',  cedula: '27.000.000', accion: 'PACIENTE_ADMITIDO', modulo: 'Admisión M1',  ip: '192.168.1.08', ts: '16:38:54', nivel: 'success' },
  { id: 3, usuario: 'Dr. H. Morales',   cedula: '18.765.432', accion: 'RECETA_EMITIDA',    modulo: 'Récipes M5',   ip: '192.168.1.12', ts: '16:30:05', nivel: 'info' },
  { id: 4, usuario: 'Admin Sistema',    cedula: '00.000.001', accion: 'USUARIO_CREADO',    modulo: 'Gestión SYS',  ip: '127.0.0.1',    ts: '15:55:00', nivel: 'warning' },
  { id: 5, usuario: 'Adm. Jeremy Acosta', cedula: '30.047.210', accion: 'LOGIN_EXITOSO',   modulo: 'Auth',         ip: '192.168.1.20', ts: '15:20:33', nivel: 'success' },
]

const USUARIOS_SISTEMA = [
  { nombre: 'Dr. H. Morales',      rol: 'medico',   cedula: '18.765.432', estado: 'activo',  ultimoAcceso: 'Hoy 16:42' },
  { nombre: 'Eli Araujo',          rol: 'admision', cedula: '27.000.000', estado: 'activo',  ultimoAcceso: 'Hoy 16:38' },
  { nombre: 'Jeremy Acosta',       rol: 'admision', cedula: '30.047.210', estado: 'activo',  ultimoAcceso: 'Hoy 15:20' },
  { nombre: 'Admin Sistema',       rol: 'admin',    cedula: '00.000.001', estado: 'activo',  ultimoAcceso: 'Hoy 15:55' },
]

const ROL_DISPLAY = {
  admin:    { label: 'Administrador', color: '#7C3AED', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  medico:   { label: 'Médico',        color: '#2563EB', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  admision: { label: 'Admisión',      color: '#D97706', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  paciente: { label: 'Paciente',      color: '#059669', bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200'},
}

const NIVEL_AUDITORIA = {
  info:    { dot: '#2563EB', label: 'INFO',    bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  success: { dot: '#16A34A', label: 'OK',      bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  warning: { dot: '#D97706', label: 'ALERTA',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  error:   { dot: '#DC2626', label: 'ERROR',   bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
}

// ── SVG Íconos ────────────────────────────────────────────────
const IconUsuarios = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)
const IconAuditoria = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const IconDB = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  </svg>
)

export default function AdminDashboard() {
  const { usuario } = useAuth()
  const navigate    = useNavigate()
  const [tabActivo, setTabActivo] = useState('auditoria')

  const inicialesA = `${usuario?.nombre?.[0] || 'A'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════════════
          HEADER — Consola Administrativa
      ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.25)',
        }}
      >
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shadow-lg backdrop-blur-sm flex-shrink-0">
              {inicialesA}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  Consola de Administración
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight">{usuario?.nombre_completo || 'Administrador del Sistema'}</h2>
              <p className="text-violet-200 text-xs font-medium mt-0.5">
                Acceso Total al Sistema · Instituto Municipal de Salud Ana Francisca Pérez de León · MPPS
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/usuarios')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-violet-700 hover:bg-violet-50 text-xs font-bold transition-all duration-150 active:scale-[0.97] shadow-lg cursor-pointer self-start sm:self-auto"
          >
            <IconUsuarios />
            Gestionar Usuarios
          </button>
        </div>

        {/* KPIs del sistema */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Usuarios Activos',        valor: USUARIOS_SISTEMA.filter(u => u.estado === 'activo').length.toString(), dot: '#34d399' },
            { label: 'Sesiones Hoy',             valor: '5',  dot: '#818cf8' },
            { label: 'Registros de Auditoría',   valor: REGISTROS_AUDITORIA.length.toString(), dot: '#fbbf24' },
            { label: 'Estado del Sistema',       valor: '100%', dot: '#34d399' },
          ].map((k) => (
            <div key={k.label} className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: k.dot }} />
                <span className="text-[9px] text-white/60 uppercase tracking-wider truncate">{k.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums">{k.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ACCESOS RÁPIDOS ADMINISTRATIVOS
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <IconUsuarios />,
            titulo: 'Gestión de Usuarios',
            desc: 'Crear, editar y asignar roles al personal hospitalario',
            badge: 'SYS',
            color: '#7C3AED',
            ruta: '/admin/usuarios',
          },
          {
            icon: <IconAuditoria />,
            titulo: 'Auditoría Inmutable',
            desc: 'Historial completo de accesos, acciones e IPs del sistema',
            badge: 'SEC',
            color: '#DC2626',
            ruta: '/admin/auditoria',
          },
          {
            icon: <IconDB />,
            titulo: 'Estado del Sistema',
            desc: 'PostgreSQL 16 · Sesiones activas · Métricas del servidor',
            badge: 'DB',
            color: '#059669',
            ruta: '/admin/dashboard',
          },
        ].map((acc) => (
          <button
            key={acc.titulo}
            onClick={() => navigate(acc.ruta)}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: acc.color }}
              >
                {acc.icon}
              </div>
              <span
                className="text-[9px] font-mono font-black px-2 py-0.5 rounded-lg border"
                style={{ color: acc.color, borderColor: `${acc.color}44`, background: `${acc.color}12` }}
              >
                {acc.badge}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{acc.titulo}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{acc.desc}</p>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          PANEL DUAL: USUARIOS + AUDITORÍA
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
          {[
            { key: 'auditoria', label: 'Auditoría del Sistema' },
            { key: 'usuarios',  label: 'Usuarios Registrados' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTabActivo(t.key)}
              className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tabActivo === t.key
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Auditoría */}
        {tabActivo === 'auditoria' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Hora', 'Usuario', 'Acción', 'Módulo', 'IP', 'Nivel'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REGISTROS_AUDITORIA.map((r) => {
                  const nc = NIVEL_AUDITORIA[r.nivel]
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-500 tabular-nums whitespace-nowrap">{r.ts}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{r.usuario}</p>
                        <p className="text-slate-400">{r.cedula}</p>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">{r.accion}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.modulo}</td>
                      <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">{r.ip}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${nc.bg} ${nc.text} ${nc.border}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: nc.dot }} />
                          {nc.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Usuarios */}
        {tabActivo === 'usuarios' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Nombre', 'Cédula', 'Rol', 'Estado', 'Último Acceso', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {USUARIOS_SISTEMA.map((u) => {
                  const rc = ROL_DISPLAY[u.rol] || ROL_DISPLAY.admision
                  return (
                    <tr key={u.cedula} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                            style={{ background: rc.color }}
                          >
                            {u.nombre[0]}
                          </div>
                          <span className="font-bold text-slate-900">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">{u.cedula}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${rc.bg} ${rc.text} ${rc.border}`}>
                          {rc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {u.estado.charAt(0).toUpperCase() + u.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{u.ultimoAcceso}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button className="text-[10px] font-bold text-violet-600 hover:text-violet-800 hover:bg-violet-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-violet-200 hover:border-violet-300">
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
