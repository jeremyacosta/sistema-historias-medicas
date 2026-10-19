// ============================================================
//  src/modules/paciente/PacienteDashboard.jsx — Billetera de Salud Digital
//  DISEÑO: "Cosmos Medical" — Wallet & Emergency QR
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function PacienteDashboard() {
  const { usuario } = useAuth()

  const esJeremy = usuario?.cedula === '30047210'

  const [permiteVerHistoria, setPermiteVerHistoria] = useState(true)
  const [permiteTeleconsulta, setPermiteTeleconsulta] = useState(true)
  const [permiteQRPublico, setPermiteQRPublico] = useState(true)
  const [copiado, setCopiado] = useState(false)

  const datosPaciente = {
    historia: esJeremy ? 'HBG-2024-00001' : 'HBG-2024-00002',
    cedula: esJeremy ? '30.047.210' : '29.921.654',
    nombre: esJeremy ? 'Jeremy Acosta' : 'Eli Araujo',
    fechaNacimiento: esJeremy ? '15 de Mayo de 2000 (24 años)' : '22 de Marzo de 2001 (23 años)',
    tipoSangre: esJeremy ? 'O Positivo (O+)' : 'A Positivo (A+)',
    alergias: esJeremy ? 'Alergia severa a Penicilina (PNC)' : 'Ninguna conocida',
    contactoEmergencia: esJeremy ? 'Laura Acosta (Madre) · 0412-9998877' : 'Rosa Araujo (Madre) · 0414-1112233',
    direccion: esJeremy ? 'Barrio 24 de Marzo, Calle 5, Petare' : 'Urb. La Dolorita, Bloque 8, Petare',
    fechaEmision: '18/10/2026',
    distrito: 'Distrito Sanitario N° 7',
  }

  const copiarEnlaceQR = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7">

      {/* ── BANNER DEL TITULAR DE SALUD ────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-800" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-50/60 pointer-events-none blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Carnet Clínico Digital Activo
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                Historia N° {datosPaciente.historia}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Billetera de {datosPaciente.nombre}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
              Expediente interoperable custodio del paciente. Los paramédicos y médicos de guardia pueden consultar su carnet de emergencia mediante código QR sin conexión a internet.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir Ficha Médica
            </button>
          </div>
        </div>
      </section>

      {/* ── CARNET CLÍNICO BIOMÉTRICO Y QR DE URGENCIAS ───────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tarjeta de Salud Digital (Clinical Biometric Card) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #042f2e 100%)',
            boxShadow: '0 20px 40px -15px rgba(6, 78, 59, 0.4)',
          }}
        >
          {/* Textura geométrica sutil */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Cabecera del Carnet */}
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
                  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-black bg-white/15 px-3 py-1 rounded-lg border border-white/20 backdrop-blur-sm">
                {datosPaciente.historia}
              </span>
              <p className="text-[9px] text-emerald-300 font-mono mt-1">EMISIÓN: {datosPaciente.fechaEmision}</p>
            </div>
          </div>

          {/* Cuerpo de Datos Vitales */}
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

            {/* Grupo Sanguíneo Destacado */}
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Grupo Sanguíneo</p>
                <p className="text-xl font-black text-emerald-300 font-mono mt-0.5">{datosPaciente.tipoSangre}</p>
              </div>
              <span className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center font-black text-xs text-white">
                Rh+
              </span>
            </div>

            {/* Alerta de Alergias Críticas */}
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
              <p className="text-xs font-semibold text-white mt-0.5 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {datosPaciente.contactoEmergencia}
              </p>
            </div>
          </div>

          {/* Pie del Carnet */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
            <span>Red Hospitalaria Nacional · MPPS</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Firma Digital Criptográfica Verificada
            </span>
          </div>
        </div>

        {/* Tarjeta de Código QR de Urgencias */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ISO/IEC 18004
            </span>
            <h3 className="text-base font-black text-slate-900 mt-2">
              QR Vital de Urgencias
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Lectura offline para ambulancias y triaje de emergencia.
            </p>
          </div>

          {/* QR con marco moderno */}
          <div className="relative my-4 p-4 rounded-2xl bg-white border-2 border-dashed border-emerald-400/60 shadow-inner flex items-center justify-center group">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                `HOSPITAL PEREZ DE LEON - PETARE | PACIENTE: ${datosPaciente.nombre} | CEDULA: ${datosPaciente.cedula} | HISTORIA: ${datosPaciente.historia} | SANGRE: ${datosPaciente.tipoSangre} | ALERGIAS: ${datosPaciente.alergias} | CONTACTO: ${datosPaciente.contactoEmergencia}`
              )}`}
              alt="Código QR de Emergencia"
              className="w-36 h-36 object-contain rounded-lg"
            />
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={copiarEnlaceQR}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copiado ? '¡Copiado al portapapeles!' : 'Copiar Identificador QR'}
            </button>
            <p className="text-[10px] text-slate-400 font-medium">
              Compatible con lectores ópticos y cámaras estándar
            </p>
          </div>
        </div>
      </section>

      {/* ── RÉCIPES MÉDICOS ACTIVOS (PRESCRIPCIÓN DIGITAL) ─────── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                Prescripciones Médicas Activas
              </h2>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Récipes firmados por médicos del Hospital Dr. Ana Francisca Pérez de León
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            1 Tratamiento en Curso
          </span>
        </div>

        {/* Tarjeta de récipe estilo prescripción oficial */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div>
              <span className="font-mono font-black text-blue-700 text-xs bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                REC-2026-00412
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-2">
                Amoxicilina + Ácido Clavulánico 875/125 mg
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Tomar 1 comprimido vía oral cada 12 horas por 7 días continuos.
              </p>
            </div>

            <div className="sm:text-right text-xs">
              <p className="font-black text-slate-900">Dr. Hildren Morales</p>
              <p className="text-[11px] text-slate-500 font-mono">MPPS N° 84.192 · Medicina General</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Válido para Despacho
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>Fecha de emisión: 18 de Octubre de 2026</span>
            <button className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer">
              <span>Descargar Récipe Oficial Firmado (PDF)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── AUTORIZACIONES Y SOBERANÍA DEL PACIENTE ───────────── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Soberanía de Datos & Consentimiento Informado
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Usted decide en tiempo real quién puede consultar su información clínica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Toggle 1 */}
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

          {/* Toggle 2 */}
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

          {/* Toggle 3 */}
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

    </div>
  )
}
