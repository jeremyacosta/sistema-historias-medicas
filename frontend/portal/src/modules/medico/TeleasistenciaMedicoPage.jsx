// ============================================================
//  src/modules/medico/TeleasistenciaMedicoPage.jsx
//  M6 — Consola de Teleasistencia y Telemedicina Médica
//  Cosmos Clinical Command · Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import Formato001Modal from '../../components/formatos/Formato001Modal'

// ── SVG Íconos Vectoriales Cosmos ────────────────────────────
const IconVideo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.816v6.368a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)
const IconChat = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
const IconSend = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)
const IconCheckCircle = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconDocument = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconUser = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

// ── Solicitudes Demo de Teleasistencia ────────────────────────
const COLA_TELECONSULTAS_INICIAL = [
  {
    id: 'TC-2026-002',
    paciente_nombre: 'María Eugenia Salazar',
    paciente_cedula: 'V-18.452.901',
    edad: '34 años',
    sexo: 'F',
    triaje: 'Verde (Nivel IV)',
    triajeColor: 'bg-emerald-500',
    hora_solicitud: '09:00',
    motivo: 'Control tensional y evaluación de medicación antihipertensiva',
    estado: 'en_curso',
    historia_nro: 'H-019482',
    antecedentes: 'Hipertensión Arterial Primaria (2021). Sin alergias conocidas.',
    signos: { ta: '135/85 mmHg', fc: '76 lpm', spo2: '98%', temp: '36.6 °C' },
    mensajes: [
      { id: 1, remitente: 'paciente', nombre: 'María Salazar', hora: '09:02', texto: 'Buenos días doctor. Me he tomado la presión estos tres días y se ha mantenido en 135/85.' },
      { id: 2, remitente: 'medico', nombre: 'Dr. Héctor Morales', hora: '09:04', texto: 'Buenos días Sra. María. ¿Ha presentado mareos, cefalea o visión borrosa?' },
      { id: 3, remitente: 'paciente', nombre: 'María Salazar', hora: '09:05', texto: 'No doctor, ningún síntoma. Solo quería validar si mantengo la dosis de Losartán 50mg.' },
    ]
  },
  {
    id: 'TC-2026-003',
    paciente_nombre: 'José Antonio Rondón',
    paciente_cedula: 'V-14.789.231',
    edad: '45 años',
    sexo: 'M',
    triaje: 'Amarillo (Nivel III)',
    triajeColor: 'bg-amber-500',
    hora_solicitud: '10:15',
    motivo: 'Tos seca persistente de 4 días y dolor retroesternal leve al toser',
    estado: 'espera',
    historia_nro: 'H-018933',
    antecedentes: 'Asma bronquial en infancia. Fumador social.',
    signos: { ta: '120/80 mmHg', fc: '84 lpm', spo2: '97%', temp: '37.1 °C' },
    mensajes: [
      { id: 1, remitente: 'paciente', nombre: 'José Rondón', hora: '10:16', texto: 'Hola doctor, tengo tos constante y me duele un poco el pecho cuando toso fuerte. No tengo fiebre.' }
    ]
  },
  {
    id: 'TC-2026-001',
    paciente_nombre: 'Carlos Eduardo Peña',
    paciente_cedula: 'V-22.345.678',
    edad: '27 años',
    sexo: 'M',
    triaje: 'Verde (Nivel IV)',
    triajeColor: 'bg-emerald-500',
    hora_solicitud: '08:15',
    motivo: 'Seguimiento síndrome febril y cefalea pulsátil',
    estado: 'completada',
    historia_nro: 'H-020114',
    antecedentes: 'Alergia a la Penicilina.',
    signos: { ta: '115/75 mmHg', fc: '72 lpm', spo2: '99%', temp: '36.8 °C' },
    conclusion: 'Evolución satisfactoria. Se indicó continuar hidratación oral y analgésico según necesidad.',
    mensajes: [
      { id: 1, remitente: 'medico', nombre: 'Dr. Héctor Morales', hora: '08:20', texto: 'Buenos días Carlos. ¿Cómo sigue la fiebre?' },
      { id: 2, remitente: 'paciente', nombre: 'Carlos Peña', hora: '08:22', texto: 'Ya sin fiebre doctor, muchas gracias. Solo un poco de cansancio.' },
      { id: 3, remitente: 'medico', nombre: 'Dr. Héctor Morales', hora: '08:25', texto: 'Excelente. Damos de alta el seguimiento. Cuídese mucho.' }
    ]
  }
]

export default function TeleasistenciaMedicoPage() {
  const { usuario } = useAuth()
  const [teleconsultas, setTeleconsultas] = useState(COLA_TELECONSULTAS_INICIAL)
  const [seleccionadaId, setSeleccionadaId] = useState('TC-2026-002')
  const [filtroEstado, setFiltroEstado] = useState('activas')
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [notaEvolucion, setNotaEvolucion] = useState('')
  const [modalRecipe, setModalRecipe] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [horaActual, setHoraActual] = useState(
    new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraActual(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const teleconsultaActual = teleconsultas.find(tc => tc.id === seleccionadaId) || teleconsultas[0]

  const totalEspera = teleconsultas.filter(tc => tc.estado === 'espera').length
  const totalEnCurso = teleconsultas.filter(tc => tc.estado === 'en_curso').length
  const totalCompletadas = teleconsultas.filter(tc => tc.estado === 'completada').length

  const consultasFiltradas = teleconsultas.filter(tc => {
    if (filtroEstado === 'activas') return tc.estado === 'espera' || tc.estado === 'en_curso'
    return tc.estado === 'completada'
  })

  const enviarMensajeMedico = (e) => {
    e?.preventDefault()
    if (!nuevoMensaje.trim() || !teleconsultaActual) return

    const nuevo = {
      id: Date.now(),
      remitente: 'medico',
      nombre: usuario?.nombre_completo || 'Dr. Médico de Guardia',
      hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      texto: nuevoMensaje.trim()
    }

    setTeleconsultas(prev => prev.map(tc => {
      if (tc.id === teleconsultaActual.id) {
        return {
          ...tc,
          estado: tc.estado === 'espera' ? 'en_curso' : tc.estado,
          mensajes: [...tc.mensajes, nuevo]
        }
      }
      return tc
    }))

    setNuevoMensaje('')
  }

  const concluirTeleconsulta = () => {
    if (!teleconsultaActual) return
    const conclusion = notaEvolucion.trim() || 'Teleconsulta médica concluida satisfactoriamente con indicaciones clínicas brindadas al paciente.'

    setTeleconsultas(prev => prev.map(tc => {
      if (tc.id === teleconsultaActual.id) {
        return {
          ...tc,
          estado: 'completada',
          conclusion,
          duracion: '18 min'
        }
      }
      return tc
    }))

    setToastMsg(`Teleconsulta ${teleconsultaActual.id} cerrada y auditada bajo norma MPPS.`)
    setNotaEvolucion('')
    setTimeout(() => setToastMsg(''), 4000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER COSMOS CLINICAL COMMAND ─────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Módulo M6 · MPPS DS-7
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Teleasistencia & Triaje Digital en Vivo
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Consola de Teleasistencia Médica
            </h1>
            <p className="text-xs text-slate-500">
              Evaluación remota, orientación clínica ambulatoria y mensajería oficial registrada e inmutable.
            </p>
          </div>

          {/* Telemetría y KPIs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
              <IconClock />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400">Hora Hospitalaria</div>
                <div className="text-sm font-black text-slate-800 tabular-nums">{horaActual}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-amber-600">En Espera</div>
                <div className="text-sm font-black text-amber-700 tabular-nums">{totalEspera}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-xl px-3.5 py-2">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-blue-600">En Atención</div>
                <div className="text-sm font-black text-blue-700 tabular-nums">{totalEnCurso}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-emerald-600">Completadas Hoy</div>
                <div className="text-sm font-black text-emerald-700 tabular-nums">{totalCompletadas}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOAST NOTIFICACIÓN ───────────────────────────────── */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <IconCheckCircle />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* ── DISPOSICIÓN PRINCIPAL DE 2 COLUMNAS ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* COLUMNA IZQUIERDA (5 COLS): COLA DE TELECONSULTAS */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <IconVideo />
              Cola de Pacientes
            </h2>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFiltroEstado('activas')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  filtroEstado === 'activas' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Activas ({totalEspera + totalEnCurso})
              </button>
              <button
                onClick={() => setFiltroEstado('completadas')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  filtroEstado === 'completadas' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cerradas ({totalCompletadas})
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {consultasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No hay solicitudes en esta categoría.
              </div>
            ) : (
              consultasFiltradas.map(tc => {
                const esActivo = tc.id === teleconsultaActual?.id
                return (
                  <button
                    key={tc.id}
                    onClick={() => setSeleccionadaId(tc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      esActivo
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black font-mono text-slate-500">
                        {tc.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${tc.triajeColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {tc.triaje}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black text-slate-900">{tc.paciente_nombre}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{tc.paciente_cedula} · {tc.historia_nro}</div>
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-1 italic bg-white/60 p-1.5 rounded border border-slate-100">
                      "{tc.motivo}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Solicitado: {tc.hora_solicitud}</span>
                      <span className="font-semibold uppercase tracking-wider text-slate-600">
                        {tc.estado === 'espera' && '⏳ En Espera'}
                        {tc.estado === 'en_curso' && '🟢 En Atención'}
                        {tc.estado === 'completada' && '✅ Completada'}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA (8 COLS): ESTACIÓN DE ATENCIÓN ACTIVA */}
        <div className="lg:col-span-8 space-y-5">
          {teleconsultaActual ? (
            <>
              {/* Tarjeta de Ficha Resumida del Paciente */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base border border-blue-200">
                      <IconUser />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{teleconsultaActual.paciente_nombre}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                          {teleconsultaActual.paciente_cedula}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {teleconsultaActual.edad} · Sexo: {teleconsultaActual.sexo} · Historia: <span className="font-mono font-bold text-slate-700">{teleconsultaActual.historia_nro}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setModalRecipe(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Emitir Récipe Oficial F-001 MPPS para este paciente"
                    >
                      <IconDocument />
                      Emitir Récipe F-001
                    </button>
                    {teleconsultaActual.estado !== 'completada' && (
                      <button
                        onClick={concluirTeleconsulta}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <IconCheckCircle />
                        Concluir Consulta
                      </button>
                    )}
                  </div>
                </div>

                {/* HUD de Signos Vitales y Antecedentes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">T.A. Reportada</span>
                    <span className="font-black text-slate-800 font-mono">{teleconsultaActual.signos?.ta || 'N/R'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Frec. Cardíaca</span>
                    <span className="font-black text-slate-800 font-mono">{teleconsultaActual.signos?.fc || 'N/R'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">SpO₂ Oximetría</span>
                    <span className="font-black text-slate-800 font-mono">{teleconsultaActual.signos?.spo2 || 'N/R'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Temperatura</span>
                    <span className="font-black text-slate-800 font-mono">{teleconsultaActual.signos?.temp || 'N/R'}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold text-amber-900">Antecedentes Clínicos:</span> {teleconsultaActual.antecedentes}
                </div>
              </div>

              {/* Chat Clínico Bidireccional */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 flex flex-col h-[380px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                    <IconChat />
                    Canal Auditado de Teleconsulta Médica
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Auditado bajo SHA-256 · MPPS DS-7
                  </span>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {teleconsultaActual.mensajes.map((m) => {
                    const esDoc = m.remitente === 'medico'
                    return (
                      <div key={m.id} className={`flex flex-col ${esDoc ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-600">{m.nombre}</span>
                          <span>·</span>
                          <span className="font-mono">{m.hora}</span>
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          esDoc
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                        }`}>
                          {m.texto}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Input para responder */}
                {teleconsultaActual.estado !== 'completada' ? (
                  <form onSubmit={enviarMensajeMedico} className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      placeholder="Escribir indicación u orientación médica..."
                      className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                    />
                    <button
                      type="submit"
                      disabled={!nuevoMensaje.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <IconSend />
                      Enviar
                    </button>
                  </form>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-center font-medium">
                    ✅ Teleconsulta concluida. Canal archivado en el expediente clínico del paciente.
                  </div>
                )}
              </div>

              {/* Nota de Teleasistencia / Conclusión */}
              {teleconsultaActual.estado !== 'completada' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Nota de Evolución / Conducta Médica de la Teleasistencia:
                  </label>
                  <textarea
                    rows={2}
                    value={notaEvolucion}
                    onChange={(e) => setNotaEvolucion(e.target.value)}
                    placeholder="Describa la conducta acordada, signos evaluados, plan terapéutico y fecha de control..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
              Seleccione un paciente de la cola para abrir la teleasistencia.
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL RÉCIPE FORMULARIO F-001 (CREATE PORTAL) ───── */}
      {modalRecipe && teleconsultaActual && createPortal(
        <Formato001Modal
          paciente={{
            id: 999,
            nombres: teleconsultaActual.paciente_nombre.split(' ')[0],
            apellidos: teleconsultaActual.paciente_nombre.split(' ').slice(1).join(' '),
            cedula: teleconsultaActual.paciente_cedula,
            historia_numero: teleconsultaActual.historia_nro,
            edad: teleconsultaActual.edad,
            sexo: teleconsultaActual.sexo
          }}
          modo="nuevo"
          alCerrar={() => setModalRecipe(false)}
          alGuardar={() => {
            setModalRecipe(false)
            setToastMsg('Récipe Formato 001 emitido y anexado al expediente digital del paciente.')
            setTimeout(() => setToastMsg(''), 4000)
          }}
        />,
        document.body
      )}
    </div>
  )
}
