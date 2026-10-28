// ============================================================
//  src/modules/medico/RegistroMorbilidadPage.jsx
//  MÓDULO M3 — Registro de Morbilidad Diaria y Control Médico
//  DISEÑO: "Cosmos Medical" — Clinical Command Center
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  consultarMorbilidadPorDia,
  consultarMorbilidadPorPaciente,
  registrarActividadMorbilidad,
} from '../../api/morbilidad'

// ── SVG Íconos Médicos Vectoriales (Cero Emojis) ─────────────
const IconActivity = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const IconUser = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const IconRefresh = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const SERVICIOS = [
  'TODOS',
  'Emergencia Adultos',
  'Emergencia Pediátrica',
  'Medicina General',
  'Traumatología',
  'Cirugía General',
  'Ginecología y Obstetricia',
  'Consulta Externa',
]

export default function RegistroMorbilidadPage() {
  const { usuario } = useAuth()

  // Pestaña activa: 'dia' | 'cedula'
  const [tabActiva, setTabActiva] = useState('dia')

  // Estado para chequeo por día
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split('T')[0])
  const [servicioFiltro, setServicioFiltro] = useState('TODOS')
  const [reporteDia, setReporteDia] = useState(null)
  const [cargandoDia, setCargandoDia] = useState(false)

  // Estado para chequeo por cédula
  const [cedulaBusqueda, setCedulaBusqueda] = useState('')
  const [historialPaciente, setHistorialPaciente] = useState(null)
  const [cargandoPaciente, setCargandoPaciente] = useState(false)
  const [errorPaciente, setErrorPaciente] = useState('')

  // Estado Modal Nueva Atención
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevoForm, setNuevoForm] = useState({
    cedula_paciente: '',
    servicio: 'Emergencia Adultos',
    tipo_atencion: 'Emergencia',
    motivo_atencion: '',
    diagnostico_cie10: '',
    diagnostico_desc: '',
    conducta_tratamiento: '',
    destino_egreso: 'Alta Médica',
  })
  const [guardandoAtencion, setGuardandoAtencion] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [toast, setToast] = useState('')

  // Cargar datos del día
  const cargarDatosDia = async () => {
    setCargandoDia(true)
    try {
      const data = await consultarMorbilidadPorDia({
        fecha: fechaConsulta,
        servicio: servicioFiltro !== 'TODOS' ? servicioFiltro : undefined,
      })
      setReporteDia(data)
    } catch (err) {
      console.warn('Error al cargar reporte de morbilidad:', err)
    } finally {
      setCargandoDia(false)
    }
  }

  useEffect(() => {
    if (tabActiva === 'dia') {
      cargarDatosDia()
    }
  }, [fechaConsulta, servicioFiltro, tabActiva])

  // Búsqueda por cédula
  const handleBuscarPorCedula = async (e) => {
    e?.preventDefault()
    if (!cedulaBusqueda.trim()) return
    setCargandoPaciente(true)
    setErrorPaciente('')
    try {
      const data = await consultarMorbilidadPorPaciente(cedulaBusqueda)
      setHistorialPaciente(data)
    } catch (err) {
      setErrorPaciente(err.response?.data?.detail || 'No se encontró historial para la cédula ingresada.')
      setHistorialPaciente(null)
    } finally {
      setCargandoPaciente(false)
    }
  }

  // Registrar nueva atención en backend
  const handleGuardarAtencion = async (e) => {
    e.preventDefault()
    setGuardandoAtencion(true)
    setErrorModal('')
    try {
      await registrarActividadMorbilidad(nuevoForm)
      setToast('¡Atención de morbilidad registrada y auditada exitosamente!')
      setTimeout(() => setToast(''), 4000)
      setModalAbierto(false)
      setNuevoForm({
        cedula_paciente: '',
        servicio: 'Emergencia Adultos',
        tipo_atencion: 'Emergencia',
        motivo_atencion: '',
        diagnostico_cie10: '',
        diagnostico_desc: '',
        conducta_tratamiento: '',
        destino_egreso: 'Alta Médica',
      })
      cargarDatosDia()
    } catch (err) {
      setErrorModal(err.response?.data?.detail || err.message || 'Error registrando la atención médica.')
    } finally {
      setGuardandoAtencion(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── HEADER DE COMANDO CLÍNICO ─────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Módulo M3 · Control de Actividades y Morbilidad
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Instituto Municipal de Salud Ana Francisca Pérez de León
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Control de Pacientes y Actividad Médica
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl font-medium">
            Supervisión diaria de consultas, atenciones de emergencia y récord por cédula de paciente. Registro con auditoría inmutable MPPS.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <IconPlus />
            Registrar Atención Médica
          </button>
        </div>
      </section>

      {/* ── HUD DE MÉTRICAS TELEMÉTRICAS ──────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Atenciones del Día</p>
          <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {reporteDia?.total_atenciones ?? 0}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En censo activo
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pacientes Únicos</p>
          <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {reporteDia?.total_pacientes_unicos ?? 0}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Sin duplicidades en registro</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Altas Médicas</p>
          <p className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {reporteDia?.por_destino?.['Alta Médica'] ?? 0}
          </p>
          <p className="text-[10px] text-emerald-600 font-medium">Egresos satisfactorios</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hospitalizados / Obs</p>
          <p className="text-2xl font-black text-amber-700 font-mono tabular-nums">
            {(reporteDia?.por_destino?.['Hospitalización'] ?? 0) + (reporteDia?.por_destino?.['En Observación'] ?? 0)}
          </p>
          <p className="text-[10px] text-amber-600 font-medium">En seguimiento hospitalario</p>
        </div>
      </section>

      {/* ── CONSOLA BIFURCADA: DÍA VS CÉDULA ───────────────────── */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Pestañas de Navegación */}
        <div className="px-6 pt-5 pb-0 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTabActiva('dia')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                tabActiva === 'dia'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconCalendar />
              Chequeo por Día (Libro de Morbilidad)
            </button>

            <button
              onClick={() => setTabActiva('cedula')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                tabActiva === 'cedula'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconSearch />
              Chequeo por Cédula de Paciente
            </button>
          </div>

          {tabActiva === 'dia' && (
            <div className="flex items-center gap-3 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Fecha:</span>
                <input
                  type="date"
                  value={fechaConsulta}
                  onChange={(e) => setFechaConsulta(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={servicioFiltro}
                onChange={(e) => setServicioFiltro(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {SERVICIOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={cargarDatosDia}
                disabled={cargandoDia}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="Refrescar lista"
              >
                <IconRefresh />
              </button>
            </div>
          )}
        </div>

        {/* ── VISTA 1: CHEQUEO POR DÍA ────────────────────────── */}
        {tabActiva === 'dia' && (
          <div className="p-6">
            {cargandoDia ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium">
                Cargando atenciones del día...
              </div>
            ) : !reporteDia?.atenciones?.length ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No hay atenciones registradas para esta fecha y servicio.</p>
                <p className="text-xs text-slate-400">Presione "Registrar Atención Médica" para ingresar una nueva consulta.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/50">
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Paciente</th>
                      <th className="py-3 px-4">N° Historia</th>
                      <th className="py-3 px-4">Servicio / Tipo</th>
                      <th className="py-3 px-4">Motivo / Diagnóstico CIE-10</th>
                      <th className="py-3 px-4">Médico Tratante</th>
                      <th className="py-3 px-4">Destino</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reporteDia.atenciones.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">
                          {String(a.hora_actividad).slice(0, 5)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900">{a.nombre_paciente}</p>
                          <p className="text-[11px] font-mono text-slate-500">V-{a.cedula_paciente}</p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {a.numero_historia}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{a.servicio}</span>
                          <p className="text-[10px] text-slate-400">{a.tipo_atencion}</p>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-semibold text-slate-900 truncate">{a.motivo_atencion}</p>
                          {a.diagnostico_cie10 && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                              {a.diagnostico_cie10} — {a.diagnostico_desc}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <p className="font-bold text-slate-800">{a.medico_nombre}</p>
                          <p className="text-[10px] font-mono text-slate-400">V-{a.medico_cedula}</p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            a.destino_egreso === 'Alta Médica'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : a.destino_egreso === 'Hospitalización'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {a.destino_egreso}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── VISTA 2: CHEQUEO POR CÉDULA ─────────────────────── */}
        {tabActiva === 'cedula' && (
          <div className="p-6 space-y-6">
            
            {/* Buscador */}
            <form onSubmit={handleBuscarPorCedula} className="max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ingrese número de cédula (ej. 30047210)..."
                  value={cedulaBusqueda}
                  onChange={(e) => setCedulaBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconSearch />
                </div>
              </div>
              <button
                type="submit"
                disabled={cargandoPaciente}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {cargandoPaciente ? 'Buscando...' : 'Consultar'}
              </button>
            </form>

            {errorPaciente && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorPaciente}
              </div>
            )}

            {historialPaciente && (
              <div className="space-y-6">
                {/* Tarjeta del Paciente */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expediente Clínico</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{historialPaciente.paciente.nombre_completo}</h3>
                    <p className="text-xs text-slate-500 font-mono">
                      C.I: {historialPaciente.paciente.cedula} · Historia: {historialPaciente.paciente.numero_historia}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800">
                      Sangre: {historialPaciente.paciente.tipo_sangre || 'No registrado'}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                      Alergias: {historialPaciente.paciente.alergias_conocidas || 'Negadas'}
                    </span>
                  </div>
                </div>

                {/* Lista Histórica */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Historial de Atenciones ({historialPaciente.total_atenciones})
                  </h4>

                  {!historialPaciente.atenciones.length ? (
                    <p className="text-xs text-slate-400">El paciente no registra atenciones previas en morbilidad.</p>
                  ) : (
                    <div className="space-y-3">
                      {historialPaciente.atenciones.map((a) => (
                        <div key={a.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="font-mono font-bold text-slate-500">{a.fecha_actividad} a las {String(a.hora_actividad).slice(0, 5)}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {a.servicio} · {a.tipo_atencion}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium"><strong>Motivo:</strong> {a.motivo_atencion}</p>
                          {a.diagnostico_cie10 && (
                            <p className="text-xs text-blue-800">
                              <strong>CIE-10:</strong> {a.diagnostico_cie10} — {a.diagnostico_desc}
                            </p>
                          )}
                          {a.conducta_tratamiento && (
                            <p className="text-xs text-slate-600"><strong>Conducta:</strong> {a.conducta_tratamiento}</p>
                          )}
                          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                            <span>Atendido por: <strong>{a.medico_nombre}</strong></span>
                            <span>Destino: <strong>{a.destino_egreso}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </section>

      {/* ── MODAL: REGISTRAR NUEVA ATENCIÓN ───────────────────── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Registrar Atención de Morbilidad</h3>
                <p className="text-xs text-slate-500">Censo diario de actividades clínicas</p>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarAtencion} className="p-6 space-y-4">
              {errorModal && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorModal}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Cédula del Paciente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 30047210"
                    value={nuevoForm.cedula_paciente}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, cedula_paciente: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Servicio *</label>
                  <select
                    value={nuevoForm.servicio}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, servicio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SERVICIOS.filter(s => s !== 'TODOS').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Tipo de Atención</label>
                  <select
                    value={nuevoForm.tipo_atencion}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, tipo_atencion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Emergencia">Emergencia</option>
                    <option value="Consulta Primera Vez">Consulta Primera Vez</option>
                    <option value="Consulta Sucesiva">Consulta Sucesiva</option>
                    <option value="Triaje Ambulatorio">Triaje Ambulatorio</option>
                    <option value="Control Post-Operatorio">Control Post-Operatorio</option>
                    <option value="Interconsulta">Interconsulta</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Destino de Egreso</label>
                  <select
                    value={nuevoForm.destino_egreso}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, destino_egreso: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Alta Médica">Alta Médica</option>
                    <option value="En Observación">En Observación</option>
                    <option value="Hospitalización">Hospitalización</option>
                    <option value="Quirófano / Cirugía">Quirófano / Cirugía</option>
                    <option value="Referido">Referido</option>
                    <option value="Fallecido">Fallecido</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Motivo de la Atención *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Síntomas principales, cuadro clínico..."
                  value={nuevoForm.motivo_atencion}
                  onChange={(e) => setNuevoForm({ ...nuevoForm, motivo_atencion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Código CIE-10</label>
                  <input
                    type="text"
                    placeholder="Ej: R51"
                    value={nuevoForm.diagnostico_cie10}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, diagnostico_cie10: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Descripción Diagnóstico</label>
                  <input
                    type="text"
                    placeholder="Ej: Cefalea tensional primaria"
                    value={nuevoForm.diagnostico_desc}
                    onChange={(e) => setNuevoForm({ ...nuevoForm, diagnostico_desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Conducta y Tratamiento Indicado</label>
                <textarea
                  rows={2}
                  placeholder="Medicamentos, reposo, indicaciones al alta..."
                  value={nuevoForm.conducta_tratamiento}
                  onChange={(e) => setNuevoForm({ ...nuevoForm, conducta_tratamiento: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  disabled={guardandoAtencion}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoAtencion}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {guardandoAtencion ? 'Guardando en BD...' : 'Guardar Atención'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICACIÓN ────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-bold">{toast}</p>
        </div>
      )}

    </div>
  )
}
