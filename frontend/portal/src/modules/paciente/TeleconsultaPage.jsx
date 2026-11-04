// ============================================================
//  src/modules/paciente/TeleconsultaPage.jsx
//  M6 — Módulo de Teleasistencia y Teleconsulta Digital
//  Cosmos Clinical Command · Acento: Esmeralda #059669
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// ── SVG Íconos Médicos Vectoriales ───────────────────────────
const IconVideo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.816v6.368a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)
const IconMic = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)
const IconChat = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconSend = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

// ── Consultas demo registradas ────────────────────────────────
const CONSULTAS_DEMO = [
  {
    id: 'TC-2026-001',
    medico: 'Dr. Héctor Morales',
    especialidad: 'Medicina General · MPPS 45.892',
    fecha: '28/10/2026',
    hora: '10:30',
    motivo: 'Seguimiento síndrome febril y cefalea pulsátil',
    estado: 'completada',
    duracion: '22 min',
    notas: 'Mejoría clínica evidente. Continuar hidratación. Control en 10 días.',
  },
  {
    id: 'TC-2026-002',
    medico: 'Dra. Ana Rodríguez',
    especialidad: 'Medicina Interna · MPPS 51.204',
    fecha: '05/11/2026',
    hora: '09:00',
    motivo: 'Control tensional y evaluación de medicación antihipertensiva',
    estado: 'programada',
    duracion: null,
    notas: null,
  },
]

const MENSAJES_DEMO = [
  { id: 1, remitente: 'medico', nombre: 'Dr. Héctor Morales', hora: '10:35', texto: 'Buenos días. ¿Cómo ha evolucionado la fiebre desde la última consulta?' },
  { id: 2, remitente: 'paciente', nombre: 'Yo', hora: '10:36', texto: 'Buenos días doctor. La fiebre bajó a 37.2°C. La cefalea es más leve ahora.' },
  { id: 3, remitente: 'medico', nombre: 'Dr. Héctor Morales', hora: '10:37', texto: 'Excelente evolución. Continúe con el Paracetamol según indicaciones y mantenga buena hidratación oral. Regrese si la temperatura supera 38.5°C.' },
  { id: 4, remitente: 'paciente', nombre: 'Yo', hora: '10:38', texto: 'Entendido doctor. Muchas gracias.' },
]

export default function TeleconsultaPage() {
  const { usuario } = useAuth()
  const [tabActiva, setTabActiva] = useState('citas')
  const [mensajeTexto, setMensajeTexto] = useState('')
  const [mensajes, setMensajes] = useState(MENSAJES_DEMO)
  const [modalSolicitar, setModalSolicitar] = useState(false)
  const [formSolicitud, setFormSolicitud] = useState({ motivo: '', especialidad: 'Medicina General', fecha_preferida: '', turno: 'Mañana' })
  const [toastMsg, setToastMsg] = useState('')
  const [horaActual, setHoraActual] = useState(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraActual(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const enviarMensaje = () => {
    if (!mensajeTexto.trim()) return
    setMensajes(prev => [...prev, {
      id: prev.length + 1,
      remitente: 'paciente',
      nombre: 'Yo',
      hora: horaActual,
      texto: mensajeTexto.trim(),
    }])
    setMensajeTexto('')
  }

  const handleSolicitarCita = (e) => {
    e.preventDefault()
    setModalSolicitar(false)
    setToastMsg('¡Solicitud de teleconsulta enviada! El equipo médico confirmará en un plazo de 24h.')
    setTimeout(() => setToastMsg(''), 5000)
    setFormSolicitud({ motivo: '', especialidad: 'Medicina General', fecha_preferida: '', turno: 'Mañana' })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ══════════════════════════════════════════════════════
          HEADER CLÍNICO M6 — TELEASISTENCIA MPPS
      ══════════════════════════════════════════════════════ */}
      <section
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)', boxShadow: '0 8px 32px rgba(5,150,105,0.25)' }}
      >
        {/* Decoración */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-0 left-10 w-28 h-28 rounded-full border border-white/15" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
              <IconVideo />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-black bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  M6 · TELEASISTENCIA MPPS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight">Teleconsulta Digital</h1>
              <p className="text-emerald-100 text-xs font-medium mt-0.5">
                Atención médica remota · Instituto Municipal de Salud Ana Francisca Pérez de León · DS-7
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalSolicitar(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-black shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <IconCalendar />
            <span>Solicitar Nueva Cita</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/15">
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Consultas Realizadas</span>
            <p className="text-2xl font-black tabular-nums">1</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Próxima Cita</span>
            <p className="text-sm font-black text-emerald-200">05/11/2026 · 09:00</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Canal</span>
            <p className="text-sm font-black text-emerald-200">Texto Seguro (MPPS)</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PESTAÑAS: CITAS / MENSAJERÍA
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Tab bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/60">
          {[
            { id: 'citas', label: 'Mis Citas', icon: <IconCalendar /> },
            { id: 'mensajeria', label: 'Mensajería Clínica', icon: <IconChat /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                tabActiva === tab.id
                  ? 'border-emerald-600 text-emerald-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PESTAÑA 1: CITAS ───────────────────────────────── */}
        {tabActiva === 'citas' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Historial y Próximas Teleconsultas
              </span>
              <span className="text-xs text-slate-500">{CONSULTAS_DEMO.length} citas registradas</span>
            </div>

            <div className="space-y-3">
              {CONSULTAS_DEMO.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-2xl border p-5 space-y-3 ${
                    c.estado === 'programada'
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar médico */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0 ${
                        c.estado === 'programada' ? 'bg-emerald-600' : 'bg-slate-600'
                      }`}>
                        {c.medico.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{c.medico}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{c.especialidad}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        c.estado === 'programada'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {c.estado === 'programada' ? (
                          <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Programada</>
                        ) : (
                          <><IconCheck />Completada</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <IconCalendar />
                      <span className="font-mono font-bold">{c.fecha}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <IconClock />
                      <span className="font-mono font-bold">{c.hora}</span>
                    </div>
                    {c.duracion && (
                      <span className="text-slate-400">Duración: <strong>{c.duracion}</strong></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    <strong>Motivo:</strong> {c.motivo}
                  </p>

                  {c.notas && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Notas del Médico</span>
                      <p className="text-xs text-slate-700 mt-1 font-medium">{c.notas}</p>
                    </div>
                  )}

                  {c.estado === 'programada' && (
                    <div className="pt-2 border-t border-emerald-100 flex items-center gap-2">
                      <button
                        onClick={() => setTabActiva('mensajeria')}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <IconChat />
                        Ir a Mensajería Clínica
                      </button>
                      <span className="text-[11px] text-slate-400">
                        Podrá comunicarse con su médico por mensaje seguro.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PESTAÑA 2: MENSAJERÍA CLÍNICA ─────────────────── */}
        {tabActiva === 'mensajeria' && (
          <div className="flex flex-col h-[520px]">
            {/* Cabecera del chat */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                HM
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Dr. Héctor Morales · Medicina General</p>
                <p className="text-[11px] text-slate-500 font-mono">MPPS 45.892 · Instituto Municipal de Salud Ana Francisca Pérez de León</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Canal Seguro Activo
              </span>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/40">
              {/* Aviso institucional */}
              <div className="text-center">
                <span className="inline-block text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Canal de comunicación médico-paciente — Registrado y auditado por normativa MPPS
                </span>
              </div>

              {mensajes.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.remitente === 'paciente' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-3 space-y-1 shadow-sm ${
                      msg.remitente === 'paciente'
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    <p className={`text-[10px] font-bold ${msg.remitente === 'paciente' ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {msg.nombre}
                    </p>
                    <p className="text-xs font-medium leading-relaxed">{msg.texto}</p>
                    <p className={`text-[10px] text-right ${msg.remitente === 'paciente' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.hora}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center gap-3">
              <input
                type="text"
                value={mensajeTexto}
                onChange={(e) => setMensajeTexto(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') enviarMensaje() }}
                placeholder="Escriba su mensaje clínico..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                onClick={enviarMensaje}
                disabled={!mensajeTexto.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                <IconSend />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          INFORMACIÓN INSTITUCIONAL
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <IconVideo />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900">Sobre el Módulo de Teleasistencia M6</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Este módulo permite la comunicación médico-paciente por canal de texto seguro auditado. Las sesiones de teleconsulta son coordinadas por el equipo médico del Instituto Municipal de Salud Ana Francisca Pérez de León y registradas en la historia clínica del paciente bajo normativa MPPS DS-7. <strong>Nota:</strong> En caso de emergencia médica, diríjase inmediatamente a la sala de emergencias o llame al 171.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Auditado MPPS', 'Registro Inmutable', 'Canal Seguro', 'DS-7 Compliant'].map((tag) => (
                <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MODAL: SOLICITAR NUEVA CITA
      ══════════════════════════════════════════════════════ */}
      {modalSolicitar && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalSolicitar(false) }}
        >
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#064e3b] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Solicitar Teleconsulta</h3>
                <p className="text-[11px] text-emerald-300 mt-0.5">Instituto Municipal de Salud Ana Francisca Pérez de León</p>
              </div>
              <button onClick={() => setModalSolicitar(false)} className="text-white/60 hover:text-white cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSolicitarCita} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Especialidad Requerida</label>
                <select
                  value={formSolicitud.especialidad}
                  onChange={(e) => setFormSolicitud({ ...formSolicitud, especialidad: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option>Medicina General</option>
                  <option>Medicina Interna</option>
                  <option>Cardiología</option>
                  <option>Pediatría</option>
                  <option>Ginecología</option>
                  <option>Traumatología</option>
                  <option>Nutrición Clínica</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Fecha Preferida</label>
                  <input
                    type="date"
                    value={formSolicitud.fecha_preferida}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormSolicitud({ ...formSolicitud, fecha_preferida: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Turno</label>
                  <select
                    value={formSolicitud.turno}
                    onChange={(e) => setFormSolicitud({ ...formSolicitud, turno: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option>Mañana (7:00–12:00)</option>
                    <option>Tarde (12:00–17:00)</option>
                    <option>Sin preferencia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Motivo de Consulta *</label>
                <textarea
                  required
                  rows={3}
                  value={formSolicitud.motivo}
                  onChange={(e) => setFormSolicitud({ ...formSolicitud, motivo: e.target.value })}
                  placeholder="Describa brevemente sus síntomas o motivo de consulta..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalSolicitar(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-[0.98]"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <p className="text-xs font-bold">{toastMsg}</p>
        </div>
      )}

    </div>
  )
}
