// ============================================================
//  src/modules/auth/LoginPage.jsx
//  DISEÑO: "Cosmos Medical" — World-Class Healthcare Enterprise Login
//  Equipo de diseño: UX + UI + Visual + Graphic Designer
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RUTA_POR_ROL = {
  admin:    '/admin/dashboard',
  medico:   '/medico/dashboard',
  admision: '/admision/dashboard',
  paciente: '/paciente/dashboard',
}

// ── ESCENAS CINEMATOGRÁFICAS ─────────────────────────────────
const SCENES = [
  {
    id: 0,
    bg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=90',
    accent: '#2563EB',
    accentLight: '#DBEAFE',
    accentGrad: 'from-blue-900/80 via-blue-800/50 to-blue-900/20',
    pill: 'TRIAJE MANCHESTER · NIVEL II',
    pillColor: 'bg-red-600',
    titulo: 'Estación Clínica\nde Guardia & Triaje',
    subtitulo: 'Apertura inmediata de historias clínicas en Formato F-052 con clasificación de emergencias en tiempo real.',
    tab: 'Módulo Médico',
    tabSub: 'Guardia · F-052 · 24H',
    metricas: [
      { label: 'Triaje Activo',    valor: 'Nivel II',       dot: '#EF4444' },
      { label: 'T.A. · SpO₂',     valor: '120/80 · 99%',   dot: '#22C55E' },
      { label: 'Censo Guardia',    valor: '03 pacientes',   dot: '#3B82F6' },
    ],
    tag: 'Personal Médico & Clínico',
    tagIcon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=90',
    accent: '#059669',
    accentLight: '#D1FAE5',
    accentGrad: 'from-emerald-900/80 via-emerald-800/50 to-emerald-900/20',
    pill: 'CARNET QR · ISO/IEC 18004',
    pillColor: 'bg-emerald-600',
    titulo: 'Billetera Móvil\nde Salud & QR',
    subtitulo: 'El paciente lleva su historial vital en el teléfono. Grupo sanguíneo, alergias y emergencias escaneables offline.',
    tab: 'Módulo Paciente',
    tabSub: 'Carnet QR · Offline · 24H',
    metricas: [
      { label: 'Titular',         valor: 'Jeremy Acosta',  dot: '#059669' },
      { label: 'Grupo Sanguíneo', valor: 'O Positivo (O+)', dot: '#22C55E' },
      { label: 'Alerta Médica',   valor: 'Alergia PNC',    dot: '#EF4444' },
    ],
    tag: 'Pacientes & Ciudadanos',
    tagIcon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=90',
    accent: '#7C3AED',
    accentLight: '#EDE9FE',
    accentGrad: 'from-violet-900/80 via-indigo-800/50 to-violet-900/20',
    pill: 'SYNC SHA-256 · CRIPTOGRAFÍA',
    pillColor: 'bg-violet-600',
    titulo: 'Récipe Digital &\nSincronización Dual',
    subtitulo: 'El médico prescribe en el hospital y el paciente recibe el récipe encriptado en milisegundos para despacho en farmacia.',
    tab: 'Interoperabilidad',
    tabSub: 'Sync Dual · Criptografía',
    metricas: [
      { label: 'Médico Emisor',  valor: 'Dr. H. Morales', dot: '#7C3AED' },
      { label: 'Récipe N°',      valor: 'REC-2026-00412', dot: '#8B5CF6' },
      { label: 'Fármaco',        valor: 'Amoxicilina 875mg', dot: '#22C55E' },
    ],
    tag: 'Interoperabilidad Bidireccional',
    tagIcon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    bg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90',
    accent: '#D97706',
    accentLight: '#FEF3C7',
    accentGrad: 'from-amber-900/80 via-orange-800/50 to-amber-900/20',
    pill: 'CIERRE MPPS · DISTRITO 7',
    pillColor: 'bg-amber-600',
    titulo: 'Consolidación\nEpidemiológica MPPS',
    subtitulo: 'Cierre de turno en 1 clic. Distribución automática de patologías para planillas oficiales del Ministerio de Salud.',
    tab: 'Cierre MPPS',
    tabSub: 'Distrito Sanitario N° 7',
    metricas: [
      { label: 'Motor BD',     valor: 'PostgreSQL 16',  dot: '#D97706' },
      { label: 'Auditoría',    valor: 'IP + Cédula',    dot: '#F59E0B' },
      { label: 'Estado Nodo',  valor: '100% Operativo', dot: '#22C55E' },
    ],
    tag: 'Gestión Epidemiológica Distrital',
    tagIcon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

// ── ÍCONOS SVG ────────────────────────────────────────────────
const IconEye = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

const IconShield = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const IconLock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

const IconUser = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const IconArrow = ({ dir }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
)

// ── GRAFICO ÚNICO POR ESCENA ──────────────────────────────────
function GraficoEscena({ sceneId }) {
  if (sceneId === 0) {
    // Triaje Manchester — semáforo de niveles
    const niveles = [
      { nivel: 'I',  label: 'Reanimación',   color: '#DC2626', ancho: '20%' },
      { nivel: 'II', label: 'Emergencia',     color: '#EA580C', ancho: '35%', activo: true },
      { nivel: 'III',label: 'Urgente',        color: '#CA8A04', ancho: '25%' },
      { nivel: 'IV', label: 'Semi-urgente',   color: '#16A34A', ancho: '12%' },
      { nivel: 'V',  label: 'No urgente',     color: '#2563EB', ancho:  '8%' },
    ]
    return (
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold text-white/50 tracking-widest uppercase mb-2">
          Distribución Triaje · Turno Actual
        </p>
        {niveles.map((n) => (
          <div key={n.nivel} className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-white/60 w-3">{n.nivel}</span>
            <div className="flex-1 relative h-5 rounded overflow-hidden bg-white/10">
              <div
                className="h-full rounded transition-all duration-1000"
                style={{
                  width: n.ancho,
                  background: n.color,
                  opacity: n.activo ? 1 : 0.65,
                  boxShadow: n.activo ? `0 0 12px ${n.color}99` : 'none',
                }}
              />
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-white font-medium">
                {n.label}
              </span>
            </div>
            <span className="text-[9px] text-white/50 w-6 text-right">{n.ancho}</span>
          </div>
        ))}
      </div>
    )
  }

  if (sceneId === 1) {
    // Carnet QR — tarjeta de salud
    return (
      <div className="relative">
        <p className="text-[10px] font-semibold text-white/50 tracking-widest uppercase mb-2.5">
          Carnet Digital de Salud · QR Offline
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
          <div className="flex gap-3 items-start">
            {/* QR simulado */}
            <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex-shrink-0">
              <div className="w-full h-full grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[1px]"
                    style={{
                      background: [0,1,2,5,6,7,10,12,14,17,18,19,20,22,24].includes(i)
                        ? '#1e3a8a' : '#ffffff'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-white text-xs font-bold leading-tight">Jeremy Acosta</p>
              <p className="text-white/60 text-[9px]">V-30.047.210</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">O+</span>
                <span className="bg-red-500/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">Alergia PNC</span>
              </div>
              <p className="text-white/40 text-[8px] mt-1">MPPS · DS-7 · Petare</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    )
  }

  if (sceneId === 2) {
    // Récipe digital — flujo de prescripción
    const pasos = [
      { label: 'Médico emite récipe', done: true, color: '#7C3AED' },
      { label: 'Firma criptográfica SHA-256', done: true, color: '#7C3AED' },
      { label: 'Envío al paciente', done: true, color: '#7C3AED' },
      { label: 'Despacho en farmacia', done: false, color: '#6B7280' },
    ]
    return (
      <div>
        <p className="text-[10px] font-semibold text-white/50 tracking-widest uppercase mb-2.5">
          Flujo · REC-2026-00412
        </p>
        <div className="space-y-2">
          {pasos.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                style={{
                  borderColor: p.done ? p.color : '#4B5563',
                  background: p.done ? p.color : 'transparent',
                }}
              >
                {p.done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] font-medium ${p.done ? 'text-white' : 'text-white/40'}`}>
                {p.label}
              </span>
              {i < pasos.length - 1 && p.done && (
                <svg className="ml-auto w-3 h-3 text-violet-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 bg-violet-500/20 border border-violet-500/40 rounded-lg p-2">
          <p className="text-[9px] text-violet-200 font-medium">Amoxicilina 875mg · 7 días</p>
          <p className="text-[8px] text-white/40 mt-0.5">Dr. H. Morales · MPPS N° 45.892</p>
        </div>
      </div>
    )
  }

  // sceneId === 3 — Morbilidad MPPS
  const barras = [
    { label: 'IRA',       pct: 32, color: '#D97706' },
    { label: 'HTA',       pct: 24, color: '#F59E0B' },
    { label: 'Diarrea',   pct: 18, color: '#FBBF24' },
    { label: 'Trauma',    pct: 14, color: '#FCD34D' },
    { label: 'Otros',     pct: 12, color: '#FDE68A' },
  ]
  return (
    <div>
      <p className="text-[10px] font-semibold text-white/50 tracking-widest uppercase mb-2">
        Morbilidad · Guardia 24H · DS-7
      </p>
      <div className="space-y-1.5">
        {barras.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-[9px] text-white/50 w-12">{b.label}</span>
            <div className="flex-1 h-4 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-1000 flex items-center px-1.5"
                style={{ width: `${b.pct}%`, background: b.color }}
              >
                <span className="text-[8px] text-white font-bold whitespace-nowrap">{b.pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────
export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [tipoCedula,    setTipoCedula]    = useState('V')
  const [numeroCedula,  setNumeroCedula]  = useState('18765432')
  const [password,      setPassword]      = useState('Test1234!')
  const [mostrarPass,   setMostrarPass]   = useState(false)
  const [perfilActivo,  setPerfilActivo]  = useState('hospital')
  const [error,         setError]         = useState('')
  const [cargando,      setCargando]      = useState(false)

  // ── HERO STATE ────────────────────────────────────────────
  const [sceneIdx,   setSceneIdx]   = useState(0)
  const [prevIdx,    setPrevIdx]    = useState(null)
  const [fase,       setFase]       = useState('visible') // 'visible' | 'saliendo' | 'entrando'
  const [progreso,   setProgreso]   = useState(0)
  const [kenBurns,   setKenBurns]   = useState(0) // 0 o 1, alterna para reiniciar animación
  const DURACION = 6000
  const scene    = SCENES[sceneIdx]
  const timerRef = useRef(null)

  const irA = (idx) => {
    if (idx === sceneIdx || fase !== 'visible') return
    setFase('saliendo')
    setPrevIdx(sceneIdx)
    setTimeout(() => {
      setSceneIdx(idx)
      setProgreso(0)
      setKenBurns((k) => (k + 1) % 2)
      setFase('entrando')
      setTimeout(() => {
        setFase('visible')
        setPrevIdx(null)
      }, 500)
    }, 400)
  }

  const siguiente = () => irA((sceneIdx + 1) % SCENES.length)
  const anterior  = () => irA(sceneIdx === 0 ? SCENES.length - 1 : sceneIdx - 1)

  // Autoplay
  useEffect(() => {
    const TICK = 40
    const paso = (TICK / DURACION) * 100
    timerRef.current = setInterval(() => {
      setProgreso((p) => {
        if (p + paso >= 100) {
          siguiente()
          return 0
        }
        return p + paso
      })
    }, TICK)
    return () => clearInterval(timerRef.current)
  }, [sceneIdx, fase])

  const cambiarPerfil = (key) => {
    setPerfilActivo(key)
    setError('')
    if (key === 'paciente') {
      setNumeroCedula('30047210')
      setPassword('Test1234!')
      irA(1)
    } else {
      setNumeroCedula('18765432')
      setPassword('Test1234!')
      irA(0)
    }
  }

  // ── FORM ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const cedulaLimpia = numeroCedula.replace(/\D/g, '')
      const data = await login(cedulaLimpia, password)
      const rol = data?.usuario?.rol || data?.rol
      navigate(RUTA_POR_ROL[rol] || (perfilActivo === 'paciente' ? '/paciente/dashboard' : '/admision/dashboard'))
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.details?.[0] || err.message || 'Credenciales incorrectas. Verifique cédula y clave.'
      setError(msg)
    } finally {
      setCargando(false)
    }
  }

  // Opacidad / transform por fase
  const heroStyle = {
    opacity:   fase === 'saliendo' ? 0 : fase === 'entrando' ? 0 : 1,
    transform: fase === 'saliendo' ? 'scale(1.03) translateY(-6px)'
             : fase === 'entrando' ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
    transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1)',
  }

  return (
    <>
      {/* ── KEYFRAMES GLOBALES ───────────────────────────── */}
      <style>{`
        @keyframes ken-burns-0 {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          100% { transform: scale(1.12) translate(-2%, -1.5%); }
        }
        @keyframes ken-burns-1 {
          0%   { transform: scale(1.12) translate(-2%, -1.5%); }
          100% { transform: scale(1.0) translate(2%, 1%); }
        }
        @keyframes float-up-1 {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes float-up-2 {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-5px); }
        }
        @keyframes slide-in-right {
          from { opacity:0; transform: translateX(24px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity:0; transform: translateX(-24px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes slide-up {
          from { opacity:0; transform: translateY(16px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:.5; transform:scale(1.5); }
        }
        @keyframes scan-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes badge-pop {
          0%   { opacity:0; transform: scale(.8) translateY(8px); }
          60%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes stream {
          0%   { stroke-dashoffset: 200; opacity:.3; }
          50%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: .3; }
        }
        .ken-burns-0 { animation: ken-burns-0 ${DURACION + 600}ms ease-out forwards; }
        .ken-burns-1 { animation: ken-burns-1 ${DURACION + 600}ms ease-out forwards; }
        .float-1     { animation: float-up-1 4s ease-in-out infinite; }
        .float-2     { animation: float-up-2 5.5s ease-in-out infinite 0.8s; }
        .slide-right { animation: slide-in-right 0.5s ease-out both; }
        .slide-left  { animation: slide-in-left 0.5s ease-out both; }
        .slide-up    { animation: slide-up 0.5s ease-out both; }
        .badge-pop   { animation: badge-pop 0.5s cubic-bezier(.4,0,.2,1) both; }
        .pulse-dot   { animation: pulse-dot 1.8s ease-in-out infinite; }
      `}</style>

      {/* ── CONTENEDOR RAÍZ ─────────────────────────────── */}
      <div className="min-h-screen w-full flex bg-[#f8fafc] overflow-hidden">

        {/* ════════════════════════════════════════════════
            PANEL IZQUIERDO — HERO CINEMATOGRÁFICO
        ════════════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-col relative w-[58%] xl:w-[60%] overflow-hidden">

          {/* Imagen con Ken Burns */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              key={`img-${sceneIdx}-${kenBurns}`}
              src={scene.bg}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover origin-center ken-burns-${kenBurns}`}
              style={{ willChange: 'transform' }}
            />
            {/* Overlay gradiente cinemático multicapa */}
            <div className={`absolute inset-0 bg-gradient-to-r ${scene.accentGrad} transition-all duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Línea de scan sutil */}
            <div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ animation: 'scan-line 4s linear infinite' }}
            />
          </div>

          {/* Badge institución — arriba izquierda */}
          <div className="relative z-20 flex items-center justify-between p-8 pb-0">
            <div className="flex items-center gap-3">
              {/* Logo SVG institucional */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: scene.accent }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8m-4-4h8M6 20.5A8.5 8.5 0 1017.5 9" />
                </svg>
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight tracking-wide">
                  Hospital Periférico de Petare
                </p>
                <p className="text-white/60 text-[10px] leading-tight">
                  MPPS · Distrito Sanitario N° 7
                </p>
              </div>
            </div>
            {/* Dot de estado en vivo */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-white/70 text-[10px] font-medium">Sistema en Línea</span>
            </div>
          </div>

          {/* CONTENIDO CENTRAL HERO */}
          <div className="relative z-20 flex-1 flex flex-col justify-end pb-8 px-8">

            {/* Pill de categoría */}
            <div style={heroStyle} key={`pill-${sceneIdx}`}>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white mb-4 slide-up"
                style={{ background: scene.accent + 'CC', animationDelay: '0ms' }}
              >
                <span className="w-1 h-1 rounded-full bg-white pulse-dot" />
                {scene.pill}
              </span>
            </div>

            {/* Título grande */}
            <div style={heroStyle} key={`titulo-${sceneIdx}`}>
              <h1
                className="text-white font-black leading-[1.05] mb-4 slide-left"
                style={{
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  whiteSpace: 'pre-line',
                  textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                  animationDelay: '60ms',
                }}
              >
                {scene.titulo}
              </h1>
            </div>

            {/* Subtítulo */}
            <div style={heroStyle} key={`sub-${sceneIdx}`}>
              <p
                className="text-white/75 text-sm leading-relaxed max-w-md mb-6 slide-left"
                style={{ animationDelay: '120ms' }}
              >
                {scene.subtitulo}
              </p>
            </div>

            {/* TAG de usuario objetivo */}
            <div style={heroStyle} key={`tag-${sceneIdx}`}>
              <div
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 mb-6 slide-up border"
                style={{
                  background: `${scene.accent}22`,
                  borderColor: `${scene.accent}44`,
                  color: '#fff',
                  animationDelay: '160ms',
                }}
              >
                {scene.tagIcon}
                <span className="text-xs font-semibold">{scene.tag}</span>
              </div>
            </div>

            {/* ── PANEL GLASS — GRÁFICO + MÉTRICAS ────────── */}
            <div
              key={`glass-${sceneIdx}`}
              className="slide-up"
              style={{ animationDelay: '200ms', ...heroStyle }}
            >
              <div
                className="rounded-2xl border p-4 mb-5"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  boxShadow: `0 0 40px ${scene.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                {/* Gráfico dinámico por escena */}
                <GraficoEscena sceneId={sceneIdx} />

                {/* Separador */}
                <div className="border-t border-white/10 my-3" />

                {/* Métricas en fila */}
                <div className="grid grid-cols-3 gap-3">
                  {scene.metricas.map((m, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: m.dot }}
                        />
                        <span className="text-[9px] text-white/45 uppercase tracking-wider truncate">{m.label}</span>
                      </div>
                      <p className="text-white text-xs font-bold truncate">{m.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── BARRA DE NAVEGACIÓN HERO ─────────────────── */}
            <div className="flex items-center gap-3">
              {/* Prev / Next */}
              <button
                onClick={anterior}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <IconArrow dir="left" />
              </button>

              {/* Pills de escena */}
              <div className="flex gap-2 flex-1">
                {SCENES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => irA(i)}
                    className="group relative flex-1 rounded-full overflow-hidden transition-all"
                    style={{ height: i === sceneIdx ? '32px' : '24px' }}
                  >
                    {/* Fondo */}
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-300"
                      style={{
                        background: i === sceneIdx ? scene.accent : 'rgba(255,255,255,0.15)',
                      }}
                    />
                    {/* Progress fill */}
                    {i === sceneIdx && (
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-none"
                        style={{
                          width: `${progreso}%`,
                          background: 'rgba(255,255,255,0.35)',
                        }}
                      />
                    )}
                    {/* Label */}
                    <div className="relative flex items-center justify-center h-full px-2">
                      {i === sceneIdx ? (
                        <span className="text-[9px] font-bold text-white tracking-wide whitespace-nowrap">
                          {s.tab}
                        </span>
                      ) : (
                        <span className="text-[8px] text-white/50 group-hover:text-white/80 transition-colors whitespace-nowrap">
                          {s.tabSub}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={siguiente}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <IconArrow dir="right" />
              </button>
            </div>
          </div>

          {/* Floating badge — esquina superior derecha */}
          <div
            className="absolute top-16 right-6 z-20 float-1 badge-pop"
            style={{ animationDelay: '400ms' }}
          >
            <div
              className="rounded-xl border px-3 py-2 text-center shadow-2xl"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(12px)',
                borderColor: `${scene.accent}55`,
                boxShadow: `0 8px 32px ${scene.accent}33`,
              }}
            >
              <p className="text-[8px] text-white/40 uppercase tracking-widest">Nodo</p>
              <p className="text-white text-xs font-black" style={{ color: scene.accentLight }}>DS-07</p>
              <p className="text-[8px] text-white/50">Petare · VE</p>
            </div>
          </div>

          {/* Floating badge — inferior izquierda */}
          <div
            className="absolute bottom-36 left-6 z-20 float-2 badge-pop"
            style={{ animationDelay: '600ms' }}
          >
            <div
              className="rounded-xl border px-3 py-2 shadow-2xl"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <IconShield />
                </div>
                <div>
                  <p className="text-[8px] text-white/40">Seguridad</p>
                  <p className="text-[10px] text-white font-semibold">Bcrypt · TLS 1.3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            PANEL DERECHO — FORMULARIO DE ACCESO
        ════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10 bg-[#f8fafc] relative overflow-y-auto">

          {/* Decoración background sutil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${scene.accent}0D 0%, transparent 70%)`,
              transition: 'background 0.6s ease',
            }}
          />

          {/* Header móvil — sólo visible en pantallas pequeñas */}
          <div className="lg:hidden flex items-center gap-3 mb-8 w-full max-w-sm">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: scene.accent }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v8m-4-4h8M6 20.5A8.5 8.5 0 1017.5 9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-tight">Hospital Periférico de Petare</p>
              <p className="text-[10px] text-gray-400">MPPS · Distrito Sanitario N° 7</p>
            </div>
          </div>

          {/* Caja de formulario */}
          <div className="relative w-full max-w-sm">

            {/* Cabecera del formulario */}
            <div className="text-center mb-8">
              {/* Ícono central */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-4 relative"
                style={{ background: `linear-gradient(135deg, ${scene.accent}, ${scene.accent}BB)` }}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {/* Halo */}
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: `0 0 0 8px ${scene.accent}18`,
                    animation: 'pulse-dot 2.5s ease-in-out infinite',
                  }}
                />
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                Acceso al Sistema
              </h2>
              <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide">
                Sistema Interoperable de Historias Médicas
              </p>
            </div>

            {/* Selector de perfil */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-6">
              {[
                { key: 'hospital', label: 'Personal Médico' },
                { key: 'paciente', label: 'Paciente' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => cambiarPerfil(key)}
                  className="flex-1 py-2.5 text-xs font-semibold transition-all duration-300"
                  style={{
                    background: perfilActivo === key ? scene.accent : 'transparent',
                    color: perfilActivo === key ? '#fff' : '#6B7280',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Cédula */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Cédula de Identidad
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={tipoCedula}
                      onChange={(e) => setTipoCedula(e.target.value)}
                      className="h-11 pl-3 pr-6 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold focus:outline-none appearance-none cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
                      style={{ '--tw-ring-color': scene.accent }}
                    >
                      {['V','E','J','G','P'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconUser />
                    </div>
                    <input
                      type="text"
                      value={numeroCedula}
                      onChange={(e) => setNumeroCedula(e.target.value.replace(/\D/g, ''))}
                      placeholder="Número de cédula"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium placeholder-gray-300 shadow-sm hover:border-gray-300 transition-colors focus:outline-none"
                      style={{ outlineOffset: '2px' }}
                      onFocus={(e) => { e.target.style.borderColor = scene.accent; e.target.style.boxShadow = `0 0 0 3px ${scene.accent}18` }}
                      onBlur={(e)  => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconLock />
                  </div>
                  <input
                    type={mostrarPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña segura"
                    required
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm placeholder-gray-300 shadow-sm hover:border-gray-300 transition-colors focus:outline-none"
                    onFocus={(e) => { e.target.style.borderColor = scene.accent; e.target.style.boxShadow = `0 0 0 3px ${scene.accent}18` }}
                    onBlur={(e)  => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPass(!mostrarPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconEye open={mostrarPass} />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-red-700 text-xs font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {/* Botón de acceso */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full h-12 rounded-xl text-white text-sm font-bold tracking-wide shadow-lg transition-all duration-300 active:scale-[.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: cargando
                    ? '#9CA3AF'
                    : `linear-gradient(135deg, ${scene.accent} 0%, ${scene.accent}CC 100%)`,
                  boxShadow: cargando ? 'none' : `0 4px 24px ${scene.accent}44`,
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => { if (!cargando) e.currentTarget.style.filter = 'brightness(1.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = '' }}
              >
                {cargando ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Autenticando...
                  </>
                ) : (
                  <>
                    <IconShield />
                    Ingresar al Sistema
                  </>
                )}
              </button>
            </form>

            {/* Footer del form */}
            <div className="mt-5 space-y-3">
              {/* Seguridad */}
              <div className="flex items-center justify-center gap-4">
                {[
                  { label: 'Bcrypt Salt-12' },
                  { label: 'TLS 1.3' },
                  { label: 'Auditoría Total' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-gray-400">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[9px] font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Separador */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[9px] text-gray-300 tracking-widest font-medium uppercase">Institución</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Info institucional */}
              <div className="text-center">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  <span className="font-semibold text-gray-500">
                    Hospital Periférico de Petare
                  </span>
                  {' '}·{' '}
                  <span className="italic">Dr. Ana Francisca Pérez de León</span>
                </p>
                <p className="text-[9px] text-gray-300 mt-0.5">
                  MPPS · Distrito Sanitario N° 7 · Sistema HIPMS v2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
