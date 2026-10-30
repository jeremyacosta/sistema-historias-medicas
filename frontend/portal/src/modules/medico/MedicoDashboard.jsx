// ============================================================
//  src/modules/medico/MedicoDashboard.jsx
//  Estación Médica de Guardia — Cosmos Clinical Command
//  Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import HistorialClinicoPanel from '../../components/historias/HistorialClinicoPanel'

// ── Pacientes activos en guardia (datos demo) ─────────────────
const PACIENTES_GUARDIA = [
  {
    historia: 'HPL-2024-00003',
    nombre: 'Roberto Pérez',
    edad: '69', cedula: '5.100.200', sangre: 'O+',
    triaje: 'II', triajeLabel: 'Emergencia', triajeColor: '#ea580c',
    signos: { ta: '160/100', spo2: '94%', fc: '98 lpm', temp: '37.1 °C' },
    motivo: 'Dolor precordial con irradiación a brazo izquierdo',
    tiempoEspera: '06 min', maxEspera: '10 min',
    medicoAsignado: 'Dr. H. Morales',
  },
  {
    historia: 'HPL-2024-00001',
    nombre: 'Jeremy Acosta',
    edad: '24', cedula: '30.047.210', sangre: 'O+', alergia: 'PNC',
    triaje: 'III', triajeLabel: 'Urgencia', triajeColor: '#ca8a04',
    signos: { ta: '120/80', spo2: '99%', fc: '76 lpm', temp: '38.5 °C' },
    motivo: 'Cefalea pulsátil y síndrome febril agudo 48H',
    tiempoEspera: '18 min', maxEspera: '60 min',
    medicoAsignado: 'Sin asignar',
  },
  {
    historia: 'HPL-2024-00004',
    nombre: 'María González',
    edad: '45', cedula: '12.345.678', sangre: 'A+',
    triaje: 'IV', triajeLabel: 'Semi-urgente', triajeColor: '#16a34a',
    signos: { ta: '118/76', spo2: '98%', fc: '82 lpm', temp: '36.8 °C' },
    motivo: 'Lumbalgia crónica en reagudización',
    tiempoEspera: '42 min', maxEspera: '120 min',
    medicoAsignado: 'Sin asignar',
  },
]

// ── Colores del semáforo Manchester ──────────────────────────
const TRIAJE_CONFIG = {
  'I':  { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: '#DC2626' },
  'II': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: '#EA580C' },
  'III':{ bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: '#CA8A04' },
  'IV': { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: '#16A34A' },
  'V':  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563EB' },
}

// ── SVG Íconos médicos ────────────────────────────────────────
const IconHistoria = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
const IconRecipe = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const IconNota = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)
const IconPulso = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l2 5 3-11 3 10 2-4" />
  </svg>
)

export default function MedicoDashboard() {
  const { usuario } = useAuth()
  const navigate    = useNavigate()
  const [pacienteActivo, setPacienteActivo] = useState(null)
  const [tabActivo, setTabActivo] = useState('guardia')

  const nombreMedico = usuario?.nombre_completo || 'Dr. Médico de Guardia'
  const inicialesM   = `${usuario?.nombre?.[0] || 'M'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════════════
          HEADER CLÍNICO DE COMANDO — Estación de Guardia
      ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
        }}
      >
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar médico */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shadow-lg backdrop-blur-sm flex-shrink-0">
              {inicialesM}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  Guardia Médica Activa
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-black leading-tight">{nombreMedico}</h2>
              <p className="text-blue-200 text-xs font-medium mt-0.5">
                Médico de Guardia · MPPS N° {usuario?.cedula || '—'} · Emergencia Adultos
              </p>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate('/medico/historias')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold transition-all duration-150 active:scale-[0.97] cursor-pointer"
            >
              <IconHistoria />
              Nueva Historia
            </button>
            <button
              onClick={() => navigate('/medico/recetas')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all duration-150 active:scale-[0.97] shadow-lg cursor-pointer"
            >
              <IconRecipe />
              Emitir Récipe
            </button>
          </div>
        </div>

        {/* KPIs en fila */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Pacientes en Guardia', valor: '3',       dot: '#34d399' },
            { label: 'Triaje Nivel II activo', valor: '1',    dot: '#f97316' },
            { label: 'Sin médico asignado',   valor: '2',     dot: '#fbbf24' },
            { label: 'Récipes emitidos hoy',  valor: '7',     dot: '#818cf8' },
          ].map((k) => (
            <div key={k.label} className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: k.dot }} />
                <span className="text-[9px] text-white/60 uppercase tracking-wider truncate">{k.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums">{k.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ACCIONES RÁPIDAS DE GUARDIA
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <IconHistoria />,
            titulo: 'Historias Médicas',
            desc: 'F-001 · F-051 · Notas de evolución',
            badge: 'M2',
            color: '#2563EB',
            ruta: '/medico/historias',
          },
          {
            icon: <IconRecipe />,
            titulo: 'Récipes Digitales',
            desc: 'Prescripciones con QR y firma SHA-256',
            badge: 'M5',
            color: '#7C3AED',
            ruta: '/medico/recetas',
          },
          {
            icon: <IconNota />,
            titulo: 'Notas de Evolución',
            desc: 'Seguimiento clínico por paciente',
            badge: 'M2',
            color: '#0ea5e9',
            ruta: '/medico/notas',
          },
        ].map((acc) => (
          <button
            key={acc.titulo}
            onClick={() => navigate(acc.ruta)}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: acc.color }}
              >
                {acc.icon}
              </div>
              <span
                className="text-[9px] font-mono font-black px-2 py-0.5 rounded-lg border"
                style={{ color: acc.color, borderColor: `${acc.color}44`, background: `${acc.color}12` }}
              >
                {acc.badge}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{acc.titulo}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{acc.desc}</p>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          CONSOLA DE GUARDIA — Pacientes activos
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Cabecera de consola */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900">Pacientes en Guardia Activa</h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              {PACIENTES_GUARDIA.length} casos
            </span>
          </div>
          <div className="flex gap-2">
            {['guardia', 'mios'].map((t) => (
              <button
                key={t}
                onClick={() => setTabActivo(t)}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  tabActivo === t
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t === 'guardia' ? 'Todos' : 'Mis pacientes'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de pacientes */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Historia', 'Paciente', 'Triaje', 'Signos Vitales', 'Motivo', 'Espera', 'Médico', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PACIENTES_GUARDIA.map((p) => {
                const tc = TRIAJE_CONFIG[p.triaje] || TRIAJE_CONFIG['V']
                const pct = Math.round((parseInt(p.tiempoEspera) / parseInt(p.maxEspera)) * 100)
                const urgente = pct >= 80
                return (
                  <tr key={p.historia} className="hover:bg-slate-50/70 transition-colors">
                    {/* Historia */}
                    <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {p.historia}
                    </td>
                    {/* Paciente */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{p.nombre}</p>
                      <p className="text-slate-400">{p.edad} años · {p.cedula}</p>
                      <div className="flex gap-1 mt-0.5">
                        <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1 rounded">{p.sangre}</span>
                        {p.alergia && <span className="bg-red-100 text-red-700 text-[8px] font-bold px-1 rounded">Alergia {p.alergia}</span>}
                      </div>
                    </td>
                    {/* Triaje */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${tc.bg} ${tc.text} ${tc.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tc.dot }} />
                        {p.triaje} · {p.triajeLabel}
                      </span>
                    </td>
                    {/* Signos Vitales */}
                    <td className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 min-w-[140px]">
                        {[
                          { k: 'T.A.',  v: p.signos.ta },
                          { k: 'SpO₂', v: p.signos.spo2 },
                          { k: 'F.C.', v: p.signos.fc },
                          { k: 'Temp', v: p.signos.temp },
                        ].map((sv) => (
                          <div key={sv.k} className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-400 font-bold w-9 flex-shrink-0">{sv.k}</span>
                            <span className="text-[10px] font-black text-slate-800 tabular-nums">{sv.v}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    {/* Motivo */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-slate-600 leading-snug line-clamp-2">{p.motivo}</p>
                    </td>
                    {/* Espera SLA */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-black tabular-nums ${urgente ? 'text-red-600' : 'text-slate-700'}`}>
                          {p.tiempoEspera}
                        </span>
                        <span className="text-[9px] text-slate-400">/ {p.maxEspera}</span>
                      </div>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            background: urgente ? '#DC2626' : pct >= 50 ? '#D97706' : '#16A34A',
                          }}
                        />
                      </div>
                    </td>
                    {/* Médico */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold ${p.medicoAsignado === 'Sin asignar' ? 'text-amber-600' : 'text-slate-700'}`}>
                        {p.medicoAsignado}
                      </span>
                    </td>
                    {/* Acción */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setPacienteActivo(p)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                          pacienteActivo?.historia === p.historia
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200 hover:border-blue-300'
                        }`}
                      >
                        {pacienteActivo?.historia === p.historia ? 'Viendo Historial' : 'Ver Historial'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Flotante Superpuesto: Historial Clínico Unificado */}
      {pacienteActivo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPacienteActivo(null)
          }}
        >
          <div className="w-full max-w-5xl">
            <HistorialClinicoPanel
              paciente={pacienteActivo}
              onClose={() => setPacienteActivo(null)}
            />
          </div>
        </div>
      )}

    </div>
  )
}
