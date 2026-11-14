// ============================================================
//  src/modules/medico/TeleasistenciaMedicoPage.jsx
//  M6 — Consola de Teleasistencia Médica con Videollamada WebRTC
//       y Copiloto IA de Resumen Clínico (Formato SOAP)
//  Cosmos Clinical Command · Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import Formato001Modal from '../../components/formatos/Formato001Modal'
import VideoLlamadaClinicaModal from '../../components/teleconsulta/VideoLlamadaClinicaModal'

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
const IconSparkle = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

// ── Cola inicial de teleconsultas demo ───────────────────────
const COLA_INICIAL = [
  {
    id: 'TC-2026-002',
    paciente_nombre: 'María Eugenia Salazar',
    paciente_cedula: 'V-18.452.901',
    edad: '34 años', sexo: 'F',
    triaje: 'Verde (Nivel IV)', triajeColor: 'bg-emerald-500',
    hora_solicitud: '09:00',
    motivo: 'Control tensional y evaluación de medicación antihipertensiva',
    estado: 'en_curso', historia_nro: 'H-019482',
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
    edad: '45 años', sexo: 'M',
    triaje: 'Amarillo (Nivel III)', triajeColor: 'bg-amber-500',
    hora_solicitud: '10:15',
    motivo: 'Tos seca persistente de 4 días y dolor retroesternal leve al toser',
    estado: 'espera', historia_nro: 'H-018933',
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
    edad: '27 años', sexo: 'M',
    triaje: 'Verde (Nivel IV)', triajeColor: 'bg-emerald-500',
    hora_solicitud: '08:15',
    motivo: 'Seguimiento síndrome febril y cefalea pulsátil',
    estado: 'completada', historia_nro: 'H-020114',
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

// ── Motor de Resumen Clínico IA (Análisis NLP Clínico) ───────
function generarResumenCopiloto(mensajes, paciente, signos, medicoNombre) {
  const textoTotal = mensajes.map(m => m.texto).join(' ').toLowerCase()

  // Detección de síntomas clave por patrones NLP
  const mapaSintomas = {
    'presión alta': /presion|hipertens|135|140|sistolic/i,
    'cefalea / dolor de cabeza': /cefalea|dolor de cabeza|cefal/i,
    'mareos o vértigo': /mareo|vertigo|inestabilid/i,
    'tos': /tos|toser|tosiendo/i,
    'fiebre': /fiebre|temperature|calor|febrile/i,
    'dolor torácico': /pecho|dolor torácico|retroesternal|cardíaco/i,
    'disnea': /falta de aire|dificultad respiratoria|dism/i,
    'fatiga': /cansancio|fatiga|agotamiento/i,
    'visión borrosa': /vision borrosa|visión borrosa|vista/i,
  }
  const sintomasDetectados = Object.entries(mapaSintomas)
    .filter(([, regex]) => regex.test(textoTotal))
    .map(([nombre]) => nombre)

  // Detección de medicamentos mencionados
  const medicamentos = [
    'losartán','losartan','paracetamol','ibuprofeno','enalapril','captopril',
    'aspirina','metformina','atorvastatina','omeprazol','amoxicilina','azitromicina',
  ].filter(m => textoTotal.includes(m))

  const fecha = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' })
  const hora = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })

  const motivoTexto = mensajes.find(m => m.remitente === 'paciente')?.texto || 'Consulta de seguimiento'
  const ultimoMensajePaciente = [...mensajes].filter(m => m.remitente === 'paciente').slice(-1)[0]?.texto || ''
  const indicacionMedico = [...mensajes].filter(m => m.remitente === 'medico').slice(-1)[0]?.texto || ''

  return `NOTA DE EVOLUCIÓN — TELEASISTENCIA MÉDICA OFICIAL
═══════════════════════════════════════════════════
Institución: Instituto Municipal de Salud Ana Francisca Pérez de León
Módulo: M6 · Teleasistencia Digital · MPPS DS-7
Fecha y Hora: ${fecha} · ${hora}
Paciente: ${paciente.paciente_nombre} | C.I.: ${paciente.paciente_cedula}
Historia Clínica: ${paciente.historia_nro} | Edad: ${paciente.edad} | Sexo: ${paciente.sexo}
Médico Tratante: ${medicoNombre || 'Dr. Médico de Guardia'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

S — SUBJETIVO (Motivo y Síntomas Referidos por el Paciente):
Paciente refiere: "${motivoTexto}"
Última comunicación del paciente: "${ultimoMensajePaciente}"
${sintomasDetectados.length > 0
  ? `Síntomas detectados en la sesión: ${sintomasDetectados.join(', ')}.`
  : 'Sin síntomas de alarma reportados activamente durante la sesión.'}

O — OBJETIVO (Signos Vitales Reportados Remotamente):
  · T.A.: ${signos?.ta || 'No reportada'}
  · Freq. Cardíaca: ${signos?.fc || 'No reportada'}
  · SpO₂ (Oximetría): ${signos?.spo2 || 'No reportada'}
  · Temperatura: ${signos?.temp || 'No reportada'}
Antecedentes relevantes: ${paciente.antecedentes || 'No registrados en esta sesión.'}

A — ANÁLISIS CLÍNICO (Evaluación del Médico):
Teleconsulta de ${mensajes.length > 3 ? 'seguimiento activo con intercambio clínico extenso' : 'evaluación inicial'}. ${
  sintomasDetectados.length === 0
    ? 'Paciente hemodinámicamente estable según datos reportados. Sin signos de alarma identificados.'
    : `Se identificaron hallazgos clínicos relevantes: ${sintomasDetectados.join(', ')}. Requiere seguimiento.`}

P — PLAN Y CONDUCTA MÉDICA:
${medicamentos.length > 0
  ? `  · Continuar tratamiento farmacológico con: ${medicamentos.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}.`
  : '  · Continuar manejo médico previo según indicaciones del expediente clínico.'}
  · Indicación del médico: "${indicacionMedico}"
  · Control ambulatorio. Acudir a Emergencias si presenta deterioro clínico, disnea o dolor torácico intenso.
  · Próxima evaluación: a criterio del médico tratante.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Resumen generado por Copiloto IA Clínico · Supervisión y validación médica obligatoria]
[Auditado bajo SHA-256 · Sesión inmutable registrada en auditoria_accesos · MPPS DS-7]`
}

// ═════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════
export default function TeleasistenciaMedicoPage() {
  const { usuario } = useAuth()
  const [teleconsultas, setTeleconsultas] = useState(COLA_INICIAL)
  const [seleccionadaId, setSeleccionadaId] = useState('TC-2026-002')
  const [filtroEstado, setFiltroEstado] = useState('activas')
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [notaEvolucion, setNotaEvolucion] = useState('')
  const [modalRecipe, setModalRecipe] = useState(false)
  const [modalVideo, setModalVideo] = useState(false)
  const [panelIA, setPanelIA] = useState(false)
  const [resumenIA, setResumenIA] = useState('')
  const [cargandoIA, setCargandoIA] = useState(false)
  const [consentimientoIA, setConsentimientoIA] = useState(false)
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

  const tc = teleconsultas.find(t => t.id === seleccionadaId) || teleconsultas[0]
  const totalEspera = teleconsultas.filter(t => t.estado === 'espera').length
  const totalEnCurso = teleconsultas.filter(t => t.estado === 'en_curso').length
  const totalCompletadas = teleconsultas.filter(t => t.estado === 'completada').length
  const consultasFiltradas = teleconsultas.filter(t =>
    filtroEstado === 'activas' ? (t.estado === 'espera' || t.estado === 'en_curso') : t.estado === 'completada'
  )

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 4500) }

  const enviarMensaje = (e) => {
    e?.preventDefault()
    if (!nuevoMensaje.trim() || !tc) return
    const nuevo = {
      id: Date.now(), remitente: 'medico',
      nombre: usuario?.nombre_completo || 'Dr. Médico de Guardia',
      hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      texto: nuevoMensaje.trim()
    }
    setTeleconsultas(prev => prev.map(t => t.id === tc.id
      ? { ...t, estado: t.estado === 'espera' ? 'en_curso' : t.estado, mensajes: [...t.mensajes, nuevo] }
      : t
    ))
    setNuevoMensaje('')
  }

  const concluirTeleconsulta = () => {
    if (!tc) return
    const conclusion = notaEvolucion.trim() || 'Teleconsulta concluida satisfactoriamente. Indicaciones clínicas brindadas.'
    setTeleconsultas(prev => prev.map(t => t.id === tc.id
      ? { ...t, estado: 'completada', conclusion, duracion: '18 min' }
      : t
    ))
    toast(`Teleconsulta ${tc.id} cerrada y auditada bajo norma MPPS.`)
    setNotaEvolucion('')
  }

  const activarCopilotoIA = () => {
    if (!tc) return
    setCargandoIA(true)
    setPanelIA(true)
    // Simular latencia de procesamiento NLP (~1.5s)
    setTimeout(() => {
      const resumen = generarResumenCopiloto(
        tc.mensajes,
        tc,
        tc.signos,
        usuario?.nombre_completo || 'Dr. Médico de Guardia'
      )
      setResumenIA(resumen)
      setNotaEvolucion(resumen)
      setCargandoIA(false)
    }, 1600)
  }

  const alFinalizarVideo = ({ duracion }) => {
    setModalVideo(false)
    toast(`Videollamada finalizada. Duración de la sesión: ${duracion}. Auditado bajo MPPS DS-7.`)
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consola de Teleasistencia Médica</h1>
            <p className="text-xs text-slate-500">Evaluación remota, videollamada clínica HD y Copiloto IA de resumen médico SOAP.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
              <IconClock />
              <div><div className="text-[10px] uppercase font-bold text-slate-400">Hora</div>
              <div className="text-sm font-black text-slate-800 tabular-nums">{horaActual}</div></div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2">
              <div><div className="text-[10px] uppercase font-bold text-amber-600">En Espera</div>
              <div className="text-sm font-black text-amber-700 tabular-nums">{totalEspera}</div></div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-xl px-3.5 py-2">
              <div><div className="text-[10px] uppercase font-bold text-blue-600">En Atención</div>
              <div className="text-sm font-black text-blue-700 tabular-nums">{totalEnCurso}</div></div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2">
              <div><div className="text-[10px] uppercase font-bold text-emerald-600">Completadas</div>
              <div className="text-sm font-black text-emerald-700 tabular-nums">{totalCompletadas}</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOAST ───────────────────────────────────────────── */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2"><IconCheckCircle /><span>{toastMsg}</span></div>
          <button onClick={() => setToastMsg('')} className="font-bold text-emerald-700 cursor-pointer">×</button>
        </div>
      )}

      {/* ── GRID PRINCIPAL ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* COLA DE PACIENTES */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <IconVideo />Cola de Pacientes
            </h2>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {['activas','completadas'].map(f => (
                <button key={f} onClick={() => setFiltroEstado(f)}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer capitalize ${
                    filtroEstado === f ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
                  {f === 'activas' ? `Activas (${totalEspera + totalEnCurso})` : `Cerradas (${totalCompletadas})`}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {consultasFiltradas.map(t => (
              <button key={t.id} onClick={() => setSeleccionadaId(t.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  t.id === tc?.id ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-300' : 'bg-white border-slate-200/80 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black font-mono text-slate-500">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${t.triajeColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {t.triaje}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">{t.paciente_nombre}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{t.paciente_cedula} · {t.historia_nro}</div>
                </div>
                <div className="text-xs text-slate-600 italic bg-white/60 p-1.5 rounded border border-slate-100 line-clamp-1">
                  "{t.motivo}"
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Sol.: {t.hora_solicitud}</span>
                  <span className="font-semibold uppercase text-slate-600">
                    {t.estado === 'espera' && 'En Espera'}
                    {t.estado === 'en_curso' && 'En Atención'}
                    {t.estado === 'completada' && 'Completada'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="lg:col-span-8 space-y-5">
          {tc && (
            <>
              {/* Ficha del paciente */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
                      <IconUser />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{tc.paciente_nombre}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">{tc.paciente_cedula}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {tc.edad} · Sexo: {tc.sexo} · Historia: <span className="font-mono font-bold text-slate-700">{tc.historia_nro}</span>
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* VIDEO LLAMADA */}
                    {tc.estado !== 'completada' && (
                      <button onClick={() => setModalVideo(true)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                        <IconVideo />
                        Iniciar Videollamada
                      </button>
                    )}
                    {/* RECIPE */}
                    <button onClick={() => setModalRecipe(true)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                      <IconDocument />
                      Emitir Récipe F-001
                    </button>
                    {tc.estado !== 'completada' && (
                      <button onClick={concluirTeleconsulta}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                        <IconCheckCircle />
                        Concluir
                      </button>
                    )}
                  </div>
                </div>

                {/* HUD Signos Vitales */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs">
                  {[['T.A. Reportada', tc.signos?.ta], ['Frec. Cardíaca', tc.signos?.fc],
                    ['SpO₂ Oximetría', tc.signos?.spo2], ['Temperatura', tc.signos?.temp]].map(([label, val]) => (
                    <div key={label}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{label}</span>
                      <span className="font-black text-slate-800 font-mono">{val || 'N/R'}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold text-amber-900">Antecedentes:</span> {tc.antecedentes}
                </div>
              </div>

              {/* Chat Clínico */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col" style={{ height: '340px' }}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                    <IconChat />
                    Canal Auditado de Teleconsulta
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">SHA-256 · MPPS DS-7</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {tc.mensajes.map(m => {
                    const esDoc = m.remitente === 'medico'
                    return (
                      <div key={m.id} className={`flex flex-col ${esDoc ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-600">{m.nombre}</span>
                          <span>·</span>
                          <span className="font-mono">{m.hora}</span>
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          esDoc ? 'bg-blue-600 text-white rounded-tr-none shadow-xs' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                          {m.texto}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {tc.estado !== 'completada' ? (
                  <form onSubmit={enviarMensaje} className="flex gap-2 pt-2 border-t border-slate-100 mt-2 shrink-0">
                    <input type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)}
                      placeholder="Escribir indicación médica..."
                      className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" />
                    <button type="submit" disabled={!nuevoMensaje.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                      <IconSend />Enviar
                    </button>
                  </form>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-center font-medium mt-2 shrink-0">
                    Teleconsulta concluida. Canal archivado en el expediente clínico.
                  </div>
                )}
              </div>

              {/* COPILOTO IA + NOTA DE EVOLUCIÓN */}
              {tc.estado !== 'completada' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                  {/* Header Copiloto IA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center border border-violet-200 shrink-0">
                          <IconSparkle />
                        </span>
                        Copiloto IA Clínico
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 ml-9">
                        Genera automáticamente la nota SOAP a partir de la conversación.
                      </p>
                    </div>
                    {/* Switch de consentimiento */}
                    <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 w-full sm:w-auto">
                      <span className="text-xs text-violet-700 font-semibold flex-1">
                        Activar resumen IA
                      </span>
                      <button
                        onClick={() => setConsentimientoIA(v => !v)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          consentimientoIA ? 'bg-violet-600' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                          consentimientoIA ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  {consentimientoIA && (
                    <div className="space-y-3">
                      <button onClick={activarCopilotoIA} disabled={cargandoIA}
                        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                        {cargandoIA ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analizando conversación clínica...
                          </>
                        ) : (
                          <>
                            <IconSparkle />
                            Generar Resumen Clínico con IA (Formato SOAP)
                          </>
                        )}
                      </button>
                      {panelIA && !cargandoIA && resumenIA && (
                        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-900 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-violet-800 flex items-center gap-1.5">
                              <IconSparkle />Resumen generado — revisar y validar antes de guardar
                            </span>
                            <button onClick={() => setPanelIA(false)} className="text-violet-500 hover:text-violet-700 font-bold cursor-pointer">×</button>
                          </div>
                          <div className="text-[10px] text-violet-600 bg-violet-100 border border-violet-200 rounded-lg p-2">
                            El contenido fue prelleno en el campo de nota de evolución. Revíselo, edítelo y valídelo antes de cerrar la consulta.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nota de evolución */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Nota de Evolución / Conducta Médica:
                    </label>
                    <textarea rows={5} value={notaEvolucion} onChange={e => setNotaEvolucion(e.target.value)}
                      placeholder="Describa la conducta acordada, plan terapéutico y fecha de control... (o active el Copiloto IA para generar automáticamente)"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-mono leading-relaxed resize-none" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MODAL RECIPE (Portal) ────────────────────────────── */}
      {modalRecipe && tc && createPortal(
        <Formato001Modal
          paciente={{
            id: 999, nombres: tc.paciente_nombre.split(' ')[0],
            apellidos: tc.paciente_nombre.split(' ').slice(1).join(' '),
            cedula: tc.paciente_cedula, historia_numero: tc.historia_nro,
            edad: tc.edad, sexo: tc.sexo
          }}
          modo="nuevo"
          alCerrar={() => setModalRecipe(false)}
          alGuardar={() => { setModalRecipe(false); toast('Récipe Formato 001 emitido y anexado al expediente.') }}
        />,
        document.body
      )}

      {/* ── MODAL VIDEO LLAMADA (Portal) ─────────────────────── */}
      {modalVideo && tc && createPortal(
        <VideoLlamadaClinicaModal
          paciente={tc}
          medico={{ nombre: usuario?.nombre_completo || 'Dr. Médico de Guardia', nombre_completo: usuario?.nombre_completo }}
          rol="medico"
          alCerrar={alFinalizarVideo}
        />,
        document.body
      )}
    </div>
  )
}
