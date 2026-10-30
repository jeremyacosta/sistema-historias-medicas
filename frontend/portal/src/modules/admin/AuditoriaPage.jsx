// ============================================================
//  src/modules/admin/AuditoriaPage.jsx
//  M7 — Auditoria Forense de Accesos (Vista Completa)
//  Cosmos Clinical Command · Acento: Rojo Forense #DC2626
//  Instituto Municipal de Salud Ana Francisca Perez de Leon
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// ── Datos de auditoría demo (fuente: tabla auditoria_accesos) ──
const REGISTROS_DEMO = [
  { id: 1,  fecha: '2026-10-30', hora: '16:42:11', usuario: 'Dr. Hector Morales',     cedula: '18765432', rol: 'medico',   accion: 'HISTORIA_LEIDA',        modulo: 'Historias M2',    ip: '192.168.1.12', detalle: 'Historia #F051-0042 de paciente C.I: 29.100.200', nivel: 'info'    },
  { id: 2,  fecha: '2026-10-30', hora: '16:38:54', usuario: 'Adm. Eli Araujo',        cedula: '25333444', rol: 'admision', accion: 'PACIENTE_ADMITIDO',     modulo: 'Admision M1',     ip: '192.168.1.08', detalle: 'Paciente Maria Torres C.I: 30.500.100 — F-052 generado', nivel: 'success' },
  { id: 3,  fecha: '2026-10-30', hora: '16:30:05', usuario: 'Dr. Hector Morales',     cedula: '18765432', rol: 'medico',   accion: 'RECETA_EMITIDA',        modulo: 'Recipes M5',      ip: '192.168.1.12', detalle: 'Receta QR#0088 emitida para paciente 29.100.200', nivel: 'info'    },
  { id: 4,  fecha: '2026-10-30', hora: '16:25:00', usuario: 'Dr. Hector Morales',     cedula: '18765432', rol: 'medico',   accion: 'DATOS_VITALES_LEIDOS',  modulo: 'Historias M2',    ip: '192.168.1.12', detalle: 'Consulta signos vitales paciente C.I: 29.100.200', nivel: 'info'    },
  { id: 5,  fecha: '2026-10-30', hora: '16:10:33', usuario: 'Adm. Jeremy Acosta',     cedula: '30047210', rol: 'admision', accion: 'LOGIN_EXITOSO',         modulo: 'Auth',            ip: '192.168.1.20', detalle: 'Sesion iniciada desde navegador Chrome 128', nivel: 'success' },
  { id: 6,  fecha: '2026-10-30', hora: '15:55:00', usuario: 'Admin Sistema',          cedula: '12345678', rol: 'admin',    accion: 'USUARIO_CREADO',        modulo: 'Gestion SYS',     ip: '127.0.0.1',    detalle: 'Usuario Dr. Pedro Ramirez C.I: 20.111.222 dado de alta', nivel: 'warning' },
  { id: 7,  fecha: '2026-10-30', hora: '15:20:33', usuario: 'Adm. Jeremy Acosta',     cedula: '30047210', rol: 'admision', accion: 'MORBILIDAD_REGISTRADA', modulo: 'Morbilidad M3',   ip: '192.168.1.20', detalle: 'Actividad MPPS CIE-10: J06.9 — 12 casos', nivel: 'info'    },
  { id: 8,  fecha: '2026-10-30', hora: '14:05:10', usuario: 'Adm. Eli Araujo',        cedula: '25333444', rol: 'admision', accion: 'PACIENTE_EDITADO',      modulo: 'Admision M1',     ip: '192.168.1.08', detalle: 'Datos de contacto actualizados — Paciente 29.100.200', nivel: 'info'    },
  { id: 9,  fecha: '2026-10-30', hora: '13:55:47', usuario: 'Dr. Pedro Ramirez',      cedula: '20111222', rol: 'medico',   accion: 'LOGIN_FALLIDO',         modulo: 'Auth',            ip: '192.168.1.15', detalle: 'Contrasena incorrecta — intento 2/5', nivel: 'error'   },
  { id: 10, fecha: '2026-10-30', hora: '13:30:00', usuario: 'Admin Sistema',          cedula: '12345678', rol: 'admin',    accion: 'SISTEMA_REINICIADO',    modulo: 'Infra SYS',       ip: '127.0.0.1',    detalle: 'Reinicio planificado del servidor de aplicacion FastAPI', nivel: 'warning' },
  { id: 11, fecha: '2026-10-29', hora: '18:15:22', usuario: 'Dr. Hector Morales',     cedula: '18765432', rol: 'medico',   accion: 'HISTORIA_EMITIDA',      modulo: 'Emergencia M2',   ip: '192.168.1.12', detalle: 'F-051 #0041 emitido para paciente C.I: 31.200.300', nivel: 'success' },
  { id: 12, fecha: '2026-10-29', hora: '09:10:05', usuario: 'Dr. Pedro Ramirez',      cedula: '20111222', rol: 'medico',   accion: 'LOGIN_EXITOSO',         modulo: 'Auth',            ip: '192.168.1.15', detalle: 'Sesion iniciada desde navegador Firefox 121', nivel: 'success' },
  { id: 13, fecha: '2026-10-28', hora: '17:00:00', usuario: 'Admin Sistema',          cedula: '12345678', rol: 'admin',    accion: 'CONTRASENA_RESETEADA',  modulo: 'Gestion SYS',     ip: '127.0.0.1',    detalle: 'Contrasena temporal asignada al usuario Enf. Maria Rodriguez', nivel: 'warning' },
  { id: 14, fecha: '2026-10-28', hora: '11:45:30', usuario: 'Enf. Maria Rodriguez',   cedula: '22888999', rol: 'enfermeria','accion': 'ACCESO_DENEGADO',   modulo: 'Auth',            ip: '10.0.0.5',     detalle: 'Intento de acceso a modulo admin sin permiso suficiente', nivel: 'error'   },
  { id: 15, fecha: '2026-10-27', hora: '16:20:45', usuario: 'Adm. Eli Araujo',        cedula: '25333444', rol: 'admision', accion: 'CENSO_EXPORTADO',       modulo: 'Admision M1',     ip: '192.168.1.08', detalle: 'Exportacion censo diario 27/10/2026 — 48 pacientes', nivel: 'info'    },
]

const NIVEL_CONFIG = {
  info:    { label: 'INFO',   bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563EB' },
  success: { label: 'OK',     bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: '#16A34A' },
  warning: { label: 'ALERTA', bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: '#D97706' },
  error:   { label: 'CRITICO', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: '#DC2626' },
}

const ROL_CONFIG = {
  admin:      { label: 'Administrador', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: '#7C3AED' },
  medico:     { label: 'Medico',        bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563EB' },
  admision:   { label: 'Admision',      bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: '#D97706' },
  enfermeria: { label: 'Enfermeria',    bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: '#0D9488' },
}

const ACCIONES_TIPO = [
  'TODAS',
  'LOGIN_EXITOSO', 'LOGIN_FALLIDO', 'ACCESO_DENEGADO',
  'HISTORIA_LEIDA', 'HISTORIA_EMITIDA',
  'PACIENTE_ADMITIDO', 'PACIENTE_EDITADO',
  'RECETA_EMITIDA', 'MORBILIDAD_REGISTRADA', 'CENSO_EXPORTADO',
  'USUARIO_CREADO', 'CONTRASENA_RESETEADA', 'SISTEMA_REINICIADO',
  'DATOS_VITALES_LEIDOS',
]

// ── SVG Iconos ────────────────────────────────────────────────
const IconAuditoria = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const IconFiltro = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)
const IconLimpiar = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ── Modal: Detalle de evento ───────────────────────────────────
function ModalDetalle({ registro, onCerrar }) {
  const nc = NIVEL_CONFIG[registro.nivel] || NIVEL_CONFIG.info
  const rc = ROL_CONFIG[registro.rol] || ROL_CONFIG.admision

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)' }}
        >
          <div>
            <p className="text-[9px] font-black text-red-200 uppercase tracking-widest">M7 — Auditoria Forense</p>
            <h3 className="text-base font-black text-white">Detalle del Evento</h3>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconLimpiar />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Accion y nivel */}
          <div className="flex items-center justify-between">
            <p className="font-mono font-black text-slate-900 text-sm">{registro.accion}</p>
            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${nc.bg} ${nc.text} ${nc.border}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: nc.dot }} />
              {nc.label}
            </span>
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Fecha" valor={registro.fecha} />
            <Campo label="Hora (UTC-4)" valor={registro.hora} mono />
            <Campo label="Usuario" valor={registro.usuario} />
            <Campo label="Cedula" valor={registro.cedula} mono />
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Rol:</span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${rc.bg} ${rc.text} ${rc.border}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: rc.dot }} />
                {rc.label}
              </span>
            </div>
            <Campo label="Modulo" valor={registro.modulo} />
            <Campo label="IP de Origen" valor={registro.ip} mono />
          </div>

          {/* Detalle */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Detalle del Evento</p>
            <p className="text-xs text-slate-700 leading-relaxed">{registro.detalle}</p>
          </div>

          {/* ID inmutable */}
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <p className="text-[9px] font-black text-red-600 uppercase tracking-wider">ID Inmutable del Registro</p>
            <p className="font-mono font-black text-red-700 text-xs">AUD-{String(registro.id).padStart(8, '0')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Campo({ label, valor, mono }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-xs font-bold text-slate-800 ${mono ? 'font-mono' : ''}`}>{valor}</p>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────
export default function AuditoriaPage() {
  const { usuario } = useAuth()

  // Filtros
  const [filtroCedula, setFiltroCedula]   = useState('')
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('')
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('')
  const [filtroIP, setFiltroIP]           = useState('')
  const [filtroAccion, setFiltroAccion]   = useState('TODAS')
  const [filtroRol, setFiltroRol]         = useState('todos')
  const [registroDetalle, setRegistroDetalle] = useState(null)

  // Filtrado reactivo
  const registrosFiltrados = useMemo(() => {
    return REGISTROS_DEMO.filter(r => {
      if (filtroCedula.trim() && !r.cedula.includes(filtroCedula.trim())) return false
      if (filtroFechaDesde && r.fecha < filtroFechaDesde) return false
      if (filtroFechaHasta && r.fecha > filtroFechaHasta) return false
      if (filtroIP.trim() && !r.ip.includes(filtroIP.trim())) return false
      if (filtroAccion !== 'TODAS' && r.accion !== filtroAccion) return false
      if (filtroRol !== 'todos' && r.rol !== filtroRol) return false
      return true
    })
  }, [filtroCedula, filtroFechaDesde, filtroFechaHasta, filtroIP, filtroAccion, filtroRol])

  const hayFiltrosActivos = filtroCedula || filtroFechaDesde || filtroFechaHasta || filtroIP || filtroAccion !== 'TODAS' || filtroRol !== 'todos'

  const limpiarFiltros = () => {
    setFiltroCedula('')
    setFiltroFechaDesde('')
    setFiltroFechaHasta('')
    setFiltroIP('')
    setFiltroAccion('TODAS')
    setFiltroRol('todos')
  }

  // Stats del conjunto filtrado
  const stats = useMemo(() => ({
    total:    registrosFiltrados.length,
    errores:  registrosFiltrados.filter(r => r.nivel === 'error').length,
    alertas:  registrosFiltrados.filter(r => r.nivel === 'warning').length,
    exitosos: registrosFiltrados.filter(r => r.nivel === 'success').length,
  }), [registrosFiltrados])

  const inicialesAdmin = `${usuario?.nombre?.[0] || 'A'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #dc2626 100%)',
          boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shadow-lg backdrop-blur-sm flex-shrink-0">
              {inicialesAdmin}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  M7 — Auditoria Forense de Accesos
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight">Registro Inmutable del Sistema</h2>
              <p className="text-red-200 text-xs font-medium mt-0.5">
                Todos los eventos son de solo lectura · No se permite borrado · MPPS DS-7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-red-200 uppercase tracking-widest font-bold">Registros totales</span>
              <span className="text-3xl font-black tabular-nums">{REGISTROS_DEMO.length}</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Filtrados',  valor: stats.total,    dot: '#fca5a5' },
            { label: 'Criticos',   valor: stats.errores,  dot: '#f87171' },
            { label: 'Alertas',    valor: stats.alertas,  dot: '#fbbf24' },
            { label: 'Exitosos',   valor: stats.exitosos, dot: '#34d399' },
          ].map(k => (
            <div key={k.label} className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: k.dot }} />
                <span className="text-[9px] text-white/60 uppercase tracking-wider">{k.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums">{k.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FILTROS ═════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-700">
            <IconFiltro />
            <span className="text-xs font-black uppercase tracking-wider">Filtros de Busqueda</span>
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 hover:text-red-800 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <IconLimpiar />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Cedula */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cedula del Usuario</label>
            <input
              type="text"
              value={filtroCedula}
              onChange={e => setFiltroCedula(e.target.value)}
              placeholder="ej. 18765432"
              className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Fecha Desde */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha Desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha Hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* IP */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">IP de Origen</label>
            <input
              type="text"
              value={filtroIP}
              onChange={e => setFiltroIP(e.target.value)}
              placeholder="ej. 192.168.1"
              className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Tipo de Accion */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo de Accion</label>
            <select
              value={filtroAccion}
              onChange={e => setFiltroAccion(e.target.value)}
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            >
              {ACCIONES_TIPO.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rol del Usuario</label>
            <select
              value={filtroRol}
              onChange={e => setFiltroRol(e.target.value)}
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            >
              <option value="todos">Todos los roles</option>
              {Object.entries(ROL_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-3 font-medium">
          Mostrando <strong className="text-slate-700">{registrosFiltrados.length}</strong> de {REGISTROS_DEMO.length} eventos registrados
          {hayFiltrosActivos && <span className="text-red-600 font-bold ml-1">— filtros activos</span>}
        </p>
      </div>

      {/* ══ TABLA DE AUDITORIA ══════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <IconAuditoria />
            <span className="text-xs font-black uppercase tracking-wider">Log de Eventos — Orden Cronologico Descendente</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
            INMUTABLE · SOLO LECTURA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID', 'Fecha', 'Hora', 'Usuario', 'Rol', 'Accion', 'Modulo', 'IP Origen', 'Nivel', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-slate-400 text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <IconAuditoria />
                      <span>No hay eventos que coincidan con los filtros aplicados.</span>
                    </div>
                  </td>
                </tr>
              ) : registrosFiltrados.map(r => {
                const nc = NIVEL_CONFIG[r.nivel] || NIVEL_CONFIG.info
                const rc = ROL_CONFIG[r.rol] || ROL_CONFIG.admision
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* ID */}
                    <td className="px-4 py-3 font-mono text-[9px] text-slate-400 whitespace-nowrap">
                      {String(r.id).padStart(8, '0')}
                    </td>
                    {/* Fecha */}
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap text-[10px]">{r.fecha}</td>
                    {/* Hora */}
                    <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">{r.hora}</td>
                    {/* Usuario */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{r.usuario}</p>
                      <p className="text-slate-400 font-mono text-[9px]">{r.cedula}</p>
                    </td>
                    {/* Rol */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${rc.bg} ${rc.text} ${rc.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: rc.dot }} />
                        {rc.label}
                      </span>
                    </td>
                    {/* Accion */}
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap text-[10px]">{r.accion}</td>
                    {/* Modulo */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.modulo}</td>
                    {/* IP */}
                    <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap text-[10px]">{r.ip}</td>
                    {/* Nivel */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${nc.bg} ${nc.text} ${nc.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: nc.dot }} />
                        {nc.label}
                      </span>
                    </td>
                    {/* Accion: detalle */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setRegistroDetalle(r)}
                        className="text-[9px] font-black text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer del log */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-[9px] text-slate-400 font-mono">
            Sistema de Auditoria · Instituto Municipal de Salud Ana Francisca Perez de Leon · MPPS DS-7
          </p>
          <p className="text-[9px] text-slate-400 font-mono">
            Logs no editables por diseno · Cumple normativa MPPS
          </p>
        </div>
      </div>

      {/* ══ MODAL DETALLE ═════════════════════════════════════ */}
      {registroDetalle && (
        <ModalDetalle
          registro={registroDetalle}
          onCerrar={() => setRegistroDetalle(null)}
        />
      )}

    </div>
  )
}
