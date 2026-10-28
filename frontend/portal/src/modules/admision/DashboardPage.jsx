// ============================================================
//  src/modules/admision/DashboardPage.jsx — Estación de Trabajo
//  DISEÑO: "Cosmos Clinical Command Center" — World-Class Hospital HUD
//  Equipo: Visual Designer + UX Designer + UI Designer + Graphic Designer
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ModalHistoria051 from '../../components/historias/ModalHistoria051'

// ── Censo en Vivo de Emergencias (Manchester Triage Protocol) ─
const PACIENTES_GUARDIA = [
  {
    historia: 'HPL-2024-00003',
    cedula: '5.100.200',
    nombre: 'Roberto Pérez',
    edad: '69',
    sexo: 'M',
    sangre: 'O+',
    triaje: 'II',
    triajeLabel: 'Emergencia Calificada',
    triajeColor: '#ea580c',
    triajeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    signos: { ta: '160/100', spo2: '94%', fc: '98 lpm', temp: '37.1 °C' },
    motivo: 'Dolor precordial opresivo con irradiación a brazo izquierdo y crisis hipertensiva',
    tiempoEspera: '06 min',
    maxEspera: '10 min',
    alertaSLA: 'Normal',
    estado: 'En Box de Atención',
    estadoBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    medicoAsignado: 'Dr. H. Morales',
  },
  {
    historia: 'HPL-2024-00001',
    cedula: '30.047.210',
    nombre: 'Jeremy Acosta',
    edad: '24',
    sexo: 'M',
    sangre: 'O+',
    alergia: 'Alergia PNC',
    triaje: 'III',
    triajeLabel: 'Urgencia Menor',
    triajeColor: '#ca8a04',
    triajeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    signos: { ta: '120/80', spo2: '99%', fc: '76 lpm', temp: '38.5 °C' },
    motivo: 'Cefalea pulsátil persistente y síndrome febril agudo de 48 horas de evolución',
    tiempoEspera: '18 min',
    maxEspera: '60 min',
    alertaSLA: 'Normal',
    estado: 'En Espera de Triaje',
    estadoBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    medicoAsignado: 'Pendiente',
  },
  {
    historia: 'HPL-2024-00002',
    cedula: '29.921.654',
    nombre: 'Eli Araujo',
    edad: '23',
    sexo: 'F',
    sangre: 'A+',
    triaje: 'IV',
    triajeLabel: 'Consulta General',
    triajeColor: '#16a34a',
    triajeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    signos: { ta: '115/75', spo2: '99%', fc: '72 lpm', temp: '36.6 °C' },
    motivo: 'Control post-tratamiento bronquial y solicitud de récipe oficial firmado',
    tiempoEspera: '24 min',
    maxEspera: '120 min',
    alertaSLA: 'Normal',
    estado: 'Llamada a Consulta',
    estadoBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    medicoAsignado: 'Dr. H. Morales',
  },
]

export default function DashboardPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [tipoCedula, setTipoCedula] = useState('V')
  const [numeroCedula, setNumeroCedula] = useState('')
  const [filtroTriaje, setFiltroTriaje] = useState('TODOS')
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [pacienteEmergencia, setPacienteEmergencia] = useState(null)

  const handleBuscarPaciente = (e) => {
    e.preventDefault()
    const limpia = numeroCedula.trim().replace(/\D/g, '')
    if (!limpia) {
      setErrorBusqueda('Ingrese el número de cédula para consultar.')
      return
    }
    setErrorBusqueda('')
    navigate(`/admision/pacientes?cedula=${tipoCedula}${limpia}`)
  }

  // Filtrado de pacientes en consola
  const pacientesFiltrados = PACIENTES_GUARDIA.filter((p) => {
    if (filtroTriaje === 'TODOS') return true
    return p.triaje === filtroTriaje
  })

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">

      {/* ══════════════════════════════════════════════════════════
          1. HEADER CLINICO ENTERPRISE — COMMAND CENTER HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* Fondo sutil con gradiente clínico y grilla técnica */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/[0.03] via-indigo-900/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Identificación del profesional y servicio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CONSOLA CLÍNICA DE GUARDIA 24H
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-slate-600">
                Instituto Municipal de Salud Ana Francisca Pérez de León
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Distrito Sanitario N° 7 · MPPS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {usuario?.nombre_completo ? `Dr. ${usuario.nombre_completo}` : 'Estación Médica de Guardia'}
              </h1>
              <span className="text-sm font-semibold text-slate-500">
                {usuario?.rol === 'medico' ? 'Médico Especialista de Emergencias' : 'Coordinación Clínica F-052'}
              </span>
            </div>

            {/* Telemetría rápida del médico */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Matrícula MPPS: <strong className="text-slate-800 font-mono">45.892</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Turno Activo: <strong className="text-slate-800 font-mono">07:00 - 19:00</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Cédula: <strong className="text-slate-800 font-mono">V-{usuario?.cedula || '18765432'}</strong></span>
              </div>
            </div>
          </div>

          {/* CTA Principal de Acción Rápida */}
          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <button
              onClick={() => navigate('/admision/pacientes')}
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-90 duration-300">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="leading-tight">Apertura de Expediente</p>
                <p className="text-[10px] text-blue-200 font-normal">Formato Oficial 052 MPPS</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. HUD DE TELEMETRÍA CLÍNICA (4 WIDGETS AVANZADOS)
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* KPI 1: Triaje Manchester */}
        <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Manchester Triage
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Niveles II-IV
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tabular-nums">03</span>
              <span className="text-xs font-semibold text-slate-500">pacientes en sala</span>
            </div>
            {/* Semáforo Manchester visual */}
            <div className="space-y-1.5 my-3">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5 p-0.5">
                <div className="h-full rounded-full bg-orange-500 w-[35%]" title="Nivel II: 35%" />
                <div className="h-full rounded-full bg-amber-500 w-[40%]" title="Nivel III: 40%" />
                <div className="h-full rounded-full bg-emerald-500 w-[25%]" title="Nivel IV: 25%" />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>NII: 1 (Emerg)</span>
                <span>NIII: 1 (Urg)</span>
                <span>NIV: 1 (Cons)</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Espera promedio: <strong className="text-slate-700 font-mono">16 min</strong>
          </p>
        </div>

        {/* KPI 2: Historias F-052 */}
        <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Expedientes F-052
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Digital
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tabular-nums">100%</span>
              <span className="text-xs font-semibold text-emerald-600">Cero Papel</span>
            </div>
            <p className="text-xs text-slate-500 my-2 leading-relaxed">
              Todos los ingresos de guardia archivados con firma médica digital y formato oficial.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Expedientes hoy</span>
            <strong className="text-slate-800 font-mono">14 digitalizados</strong>
          </p>
        </div>

        {/* KPI 3: Récipes Digitales SHA-256 */}
        <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Prescripciones QR
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Sync SHA-256
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tabular-nums">08</span>
              <span className="text-xs font-semibold text-slate-500">récipes emitidos</span>
            </div>
            <p className="text-xs text-slate-500 my-2 leading-relaxed">
              Dispensación directa con código QR escaneable en farmacia hospitalaria sin recetas falsas.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Seguridad cripto</span>
            <strong className="text-emerald-600 font-bold inline-flex items-center gap-1">Verificado <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></strong>
          </p>
        </div>

        {/* KPI 4: Cierre de Morbilidad MPPS */}
        <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Morbilidad 24H
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Planilla EPI-12
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">Automático</span>
            </div>
            <p className="text-xs text-slate-500 my-2 leading-relaxed">
              Consolidación en 1 clic de patologías atendidas para el reporte distrital del Ministerio de Salud.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Estado cierre</span>
            <strong className="text-amber-600 font-bold">Listo al Cierre</strong>
          </p>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          3. BARRA DE COMANDO: BÚSQUEDA RÁPIDA & FILTROS MANCHESTER
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Formulario de búsqueda rápida por Cédula */}
          <form onSubmit={handleBuscarPaciente} className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white shadow-inner focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <select
                value={tipoCedula}
                onChange={(e) => setTipoCedula(e.target.value)}
                className="px-3.5 py-2.5 text-xs font-black bg-slate-100 text-slate-700 border-r border-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="V">V-</option>
                <option value="E">E-</option>
                <option value="P">P-</option>
              </select>
              <input
                type="text"
                value={numeroCedula}
                onChange={(e) => {
                  setNumeroCedula(e.target.value)
                  if (errorBusqueda) setErrorBusqueda('')
                }}
                placeholder="Buscar cédula del paciente (ej. 30047210)..."
                className="px-4 py-2.5 text-sm font-mono text-slate-800 placeholder-slate-400 w-full sm:w-80 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Consultar Historia</span>
            </button>
          </form>

          {/* Filtros rápidos Manchester */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
              Filtro Manchester:
            </span>
            {[
              { id: 'TODOS', label: 'Todos (3)' },
              { id: 'II', label: 'Nivel II (Emerg)' },
              { id: 'III', label: 'Nivel III (Urg)' },
              { id: 'IV', label: 'Nivel IV (Cons)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroTriaje(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filtroTriaje === f.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {errorBusqueda && (
          <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            {errorBusqueda}
          </p>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. TABLA CLÍNICA DE ALTA DENSIDAD: MANCHESTER TRIAGE HUD
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Cabecera de la tabla */}
        <div className="p-5 sm:px-6 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Consola en Vivo de Triaje & Pacientes de Guardia
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Protocolo Internacional Manchester adaptado a normativa del Ministerio de Salud (MPPS)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-sm font-mono">
              {pacientesFiltrados.length} Registros Activos
            </span>
          </div>
        </div>

        {/* Tabla Responsiva con Signos Vitales y SLA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-500 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-5">Triaje Manchester</th>
                <th className="py-3.5 px-4">Historia / Cédula</th>
                <th className="py-3.5 px-4">Paciente & Grupo</th>
                <th className="py-3.5 px-4 min-w-[220px]">Signos Vitales (Telemetría)</th>
                <th className="py-3.5 px-5 min-w-[210px]">Motivo de Ingreso</th>
                <th className="py-3.5 px-3">Espera SLA</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-5 text-right">Acción Clínica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pacientesFiltrados.map((p) => (
                <tr key={p.historia} className="hover:bg-blue-50/40 transition-colors group">

                  {/* Columna Triaje */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: p.triajeColor,
                          boxShadow: `0 0 10px ${p.triajeColor}88`,
                        }}
                      />
                      <div>
                        <span className={`inline-block font-black text-[11px] px-2 py-0.5 rounded-md border ${p.triajeBg}`}>
                          Nivel {p.triaje}
                        </span>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{p.triajeLabel}</p>
                      </div>
                    </div>
                  </td>

                  {/* Historia y Cédula */}
                  <td className="py-4 px-4 whitespace-nowrap font-mono">
                    <p className="font-black text-slate-900 text-xs">{p.historia}</p>
                    <p className="text-[11px] text-slate-500 font-medium">V-{p.cedula}</p>
                  </td>

                  {/* Paciente y Datos */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {p.sexo}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{p.nombre}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-medium">{p.edad} años</span>
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 rounded">{p.sangre}</span>
                          {p.alergia && (
                            <span className="text-[9px] font-black bg-rose-100 text-rose-800 px-1 rounded border border-rose-200">
                              {p.alergia}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Signos Vitales HUD */}
                  <td className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">
                    <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl px-3 py-2 w-[210px] shadow-xs hover:border-blue-300 transition-colors">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] leading-tight">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">T.A:</span>
                          <span className="text-slate-900 font-black">{p.signos.ta}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">SpO₂:</span>
                          <span className="text-emerald-600 font-black">{p.signos.spo2}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">F.C:</span>
                          <span className="text-slate-800 font-bold">{p.signos.fc}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">T°:</span>
                          <span className="text-slate-800 font-bold">{p.signos.temp}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Motivo de Consulta */}
                  <td className="py-4 px-5 min-w-[210px] max-w-sm">
                    <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed" title={p.motivo}>
                      {p.motivo}
                    </p>
                  </td>

                  {/* Tiempo de Espera y SLA */}
                  <td className="py-4 px-3 whitespace-nowrap font-mono">
                    <p className="font-black text-slate-900 text-xs">{p.tiempoEspera}</p>
                    <p className="text-[10px] text-slate-400">Máx: {p.maxEspera}</p>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${p.estadoBadge}`}>
                      {p.estado}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.medicoAsignado}</p>
                  </td>

                  {/* Acción Médica Directa */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    {p.triaje === 'I' || p.triaje === 'II' ? (
                      <button
                        onClick={() => setPacienteEmergencia(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Historia 051 · Emergencia</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/medico/recetas')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                      >
                        <span>Atención Ambulatoria</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. MÓDULOS DE ATENCIÓN OFICIALES (FORMATOS MPPS)
      ══════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Módulos Clínicos & Formatos Oficiales MPPS
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Procedimientos estandarizados del Hospital Dr. Ana Francisca Pérez de León
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400">
            Nodo Distrital DS-7 · Petare
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Módulo 1 */}
          <div
            onClick={() => navigate('/admision/pacientes')}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  M1 · F-052
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                Admisión y Expediente F-052
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Apertura formal de historia clínica oficial con verificación inmutable de cédula y antecedentes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
              <span>Abrir formato</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Módulo 2 */}
          <div
            onClick={() => setPacienteEmergencia(PACIENTES_GUARDIA[0])}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:border-orange-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-black bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded">
                  M2 · F-051
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                Historia 051 · Emergencia (48h)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Atención de Guardia para emergencias calificadas (Nivel I y II). Validez de 48 horas continuas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600">
              <span>Aperturar 051</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Módulo 5 */}
          <div
            onClick={() => navigate('/medico/recetas')}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  M5 · QR
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                Récipes Digitales Criptográficos
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Prescripción con firma electrónica SHA-256 e interoperabilidad inmediata con la billetera del paciente.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
              <span>Emitir récipe</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Módulo 6 */}
          <div
            onClick={() => navigate('/admision/morbilidad')}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-mono text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  M6 · MPPS
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                Consolidado de Morbilidad MPPS
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Cierre automático de turno hospitalario con cálculo de distribución porcentual para planillas del MPPS.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
              <span>Cierre de guardia</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

        </div>
      </section>

      {/* Modal Historia 051 de Emergencia (48 horas) */}
      <ModalHistoria051
        paciente={pacienteEmergencia}
        onClose={() => setPacienteEmergencia(null)}
      />

    </div>
  )
}
