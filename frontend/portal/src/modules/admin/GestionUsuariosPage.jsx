// ============================================================
//  src/modules/admin/GestionUsuariosPage.jsx
//  M4 — Gestión de Personal Hospitalario
//  Cosmos Clinical Command · Acento: Violeta Gestión #7C3AED
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// ── Datos de personal (demo — fuente: 02_seed_data.sql) ───────
const PERSONAL_INICIAL = [
  {
    id: 1,
    nombre: 'Admin Sistema',
    cedula: '12.345.678',
    rol: 'admin',
    especialidad: 'Administración de Sistemas',
    correo: 'admin@perezdeleon.gob.ve',
    telefono: '0412-000-0001',
    estado: 'activo',
    ultimoAcceso: '30/10/2026 15:55',
    fechaAlta: '01/01/2026',
  },
  {
    id: 2,
    nombre: 'Dr. Héctor Morales',
    cedula: '18.765.432',
    rol: 'medico',
    especialidad: 'Medicina Interna',
    correo: 'hmorales@perezdeleon.gob.ve',
    telefono: '0414-876-5432',
    estado: 'activo',
    ultimoAcceso: '30/10/2026 16:42',
    fechaAlta: '15/01/2026',
  },
  {
    id: 3,
    nombre: 'Dr. Pedro Ramírez',
    cedula: '20.111.222',
    rol: 'medico',
    especialidad: 'Pediatría',
    correo: 'pramirez@perezdeleon.gob.ve',
    telefono: '0424-111-2222',
    estado: 'activo',
    ultimoAcceso: '29/10/2026 09:10',
    fechaAlta: '20/02/2026',
  },
  {
    id: 4,
    nombre: 'Adm. Eli Araujo',
    cedula: '25.333.444',
    rol: 'admision',
    especialidad: 'Admisión y Triaje',
    correo: 'earaujo@perezdeleon.gob.ve',
    telefono: '0416-333-4444',
    estado: 'activo',
    ultimoAcceso: '30/10/2026 16:38',
    fechaAlta: '15/01/2026',
  },
  {
    id: 5,
    nombre: 'Adm. Jeremy Acosta',
    cedula: '30.047.210',
    rol: 'admision',
    especialidad: 'Admisión y Triaje',
    correo: 'jacosta@perezdeleon.gob.ve',
    telefono: '0412-047-2100',
    estado: 'activo',
    ultimoAcceso: '30/10/2026 15:20',
    fechaAlta: '10/03/2026',
  },
  {
    id: 6,
    nombre: 'Enf. María Rodríguez',
    cedula: '22.888.999',
    rol: 'enfermeria',
    especialidad: 'Enfermería General',
    correo: 'mrodriguez@perezdeleon.gob.ve',
    telefono: '0426-888-9990',
    estado: 'suspendido',
    ultimoAcceso: '10/09/2026 08:30',
    fechaAlta: '01/04/2026',
  },
]

const ROL_CONFIG = {
  admin:      { label: 'Administrador',  bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: '#7C3AED' },
  medico:     { label: 'Médico',         bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563EB' },
  admision:   { label: 'Admisión',       bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: '#D97706' },
  enfermeria: { label: 'Enfermería',     bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: '#0D9488' },
}

const ESTADO_CONFIG = {
  activo:     { label: 'Activo',     bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: '#16A34A', pulse: true  },
  suspendido: { label: 'Suspendido', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: '#D97706', pulse: false },
  bloqueado:  { label: 'Bloqueado',  bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: '#DC2626', pulse: false },
}

const ROLES_FILTRO = [
  { value: 'todos',      label: 'Todos los roles' },
  { value: 'admin',      label: 'Administrador' },
  { value: 'medico',     label: 'Médico' },
  { value: 'admision',   label: 'Admisión' },
  { value: 'enfermeria', label: 'Enfermería' },
]

// ── SVG Iconos ────────────────────────────────────────────────
const IconUsuario = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const IconBuscar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const IconMas = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)
const IconCerrar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IconLlave = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
)

// ── Modal: Nuevo Usuario ───────────────────────────────────────
function ModalNuevoUsuario({ onCerrar, onGuardar }) {
  const [form, setForm] = useState({
    nombre: '', cedula: '', rol: 'medico',
    especialidad: '', correo: '', telefono: '',
  })
  const [errores, setErrores] = useState({})

  const set = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: null }))
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim())      e.nombre      = 'Requerido'
    if (!form.cedula.trim())      e.cedula      = 'Requerido'
    if (!form.correo.trim())      e.correo      = 'Requerido'
    if (!form.especialidad.trim()) e.especialidad = 'Requerido'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleGuardar = () => {
    if (!validar()) return
    onGuardar({
      ...form,
      id: Date.now(),
      estado: 'activo',
      ultimoAcceso: 'Nunca',
      fechaAlta: new Date().toLocaleDateString('es-VE'),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header del modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)' }}>
          <div>
            <p className="text-[9px] font-black text-violet-200 uppercase tracking-widest">M4 — Gestión de Personal</p>
            <h3 className="text-base font-black text-white">Alta de Nuevo Usuario</h3>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconCerrar />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CampoTexto label="Nombre Completo" campo="nombre" form={form} set={set} errores={errores} colSpan={2} />
            <CampoTexto label="Cedula (sin puntos)" campo="cedula" form={form} set={set} errores={errores} placeholder="12345678" />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Rol</label>
              <select
                value={form.rol}
                onChange={e => set('rol', e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
              >
                {Object.entries(ROL_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <CampoTexto label="Especialidad / Cargo" campo="especialidad" form={form} set={set} errores={errores} colSpan={2} />
            <CampoTexto label="Correo Institucional" campo="correo" form={form} set={set} errores={errores} placeholder="usuario@perezdeleon.gob.ve" />
            <CampoTexto label="Telefono" campo="telefono" form={form} set={set} errores={errores} placeholder="0412-000-0000" />
          </div>

          {/* Nota contraseña */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <IconLlave />
            <p className="text-[10px] text-amber-700 leading-relaxed">
              Se generara la contrasena inicial <strong>Test1234!</strong>. El usuario debera cambiarla en su primer inicio de sesion.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-5 py-2 text-xs font-bold text-white rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #7c3aed)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
          >
            Registrar Usuario
          </button>
        </div>
      </div>
    </div>
  )
}

function CampoTexto({ label, campo, form, set, errores, placeholder, colSpan }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={form[campo]}
        onChange={e => set(campo, e.target.value)}
        placeholder={placeholder || ''}
        className={`w-full text-xs font-medium text-slate-800 bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 ${errores[campo] ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
      />
      {errores[campo] && <p className="text-[9px] text-red-600 mt-0.5 font-bold">{errores[campo]}</p>}
    </div>
  )
}

// ── Modal: Confirmar accion ────────────────────────────────────
function ModalConfirmar({ accion, usuario, onConfirmar, onCerrar }) {
  const ACCIONES = {
    suspender: { titulo: 'Suspender Acceso', desc: `El usuario ${usuario?.nombre} perdera acceso inmediatamente al sistema.`, color: '#D97706', btnLabel: 'Suspender' },
    activar:   { titulo: 'Reactivar Acceso', desc: `El usuario ${usuario?.nombre} recuperara acceso completo segun su rol.`,   color: '#16A34A', btnLabel: 'Reactivar'  },
    bloquear:  { titulo: 'Bloquear Usuario', desc: `El usuario ${usuario?.nombre} quedara bloqueado de forma permanente hasta revision.`, color: '#DC2626', btnLabel: 'Bloquear'  },
    reset:     { titulo: 'Resetear Contrasena', desc: `Se asignara la contrasena temporal Test1234! al usuario ${usuario?.nombre}.`, color: '#7C3AED', btnLabel: 'Resetear'  },
  }
  const cfg = ACCIONES[accion] || {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow"
            style={{ background: cfg.color }}>
            <IconLlave />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">{cfg.titulo}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{cfg.desc}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCerrar} className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl cursor-pointer shadow"
            style={{ background: cfg.color }}
          >
            {cfg.btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────
export default function GestionUsuariosPage() {
  const { usuario } = useAuth()
  const [personal, setPersonal]         = useState(PERSONAL_INICIAL)
  const [busqueda, setBusqueda]         = useState('')
  const [filtroRol, setFiltroRol]       = useState('todos')
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(null) // { accion, usuario }

  // Filtrado reactivo
  const personalFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return personal.filter(u => {
      const matchBusqueda = !q || u.nombre.toLowerCase().includes(q) || u.cedula.includes(q) || u.correo.toLowerCase().includes(q)
      const matchRol = filtroRol === 'todos' || u.rol === filtroRol
      return matchBusqueda && matchRol
    })
  }, [personal, busqueda, filtroRol])

  // Estadisticas
  const stats = useMemo(() => ({
    total:      personal.length,
    activos:    personal.filter(u => u.estado === 'activo').length,
    suspendidos: personal.filter(u => u.estado === 'suspendido').length,
    bloqueados: personal.filter(u => u.estado === 'bloqueado').length,
    medicos:    personal.filter(u => u.rol === 'medico').length,
  }), [personal])

  const handleNuevoUsuario = (datos) => {
    setPersonal(prev => [datos, ...prev])
    setMostrarModal(false)
  }

  const ejecutarAccion = () => {
    if (!modalConfirm) return
    const { accion, usuario: usr } = modalConfirm
    setPersonal(prev => prev.map(u => {
      if (u.id !== usr.id) return u
      if (accion === 'activar')   return { ...u, estado: 'activo' }
      if (accion === 'suspender') return { ...u, estado: 'suspendido' }
      if (accion === 'bloquear')  return { ...u, estado: 'bloqueado' }
      return u // reset no cambia estado
    }))
    setModalConfirm(null)
  }

  const inicialesAdmin = `${usuario?.nombre?.[0] || 'A'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.25)',
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
                  M4 — Gestión de Personal Hospitalario
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight">Personal del Sistema</h2>
              <p className="text-violet-200 text-xs font-medium mt-0.5">
                Instituto Municipal de Salud Ana Francisca Perez de Leon · MPPS DS-7
              </p>
            </div>
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-violet-700 hover:bg-violet-50 text-xs font-bold transition-all duration-150 active:scale-[0.97] shadow-lg cursor-pointer self-start sm:self-auto"
          >
            <IconMas />
            Nuevo Usuario
          </button>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Total Personal',  valor: stats.total,       dot: '#818cf8' },
            { label: 'Activos',         valor: stats.activos,     dot: '#34d399' },
            { label: 'Suspendidos',     valor: stats.suspendidos, dot: '#fbbf24' },
            { label: 'Bloqueados',      valor: stats.bloqueados,  dot: '#f87171' },
            { label: 'Medicos',         valor: stats.medicos,     dot: '#60a5fa' },
          ].map(k => (
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

      {/* ══ BARRA DE BUSQUEDA Y FILTROS ═══════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconBuscar />
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, cedula o correo..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtro por rol */}
          <div className="flex gap-2 flex-wrap">
            {ROLES_FILTRO.map(r => (
              <button
                key={r.value}
                onClick={() => setFiltroRol(r.value)}
                className={`text-[10px] font-black px-3 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  filtroRol === r.value
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contador de resultados */}
        <p className="text-[10px] text-slate-400 mt-3 font-medium">
          Mostrando <strong className="text-slate-700">{personalFiltrado.length}</strong> de {personal.length} usuarios registrados
        </p>
      </div>

      {/* ══ TABLA DE PERSONAL ══════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Personal', 'Cedula', 'Rol', 'Especialidad / Cargo', 'Contacto', 'Ultimo Acceso', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {personalFiltrado.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 text-xs">
                    <div className="flex flex-col items-center gap-2">
                      <IconUsuario />
                      <span>No se encontraron usuarios con los filtros aplicados.</span>
                    </div>
                  </td>
                </tr>
              ) : personalFiltrado.map(u => {
                const rc = ROL_CONFIG[u.rol] || ROL_CONFIG.admision
                const ec = ESTADO_CONFIG[u.estado] || ESTADO_CONFIG.activo
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Personal */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-sm"
                          style={{ background: rc.dot }}
                        >
                          {u.nombre[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.nombre}</p>
                          <p className="text-slate-400 text-[9px]">{u.correo}</p>
                        </div>
                      </div>
                    </td>
                    {/* Cedula */}
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">{u.cedula}</td>
                    {/* Rol */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${rc.bg} ${rc.text} ${rc.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: rc.dot }} />
                        {rc.label}
                      </span>
                    </td>
                    {/* Especialidad */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{u.especialidad}</td>
                    {/* Contacto */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-mono text-slate-600">{u.telefono}</p>
                      <p className="text-slate-400 text-[9px]">Alta: {u.fechaAlta}</p>
                    </td>
                    {/* Ultimo acceso */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[10px]">{u.ultimoAcceso}</td>
                    {/* Estado */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${ec.bg} ${ec.text} ${ec.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ec.pulse ? 'animate-pulse' : ''}`} style={{ background: ec.dot }} />
                        {ec.label}
                      </span>
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {u.estado === 'activo' ? (
                          <button
                            onClick={() => setModalConfirm({ accion: 'suspender', usuario: u })}
                            className="text-[9px] font-black text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => setModalConfirm({ accion: 'activar', usuario: u })}
                            className="text-[9px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Activar
                          </button>
                        )}
                        {u.estado !== 'bloqueado' && (
                          <button
                            onClick={() => setModalConfirm({ accion: 'bloquear', usuario: u })}
                            className="text-[9px] font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Bloquear
                          </button>
                        )}
                        <button
                          onClick={() => setModalConfirm({ accion: 'reset', usuario: u })}
                          className="text-[9px] font-black text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ MODALES ═══════════════════════════════════════════ */}
      {mostrarModal && (
        <ModalNuevoUsuario
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleNuevoUsuario}
        />
      )}
      {modalConfirm && (
        <ModalConfirmar
          accion={modalConfirm.accion}
          usuario={modalConfirm.usuario}
          onConfirmar={ejecutarAccion}
          onCerrar={() => setModalConfirm(null)}
        />
      )}

    </div>
  )
}
