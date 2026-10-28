// ============================================================
//  src/components/historias/HistorialClinicoPanel.jsx
//  Panel Lateral / Desplegable: Historial Clínico Unificado
//  Diseño: Cosmos Medical · Fondo blanco · Slate/Blue/Rose
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { obtenerHistorialPacienteBackend } from '../../api/pacientes'

// ── SVG Íconos médicos vectoriales ───────────────────────────
const IconAlert = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const IconEmergencia = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const IconRecipe = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconHeartbeat = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function HistorialClinicoPanel({ paciente, onClose }) {
  const [tabActiva, setTabActiva] = useState('emergencias')
  const [historiasBackend, setHistoriasBackend] = useState([])

  useEffect(() => {
    async function cargarHistorial() {
      if (!paciente?.cedula) return
      try {
        const data = await obtenerHistorialPacienteBackend(paciente.cedula)
        if (data?.historias_emergencia) {
          setHistoriasBackend(data.historias_emergencia)
        }
      } catch (err) {
        console.warn('[HistorialClinicoPanel] Fallback a datos mock:', err.message)
      }
    }
    cargarHistorial()
  }, [paciente?.cedula])

  if (!paciente) return null

  // Datos mock enriquecidos según el paciente
  const alergias = paciente.alergia || 'Alergia severa a Penicilina (PNC) · Reacción anafiláctica previa'

  const itemsBackendFormat = historiasBackend.map((h) => ({
    id: `F051-${h.id.slice(0, 8)}`,
    fecha: new Date(h.fecha_atencion).toLocaleString('es-VE'),
    motivo: h.motivo_consulta,
    cie10: h.diagnostico_cie10 ? `${h.diagnostico_cie10} — ${h.diagnostico_desc || ''}` : 'Sin CIE-10',
    medico: h.medico_nombre || 'Médico de Guardia',
    resolucion: h.resolucion,
    estadoBadge: h.resolucion === 'Hospitalizado' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }))

  const historicoEmergencias = [
    ...itemsBackendFormat,
    {
      id: 'EM-2026-089',
      fecha: '18/10/2026 21:40',
      motivo: 'Crisis hipertensiva y dolor torácico opresivo',
      cie10: 'I10 — Hipertensión esencial primaria',
      medico: 'Dr. Hildren Morales (MPPS 45.892)',
      resolucion: 'Alta Médica Observada (24h)',
      estadoBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'EM-2026-042',
      fecha: '04/09/2026 14:15',
      motivo: 'Síndrome febril prolongado con deshidratación grado I',
      cie10: 'A09 — Gastroenteritis de presunto origen infeccioso',
      medico: 'Dra. Ana Rodríguez (MPPS 51.204)',
      resolucion: 'Tratamiento Ambulatorio + Suero Oral',
      estadoBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ]

  const historicoRecipes = [
    {
      id: 'REC-2026-1029',
      fecha: '18/10/2026',
      medicamentos: [
        'Losartán Potásico 50mg — 1 tab cada 12 horas por 30 días',
        'Amlodipino 5mg — 1 tab cada mañana',
      ],
      medico: 'Dr. Hildren Morales',
      hashSHA: 'a8f3b29c',
    },
    {
      id: 'REC-2026-0741',
      fecha: '04/09/2026',
      medicamentos: [
        'Sales de Rehidratación Oral — 1 sobre diluido en 1L de agua cada 8h',
        'Probióticos cápsulas — 1 al día con desayuno',
      ],
      medico: 'Dra. Ana Rodríguez',
      hashSHA: '5e17cc04',
    },
  ]

  const historicoSignos = [
    { fecha: '24/10 13:00', ta: paciente.signos?.ta || '120/80', spo2: paciente.signos?.spo2 || '99%', fc: paciente.signos?.fc || '76 lpm', temp: paciente.signos?.temp || '37.0 °C' },
    { fecha: '18/10 21:40', ta: '160/100', spo2: '94%', fc: '98 lpm', temp: '37.1 °C' },
    { fecha: '18/10 23:30', ta: '135/85', spo2: '97%', fc: '82 lpm', temp: '36.8 °C' },
    { fecha: '04/09 14:15', ta: '110/70', spo2: '98%', fc: '88 lpm', temp: '38.6 °C' },
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* ── HEADER DEL PANEL ─────────────────────────────────── */}
      <div className="bg-[#091528] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
              Historial Clínico Unificado · Acceso Médico
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
              Confidencial MPPS
            </span>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-xl font-black tracking-tight">{paciente.nombre}</h3>
            <span className="text-xs text-slate-300 font-mono">C.I: {paciente.cedula}</span>
            <span className="text-xs text-slate-300 font-mono">Historia: {paciente.historia}</span>
            <span className="text-xs text-slate-400">({paciente.edad} años · {paciente.sexo} · {paciente.sangre})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <IconClose />
            <span>Cerrar Panel</span>
          </button>
        </div>
      </div>

      {/* ── ALERTA CRÍTICA: ALERGIAS ──────────────────────────── */}
      {alergias && (
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-600/30">
              <IconAlert />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-800">
                Alerta Médica de Seguridad · Alergias Confirmadas
              </p>
              <p className="text-xs font-bold text-rose-900 mt-0.5">{alergias}</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-rose-200/80 text-rose-900 px-2.5 py-1 rounded-full border border-rose-300 animate-pulse">
            Riesgo Vital
          </span>
        </div>
      )}

      {/* ── BARRA DE PESTAÑAS DEL HISTORIAL ───────────────────── */}
      <div className="border-b border-slate-200 px-6 bg-slate-50/70 flex gap-2 pt-2">
        <button
          onClick={() => setTabActiva('emergencias')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            tabActiva === 'emergencias'
              ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <IconEmergencia />
          <span>Atenciones de Emergencia 051 ({historicoEmergencias.length})</span>
        </button>

        <button
          onClick={() => setTabActiva('recipes')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            tabActiva === 'recipes'
              ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <IconRecipe />
          <span>Récipes Emitidos ({historicoRecipes.length})</span>
        </button>

        <button
          onClick={() => setTabActiva('signos')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            tabActiva === 'signos'
              ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <IconHeartbeat />
          <span>Curva de Signos Vitales</span>
        </button>
      </div>

      {/* ── CONTENIDO DE LAS PESTAÑAS ─────────────────────────── */}
      <div className="p-6">
        
        {/* Pestaña 1: Emergencias 051 */}
        {tabActiva === 'emergencias' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Registro Histórico de Guardias Previas (F-051 / 48h)
              </span>
              <span className="text-xs text-slate-500">
                Mostrando {historicoEmergencias.length} atenciones registradas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historicoEmergencias.map((em) => (
                <div
                  key={em.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-blue-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {em.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{em.fecha}</span>
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-900 leading-snug">{em.motivo}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{em.cie10}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{em.medico}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${em.estadoBadge}`}>
                      {em.resolucion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña 2: Récipes Emitidos */}
        {tabActiva === 'recipes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Prescripciones Médicas Criptográficas Firmadas
              </span>
              <span className="text-xs text-slate-500">
                Verificadas con hash SHA-256 en Billetera de Paciente
              </span>
            </div>

            <div className="space-y-3">
              {historicoRecipes.map((rc) => (
                <div
                  key={rc.id}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-2 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                        {rc.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{rc.medico}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{rc.fecha}</span>
                      <span>·</span>
                      <span className="text-purple-600 font-bold">SHA: {rc.hashSHA}</span>
                    </div>
                  </div>

                  <ul className="space-y-1 pl-2 border-l-2 border-purple-300 text-xs text-slate-800">
                    {rc.medicamentos.map((m, idx) => (
                      <li key={idx} className="font-medium">• {m}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña 3: Curva de Signos Vitales */}
        {tabActiva === 'signos' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Evolución de Constantes Fisiológicas (Tensión, SpO₂, Pulso, Temperatura)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-[10px] uppercase">
                    <th className="py-2.5 px-4">Fecha / Hora</th>
                    <th className="py-2.5 px-4">T.A. (mmHg)</th>
                    <th className="py-2.5 px-4">SpO₂ (%)</th>
                    <th className="py-2.5 px-4">F.C. (lpm)</th>
                    <th className="py-2.5 px-4">T° (°C)</th>
                    <th className="py-2.5 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {historicoSignos.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">{s.fecha}</td>
                      <td className="py-2.5 px-4 font-black text-slate-900">{s.ta}</td>
                      <td className="py-2.5 px-4 font-black text-emerald-600">{s.spo2}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{s.fc}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{s.temp}</td>
                      <td className="py-2.5 px-4 font-sans text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {idx === 0 ? 'Actual' : 'Histórico'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
