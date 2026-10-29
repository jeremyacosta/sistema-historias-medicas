// ============================================================
//  src/components/formatos/PerfilPacienteModal.jsx
//  PERFIL INTEGRAL DEL PACIENTE Y EXPEDIENTE DOCUMENTAL FOLIADO
//  Normativa MPPS: Historial Inmutable y Cadena de Custodia (Append-Only)
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'

// Íconos SVG Vectoriales (Cero Emojis)
const IconDocumentText = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconPlusCircle = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconLockClosed = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

const IconShieldCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export default function PerfilPacienteModal({
  abierto,
  cerrar,
  paciente,
  onVerDocumento,
  onAnexarDocumento,
  onConsultarHistoria,
}) {
  if (!abierto || !paciente) return null

  const documentos = paciente.documentos || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* ── BARRA SUPERIOR INSTITUCIONAL ── */}
        <header className="bg-[#091528] text-white px-6 py-5 flex items-center justify-between flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow">
              <img
                src="/IMSAFPL.jpg"
                alt="Logo Instituto Municipal de Salud Ana Francisca Pérez de León"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  EXPEDIENTE CLÍNICO FOLIADO
                </span>
                <span className="text-xs text-slate-400">· MPPS Distrito Sanitario N° 7</span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2 mt-0.5">
                <span>{paciente.nombre_completo || `${paciente.nombre} ${paciente.apellido}`}</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (C.I: {paciente.tipo_cedula || 'V'}-{paciente.cedula})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onConsultarHistoria && (
              <button
                onClick={() => onConsultarHistoria(paciente)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                title="Consultar Historial Clínico Unificado (Atenciones de Emergencia, Hospitalización y Récipes)"
              >
                <IconDocumentText />
                <span>Consultar Historia</span>
              </button>
            )}

            <button
              onClick={() => onAnexarDocumento(paciente)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <IconPlusCircle />
              <span>Anexar Nuevo Documento</span>
            </button>

            <button
              onClick={cerrar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── CUERPO PRINCIPAL DEL EXPEDIENTE ── */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6">
          
          {/* Ficha Resumen del Paciente */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {paciente.sexo === 'F' ? 'F' : 'M'}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Historia Clínica N°</p>
                  <p className="text-base font-black font-mono text-blue-900">{paciente.numero_historia}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {paciente.edad} años
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Grupo: {paciente.tipo_sangre || 'O+'}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {paciente.servicio_actual}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Triaje {paciente.triaje_actual}
                </span>
              </div>
            </div>

            {/* Alerta de Alergias */}
            {paciente.alergias_conocidas && paciente.alergias_conocidas !== 'Ninguna conocida' && paciente.alergias_conocidas !== 'Negadas' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-900 text-xs">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold">
                  !
                </div>
                <div>
                  <strong className="font-black uppercase tracking-wider text-[10px]">Alerta Clínica de Alergias: </strong>
                  <span>{paciente.alergias_conocidas}</span>
                </div>
              </div>
            )}

            {/* Datos de Contacto y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Dirección de Domicilio:</span>
                <p className="font-semibold text-slate-800">{paciente.direccion || 'Petare, Miranda'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Teléfono Principal:</span>
                <p className="font-mono font-semibold text-slate-800">{paciente.telefono_principal || 'No registrado'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Contacto de Emergencia:</span>
                <p className="font-semibold text-slate-800">
                  {paciente.nombre_contacto_emergencia || 'Familiar'} ({paciente.parentesco_contacto || 'Familiar'})
                  <span className="font-mono text-slate-500 block">{paciente.telefono_emergencia}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── SECCIÓN DE FOLIOS Y DOCUMENTOS INMUTABLES (APPEND-ONLY) ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <IconDocumentText />
                  <span>Carpeta de Documentos Foliados (Historial Inmutable)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cada documento emitido queda formalmente sellado. Las modificaciones o nuevas atenciones se suman como folios sucesivos sin alterar los registros anteriores.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                <IconShieldCheck />
                <span>{documentos.length} {documentos.length === 1 ? 'Folio registrado' : 'Folios registrados'}</span>
              </div>
            </div>

            {/* Listado Cronológico de Folios */}
            <div className="space-y-3">
              {documentos.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Folio Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-[#091528] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[9px] font-black uppercase text-blue-300 tracking-wider">FOLIO</span>
                      <span className="text-sm font-mono font-black">{String(doc.folio || idx + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">
                          {doc.nombre_formato || 'Documento Oficial MPPS'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {doc.codigo_formato || 'FORM. OFICIAL'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          <IconLockClosed />
                          <span>Inmutable</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {doc.resumen || 'Registro médico oficial foliado.'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span>Emisión: <strong className="text-slate-600">{doc.fecha}</strong></span>
                        <span>·</span>
                        <span>Responsable: <strong className="text-slate-600">{doc.medico}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => onVerDocumento(doc, paciente)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-bold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Ver Documento Original</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Caja de Explicación de Normativa MPPS */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <IconShieldCheck />
                <span>Normativa de Registro Clínico e Inmutabilidad de Historias Médicas</span>
              </p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                De conformidad con la Ley de Ejercicio de la Medicina y directrices del Ministerio del Poder Popular para la Salud (MPPS), una vez emitido un documento clínico no podrá ser borrado, sobreescrito ni sustituido. Toda corrección, actualización diagnóstica, cambio de tratamiento o nueva evolución médica debe ser foliada como un nuevo documento oficial anexo al expediente del paciente.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
