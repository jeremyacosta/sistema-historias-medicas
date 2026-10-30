// ============================================================
//  src/modules/medico/HistoriasPage.jsx
//  M2 — Archivo General de Historias Clínicas
//  Cosmos Clinical Command · Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import HistorialClinicoPanel from '../../components/historias/HistorialClinicoPanel'

// ── Archivo de historias clínicas (demo — fuente: tabla historias_emergencia_051) ──
const ARCHIVO_HISTORIAS = [
  {
    historia: 'HPL-2026-00001',
    cedula: '30.047.210',
    nombre: 'Jeremy Acosta',
    edad: 24,
    sangre: 'O+',
    alergia: 'PNC',
    sexo: 'M',
    triaje: 'III',
    triajeLabel: 'Urgencia',
    triajeColor: '#CA8A04',
    ultimaAtencion: '2026-10-29',
    totalAtenciones: 3,
    motivo: 'Cefalea pulsátil y síndrome febril agudo 48H',
    servicio: 'Emergencia Adultos',
    medicoTratante: 'Dr. H. Morales',
    estado: 'alta',
  },
  {
    historia: 'HPL-2026-00002',
    cedula: '29.921.654',
    nombre: 'Eli Araujo',
    edad: 22,
    sangre: 'A+',
    alergia: null,
    sexo: 'F',
    triaje: 'IV',
    triajeLabel: 'Semi-urgente',
    triajeColor: '#16A34A',
    ultimaAtencion: '2026-10-25',
    totalAtenciones: 1,
    motivo: 'Control tensional y cefalea leve',
    servicio: 'Consulta Externa',
    medicoTratante: 'Dr. P. Ramírez',
    estado: 'alta',
  },
  {
    historia: 'HPL-2026-00003',
    cedula: '5.100.200',
    nombre: 'Roberto Pérez',
    edad: 69,
    sangre: 'O+',
    alergia: 'AINE',
    sexo: 'M',
    triaje: 'II',
    triajeLabel: 'Emergencia',
    triajeColor: '#EA580C',
    ultimaAtencion: '2026-10-30',
    totalAtenciones: 8,
    motivo: 'Dolor precordial con irradiación a brazo izquierdo',
    servicio: 'Emergencia Adultos',
    medicoTratante: 'Dr. H. Morales',
    estado: 'observacion',
  },
  {
    historia: 'HPL-2026-00004',
    cedula: '12.345.678',
    nombre: 'María González',
    edad: 45,
    sangre: 'A+',
    alergia: null,
    sexo: 'F',
    triaje: 'IV',
    triajeLabel: 'Semi-urgente',
    triajeColor: '#16A34A',
    ultimaAtencion: '2026-10-28',
    totalAtenciones: 2,
    motivo: 'Lumbalgia crónica en reagudización. Fisioterapia pautada.',
    servicio: 'Ortopedia',
    medicoTratante: 'Dr. P. Ramírez',
    estado: 'alta',
  },
  {
    historia: 'HPL-2026-00005',
    cedula: '8.900.100',
    nombre: 'Carmen López',
    edad: 58,
    sangre: 'B-',
    alergia: 'Sulfas',
    sexo: 'F',
    triaje: 'III',
    triajeLabel: 'Urgencia',
    triajeColor: '#CA8A04',
    ultimaAtencion: '2026-10-27',
    totalAtenciones: 5,
    motivo: 'Descompensación hipertensiva. TA 180/110 mmHg.',
    servicio: 'Medicina Interna',
    medicoTratante: 'Dr. H. Morales',
    estado: 'hospitalizacion',
  },
  {
    historia: 'HPL-2026-00006',
    cedula: '20.500.300',
    nombre: 'Luis Herrera',
    edad: 31,
    sangre: 'AB+',
    alergia: null,
    sexo: 'M',
    triaje: 'V',
    triajeLabel: 'No urgente',
    triajeColor: '#2563EB',
    ultimaAtencion: '2026-10-20',
    totalAtenciones: 1,
    motivo: 'Certificado médico pre-empleo. Sin hallazgos patológicos.',
    servicio: 'Consulta Externa',
    medicoTratante: 'Dr. P. Ramírez',
    estado: 'alta',
  },
]

const TRIAJE_CONFIG = {
  'I':   { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: '#DC2626' },
  'II':  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: '#EA580C' },
  'III': { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: '#CA8A04' },
  'IV':  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: '#16A34A' },
  'V':   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563EB' },
}

const ESTADO_CONFIG = {
  alta:            { label: 'Alta Médica',      bg: 'bg-slate-100',    text: 'text-slate-600',   dot: '#94A3B8' },
  observacion:     { label: 'Observación',      bg: 'bg-amber-50',     text: 'text-amber-700',   dot: '#D97706' },
  hospitalizacion: { label: 'Hospitalizado',    bg: 'bg-blue-50',      text: 'text-blue-700',    dot: '#2563EB' },
  urgente:         { label: 'Urgencia activa',  bg: 'bg-red-50',       text: 'text-red-700',     dot: '#DC2626' },
}

const SERVICIOS_FILTRO = [
  'Todos los servicios',
  'Emergencia Adultos',
  'Medicina Interna',
  'Consulta Externa',
  'Ortopedia',
  'Pediatría',
]

// ── SVG Iconos ────────────────────────────────────────────────
const IconBuscar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const IconHistoria = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconLimpiar = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function HistoriasPage() {
  const { usuario } = useAuth()
  const [busqueda, setBusqueda]           = useState('')
  const [filtroTriaje, setFiltroTriaje]   = useState('todos')
  const [filtroServicio, setFiltroServicio] = useState('Todos los servicios')
  const [pacienteActivo, setPacienteActivo] = useState(null)

  // Filtrado reactivo
  const historiasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return ARCHIVO_HISTORIAS.filter(h => {
      const matchBusqueda =
        !q ||
        h.nombre.toLowerCase().includes(q) ||
        h.cedula.replace(/\./g, '').includes(q.replace(/\./g, '')) ||
        h.historia.toLowerCase().includes(q)
      const matchTriaje   = filtroTriaje === 'todos' || h.triaje === filtroTriaje
      const matchServicio = filtroServicio === 'Todos los servicios' || h.servicio === filtroServicio
      return matchBusqueda && matchTriaje && matchServicio
    })
  }, [busqueda, filtroTriaje, filtroServicio])

  const hayFiltros = busqueda || filtroTriaje !== 'todos' || filtroServicio !== 'Todos los servicios'
  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroTriaje('todos')
    setFiltroServicio('Todos los servicios')
  }

  const stats = useMemo(() => ({
    total:          ARCHIVO_HISTORIAS.length,
    hospitalizados: ARCHIVO_HISTORIAS.filter(h => h.estado === 'hospitalizacion').length,
    observacion:    ARCHIVO_HISTORIAS.filter(h => h.estado === 'observacion').length,
    atencionesMes:  ARCHIVO_HISTORIAS.reduce((s, h) => s + h.totalAtenciones, 0),
  }), [])

  const inicialesM = `${usuario?.nombre?.[0] || 'M'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shadow-lg backdrop-blur-sm flex-shrink-0">
              {inicialesM}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  M2 — Archivo General de Historias Clínicas
                </span>
              </div>
              <h2 className="text-xl font-black leading-tight">Expedientes Hospitalarios</h2>
              <p className="text-blue-200 text-xs font-medium mt-0.5">
                {usuario?.nombre_completo || 'Médico de Guardia'} · Instituto Municipal de Salud Ana Francisca Perez de Leon
              </p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Total Expedientes',  valor: stats.total,          dot: '#818cf8' },
            { label: 'Hospitalizados',     valor: stats.hospitalizados, dot: '#60a5fa' },
            { label: 'En Observacion',     valor: stats.observacion,    dot: '#fbbf24' },
            { label: 'Atenciones Totales', valor: stats.atencionesMes,  dot: '#34d399' },
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

      {/* ══ BARRA DE BUSQUEDA Y FILTROS ══════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador principal */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <IconBuscar />
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, cedula o numero de historia (HPL-2026-NNNNN)..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <IconLimpiar />
              </button>
            )}
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filtro Triaje Manchester */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Triaje:</span>
            {[
              { v: 'todos', label: 'Todos' },
              { v: 'I',     label: 'I · Inmediato' },
              { v: 'II',    label: 'II · Emergencia' },
              { v: 'III',   label: 'III · Urgencia' },
              { v: 'IV',    label: 'IV · Semi-urgente' },
              { v: 'V',     label: 'V · No urgente' },
            ].map(t => (
              <button
                key={t.v}
                onClick={() => setFiltroTriaje(t.v)}
                className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  filtroTriaje === t.v
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Filtro Servicio */}
          <select
            value={filtroServicio}
            onChange={e => setFiltroServicio(e.target.value)}
            className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {SERVICIOS_FILTRO.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <IconLimpiar />
              Limpiar
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          Mostrando <strong className="text-slate-700">{historiasFiltradas.length}</strong> de {ARCHIVO_HISTORIAS.length} expedientes registrados
        </p>
      </div>

      {/* ══ TABLA DEL ARCHIVO ════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Archivo de Expedientes — Orden Cronológico</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['No. Historia', 'Paciente', 'Triaje', 'Servicio', 'Ultimo Motivo', 'Ultima Atencion', 'Atenciones', 'Estado', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historiasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <IconHistoria />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-600">No se encontraron expedientes</p>
                        <p className="text-xs text-slate-400 mt-0.5">Intenta con otro nombre, cedula o numero de historia.</p>
                      </div>
                      {hayFiltros && (
                        <button
                          onClick={limpiarFiltros}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Limpiar todos los filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : historiasFiltradas.map(h => {
                const tc = TRIAJE_CONFIG[h.triaje] || TRIAJE_CONFIG['V']
                const ec = ESTADO_CONFIG[h.estado]  || ESTADO_CONFIG.alta
                const esActivo = pacienteActivo?.historia === h.historia
                return (
                  <tr
                    key={h.historia}
                    className={`hover:bg-blue-50/30 transition-colors group ${esActivo ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}
                  >
                    {/* No. Historia */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-black text-slate-700 text-[11px]">{h.historia}</span>
                    </td>
                    {/* Paciente */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-sm"
                          style={{ background: tc.dot }}
                        >
                          {h.nombre[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{h.nombre}</p>
                          <p className="text-slate-400 font-mono text-[9px]">{h.cedula} · {h.edad} años · {h.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                          <div className="flex gap-1 mt-0.5">
                            <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1 rounded">{h.sangre}</span>
                            {h.alergia && (
                              <span className="bg-red-100 text-red-700 text-[8px] font-bold px-1 rounded">Alergia {h.alergia}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Triaje */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md border ${tc.bg} ${tc.text} ${tc.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: tc.dot }} />
                        {h.triaje} · {h.triajeLabel}
                      </span>
                    </td>
                    {/* Servicio */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-[11px] font-medium">
                      {h.servicio}
                    </td>
                    {/* Ultimo motivo */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-slate-600 leading-snug line-clamp-2 text-[11px]">{h.motivo}</p>
                      <p className="text-slate-400 text-[9px] mt-0.5">{h.medicoTratante}</p>
                    </td>
                    {/* Ultima atencion */}
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-500 text-[10px]">
                      {h.ultimaAtencion}
                    </td>
                    {/* Total atenciones */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black">
                        {h.totalAtenciones}
                      </span>
                    </td>
                    {/* Estado */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md ${ec.bg} ${ec.text}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: ec.dot }} />
                        {ec.label}
                      </span>
                    </td>
                    {/* Accion */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setPacienteActivo(esActivo ? null : h)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                          esActivo
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200 hover:border-blue-300 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {esActivo ? 'Viendo' : 'Ver Historia'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[9px] text-slate-400 font-mono">
            Archivo Clinico · Instituto Municipal de Salud Ana Francisca Perez de Leon · Todos los expedientes son confidenciales — Ley de Salud Art. 69
          </p>
        </div>
      </div>

      {/* ══ HISTORIAL CLÍNICO UNIFICADO (MODAL FLOTANTE) ══════ */}
      {pacienteActivo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setPacienteActivo(null) }}
        >
          <div className="w-full max-w-5xl">
            <HistorialClinicoPanel
              paciente={pacienteActivo}
              onClose={() => setPacienteActivo(null)}
            />
          </div>
        </div>
      )}

    </div>
  )
}
