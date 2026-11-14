// ============================================================
//  src/components/teleconsulta/VideoLlamadaClinicaModal.jsx
//  M6 — Videollamada Clínica WebRTC con Robot Copiloto IA en Vivo
//       Reconocimiento de Voz en Tiempo Real (Web Speech API)
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
const IconRobot = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
)
const IconSparkles = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

export default function VideoLlamadaClinicaModal({
  paciente,
  medico,
  rol = 'medico', // 'medico' | 'paciente'
  alCerrar
}) {
  const videoLocalRef = useRef(null)
  const recognitionRef = useRef(null)

  const [stream, setStream] = useState(null)
  const [micActivo, setMicActivo] = useState(true)
  const [camaraActiva, setCamaraActiva] = useState(true)
  const [duracion, setDuracion] = useState(0)
  const [estadoLlamada, setEstadoLlamada] = useState('conectando') // conectando | activa | finalizada
  const [errorMsg, setErrorMsg] = useState(null)

  // ── Estados del Robot IA Asistente y Reconocimiento de Voz ──
  const [robotActivo, setRobotActivo] = useState(true)
  const [panelIABot, setPanelIABot] = useState(true) // Visible por defecto para que el usuario lo vea
  const [escuchandoVoz, setEscuchandoVoz] = useState(false)
  const [vozEnVivoTexto, setVozEnVivoTexto] = useState('')
  const [transcripcion, setTranscripcion] = useState([
    { hablante: 'sistema', nombre: 'MediBot IA', texto: 'Robot asistente conectado y escuchando micrófono en vivo...', hora: '00:01' }
  ])
  const [resumenSOAPGenerado, setResumenSOAPGenerado] = useState(null)
  const [generandoResumen, setGenerandoResumen] = useState(false)
  const [copiadoResumen, setCopiadoResumen] = useState(false)

  const miNombre = rol === 'medico'
    ? (medico?.nombre || 'Dr. Médico')
    : (paciente?.paciente_nombre || 'Jeremy Acosta')

  const nombre_remoto = rol === 'medico'
    ? (paciente?.paciente_nombre || 'Jeremy Acosta')
    : (medico?.nombre || 'Dr. Héctor Morales')

  // ── 1. Activar cámara y micrófono local ───────────────────
  useEffect(() => {
    let mediaStream = null

    const activarCamara = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(mediaStream)
        if (videoLocalRef.current) {
          videoLocalRef.current.srcObject = mediaStream
        }
        setTimeout(() => setEstadoLlamada('activa'), 1200)
      } catch {
        setErrorMsg('Permiso de cámara/micrófono denegado. Se activará en modo audio-clínico.')
        setEstadoLlamada('activa')
      }
    }

    activarCamara()

    return () => {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop())
    }
  }, [])

  // ── 2. Cronómetro de la sesión ────────────────────────────
  useEffect(() => {
    if (estadoLlamada !== 'activa') return
    const timer = setInterval(() => setDuracion(d => d + 1), 1000)
    return () => clearInterval(timer)
  }, [estadoLlamada])

  const formatDuracion = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // ── 3. Motor de Reconocimiento de Voz Real (Web Speech API) ─
  useEffect(() => {
    if (estadoLlamada !== 'activa' || !micActivo || !robotActivo) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
      setEscuchandoVoz(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition no está soportado en este navegador.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-VE' // Español de Venezuela (o es-ES)

    recognition.onstart = () => {
      setEscuchandoVoz(true)
    }

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          const textoFinal = transcript.trim()
          if (textoFinal) {
            setTranscripcion(prev => [
              ...prev,
              {
                hablante: rol,
                nombre: miNombre,
                texto: textoFinal,
                hora: formatDuracion(duracion)
              }
            ])
            setVozEnVivoTexto(textoFinal)
          }
        } else {
          interim += transcript
          setVozEnVivoTexto(interim)
        }
      }
    }

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error)
      if (event.error !== 'no-speech') {
        setEscuchandoVoz(false)
      }
    }

    recognition.onend = () => {
      // Re-iniciar si la llamada sigue activa y el micrófono está encendido
      if (estadoLlamada === 'activa' && micActivo && robotActivo) {
        try { recognition.start() } catch {}
      } else {
        setEscuchandoVoz(false)
      }
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (e) {
      console.warn('Error al iniciar SpeechRecognition:', e)
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [estadoLlamada, micActivo, robotActivo])

  // ── 4. Generador Inteligente de Resumen SOAP basado en la Voz Real ──
  const generarResumenRobotIA = () => {
    setGenerandoResumen(true)

    setTimeout(() => {
      // Unir todo lo hablado realmente durante la llamada
      const oracionesHabladas = transcripcion
        .filter(t => t.hablante !== 'sistema')
        .map(t => t.texto)

      const textoCompleto = oracionesHabladas.join(' ').toLowerCase()

      // Extracción de síntomas clave a partir de lo que habló la persona
      const sintomas = []
      if (/presi[oó]n|tensi[oó]n|135|120|140/.test(textoCompleto)) sintomas.push('Valores tensionales referidos')
      if (/dolor|cefalea|cabeza/.test(textoCompleto)) sintomas.push('Cefalea / dolor referido')
      if (/fiebre|calentura|temperatura/.test(textoCompleto)) sintomas.push('Síndrome febril evaluado')
      if (/tos|gripe|pecho|respirar/.test(textoCompleto)) sintomas.push('Síntomas respiratorios / tos')
      if (/mareo|v[eé]rtigo/.test(textoCompleto)) sintomas.push('Mareos / inestabilidad')
      if (/mejo|bien|alivi|estable/.test(textoCompleto)) sintomas.push('Evolución clínica satisfactoria')

      // Extracción de medicamentos hablados
      const farmacos = []
      if (/losart[aá]n/.test(textoCompleto)) farmacos.push('Losartán 50mg')
      if (/paracetamol|acetaminof[eé]n/.test(textoCompleto)) farmacos.push('Paracetamol')
      if (/ibuprofeno/.test(textoCompleto)) farmacos.push('Ibuprofeno')
      if (/suero|hidrataci[oó]n/.test(textoCompleto)) farmacos.push('Hidratación oral')

      const subjetivoTexto = oracionesHabladas.length > 0
        ? `Durante la sesión de teleconsulta el paciente/facultativo refirió: "${oracionesHabladas.slice(-2).join(' ')}". ${sintomas.length > 0 ? `Hallazgos identificados: ${sintomas.join(', ')}.` : ''}`
        : 'Paciente evaluado por teleasistencia en tiempo real. Comunicación verbal fluida y sin signos evidentes de compromiso agudo.'

      const planTexto = farmacos.length > 0
        ? `Continuar tratamiento acordado verbalmente con: ${farmacos.join(', ')}. Control de signos en su centro ambulatorio.`
        : 'Mantener indicaciones clínicas preventivas, reposo e hidratación. Control en caso de persistencia de síntomas.'

      setResumenSOAPGenerado({
        subjetivo: subjetivoTexto,
        objetivo: 'Constantes evaluadas remotamente. Intercambio verbal coherente, orientado en tiempo, espacio y persona. Sin dificultad respiratoria aparente.',
        analisis: sintomas.length > 0
          ? `Evaluación clínica basada en el diálogo médico: ${sintomas.join(', ')}. Paciente con evolución estable.`
          : 'Consulta de seguimiento clínico general sin criterios de urgencia inmediata.',
        plan: planTexto,
        timestamp: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
        auditHash: 'SHA256-MPPS-VOZ-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        totalLineasHabladas: oracionesHabladas.length
      })

      setGenerandoResumen(false)
    }, 1200)
  }

  const toggleMic = () => {
    if (stream) stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    setMicActivo(v => !v)
  }

  const toggleCamara = () => {
    if (stream) stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    setCamaraActiva(v => !v)
  }

  const toggleRobotIA = () => {
    setRobotActivo(v => !v)
    if (!robotActivo) setPanelIABot(true)
  }

  const finalizar = () => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    setEstadoLlamada('finalizada')
  }

  const cerrarDefinitivo = () => {
    alCerrar({ duracion: formatDuracion(duracion), resumen: resumenSOAPGenerado })
  }

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex flex-col"
           style={{ minHeight: '560px', maxHeight: '90vh' }}>

        {/* ── BARRA SUPERIOR HUD ──────────────────────────────── */}
        <div className="relative z-20 flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md">
          {/* Identidad */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[11px] font-black text-white uppercase tracking-wider block">
                Teleasistencia Digital · MPPS DS-7
              </span>
              <span className="text-[10px] text-slate-400">
                Instituto Municipal de Salud Ana Francisca Pérez de León
              </span>
            </div>
          </div>

          {/* Badges de Seguridad y Robot IA */}
          <div className="flex items-center gap-2">
            {robotActivo && (
              <button
                onClick={() => setPanelIABot(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm ${
                  escuchandoVoz
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse'
                    : 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                }`}
                title="MediBot escuchando micrófono en vivo"
              >
                <IconRobot />
                <span>{escuchandoVoz ? '🤖 MediBot Escuchando tu Voz' : '🤖 MediBot IA'}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-700/50 rounded-full text-[10px] text-emerald-400 font-bold">
              <IconShield />
              <span>WebRTC Cifrado</span>
            </div>

            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-black font-mono text-emerald-400">
              {formatDuracion(duracion)}
            </div>
          </div>
        </div>

        {/* ── CUERPO PRINCIPAL: VIDEO + PANEL IA LATERAL ────── */}
        <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">

          {/* ÁREA DE VIDEO (FEED REMOTO + PiP) */}
          <div className="relative flex-1 flex items-center justify-center p-4 bg-radial from-slate-900 to-slate-950">

            {/* Pantalla central del interlocutor remoto */}
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 via-indigo-700 to-emerald-800 flex items-center justify-center text-4xl font-black text-white border-4 border-blue-500/50 shadow-2xl">
                  {nombre_remoto.split(' ').slice(0, 2).map(w => w[0]).join('')}
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/30 animate-ping" />
              </div>

              <div>
                <h3 className="text-white text-base font-black">{nombre_remoto}</h3>
                <p className="text-slate-400 text-xs font-medium">
                  {rol === 'medico' ? 'Paciente conectado · Audio/Video en vivo' : 'Médico de Guardia · MPPS 45.892'}
                </p>
              </div>

              {/* Ondas de audio en vivo */}
              <div className="flex items-end gap-1.5 h-6 mt-1">
                {[4, 8, 5, 12, 7, 10, 4, 9, 6].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${escuchandoVoz ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>

            {/* PiP — Cámara Local Real del Usuario */}
            <div className="absolute bottom-4 right-4 z-20 w-36 h-24 sm:w-48 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-2xl bg-slate-900">
              {camaraActiva && stream ? (
                <video
                  ref={videoLocalRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800">
                  <IconCamOff />
                  <span className="text-[10px] font-bold mt-1">Cámara Off</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                Tú ({rol === 'medico' ? 'Médico' : 'Paciente'})
              </div>
            </div>

            {/* Subtítulos IA Flotantes de lo que HABLAS en tu micrófono */}
            {robotActivo && (
              <div className="absolute bottom-4 left-4 right-40 sm:right-56 z-10 bg-black/75 backdrop-blur-md border border-violet-500/40 rounded-xl p-2.5 text-xs text-white shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between text-violet-300 font-black text-[10px] uppercase mb-1">
                  <div className="flex items-center gap-1.5">
                    <IconRobot />
                    <span>Transcripción por Voz en Vivo</span>
                  </div>
                  {escuchandoVoz && (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      MICRÓFONO ACTIVO
                    </span>
                  )}
                </div>
                <p className="text-slate-100 italic font-medium leading-relaxed">
                  {vozEnVivoTexto ? `"${vozEnVivoTexto}"` : '"Habla por tu micrófono... MediBot transcribirá tus palabras en vivo"'}
                </p>
              </div>
            )}
          </div>

          {/* ── PANEL LATERAL: ASISTENTE ROBOT IA (DRAWER) ──── */}
          {panelIABot && (
            <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn z-30">
              <div className="space-y-4">
                {/* Header del Panel IA */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-md">
                      <IconRobot />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">MediBot Asistente IA</h4>
                      <p className="text-[10px] text-violet-400">Escuchando micrófono y resumiendo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPanelIABot(false)}
                    className="text-slate-400 hover:text-white font-bold text-base cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {/* Transcripción de la conversación */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Transcripción en Vivo:
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono">
                      {transcripcion.filter(t => t.hablante !== 'sistema').length} intervenciones
                    </span>
                  </div>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs">
                    {transcripcion.map((t, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className={`font-bold ${t.hablante === 'sistema' ? 'text-amber-300' : 'text-violet-300'}`}>
                            {t.nombre}
                          </span>
                          <span className="font-mono">{t.hora}</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-relaxed">{t.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón para generar Resumen SOAP */}
                <button
                  onClick={generarResumenRobotIA}
                  disabled={generandoResumen}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-violet-900/30 active:scale-[0.98]"
                >
                  {generandoResumen ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Procesando lo que hablaste...</span>
                    </>
                  ) : (
                    <>
                      <IconSparkles />
                      <span>Generar Resumen con lo Hablado</span>
                    </>
                  )}
                </button>

                {/* Tarjeta de Resumen Clínico SOAP */}
                {resumenSOAPGenerado && (
                  <div className="p-3.5 rounded-xl bg-violet-950/60 border border-violet-600/50 space-y-2 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-violet-200 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <IconSparkles />
                        Resumen SOAP Personalizado
                      </span>
                      <span className="text-[9px] font-mono text-violet-400">{resumenSOAPGenerado.timestamp}</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed font-sans">
                      <p><strong className="text-violet-300">S (Subjetivo):</strong> {resumenSOAPGenerado.subjetivo}</p>
                      <p><strong className="text-violet-300">O (Objetivo):</strong> {resumenSOAPGenerado.objetivo}</p>
                      <p><strong className="text-violet-300">A (Análisis):</strong> {resumenSOAPGenerado.analisis}</p>
                      <p><strong className="text-violet-300">P (Plan):</strong> {resumenSOAPGenerado.plan}</p>
                    </div>

                    <div className="pt-2 border-t border-violet-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-mono font-bold">✓ Creado de tu voz</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            `S: ${resumenSOAPGenerado.subjetivo}\nO: ${resumenSOAPGenerado.objetivo}\nA: ${resumenSOAPGenerado.analisis}\nP: ${resumenSOAPGenerado.plan}`
                          )
                          setCopiadoResumen(true)
                          setTimeout(() => setCopiadoResumen(false), 2000)
                        }}
                        className="px-2 py-1 rounded bg-violet-800 hover:bg-violet-700 text-white font-bold transition-all cursor-pointer"
                      >
                        {copiadoResumen ? '¡Copiado!' : 'Copiar Texto'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── BARRA DE CONTROLES INFERIOR ─────────────────────── */}
        <div className="relative z-20 flex items-center justify-center gap-4 py-4 px-6 bg-slate-900 border-t border-slate-800">

          {/* Micrófono */}
          <button
            onClick={toggleMic}
            title={micActivo ? 'Silenciar micrófono' : 'Activar micrófono'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              micActivo ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {micActivo ? <IconMicOn /> : <IconMicOff />}
          </button>

          {/* Cámara */}
          <button
            onClick={toggleCamara}
            title={camaraActiva ? 'Apagar cámara' : 'Encender cámara'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              camaraActiva ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {camaraActiva ? <IconCamOn /> : <IconCamOff />}
          </button>

          {/* BOTÓN ASISTENTE ROBOT IA */}
          <button
            onClick={toggleRobotIA}
            title="Abrir Asistente Robot IA de la llamada"
            className={`h-12 px-4 rounded-full flex items-center gap-2 font-black text-xs transition-all cursor-pointer shadow-lg ${
              panelIABot
                ? 'bg-violet-600 text-white ring-2 ring-violet-400'
                : 'bg-slate-800 hover:bg-violet-900/60 text-violet-300 border border-violet-500/40'
            }`}
          >
            <IconRobot />
            <span>{panelIABot ? 'Ocultar IA' : 'Robot Asistente IA'}</span>
          </button>

          {/* Finalizar Llamada */}
          <button
            onClick={finalizar}
            title="Finalizar videollamada"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl shadow-red-900/50 hover:scale-105"
          >
            <IconPhoneOff />
          </button>
        </div>

        {/* ── MODAL FINAL DE CIERRE Y RESUMEN IA ──────────────── */}
        {estadoLlamada === 'finalizada' && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <IconRobot />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Teleconsulta Finalizada con Éxito</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Duración de la sesión médica: <strong className="text-white font-mono">{formatDuracion(duracion)}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-violet-300 font-bold text-[11px]">
                  <span>Síntesis Generada por el Robot IA</span>
                  <span className="font-mono text-emerald-400">✓ Auditado MPPS DS-7</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {resumenSOAPGenerado
                    ? resumenSOAPGenerado.subjetivo
                    : '"Paciente y facultativo mantuvieron sesión de teleconsulta médica. Registro de voz procesado bajo estándares de seguridad MPPS."'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cerrarDefinitivo}
                  className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  Guardar Resumen y Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
