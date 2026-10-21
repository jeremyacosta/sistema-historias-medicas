// ============================================================
//  src/components/formatos/NotaEvolucionModal.jsx
//  NOTA OFICIAL DE EVOLUCIÓN Y MODIFICACIÓN CLÍNICA (FOLIADA)
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'

export default function NotaEvolucionModal({
  abierto,
  cerrar,
  paciente,
  documento = null,
  modo = 'nuevo', // 'nuevo' | 'ver'
  alGuardar,
}) {
  if (!abierto) return null

  const esInmutable = modo === 'ver' || documento?.inmutable

  const [datos, setDatos] = useState({
    fecha: new Date().toLocaleDateString('es-VE'),
    hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
    servicio: 'Emergencia Adultos',
    motivo_nota: 'Evolución clínica en guardia y actualización de conducta terapéutica',
    subjetivo: '',
    objetivo_signos: '',
    diagnostico_actualizado: '',
    conducta_plan: '',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · Especialista de Guardia',
  })

  useEffect(() => {
    if (documento && documento.datos) {
      setDatos({
        ...datos,
        ...documento.datos,
        fecha: documento.datos.fecha || documento.fecha?.split(' ')[0] || new Date().toLocaleDateString('es-VE'),
        hora: documento.datos.hora || documento.fecha?.split(' ')[1] || '08:00',
        medico: documento.datos.medico || documento.medico || 'Dr. Héctor Morales',
      })
    } else if (paciente) {
      setDatos({
        fecha: new Date().toLocaleDateString('es-VE'),
        hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
        servicio: paciente.servicio_actual || 'Emergencia Adultos',
        motivo_nota: 'Evolución médica de guardia y seguimiento de diagnóstico',
        subjetivo: 'Paciente refiere mejoría parcial de sintomatología inicial, sin nuevos picos febriles ni dificultad respiratoria.',
        objetivo_signos: 'T.A: 120/80 mmHg | Pulso: 78 lpm | Temp: 36.6 °C | Resp: 18 rpm | Glasgow: 15/15',
        diagnostico_actualizado: paciente.diagnostico_admision || '',
        conducta_plan: '1. Mantener esquema de hidratación parenteral y analgésicos VO.\n2. Solicitar hematología completa de control.\n3. Reevaluar en 6 horas.',
        medico: paciente.medico_tratante || 'Dr. Héctor Morales',
        mpps: 'MPPS 45.892 · Médico Tratante',
      })
    }
  }, [paciente, documento, abierto])

  const handleChange = (campo, valor) => {
    if (esInmutable) return
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (esInmutable) return

    if (!datos.diagnostico_actualizado || !datos.conducta_plan) {
      alert('Por favor complete el diagnóstico actualizado y la conducta o plan.')
      return
    }

    if (alGuardar) {
      alGuardar({
        tipo: 'EVOLUCION',
        codigo_formato: 'NOTA EVOLUCIÓN',
        nombre_formato: 'Nota Oficial de Evolución Médica',
        medico: datos.medico,
        diagnostico: datos.diagnostico_actualizado,
        resumen: `Evolución clínica: ${datos.diagnostico_actualizado} — ${datos.conducta_plan.split('\n')[0]}`,
        datos: { ...datos },
      })
    }
  }

  const imprimir = () => {
    window.print()
  }

  const inputClass = esInmutable
    ? 'w-full bg-transparent font-bold text-slate-900 border-b border-dotted border-slate-300 py-0.5 text-xs select-text cursor-default'
    : 'w-full bg-blue-50/20 hover:bg-blue-50/40 focus:bg-white border-b border-transparent focus:border-blue-600 focus:outline-none font-bold text-slate-900 px-1 py-0.5 text-xs'

  const textareaClass = esInmutable
    ? 'w-full bg-slate-50/40 border border-slate-200 rounded p-2 text-xs text-slate-900 resize-none select-text cursor-default'
    : 'w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded p-2 text-xs text-slate-900 focus:outline-none transition-colors resize-y'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-[#091528] text-white px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow">
              <img
                src="/IMSAFPL.jpg"
                alt="Logo Hospital Periférico de Petare"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
                  SEGUIMIENTO & EVOLUCIÓN
                </span>
                <span className="text-xs text-slate-400">· MPPS Distrito Sanitario N° 7</span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                Nota de Evolución Médica — Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!esInmutable && (
              <button
                type="submit"
                form="form-evolucion"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar Nota</span>
              </button>
            )}

            <button
              type="button"
              onClick={imprimir}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Imprimir Nota de Evolución"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={cerrar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Banner */}
        {esInmutable ? (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
              <strong className="uppercase">Documento Foliado e Inmutable:</strong> Esta nota médica está firmada y sellada en el expediente. No puede modificarse.
            </span>
            <span className="font-mono font-bold text-amber-800">
              {documento?.folio ? `FOLIO #${String(documento.folio).padStart(3, '0')}` : 'FOLIO OFICIAL'}
            </span>
          </div>
        ) : (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              Nueva Nota de Evolución — Registra la actualización clínica del paciente. Se sumará como un nuevo folio inmutable sin sobreescribir folios previos.
            </span>
            <span className="font-mono font-bold text-blue-800">
              HISTORIA: {paciente?.numero_historia || 'N/A'}
            </span>
          </div>
        )}

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          <form id="form-evolucion" onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white border-2 border-slate-900 shadow-md p-6 printable-sheet space-y-4 text-xs text-slate-900">
            
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
              <div>
                <p className="font-black text-xs text-slate-900 uppercase">Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</p>
                <p className="text-[10px] text-slate-500 font-bold">NOTA DE EVOLUCIÓN CLÍNICA · MPPS DS-7</p>
                <p className="font-bold text-slate-800 mt-1">
                  PACIENTE: {paciente?.nombre_completo || `${paciente?.nombre} ${paciente?.apellido}`} · C.I: {paciente?.cedula}
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-bold text-blue-900">HISTORIA: {paciente?.numero_historia}</p>
                <p className="text-slate-500">{datos.fecha} · {datos.hora}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">SERVICIO ACTUAL:</label>
                <input
                  type="text"
                  value={datos.servicio}
                  onChange={(e) => handleChange('servicio', e.target.value)}
                  className={inputClass}
                  readOnly={esInmutable}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">MÉDICO RESPONSABLE:</label>
                <input
                  type="text"
                  value={datos.medico}
                  onChange={(e) => handleChange('medico', e.target.value)}
                  className={inputClass}
                  readOnly={esInmutable}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                SUBJETIVO (ESTADO GENERAL REFERIDO POR EL PACIENTE O ENFERMERÍA):
              </label>
              <textarea
                value={datos.subjetivo}
                onChange={(e) => handleChange('subjetivo', e.target.value)}
                className={`${textareaClass} h-16`}
                readOnly={esInmutable}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                OBJETIVO & SIGNOS VITALES ACTUALES:
              </label>
              <input
                type="text"
                value={datos.objetivo_signos}
                onChange={(e) => handleChange('objetivo_signos', e.target.value)}
                className={inputClass}
                placeholder="T.A, Pulso, Temp, Resp, Glasgow..."
                readOnly={esInmutable}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                DIAGNÓSTICO CLÍNICO ACTUALIZADO (CIE-10):
              </label>
              <input
                type="text"
                value={datos.diagnostico_actualizado}
                onChange={(e) => handleChange('diagnostico_actualizado', e.target.value)}
                className={`${inputClass} font-bold text-blue-900`}
                readOnly={esInmutable}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                CONDUCTA MÉDICA, PLAN TERAPÉUTICO Y ÓRDENES:
              </label>
              <textarea
                value={datos.conducta_plan}
                onChange={(e) => handleChange('conducta_plan', e.target.value)}
                className={`${textareaClass} h-28`}
                readOnly={esInmutable}
                required
              />
            </div>

            <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs">{datos.medico}</p>
                <p className="text-[10px] text-slate-500 font-mono">{datos.mpps}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase px-2 py-1 bg-slate-100 border border-slate-300 rounded font-bold">
                  MPPS · EXPEDIENTE FOLIADO
                </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
