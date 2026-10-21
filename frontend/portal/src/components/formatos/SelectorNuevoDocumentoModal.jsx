// ============================================================
//  src/components/formatos/SelectorNuevoDocumentoModal.jsx
//  SELECTOR OFICIAL DE FORMATOS MPPS PARA ANEXAR DOCUMENTOS
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

export default function SelectorNuevoDocumentoModal({
  abierto,
  cerrar,
  paciente,
  onSeleccionarTipo,
}) {
  if (!abierto || !paciente) return null

  const opciones = [
    {
      tipo: 'F051',
      codigo: 'FORM. 051',
      titulo: 'Historia de Emergencia / Trauma Shock',
      descripcion: 'Evaluación y estabilización en guardia o sala de shock, signos vitales, severidad del caso, antecedentes de trauma y evolución médica.',
      etiqueta: 'Emergencias & Trauma Shock',
      colorBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      tipo: 'F001',
      codigo: 'FORM. 001',
      titulo: 'Récipe Médico Oficial (Rp. & Indicaciones)',
      descripcion: 'Prescripción de medicamentos con formato reglamentario oficial MPPS en dos columnas: Rp. para farmacia e Indicaciones para el paciente.',
      etiqueta: 'Farmacología & Indicaciones',
      colorBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      tipo: 'EVOLUCION',
      codigo: 'EVOLUCIÓN',
      titulo: 'Nota de Evolución / Modificación Clínica',
      descripcion: 'Actualización formal del estado del paciente, cambios en diagnóstico CIE-10, evolución médica en sala y ajustes de tratamiento.',
      etiqueta: 'Seguimiento Clínico',
      colorBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#091528] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                MPPS DS-7 · ADICIÓN DE FOLIOS
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-1">
              Anexar Nuevo Documento al Expediente
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paciente: <strong className="text-white">{paciente.nombre_completo || `${paciente.nombre} ${paciente.apellido}`}</strong> · C.I: {paciente.cedula}
            </p>
          </div>

          <button
            onClick={cerrar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-6 space-y-3 bg-[#f8fafc]">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Selecciona el tipo de documento oficial que deseas emitir y sumar al perfil:
          </p>

          {opciones.map((opc) => (
            <button
              key={opc.tipo}
              onClick={() => onSeleccionarTipo(opc.tipo)}
              className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all group flex items-start justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${opc.colorBadge}`}>
                    {opc.codigo}
                  </span>
                  <span className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {opc.titulo}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pr-4">
                  {opc.descripcion}
                </p>
              </div>

              <div className="mt-1 w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-500 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}

          <div className="pt-2 text-[11px] text-slate-500 text-center">
            * El nuevo documento quedará foliado cronológicamente con firma médica inalterable.
          </div>
        </div>

      </div>
    </div>
  )
}
