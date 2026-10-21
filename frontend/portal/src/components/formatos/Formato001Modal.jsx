// ============================================================
//  src/components/formatos/Formato001Modal.jsx
//  RÉPLICA DIGITAL EXACTA: Formato Oficial MPPS 001 (Récipe Médico)
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  Basado en: 001_FORMATO RECIPE MEDICO.xlsx
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'

export default function Formato001Modal({
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
    nombre_paciente: '',
    cedula: '',
    prescripcion_rp: '',
    indicaciones: '',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · Col. Médico 18.234',
  })

  useEffect(() => {
    if (documento && documento.datos) {
      setDatos({
        fecha: documento.datos.fecha || documento.fecha?.split(' ')[0] || new Date().toLocaleDateString('es-VE'),
        nombre_paciente: documento.datos.nombre_paciente || paciente?.nombre_completo || '',
        cedula: documento.datos.cedula || paciente?.cedula || '',
        prescripcion_rp: documento.datos.prescripcion_rp || '',
        indicaciones: documento.datos.indicaciones || '',
        medico: documento.datos.medico || documento.medico || 'Dr. Héctor Morales',
        mpps: documento.datos.mpps || 'MPPS 45.892 · Col. Médico 18.234',
      })
    } else if (paciente) {
      setDatos({
        fecha: new Date().toLocaleDateString('es-VE'),
        nombre_paciente: paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim(),
        cedula: paciente.cedula ? `${paciente.tipo_cedula || 'V'}-${paciente.cedula}` : '',
        prescripcion_rp: '1. ',
        indicaciones: '1. ',
        medico: paciente.medico_tratante || 'Dr. Héctor Morales',
        mpps: 'MPPS 45.892 · Col. Médico 18.234',
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

    if (!datos.prescripcion_rp || !datos.indicaciones) {
      alert('Por favor complete tanto la sección de Rp. como las Indicaciones.')
      return
    }

    if (alGuardar) {
      alGuardar({
        tipo: 'F001',
        codigo_formato: 'FORM. 001',
        nombre_formato: 'Récipe Médico Oficial (Rp. & Indicaciones)',
        medico: datos.medico,
        resumen: datos.prescripcion_rp.split('\n')[0] || 'Prescripción de medicamentos oficiales.',
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
    ? 'w-full bg-slate-50/40 border border-slate-200 rounded p-3 font-mono text-xs text-slate-900 resize-none select-text cursor-default h-64'
    : 'w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded p-3 font-mono text-xs text-slate-900 focus:outline-none transition-colors resize-none h-64'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* Barra Superior */}
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
                  FORM. 001 OFICIAL MPPS
                </span>
                <span className="text-xs text-slate-400">· Distrito Sanitario N° 7</span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                Récipe Médico Oficial (Rp. & Indicaciones)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!esInmutable && (
              <button
                type="submit"
                form="form-001"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar Récipe</span>
              </button>
            )}

            <button
              type="button"
              onClick={imprimir}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Imprimir Récipe Oficial"
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

        {/* Banner de Estado */}
        {esInmutable ? (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
              <strong className="uppercase">Documento Foliado e Inmutable:</strong> Este récipe forma parte del expediente cerrado del paciente. No puede ser alterado.
            </span>
            <span className="font-mono font-bold text-amber-800">
              {documento?.folio ? `FOLIO #${String(documento.folio).padStart(3, '0')}` : 'RÉCIPE EMITIDO'}
            </span>
          </div>
        ) : (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              Nuevo Récipe Médico — Completa la prescripción (Rp.) y las indicaciones para el paciente. Al guardar, se sumará como un nuevo folio inmutable en su perfil.
            </span>
            <span className="font-mono font-bold text-blue-800">
              EXPEDIENTE: {paciente?.numero_historia || 'N/A'}
            </span>
          </div>
        )}

        {/* Cuerpo del Formato 001 (Doble Columna Rp. e Indicaciones) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          <form id="form-001" onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white border-2 border-slate-900 shadow-lg p-6 printable-sheet text-slate-900">
            
            {/* Header del Récipe */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-slate-300 p-0.5 bg-white flex items-center justify-center flex-shrink-0">
                  <img src="/IMSAFPL.jpg" alt="Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-600">REPÚBLICA BOLIVARIANA DE VENEZUELA · MPPS</p>
                  <p className="font-black text-xs text-slate-900">Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</p>
                  <p className="text-[10px] text-slate-500 font-semibold">DISTRITO SANITARIO N° 7 · PERIFÉRICO DE PETARE</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-xs bg-slate-100 px-2 py-1 border border-slate-300 rounded">
                  Form. 001
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">FECHA: {datos.fecha}</p>
              </div>
            </div>

            {/* Doble Columna Oficial según 001_FORMATO RECIPE MEDICO.xlsx */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-800 border-2 border-slate-800">
              
              {/* Columna Izquierda: Rp. (Prescripción Médica) */}
              <div className="p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between border-b-2 border-slate-800 pb-1 mb-3">
                    <span className="font-serif italic text-2xl font-black tracking-tight text-blue-950">Rp.</span>
                    <span className="text-[10px] font-mono text-slate-500">FECHA: {datos.fecha}</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Nombre y Apellido:</span>
                      <input
                        type="text"
                        value={datos.nombre_paciente}
                        onChange={(e) => handleChange('nombre_paciente', e.target.value)}
                        className={inputClass}
                        placeholder="Nombre completo del paciente"
                        readOnly={esInmutable}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">C.I.:</span>
                      <input
                        type="text"
                        value={datos.cedula}
                        onChange={(e) => handleChange('cedula', e.target.value)}
                        className={inputClass}
                        placeholder="V-XXXXXXXX"
                        readOnly={esInmutable}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                      Prescripción Farmacológica (Fármaco, Concentración y Cantidad):
                    </label>
                    <textarea
                      value={datos.prescripcion_rp}
                      onChange={(e) => handleChange('prescripcion_rp', e.target.value)}
                      placeholder="1. Medicamento dosis forma farmacéutica&#10;2. ..."
                      className={textareaClass}
                      readOnly={esInmutable}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-slate-400 pt-3 text-center">
                  <p className="font-serif italic font-bold text-xs text-slate-800">{datos.medico}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{datos.mpps}</p>
                  <span className="inline-block mt-2 text-[9px] font-mono text-slate-400 border border-slate-300 px-2 py-0.5 rounded">
                    Form. 001 - Récipe
                  </span>
                </div>
              </div>

              {/* Columna Derecha: Indicaciones para el Paciente */}
              <div className="p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between border-b-2 border-slate-800 pb-1 mb-3">
                    <span className="font-serif font-black text-xl tracking-tight text-slate-900">Indicaciones.</span>
                    <span className="text-[10px] font-mono text-slate-500">FECHA: {datos.fecha}</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Nombre y Apellido:</span>
                      <input
                        type="text"
                        value={datos.nombre_paciente}
                        onChange={(e) => handleChange('nombre_paciente', e.target.value)}
                        className={inputClass}
                        placeholder="Nombre completo del paciente"
                        readOnly={esInmutable}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">C.I.:</span>
                      <input
                        type="text"
                        value={datos.cedula}
                        onChange={(e) => handleChange('cedula', e.target.value)}
                        className={inputClass}
                        placeholder="V-XXXXXXXX"
                        readOnly={esInmutable}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-700 block mb-1">
                      Instrucciones Posológicas, Horarios y Cuidados:
                    </label>
                    <textarea
                      value={datos.indicaciones}
                      onChange={(e) => handleChange('indicaciones', e.target.value)}
                      placeholder="1. Tomar cada X horas durante Y días...&#10;2. ..."
                      className={textareaClass}
                      readOnly={esInmutable}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-slate-400 pt-3 text-center">
                  <p className="font-serif italic font-bold text-xs text-slate-800">{datos.medico}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{datos.mpps}</p>
                  <span className="inline-block mt-2 text-[9px] font-mono text-slate-400 border border-slate-300 px-2 py-0.5 rounded">
                    Form. 001 - Indicaciones
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <span>Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</span>
              <span className="font-mono font-bold">VÁLIDO CON SELLO OFICIAL</span>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
