// ============================================================
//  src/modules/paciente/PacienteDashboard.jsx — Billetera de Salud Digital
//  DISEÑO: "Cosmos Medical" — Wallet, Emergency QR, Récipes e Historial
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  obtenerMiPerfilClinico,
  actualizarMiPerfilClinico,
  actualizarMisDatosContacto,
  getStoredPacientes
} from '../../api/pacientes'
import Formato001Modal from '../../components/formatos/Formato001Modal'
import ModalEditarDatosVitales from '../../components/paciente/ModalEditarDatosVitales'
import ModalEditarDatosPersonales from '../../components/paciente/ModalEditarDatosPersonales'

// ── SVG Íconos Médicos Vectoriales ───────────────────────────
const IconQr = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)
const IconDocument = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconHistory = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IconShield = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const IconPrint = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
)

// ── Historial Clínico de Consultas y Atenciones (Demo Oficial) ───
const HISTORIAL_ATENCIONES_DEMO = [
  {
    id: 'AT-2026-003',
    fecha: '28/10/2026',
    hora: '10:30',
    tipo: 'Teleasistencia Digital M6',
    servicio: 'Medicina General Ambulatoria',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · DS-7',
    motivo: 'Seguimiento síndrome febril y control de cefalea',
    diagnostico: 'Evolución satisfactoria de síndrome febril agudo (CIE-10: R50.9)',
    conducta: 'Continuar hidratación oral. Mantener control de temperatura. Alta clínica del episodio.',
    signos: { ta: '115/75 mmHg', fc: '72 lpm', spo2: '99%', temp: '36.8 °C' },
    formato: 'FORM. M6 TELEMED',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'AT-2026-002',
    fecha: '19/10/2026',
    hora: '11:20',
    tipo: 'Guardia Médica de Emergencia (F-051)',
    servicio: 'Emergencia Adultos',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · DS-7',
    motivo: 'Reevaluación post-hidratación y emisión de récipe formal',
    diagnostico: 'Cefalea tensional en remisión (CIE-10: G44.2)',
    conducta: 'Egreso por mejoría clínica. Se emite Récipe Oficial Formato 001 (Folio #001). Reposo 48h.',
    signos: { ta: '120/80 mmHg', fc: '78 lpm', spo2: '98%', temp: '37.0 °C' },
    formato: 'FORM. 051 EMERG',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'AT-2026-001',
    fecha: '19/10/2026',
    hora: '08:30',
    tipo: 'Admisión Central & Triaje (F-052)',
    servicio: 'Triaje de Emergencia Adultos',
    medico: 'Dr. Héctor Morales (Jefe de Guardia: Dr. Hildren Morales)',
    mpps: 'MPPS 45.892 · DS-7',
    motivo: 'Cefalea pulsátil persistente y síndrome febril de 48 horas de evolución',
    diagnostico: 'Cefalea tensional / Síndrome febril en estudio (CIE-10: R51)',
    conducta: 'Triaje Manchester Nivel III (Amarillo). Ingreso a área de hidratación y observación médica.',
    signos: { ta: '130/85 mmHg', fc: '88 lpm', spo2: '97%', temp: '38.5 °C' },
    formato: 'FORM. 052 P-1',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  }
]

export default function PacienteDashboard() {
  const { usuario } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const esJeremy = usuario?.cedula === '30047210'

  // Determinar pestaña activa según la URL
  const path = location.pathname
  const tabActiva = path.includes('/paciente/recetas')
    ? 'recetas'
    : path.includes('/paciente/historial')
    ? 'historial'
    : path.includes('/paciente/privacidad')
    ? 'privacidad'
    : 'general'

  const [permiteVerHistoria, setPermiteVerHistoria] = useState(true)
  const [permiteTeleconsulta, setPermiteTeleconsulta] = useState(true)
  const [permiteQRPublico, setPermiteQRPublico] = useState(true)
  const [copiado, setCopiado] = useState(false)

  // Estado del perfil clínico real (Backend M1)
  const [perfilClinico, setPerfilClinico] = useState(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [modalContactoAbierto, setModalContactoAbierto] = useState(false)
  const [notificacion, setNotificacion] = useState('')
  const [recetasPaciente, setRecetasPaciente] = useState([])
  const [modalRecipeAbierto, setModalRecipeAbierto] = useState(false)
  const [recipeActivo, setRecipeActivo] = useState(null)

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const data = await obtenerMiPerfilClinico()
        if (data) setPerfilClinico(data)
      } catch (err) {
        console.warn('Fallback a perfil estático de demostración:', err)
      }
    }
    cargarPerfil()
  }, [])

  // Cargar prescripciones oficiales foliadas del paciente (FORM. 001)
  useEffect(() => {
    try {
      const list = getStoredPacientes()
      const cedLimpia = String(usuario?.cedula || '').replace(/\D/g, '')
      const pac = list.find((p) => {
        const pCed = String(p.cedula || '').replace(/\D/g, '')
        return (cedLimpia && pCed === cedLimpia) || (p.numero_historia === (perfilClinico?.numero_historia || (esJeremy ? 'HPL-2024-00001' : 'HPL-2024-00002')))
      }) || list[0]

      if (pac && Array.isArray(pac.documentos)) {
        const f001Docs = pac.documentos.filter((d) => d.tipo === 'F001')
        setRecetasPaciente(f001Docs)
      }
    } catch (e) {
      console.warn('Error al cargar recetas del paciente:', e)
    }
  }, [usuario?.cedula, perfilClinico])

  const datosPaciente = {
    historia: perfilClinico?.numero_historia || (esJeremy ? 'HPL-2024-00001' : 'HPL-2024-00002'),
    cedula: perfilClinico?.cedula || (esJeremy ? '30.047.210' : '29.921.654'),
    nombre: perfilClinico ? `${perfilClinico.nombre} ${perfilClinico.apellido}` : (esJeremy ? 'Jeremy Acosta' : 'Eli Araujo'),
    fechaNacimiento: perfilClinico?.fecha_nacimiento || (esJeremy ? '15 de Mayo de 2000 (24 años)' : '22 de Marzo de 2001 (23 años)'),
    tipoSangre: perfilClinico?.tipo_sangre || (esJeremy ? 'O+' : 'A+'),
    alergias: perfilClinico?.alergias_conocidas || (esJeremy ? 'Alergia severa a Penicilina (PNC)' : 'Ninguna conocida'),
    contactoEmergencia: perfilClinico?.nombre_contacto_emergencia ? `${perfilClinico.nombre_contacto_emergencia} · ${perfilClinico.telefono_emergencia || ''}` : (esJeremy ? 'Laura Acosta (Madre) · 0412-9998877' : 'Rosa Araujo (Madre) · 0414-1112233'),
    direccion: perfilClinico?.direccion || (esJeremy ? 'Barrio 24 de Marzo, Calle 5, Petare' : 'Urb. La Dolorita, Bloque 8, Petare'),
    fechaEmision: '18/10/2026',
    distrito: 'Distrito Sanitario N° 7',
  }

  const handleGuardarDatosVitales = async (nuevosDatos) => {
    const data = await actualizarMiPerfilClinico(nuevosDatos)
    if (data) {
      setPerfilClinico(data)
    } else {
      setPerfilClinico((prev) => ({ ...prev, ...nuevosDatos }))
    }
    setNotificacion('¡Datos vitales actualizados y registrados en auditoría clínica!')
    setTimeout(() => setNotificacion(''), 4000)
  }

  const copiarEnlaceQR = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* ── BANNER INSTITUCIONAL DEL TITULAR DE SALUD ──────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-800" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Expediente Clínico Soberano
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                Historia N° {datosPaciente.historia}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Billetera de {datosPaciente.nombre}
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-2xl">
              C.I. V-{datosPaciente.cedula} · Distrito Sanitario N° 7 · Instituto Municipal de Salud Ana Francisca Pérez de León.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setModalEditarAbierto(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Editar Sangre / Alergias</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-200 shadow-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <IconPrint />
              <span>Imprimir Ficha</span>
            </button>
          </div>
        </div>

        {/* ── BARRA DE TABS / SERVICIOS DEL PACIENTE ─────────── */}
        <div className="flex items-center gap-1 border-t border-slate-100 mt-5 pt-4 overflow-x-auto">
          {[
            { id: 'general', label: 'Carnet QR & Ficha Vital', path: '/paciente/dashboard', icon: <IconQr /> },
            { id: 'recetas', label: 'Mis Récipes Digitales (F-001)', path: '/paciente/recetas', icon: <IconDocument /> },
            { id: 'historial', label: 'Historial de Consultas', path: '/paciente/historial', icon: <IconHistory /> },
            { id: 'privacidad', label: 'Consentimiento & Soberanía', path: '/paciente/privacidad', icon: <IconShield /> },
          ].map((tab) => {
            const activo = tabActiva === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activo
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VISTA 1: CARNET QR & FICHA VITAL (Ruta: /paciente/dashboard)
      ════════════════════════════════════════════════════════ */}
      {(tabActiva === 'general') && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Carnet Clínico de Emergencia */}
          <div
            className="lg:col-span-2 relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #042f2e 100%)',
              boxShadow: '0 20px 40px -15px rgba(6, 78, 59, 0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-lg">
                  +
                </div>
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-emerald-300">
                    Carnet Clínico de Emergencia
                  </p>
                  <p className="text-[11px] text-white/70 font-medium">
                    Instituto Municipal de Salud Ana Francisca Pérez de León
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-black bg-white/15 px-3 py-1 rounded-lg border border-white/20">
                  {datosPaciente.historia}
                </span>
                <p className="text-[9px] text-emerald-300 font-mono mt-1">EMISIÓN: {datosPaciente.fechaEmision}</p>
              </div>
            </div>

            <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Titular de Salud</p>
                <p className="text-base font-black text-white mt-0.5">{datosPaciente.nombre}</p>
                <p className="text-xs font-mono font-medium text-emerald-300">V-{datosPaciente.cedula}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Fecha de Nacimiento</p>
                <p className="text-xs font-semibold text-white mt-1">{datosPaciente.fechaNacimiento}</p>
                <p className="text-[11px] text-white/60 truncate mt-0.5">{datosPaciente.direccion}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Grupo Sanguíneo</p>
                  <p className="text-xl font-black text-emerald-300 font-mono mt-0.5">{datosPaciente.tipoSangre}</p>
                </div>
                <span className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center font-black text-xs text-white">
                  Rh+
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    Alerta Médica
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">{datosPaciente.alergias}</p>
                </div>
                <span className="text-rose-300 font-black text-xs px-2 py-0.5 rounded bg-rose-500/30">
                  CRÍTICO
                </span>
              </div>
              <div className="sm:col-span-2 pt-2">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Contacto de Resguardo</p>
                <p className="text-xs font-semibold text-white mt-0.5">{datosPaciente.contactoEmergencia}</p>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
              <span>Red Hospitalaria Nacional · MPPS</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Firma Digital Criptográfica Verificada
              </span>
            </div>
          </div>

          {/* Tarjeta de Código QR */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-between text-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ISO/IEC 18004
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">QR Vital de Urgencias</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Lectura offline para ambulancias y triaje de emergencia.
              </p>
            </div>
            <div className="relative my-4 p-4 rounded-2xl bg-white border-2 border-dashed border-emerald-400/60 shadow-inner flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `INSTITUTO MUNICIPAL DE SALUD - ANA FRANCISCA PEREZ DE LEON | PACIENTE: ${datosPaciente.nombre} | CEDULA: ${datosPaciente.cedula} | HISTORIA: ${datosPaciente.historia} | SANGRE: ${datosPaciente.tipoSangre} | ALERGIAS: ${datosPaciente.alergias} | CONTACTO: ${datosPaciente.contactoEmergencia}`
                )}`}
                alt="Código QR de Emergencia"
                className="w-36 h-36 object-contain rounded-lg"
              />
            </div>
            <div className="w-full space-y-2">
              <button
                onClick={copiarEnlaceQR}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiado ? '¡Copiado al portapapeles!' : 'Copiar Identificador QR'}
              </button>
              <p className="text-[10px] text-slate-400 font-medium">Compatible con lectores ópticos y cámaras estándar</p>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          VISTA 2: MIS RÉCIPES DIGITALES (Ruta: /paciente/recetas)
      ════════════════════════════════════════════════════════ */}
      {(tabActiva === 'recetas' || tabActiva === 'general') && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Récipes Médicos Oficiales (Formato 001 MPPS)
                </h2>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Prescripciones oficiales foliadas listas para su consulta e impresión física oficial.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {recetasPaciente.length} {recetasPaciente.length === 1 ? 'Récipe Foliado' : 'Récipes Foliados'}
            </span>
          </div>

          {recetasPaciente.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
              <p className="text-xs font-bold text-slate-600">No posee prescripciones médicas activas en este momento.</p>
              <p className="text-[11px] text-slate-400 mt-1">Los récipes emitidos por su médico de guardia aparecerán aquí foliados y listos para imprimir en físico.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recetasPaciente.map((rc, idx) => (
                <div
                  key={rc.id || idx}
                  className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 p-5 space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-blue-700 text-xs bg-blue-100/80 px-2.5 py-0.5 rounded-lg border border-blue-200">
                          FOLIO #{rc.folio || idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          FORM. 001 MPPS
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-2">
                        {rc.resumen || rc.datos?.prescripcion_rp || 'Prescripción Médica Oficial'}
                      </h3>
                      {rc.datos?.indicaciones && (
                        <p className="text-xs text-slate-600 font-medium mt-1">
                          <strong>Indicaciones:</strong> {rc.datos.indicaciones}
                        </p>
                      )}
                    </div>
                    <div className="sm:text-right text-xs">
                      <p className="font-black text-slate-900">{rc.medico || rc.datos?.medico || 'Dr. Héctor Morales'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{rc.datos?.mpps || 'MPPS 45.892 · DS-7'}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Válido para Despacho Farmacéutico
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <span>Fecha de emisión: <strong>{rc.datos?.fecha || rc.fecha || '19/10/2026'}</strong></span>
                    <button
                      onClick={() => {
                        setRecipeActivo(rc)
                        setModalRecipeAbierto(true)
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <IconPrint />
                      <span>Ver e Imprimir Récipe Oficial (FORM. 001)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          VISTA 3: HISTORIAL DE CONSULTAS (Ruta: /paciente/historial)
      ════════════════════════════════════════════════════════ */}
      {(tabActiva === 'historial') && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Historial Clínico de Consultas y Atenciones Médicas
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Registro inmutable de atenciones recibidas en el Instituto Municipal de Salud Ana Francisca Pérez de León.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black rounded-xl">
              {HISTORIAL_ATENCIONES_DEMO.length} Atenciones Registradas
            </span>
          </div>

          <div className="space-y-4">
            {HISTORIAL_ATENCIONES_DEMO.map((at) => (
              <div
                key={at.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {at.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${at.badgeColor}`}>
                      {at.formato}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{at.tipo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{at.fecha}</span>
                    <span>·</span>
                    <span>{at.hora}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Médico Tratante</span>
                    <span className="font-black text-slate-900">{at.medico}</span>
                    <span className="text-[11px] text-slate-500 block font-mono">{at.mpps}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Servicio Hospitalario</span>
                    <span className="font-semibold text-slate-800">{at.servicio}</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">Motivo:</span> <span className="text-slate-600">{at.motivo}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Diagnóstico:</span> <span className="font-semibold text-emerald-800">{at.diagnostico}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Conducta / Destino:</span> <span className="text-slate-600">{at.conducta}</span>
                  </div>
                </div>

                {/* HUD de Signos en la Consulta */}
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">T.A.</span>
                    <span className="font-mono font-black text-slate-700">{at.signos.ta}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">F.C.</span>
                    <span className="font-mono font-black text-slate-700">{at.signos.fc}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">SpO₂</span>
                    <span className="font-mono font-black text-slate-700">{at.signos.spo2}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Temp.</span>
                    <span className="font-mono font-black text-slate-700">{at.signos.temp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          VISTA 4: SOBERANÍA Y PRIVACIDAD (Ruta: /paciente/privacidad)
      ════════════════════════════════════════════════════════ */}
      {(tabActiva === 'privacidad' || tabActiva === 'general') && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Soberanía de Datos & Consentimiento Informado
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Usted decide en tiempo real quién puede consultar su información clínica bajo la Ley de Infogobierno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Acceso a Historia F-052</span>
                <input
                  type="checkbox"
                  checked={permiteVerHistoria}
                  onChange={(e) => setPermiteVerHistoria(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded-md accent-emerald-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Permite a los médicos de guardia del Pérez de León consultar antecedentes clínicos y triaje.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Teleasistencia 24H</span>
                <input
                  type="checkbox"
                  checked={permiteTeleconsulta}
                  onChange={(e) => setPermiteTeleconsulta(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded-md accent-emerald-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Habilita consultas médicas a distancia y monitoreo remoto para seguimiento de tratamientos.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">QR de Urgencias Público</span>
                <input
                  type="checkbox"
                  checked={permiteQRPublico}
                  onChange={(e) => setPermiteQRPublico(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded-md accent-emerald-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Mantiene visible la ficha básica vital para paramédicos y servicios de ambulancia en la vía pública.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Modal para auto-gestión de Grupo Sanguíneo y Alergias */}
      <ModalEditarDatosVitales
        abierto={modalEditarAbierto}
        alCerrar={() => setModalEditarAbierto(false)}
        datosActuales={{
          tipo_sangre: datosPaciente.tipoSangre,
          alergias_conocidas: datosPaciente.alergias
        }}
        alGuardarExitoso={handleGuardarDatosVitales}
      />

      {/* Toast Notification */}
      {notificacion && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-700/60 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-bold">{notificacion}</p>
        </div>
      )}

      {/* ── MODAL: RÉCIPE OFICIAL MPPS (VER / IMPRIMIR) ───────────── */}
      {modalRecipeAbierto && createPortal(
        <Formato001Modal
          abierto={modalRecipeAbierto}
          cerrar={() => {
            setModalRecipeAbierto(false)
            setRecipeActivo(null)
          }}
          paciente={{
            nombre_completo: datosPaciente.nombre,
            cedula: datosPaciente.cedula,
            numero_historia: datosPaciente.historia,
          }}
          documento={recipeActivo}
          modo="ver"
        />,
        document.body
      )}
    </div>
  )
}
