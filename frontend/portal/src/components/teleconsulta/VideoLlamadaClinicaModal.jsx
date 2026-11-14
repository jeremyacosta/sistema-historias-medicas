// ============================================================
//  src/components/teleconsulta/VideoLlamadaClinicaModal.jsx
//  M6 — Videollamada Clínica WebRTC con HUD Médico
//  Cosmos Clinical Command · Instituto Municipal de Salud
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect, useRef } from 'react'

// ── SVG Íconos de Control de Videollamada ─────────────────────
const IconMicOn = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)
const IconMicOff = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
)
const IconCamOn = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.816v6.368a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)
const IconCamOff = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.816v6.368a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM3 3l18 18" />
  </svg>
)
const IconPhoneOff = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
  </svg>
)
const IconShield = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const IconWifi = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
)

export default function VideoLlamadaClinicaModal({
  paciente,
  medico,
  rol = 'medico', // 'medico' | 'paciente'
  alCerrar
}) {
  const videoLocalRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [micActivo, setMicActivo] = useState(true)
  const [camaraActiva, setCamaraActiva] = useState(true)
  const [duracion, setDuracion] = useState(0)
  const [estadoLlamada, setEstadoLlamada] = useState('conectando') // conectando | activa | error
  const [errorMsg, setErrorMsg] = useState(null)

  // ── Activar cámara y micrófono ────────────────────────────
  useEffect(() => {
    let mediaStream = null

    const activarCamara = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(mediaStream)
        if (videoLocalRef.current) {
          videoLocalRef.current.srcObject = mediaStream
        }
        // Simular establecimiento de conexión (TEG demo)
        setTimeout(() => setEstadoLlamada('activa'), 2500)
      } catch {
        setErrorMsg('Permiso de cámara/micrófono denegado. Verifique los ajustes del navegador.')
        setEstadoLlamada('activa') // Continuar en modo audio-only
      }
    }

    activarCamara()

    return () => {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop())
    }
  }, [])

  // ── Cronómetro de la sesión ───────────────────────────────
  useEffect(() => {
    if (estadoLlamada !== 'activa') return
    const timer = setInterval(() => setDuracion(d => d + 1), 1000)
    return () => clearInterval(timer)
  }, [estadoLlamada])

  const formatDuracion = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`
  }

  const toggleMic = () => {
    if (stream) stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    setMicActivo(v => !v)
  }

  const toggleCamara = () => {
    if (stream) stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    setCamaraActiva(v => !v)
  }

  const finalizar = () => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    alCerrar({ duracion: formatDuracion(duracion), segundos: duracion })
  }

  const nombre_remoto = rol === 'medico' ? paciente?.paciente_nombre : medico?.nombre
  const initiales_remoto = nombre_remoto
    ? nombre_remoto.split(' ').slice(0, 2).map(w => w[0]).join('')
    : '??'

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/80"
           style={{ minHeight: '520px' }}>

        {/* ── BARRA SUPERIOR HUD ──────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3
                        bg-gradient-to-b from-slate-900/95 to-transparent">
          {/* Identidad Institucional */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/30 border border-blue-500/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider">
                Teleconsulta Oficial MPPS DS-7
              </span>
            </div>
          </div>

          {/* Telemetría de sesión */}
          <div className="flex items-center gap-3">
            {estadoLlamada === 'activa' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {formatDuracion(duracion)}
              </div>
            )}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-900/50 border border-emerald-700/50 rounded-full text-[10px] text-emerald-400 font-bold">
              <IconShield />
              <span>DTLS/SRTP Cifrado</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/50 border border-blue-700/50 rounded-full text-[10px] text-blue-400 font-bold">
              <IconWifi />
              <span>HD · Conectado</span>
            </div>
          </div>
        </div>

        {/* ── VIDEO PRINCIPAL (REMOTO / PACIENTE o MÉDICO) ──── */}
        <div className="relative w-full" style={{ minHeight: '460px' }}>

          {/* Estado: Conectando */}
          {estadoLlamada === 'conectando' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-4 z-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl font-black text-white border-4 border-blue-500/60 shadow-xl">
                  {initiales_remoto}
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-blue-500/40 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
              </div>
              <div className="text-center">
                <p className="text-white font-black text-lg">{nombre_remoto}</p>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Estableciendo videollamada cifrada...
                </p>
              </div>
            </div>
          )}

          {/* Estado: Activo — pantalla remota placeholder con fondo médico */}
          {estadoLlamada === 'activa' && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-4xl font-black text-white border-4 border-blue-600/50 shadow-2xl">
                  {initiales_remoto}
                </div>
                <p className="text-white/90 font-bold text-base">{nombre_remoto}</p>
                <p className="text-slate-400 text-xs">
                  {rol === 'medico' ? 'Paciente conectado · Audio/Video activo' : 'Médico tratante · Audio/Video activo'}
                </p>
                {/* Ondas de audio simuladas */}
                <div className="flex items-end gap-1 h-8">
                  {[3,6,4,8,5,7,3,6,5].map((h, i) => (
                    <div key={i} className="w-1 bg-blue-500 rounded-full animate-pulse"
                         style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error de cámara */}
          {errorMsg && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 max-w-sm w-full mx-4">
              <div className="bg-amber-900/80 border border-amber-600/60 text-amber-200 text-xs p-3 rounded-xl text-center">
                {errorMsg}
              </div>
            </div>
          )}

          {/* ── PiP — Cámara Local (esquina inferior derecha) ─── */}
          <div className="absolute bottom-20 right-4 z-20 w-40 h-28 md:w-52 md:h-36 rounded-2xl overflow-hidden
                          border-2 border-blue-500/60 shadow-2xl bg-slate-800">
            {camaraActiva && stream ? (
              <video
                ref={videoLocalRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                <div className="text-slate-400 text-center">
                  <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.816v6.368a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM3 3l18 18" />
                  </svg>
                  <p className="text-[10px] font-bold">Cámara Off</p>
                </div>
              </div>
            )}
            {/* Label PiP */}
            <div className="absolute bottom-1.5 left-2 text-[10px] text-white/70 font-bold bg-black/40 px-1.5 py-0.5 rounded">
              {rol === 'medico' ? 'Dr. ' : ''}{medico?.nombre_completo?.split(' ')[0] || 'Tú'}
            </div>
          </div>

          {/* Info del paciente — esquina superior izquierda */}
          <div className="absolute top-14 left-4 z-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
            <p className="text-white text-xs font-black">{nombre_remoto}</p>
            <p className="text-slate-300 text-[10px]">
              {rol === 'medico' ? `${paciente?.cedula || ''} · ${paciente?.historia_nro || ''}` : 'Médico de Guardia · MPPS DS-7'}
            </p>
          </div>
        </div>

        {/* ── BARRA DE CONTROLES INFERIOR ─────────────────────── */}
        <div className="flex items-center justify-center gap-4 py-4 px-6
                        bg-gradient-to-t from-slate-900 to-slate-900/90 border-t border-slate-700/50">

          {/* Botón Micrófono */}
          <button
            onClick={toggleMic}
            title={micActivo ? 'Silenciar micrófono' : 'Activar micrófono'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg
              ${micActivo ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {micActivo ? <IconMicOn /> : <IconMicOff />}
          </button>

          {/* Botón Cámara */}
          <button
            onClick={toggleCamara}
            title={camaraActiva ? 'Apagar cámara' : 'Encender cámara'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg
              ${camaraActiva ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {camaraActiva ? <IconCamOn /> : <IconCamOff />}
          </button>

          {/* Botón Finalizar Llamada */}
          <button
            onClick={finalizar}
            title="Finalizar videollamada"
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl shadow-red-900/50 hover:scale-105"
          >
            <IconPhoneOff />
          </button>

          {/* Tiempo de sesión */}
          <div className="text-center min-w-[64px]">
            <div className="text-white font-black text-base font-mono tabular-nums">
              {formatDuracion(duracion)}
            </div>
            <div className="text-slate-400 text-[10px] font-bold uppercase">Sesión</div>
          </div>

          {/* Aviso MPPS */}
          <div className="text-center min-w-[80px]">
            <div className="text-[10px] text-slate-400 leading-tight">
              Sesión auditada<br />bajo norma MPPS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
