// ============================================================
//  src/components/formatos/Formato051Modal.jsx
//  RÉPLICA DIGITAL COMPLETA Y EXACTA: Formato Oficial MPPS 051
//  HISTORIA DE EMERGENCIA & SALA DE SHOCK
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  Basado en: 051_FORMATO HISTORIA DE EMERGENCIA.xlsx (R1-R108)
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'

export default function Formato051Modal({
  abierto,
  cerrar,
  paciente,
  documento = null,
  modo = 'nuevo', // 'nuevo' | 'ver'
  alGuardar,
}) {
  if (!abierto) return null

  const esInmutable = modo === 'ver' || Boolean(documento?.inmutable)

  // Estado completo con TODOS los campos de la planilla oficial Excel (R1-R108)
  const [datos, setDatos] = useState({
    // Cabecera (R2, R4)
    historia_numero: '',

    // Sección I: Identificación del Paciente (R6-R14)
    nombre_paciente: '',
    direccion_paciente: '',
    fecha: new Date().toLocaleDateString('es-VE'),
    hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
    edad: '',
    genero: 'M', // M | F
    fecha_nacimiento: '',
    lugar_nacimiento: 'Caracas, Dtto. Capital',
    cedula_pasaporte: '',
    direccion_complementaria: '',

    // Sección II: Familiar o Acompañante (R15-R17)
    familiar_acompanante: '',
    parentesco: 'Familiar',
    cedula_familiar: '',
    telefono_familiar: '',

    // Sección III: Procedencia (R18-R21)
    procedencia: 'SU CASA', // 'SU CASA' | 'HOSPITAL O CLINICA' | 'SITIO DEL ACCIDENTE' | 'OTROS'
    procedencia_otros_texto: '',

    // Sección IV: Responsable Asistencia Médica & Constantes Vitales (R22-R28)
    responsable_asistencia_medica: 'Dr. Héctor Morales (MPPS 45.892)',
    estado_conciencia: 'CONCIENTE', // 'CONCIENTE' | 'INCONSCIENTE'
    temperatura: '37.0 °C',
    respiracion: '18 rpm',
    pulso: '80 lpm',
    presion_arterial: '120/80 mmHg',
    ingestion_alcohol: 'NO', // 'SI' | 'NO'

    // Sección V: Medidas de Primeros Auxilios previas al ingreso (R29-R34)
    primeros_auxilios_ninguna: true,
    primeros_auxilios_masaje_cardiaco: false,
    primeros_auxilios_inmovilizacion: false,
    primeros_auxilios_respiracion_art: false,
    primeros_auxilios_control_hemorragia: false,
    primeros_auxilios_otros: false,
    primeros_auxilios_otros_texto: '',

    // Sección VI: Condición Crítica de Ingreso (R36)
    ingreso_muerto: false,
    muere_de_emergencia: false,

    // Sección VII: Motivo de la Consulta & Severidad (R39)
    motivo_consulta: '',
    severidad_caso: 'MODERADO', // 'MODERADO' | 'SEVERO' | 'CRITICO'

    // Cuadrícula Oficial de los 28 Síntomas de Emergencia (R40-R46)
    sintoma_fiebre: false,
    sintoma_tos: false,
    sintoma_ronquera: false,
    sintoma_dificultad_respirar: false,
    sintoma_dolor: false,
    sintoma_palpitaciones: false,
    sintoma_opresion: false,

    sintoma_hipo: false,
    sintoma_nauseas: false,
    sintoma_vomito: false,
    sintoma_acidez: false,
    sintoma_diarrea: false,
    sintoma_estrenimiento: false,
    sintoma_confusion: false,

    sintoma_agitacion: false,
    sintoma_depresion: false,
    sintoma_desmayo: false,
    sintoma_temblor: false,
    sintoma_convulsion: false,
    sintoma_paralisis: false,
    sintoma_ardor: false,

    sintoma_picazon: false,
    sintoma_hinchazon: false,
    sintoma_intoxicacion: false,
    sintoma_accidente: false,
    sintoma_hemorragia: false,
    sintoma_mareo: false,
    sintoma_otros: false,
    sintoma_otros_texto: '',

    // Sección VIII: Detalle de Accidente y Lesión (R48-R53)
    es_accidente: false,
    accidente_tipo: '',
    accidente_lesion: '',
    accidente_localizacion: '',

    // Sección IX: Antecedentes (R58)
    antecedentes_diabetes: 'No',
    antecedentes_alergia: 'Negadas',
    antecedentes_otros: 'Ninguno relevante',

    // Sección X: Enfermedad Actual (R59-R72)
    enfermedad_actual: '',

    // Sección XI: Examen Físico (R73-R75)
    examen_fisico: '',

    // Sección XII: Diagnóstico de Ingreso (R76-R78)
    diagnostico_ingreso: '',

    // Sección XIII: Tratamiento (R79-R82)
    tratamiento_medico: true,
    tratamiento_quirurgico: false,
    tratamiento_cirugia_menor: false,
    tratamiento_descripcion: '',

    // Sección XIV: Evolución (R83-R94)
    evolucion: '',

    // Sección XV: Diagnóstico Final (R95-R98)
    diagnostico_final: '',

    // Sección XVI: Egreso y Firmas Oficiales (R99-R108)
    nombre_enfermera: 'Lic. María González (Enfermería)',
    firma_enfermera: 'Lic. M. González',
    egreso_hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
    egreso_horario: 'PM', // AM | PM
    egreso_contra_opinion_medica: false,

    nombre_medico_tratante: 'Dr. Héctor Morales',
    firma_medico_tratante: 'Dr. Héctor Morales',
    registro_sas_medico: 'MPPS 45.892 · CM 18.234',

    nombre_medico_jefe_guardia: 'Dr. Hildren Morales',
    firma_medico_jefe_guardia: 'Dr. Hildren Morales',
    registro_sas_jefe_guardia: 'MPPS 38.109 · CM 15.901',
  })

  useEffect(() => {
    if (documento && documento.datos) {
      setDatos({
        ...datos,
        ...documento.datos,
        historia_numero: documento.datos.historia_numero || paciente?.numero_historia || '',
        nombre_paciente: documento.datos.nombre_paciente || paciente?.nombre_completo || '',
        cedula_pasaporte: documento.datos.cedula_pasaporte || documento.datos.cedula || (paciente ? `${paciente.tipo_cedula || 'V'}-${paciente.cedula}` : ''),
        fecha: documento.datos.fecha || documento.fecha?.split(' ')[0] || new Date().toLocaleDateString('es-VE'),
        hora: documento.datos.hora || documento.fecha?.split(' ')[1] || '08:00',
      })
    } else if (paciente) {
      setDatos((prev) => ({
        ...prev,
        historia_numero: paciente.numero_historia || '',
        nombre_paciente: paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim(),
        direccion_paciente: paciente.direccion || '',
        edad: paciente.edad || '',
        genero: paciente.sexo || 'M',
        fecha_nacimiento: paciente.fecha_nacimiento || '',
        lugar_nacimiento: paciente.lugar_nacimiento || 'Caracas, Dtto. Capital',
        cedula_pasaporte: paciente.cedula ? `${paciente.tipo_cedula || 'V'}-${paciente.cedula}` : '',
        familiar_acompanante: paciente.nombre_contacto_emergencia || '',
        parentesco: paciente.parentesco_contacto || 'Familiar',
        telefono_familiar: paciente.telefono_emergencia || paciente.telefono_principal || '',
        motivo_consulta: paciente.motivo_admision || '',
        enfermedad_actual: paciente.enfermedad_actual || paciente.motivo_admision || '',
        diagnostico_ingreso: paciente.diagnostico_admision || '',
        diagnostico_final: paciente.diagnostico_admision || '',
        antecedentes_alergia: paciente.alergias_conocidas || 'Negadas',
        nombre_medico_tratante: paciente.medico_tratante || 'Dr. Héctor Morales',
      }))
    }
  }, [paciente, documento, abierto])

  const handleChange = (campo, valor) => {
    if (esInmutable) return
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleToggle = (campo) => {
    if (esInmutable) return
    setDatos((prev) => ({ ...prev, [campo]: !prev[campo] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (esInmutable) return

    if (!datos.motivo_consulta || !datos.diagnostico_ingreso) {
      alert('Por favor complete el Motivo de Consulta y el Diagnóstico de Ingreso.')
      return
    }

    if (alGuardar) {
      // Síntomas marcados para resumen clínico
      const sintomasMarcados = [
        datos.sintoma_fiebre && 'Fiebre',
        datos.sintoma_tos && 'Tos',
        datos.sintoma_dolor && 'Dolor',
        datos.sintoma_dificultad_respirar && 'Dificultad respiratoria',
        datos.sintoma_opresion && 'Opresión',
        datos.sintoma_vomito && 'Vómito',
        datos.sintoma_convulsion && 'Convulsión',
        datos.sintoma_accidente && 'Accidente',
        datos.sintoma_hemorragia && 'Hemorragia',
      ].filter(Boolean).join(', ')

      alGuardar({
        tipo: 'F051',
        codigo_formato: 'FORM. 051',
        nombre_formato: 'Historia de Emergencia / Trauma Shock',
        medico: datos.nombre_medico_tratante,
        diagnostico: datos.diagnostico_ingreso,
        resumen: `Emergencia [Severidad: ${datos.severidad_caso}] · T.A: ${datos.presion_arterial}, Pulso: ${datos.pulso}. Diagnóstico: ${datos.diagnostico_ingreso}. ${sintomasMarcados ? `Síntomas: ${sintomasMarcados}` : ''}`,
        datos: { ...datos },
      })
    }
  }

  const imprimir = () => {
    window.print()
  }

  // Clases CSS de celdas
  const inputCellClass = esInmutable
    ? 'w-full bg-transparent border-b border-dotted border-slate-300 font-bold text-slate-900 px-1 py-0.5 text-xs select-text cursor-default'
    : 'w-full bg-blue-50/20 hover:bg-blue-50/40 focus:bg-white border-b border-transparent focus:border-blue-600 focus:outline-none font-bold text-slate-900 transition-colors px-1 py-0.5 text-xs placeholder-slate-400'

  const textareaClass = esInmutable
    ? 'w-full bg-slate-50/40 border border-slate-200 rounded p-2 text-xs text-slate-900 resize-none select-text cursor-default font-medium'
    : 'w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded p-2 text-xs text-slate-900 focus:outline-none transition-colors resize-y'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* ── BARRA SUPERIOR DE HERRAMIENTAS ── */}
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
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/30">
                  {esInmutable ? 'FORM. 051 · EXPEDIENTE FOLIADO' : 'FORM. 051 OFICIAL COMPLETO'}
                </span>
                <span className="text-xs text-slate-400">· Trauma Shock & Emergencia</span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                Historia de Emergencia — Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!esInmutable && (
              <button
                type="submit"
                form="form-051-completo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar F-051</span>
              </button>
            )}

            <button
              type="button"
              onClick={imprimir}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Imprimir Planilla Oficial 051"
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

        {/* ── BANNER DE ESTADO: INMUTABLE VS EDICIÓN ── */}
        {esInmutable ? (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
              <strong className="uppercase bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-black">
                {documento?.folio ? `Folio #${String(documento.folio).padStart(3, '0')}` : 'Folio Registrado'} · Documento Cerrado e Inmutable:
              </strong>
              <span>Historia de emergencia sellada conforme a la Ley de Ejercicio de la Medicina. No admite modificaciones.</span>
            </span>
            <span className="font-mono font-bold text-amber-900">EXPEDIENTE CERRADO</span>
          </div>
        ) : (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center justify-between text-xs text-rose-900">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              Apertura de Historia de Emergencia (F-051) — Estructura oficial MPPS completa. Al guardar se sumará como un nuevo folio inmutable.
            </span>
            <span className="font-mono font-bold text-rose-800">
              HISTORIA: {datos.historia_numero || paciente?.numero_historia || 'N/A'}
            </span>
          </div>
        )}

        {/* ── CUERPO CON LA ESTRUCTURA EXACTA DEL DOCUMENTO 051 (R1-R108) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          <form id="form-051-completo" onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white border-2 border-slate-900 shadow-md p-6 sm:p-8 text-slate-900 font-sans text-xs space-y-4 printable-sheet">
            <fieldset disabled={esInmutable} className={esInmutable ? "inmutable-sheet contents" : "contents"}>
            
            {/* 1. Encabezado Oficial (R1-R5) */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 border border-slate-300 p-0.5 bg-white flex items-center justify-center flex-shrink-0">
                  <img src="/IMSAFPL.jpg" alt="Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <p className="font-black text-[10px] tracking-tight text-slate-600">REPÚBLICA BOLIVARIANA DE VENEZUELA</p>
                  <p className="font-black text-xs text-slate-900">MINISTERIO DEL PODER POPULAR PARA LA SALUD</p>
                  <p className="font-bold text-[11px] text-slate-800">Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</p>
                  <p className="font-black text-xs text-blue-900 tracking-wider mt-0.5">HISTORIA DE EMERGENCIA (FORM. 051)</p>
                </div>
              </div>

              <div className="border-2 border-slate-900 p-2 text-right bg-slate-50 min-w-[200px]">
                <span className="font-mono text-[10px] text-slate-600 block">HISTORIA N°.:</span>
                <input
                  type="text"
                  value={datos.historia_numero}
                  onChange={(e) => handleChange('historia_numero', e.target.value)}
                  className="font-mono font-black text-sm text-blue-900 text-right bg-transparent w-full focus:outline-none"
                  placeholder="HBG-2024-XXXXX"
                  required
                />
              </div>
            </div>

            {/* 2. Sección I: Identificación del Paciente (R6-R14) */}
            <div className="border-2 border-slate-900 divide-y-2 divide-slate-800">
              
              {/* R6: Nombre del Paciente */}
              <div className="p-2 flex items-center gap-2">
                <span className="font-black text-[10px] uppercase text-slate-700 whitespace-nowrap">NOMBRE DEL PACIENTE:</span>
                <input
                  type="text"
                  value={datos.nombre_paciente}
                  onChange={(e) => handleChange('nombre_paciente', e.target.value)}
                  className={inputCellClass}
                  placeholder="Apellidos y nombres completos"
                  required
                />
              </div>

              {/* R7: Dirección del Paciente */}
              <div className="p-2 flex items-center gap-2">
                <span className="font-black text-[10px] uppercase text-slate-700 whitespace-nowrap">DIRECCION DEL PACIENTE:</span>
                <input
                  type="text"
                  value={datos.direccion_paciente}
                  onChange={(e) => handleChange('direccion_paciente', e.target.value)}
                  className={inputCellClass}
                  placeholder="Dirección exacta de residencia habitual"
                  required
                />
              </div>

              {/* R10-R11: Cuadrícula Fecha, Hora, Edad, Género, F. Nacimiento, Lugar Nacimiento, Cédula */}
              <div className="grid grid-cols-12 divide-x-2 divide-slate-800 text-[11px]">
                <div className="col-span-2 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">FECHA</span>
                  <input
                    type="text"
                    value={datos.fecha}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                    className={inputCellClass}
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                <div className="col-span-1 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">HORA</span>
                  <input
                    type="text"
                    value={datos.hora}
                    onChange={(e) => handleChange('hora', e.target.value)}
                    className={inputCellClass}
                    placeholder="HH:MM"
                  />
                </div>
                <div className="col-span-1 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">EDAD</span>
                  <input
                    type="text"
                    value={datos.edad}
                    onChange={(e) => handleChange('edad', e.target.value)}
                    className={inputCellClass}
                    placeholder="Años"
                  />
                </div>
                <div className="col-span-1 p-1.5 text-center">
                  <span className="block font-black text-[9px] uppercase text-slate-600">GÉNERO</span>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5 font-bold">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="genero"
                        value="M"
                        checked={datos.genero === 'M'}
                        onChange={() => handleChange('genero', 'M')}
                        disabled={esInmutable}
                      /> M
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="genero"
                        value="F"
                        checked={datos.genero === 'F'}
                        onChange={() => handleChange('genero', 'F')}
                        disabled={esInmutable}
                      /> F
                    </label>
                  </div>
                </div>
                <div className="col-span-2 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">FECHA DE NACIMIENTO</span>
                  <input
                    type="text"
                    value={datos.fecha_nacimiento}
                    onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                    className={inputCellClass}
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                <div className="col-span-2 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">LUGAR DE NACIMIENTO</span>
                  <input
                    type="text"
                    value={datos.lugar_nacimiento}
                    onChange={(e) => handleChange('lugar_nacimiento', e.target.value)}
                    className={inputCellClass}
                  />
                </div>
                <div className="col-span-3 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">N° DE CÉDULA / PASAPORTE</span>
                  <input
                    type="text"
                    value={datos.cedula_pasaporte}
                    onChange={(e) => handleChange('cedula_pasaporte', e.target.value)}
                    className={`${inputCellClass} font-mono`}
                    placeholder="V-XXXXXXXX"
                    required
                  />
                </div>
              </div>

            </div>

            {/* 3. Sección II: Familiar o Acompañante (R15-R17) */}
            <div className="border-2 border-slate-900 divide-y-2 divide-slate-800">
              <div className="p-2 flex items-center gap-2">
                <span className="font-black text-[10px] uppercase text-slate-700 whitespace-nowrap">NOMBRE DEL FAMILIAR O ACOMPAÑANTE:</span>
                <input
                  type="text"
                  value={datos.familiar_acompanante}
                  onChange={(e) => handleChange('familiar_acompanante', e.target.value)}
                  className={inputCellClass}
                  placeholder="Nombre y apellido del familiar que acompaña al paciente"
                />
              </div>

              <div className="grid grid-cols-12 divide-x-2 divide-slate-800 text-[11px]">
                <div className="col-span-4 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">PARENTESCO:</span>
                  <input
                    type="text"
                    value={datos.parentesco}
                    onChange={(e) => handleChange('parentesco', e.target.value)}
                    className={inputCellClass}
                    placeholder="Madre, Padre, Cónyuge..."
                  />
                </div>
                <div className="col-span-4 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">CÉDULA:</span>
                  <input
                    type="text"
                    value={datos.cedula_familiar}
                    onChange={(e) => handleChange('cedula_familiar', e.target.value)}
                    className={inputCellClass}
                    placeholder="C.I. del familiar"
                  />
                </div>
                <div className="col-span-4 p-1.5">
                  <span className="block font-black text-[9px] uppercase text-slate-600">TELÉFONO:</span>
                  <input
                    type="text"
                    value={datos.telefono_familiar}
                    onChange={(e) => handleChange('telefono_familiar', e.target.value)}
                    className={inputCellClass}
                    placeholder="0412-..."
                  />
                </div>
              </div>
            </div>

            {/* 4. Sección III: Procedencia (R18-R21) */}
            <div className="border-2 border-slate-900 p-2.5 bg-slate-50/50">
              <span className="font-black text-[10px] uppercase text-slate-700 block mb-1.5">PROCEDENCIA DEL PACIENTE:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="procedencia"
                    value="SU CASA"
                    checked={datos.procedencia === 'SU CASA'}
                    onChange={() => handleChange('procedencia', 'SU CASA')}
                    disabled={esInmutable}
                  />
                  <span>SU CASA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="procedencia"
                    value="HOSPITAL O CLINICA"
                    checked={datos.procedencia === 'HOSPITAL O CLINICA'}
                    onChange={() => handleChange('procedencia', 'HOSPITAL O CLINICA')}
                    disabled={esInmutable}
                  />
                  <span>HOSPITAL O CLÍNICA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="procedencia"
                    value="SITIO DEL ACCIDENTE"
                    checked={datos.procedencia === 'SITIO DEL ACCIDENTE'}
                    onChange={() => handleChange('procedencia', 'SITIO DEL ACCIDENTE')}
                    disabled={esInmutable}
                  />
                  <span>SITIO DEL ACCIDENTE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="procedencia"
                    value="OTROS"
                    checked={datos.procedencia === 'OTROS'}
                    onChange={() => handleChange('procedencia', 'OTROS')}
                    disabled={esInmutable}
                  />
                  <span>OTROS:</span>
                  <input
                    type="text"
                    value={datos.procedencia_otros_texto}
                    onChange={(e) => handleChange('procedencia_otros_texto', e.target.value)}
                    className="border-b border-slate-400 bg-transparent text-xs w-28 focus:outline-none"
                    placeholder="Especifique"
                  />
                </label>
              </div>
            </div>

            {/* 5. Sección IV: Responsable Asistencia Médica y Constantes Vitales (R22-R28) */}
            <div className="border-2 border-slate-900 p-2.5 space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5">
                <span className="font-black text-[10px] uppercase text-slate-700 whitespace-nowrap">
                  RESPONSABLE ASISTENCIA MÉDICA:
                </span>
                <input
                  type="text"
                  value={datos.responsable_asistencia_medica}
                  onChange={(e) => handleChange('responsable_asistencia_medica', e.target.value)}
                  className={inputCellClass}
                  placeholder="Médico o personal paramédico responsable"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">ESTADO:</span>
                  <div className="flex items-center gap-2 font-bold mt-1">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="estado_conciencia"
                        value="CONCIENTE"
                        checked={datos.estado_conciencia === 'CONCIENTE'}
                        onChange={() => handleChange('estado_conciencia', 'CONCIENTE')}
                        disabled={esInmutable}
                      /> CONCIENTE
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="estado_conciencia"
                        value="INCONSCIENTE"
                        checked={datos.estado_conciencia === 'INCONSCIENTE'}
                        onChange={() => handleChange('estado_conciencia', 'INCONSCIENTE')}
                        disabled={esInmutable}
                      /> INCONSCIENTE
                    </label>
                  </div>
                </div>

                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">TEMPERATURA:</span>
                  <input
                    type="text"
                    value={datos.temperatura}
                    onChange={(e) => handleChange('temperatura', e.target.value)}
                    className={inputCellClass}
                    placeholder="37.0 °C"
                  />
                </div>

                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">RESP.:</span>
                  <input
                    type="text"
                    value={datos.respiracion}
                    onChange={(e) => handleChange('respiracion', e.target.value)}
                    className={inputCellClass}
                    placeholder="18 rpm"
                  />
                </div>

                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">PULSO:</span>
                  <input
                    type="text"
                    value={datos.pulso}
                    onChange={(e) => handleChange('pulso', e.target.value)}
                    className={inputCellClass}
                    placeholder="80 lpm"
                  />
                </div>

                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">T.A.:</span>
                  <input
                    type="text"
                    value={datos.presion_arterial}
                    onChange={(e) => handleChange('presion_arterial', e.target.value)}
                    className={inputCellClass}
                    placeholder="120/80 mmHg"
                  />
                </div>

                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600 mb-0.5">INGESTIÓN ALCOHOL:</span>
                  <div className="flex items-center gap-3 font-bold mt-1">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="ingestion_alcohol"
                        value="SI"
                        checked={datos.ingestion_alcohol === 'SI'}
                        onChange={() => handleChange('ingestion_alcohol', 'SI')}
                        disabled={esInmutable}
                      /> SÍ
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="ingestion_alcohol"
                        value="NO"
                        checked={datos.ingestion_alcohol === 'NO'}
                        onChange={() => handleChange('ingestion_alcohol', 'NO')}
                        disabled={esInmutable}
                      /> NO
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Sección V: Medidas de Primeros Auxilios previas (R29-R34) */}
            <div className="border-2 border-slate-900 p-2.5 bg-slate-50/50 space-y-1.5">
              <span className="font-black text-[10px] uppercase text-slate-800 block">
                MEDIDAS DE PRIMEROS AUXILIOS APLICADAS AL ENFERMO ANTES DE LLEGAR AL HOSPITAL:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_ninguna}
                    onChange={() => handleToggle('primeros_auxilios_ninguna')}
                    disabled={esInmutable}
                  />
                  <span>NINGUNA:</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_masaje_cardiaco}
                    onChange={() => handleToggle('primeros_auxilios_masaje_cardiaco')}
                    disabled={esInmutable}
                  />
                  <span>MASAJE CARDIACO:</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_inmovilizacion}
                    onChange={() => handleToggle('primeros_auxilios_inmovilizacion')}
                    disabled={esInmutable}
                  />
                  <span>INMOVILIZACIÓN DE FRACTURA:</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_respiracion_art}
                    onChange={() => handleToggle('primeros_auxilios_respiracion_art')}
                    disabled={esInmutable}
                  />
                  <span>RESPIRACIÓN ARTIFICIAL:</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_control_hemorragia}
                    onChange={() => handleToggle('primeros_auxilios_control_hemorragia')}
                    disabled={esInmutable}
                  />
                  <span>CONTROL DE HEMORRAGIA:</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.primeros_auxilios_otros}
                    onChange={() => handleToggle('primeros_auxilios_otros')}
                    disabled={esInmutable}
                  />
                  <span>OTROS:</span>
                  <input
                    type="text"
                    value={datos.primeros_auxilios_otros_texto}
                    onChange={(e) => handleChange('primeros_auxilios_otros_texto', e.target.value)}
                    className="border-b border-slate-400 bg-transparent text-xs w-24 focus:outline-none"
                    placeholder="Detalle"
                  />
                </label>
              </div>

              {/* R36: Estado Crítico de Ingreso */}
              <div className="pt-2 border-t border-slate-300 flex items-center gap-6 text-xs font-black text-rose-900">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.ingreso_muerto}
                    onChange={() => handleToggle('ingreso_muerto')}
                    disabled={esInmutable}
                  />
                  <span>INGRESO MUERTO</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={datos.muere_de_emergencia}
                    onChange={() => handleToggle('muere_de_emergencia')}
                    disabled={esInmutable}
                  />
                  <span>MUERE DE EMERGENCIA</span>
                </label>
              </div>
            </div>

            {/* 7. Sección VI: Motivo de Consulta & Severidad (R39) + CUADRÍCULA COMPLETA DE 28 SÍNTOMAS (R40-R46) */}
            <div className="border-2 border-slate-900 p-2.5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-black text-[10px] uppercase text-slate-800 whitespace-nowrap">MOTIVO DE LA CONSULTA:</span>
                  <input
                    type="text"
                    value={datos.motivo_consulta}
                    onChange={(e) => handleChange('motivo_consulta', e.target.value)}
                    className={inputCellClass}
                    placeholder="Síntoma o queja principal referida"
                    required
                  />
                </div>

                {/* Severidad del Caso (I39-I45) */}
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded border border-slate-300">
                  <span className="font-black text-[10px] uppercase text-slate-700">SEVERIDAD DEL CASO:</span>
                  <label className="flex items-center gap-1 font-bold text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="severidad_caso"
                      value="MODERADO"
                      checked={datos.severidad_caso === 'MODERADO'}
                      onChange={() => handleChange('severidad_caso', 'MODERADO')}
                      disabled={esInmutable}
                    /> MODERADO
                  </label>
                  <label className="flex items-center gap-1 font-bold text-xs text-orange-700 cursor-pointer">
                    <input
                      type="radio"
                      name="severidad_caso"
                      value="SEVERO"
                      checked={datos.severidad_caso === 'SEVERO'}
                      onChange={() => handleChange('severidad_caso', 'SEVERO')}
                      disabled={esInmutable}
                    /> SEVERO
                  </label>
                  <label className="flex items-center gap-1 font-bold text-xs text-rose-700 cursor-pointer">
                    <input
                      type="radio"
                      name="severidad_caso"
                      value="CRITICO"
                      checked={datos.severidad_caso === 'CRITICO'}
                      onChange={() => handleChange('severidad_caso', 'CRITICO')}
                      disabled={esInmutable}
                    /> CRÍTICO
                  </label>
                </div>
              </div>

              {/* Cuadrícula Oficial de 28 Síntomas según Excel (Filas 40 a 46) */}
              <div>
                <span className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                  CUADRÍCULA DE SIGNOS Y SÍNTOMAS PRESENTES AL INGRESO:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] font-semibold bg-slate-50 p-2 border border-slate-200">
                  {/* Columna 1 (A40-A46) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_fiebre} onChange={() => handleToggle('sintoma_fiebre')} disabled={esInmutable} />
                      <span>FIEBRE</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_tos} onChange={() => handleToggle('sintoma_tos')} disabled={esInmutable} />
                      <span>TOS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_ronquera} onChange={() => handleToggle('sintoma_ronquera')} disabled={esInmutable} />
                      <span>RONQUERA</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_dificultad_respirar} onChange={() => handleToggle('sintoma_dificultad_respirar')} disabled={esInmutable} />
                      <span>DIFICULTAD AL RESPIRAR</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_dolor} onChange={() => handleToggle('sintoma_dolor')} disabled={esInmutable} />
                      <span>DOLOR</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_palpitaciones} onChange={() => handleToggle('sintoma_palpitaciones')} disabled={esInmutable} />
                      <span>PALPITACIONES</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_opresion} onChange={() => handleToggle('sintoma_opresion')} disabled={esInmutable} />
                      <span>OPRESIÓN</span>
                    </label>
                  </div>

                  {/* Columna 2 (C40-C46) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_hipo} onChange={() => handleToggle('sintoma_hipo')} disabled={esInmutable} />
                      <span>HIPO</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_nauseas} onChange={() => handleToggle('sintoma_nauseas')} disabled={esInmutable} />
                      <span>NAUSEAS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_vomito} onChange={() => handleToggle('sintoma_vomito')} disabled={esInmutable} />
                      <span>VOMITO</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_acidez} onChange={() => handleToggle('sintoma_acidez')} disabled={esInmutable} />
                      <span>ACIDEZ</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_diarrea} onChange={() => handleToggle('sintoma_diarrea')} disabled={esInmutable} />
                      <span>DIARREA</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_estrenimiento} onChange={() => handleToggle('sintoma_estrenimiento')} disabled={esInmutable} />
                      <span>ESTREÑIMIENTO</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_confusion} onChange={() => handleToggle('sintoma_confusion')} disabled={esInmutable} />
                      <span>CONFUSIÓN</span>
                    </label>
                  </div>

                  {/* Columna 3 (E40-E46) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_agitacion} onChange={() => handleToggle('sintoma_agitacion')} disabled={esInmutable} />
                      <span>AGITACIÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_depresion} onChange={() => handleToggle('sintoma_depresion')} disabled={esInmutable} />
                      <span>DEPRESIÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_desmayo} onChange={() => handleToggle('sintoma_desmayo')} disabled={esInmutable} />
                      <span>DESMAYO</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_temblor} onChange={() => handleToggle('sintoma_temblor')} disabled={esInmutable} />
                      <span>TEMBLOR</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_convulsion} onChange={() => handleToggle('sintoma_convulsion')} disabled={esInmutable} />
                      <span>CONVULSIÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_paralisis} onChange={() => handleToggle('sintoma_paralisis')} disabled={esInmutable} />
                      <span>PARÁLISIS</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_ardor} onChange={() => handleToggle('sintoma_ardor')} disabled={esInmutable} />
                      <span>ARDOR</span>
                    </label>
                  </div>

                  {/* Columna 4 (H40-H46) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_picazon} onChange={() => handleToggle('sintoma_picazon')} disabled={esInmutable} />
                      <span>PICAZÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_hinchazon} onChange={() => handleToggle('sintoma_hinchazon')} disabled={esInmutable} />
                      <span>HINCHAZÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_intoxicacion} onChange={() => handleToggle('sintoma_intoxicacion')} disabled={esInmutable} />
                      <span>INTOXICACIÓN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_accidente} onChange={() => handleToggle('sintoma_accidente')} disabled={esInmutable} />
                      <span>ACCIDENTE</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_hemorragia} onChange={() => handleToggle('sintoma_hemorragia')} disabled={esInmutable} />
                      <span>HEMORRAGIA</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_mareo} onChange={() => handleToggle('sintoma_mareo')} disabled={esInmutable} />
                      <span>MAREO</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={datos.sintoma_otros} onChange={() => handleToggle('sintoma_otros')} disabled={esInmutable} />
                      <span>OTROS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Sección VII: Accidente y Lesión (R48-R53) */}
            <div className="border-2 border-slate-900 p-2.5 bg-slate-50/50 space-y-1.5">
              <span className="font-black text-[10px] uppercase text-slate-800 block">
                DETALLE DEL ACCIDENTE Y LESIÓN (R48-R53):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">TIPO DE ACCIDENTE:</span>
                  <input
                    type="text"
                    value={datos.accidente_tipo}
                    onChange={(e) => handleChange('accidente_tipo', e.target.value)}
                    className={inputCellClass}
                    placeholder="Tránsito, Laboral, Caída, Arma..."
                  />
                </div>
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">LESIÓN:</span>
                  <input
                    type="text"
                    value={datos.accidente_lesion}
                    onChange={(e) => handleChange('accidente_lesion', e.target.value)}
                    className={inputCellClass}
                    placeholder="Fractura, Herida, Contusión, Quemadura..."
                  />
                </div>
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">LOCALIZACIÓN ANATÓMICA:</span>
                  <input
                    type="text"
                    value={datos.accidente_localizacion}
                    onChange={(e) => handleChange('accidente_localizacion', e.target.value)}
                    className={inputCellClass}
                    placeholder="Región anatómica afectada..."
                  />
                </div>
              </div>
            </div>

            {/* 9. Sección VIII: Antecedentes (R58) */}
            <div className="border-2 border-slate-900 p-2.5">
              <span className="font-black text-[10px] uppercase text-slate-800 block mb-1">
                ANTECEDENTES PATOLÓGICOS (R58):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">DIABETES:</span>
                  <input
                    type="text"
                    value={datos.antecedentes_diabetes}
                    onChange={(e) => handleChange('antecedentes_diabetes', e.target.value)}
                    className={inputCellClass}
                    placeholder="Sí / No / Tipo"
                  />
                </div>
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">ALERGIA:</span>
                  <input
                    type="text"
                    value={datos.antecedentes_alergia}
                    onChange={(e) => handleChange('antecedentes_alergia', e.target.value)}
                    className={inputCellClass}
                    placeholder="Alergias a medicamentos o alimentos"
                  />
                </div>
                <div>
                  <span className="block font-black text-[9px] uppercase text-slate-600">OTROS:</span>
                  <input
                    type="text"
                    value={datos.antecedentes_otros}
                    onChange={(e) => handleChange('antecedentes_otros', e.target.value)}
                    className={inputCellClass}
                    placeholder="HTA, Asma, Cardiopatía, Cirugías..."
                  />
                </div>
              </div>
            </div>

            {/* 10. Sección IX: Enfermedad Actual (R59-R72) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 block mb-1">
                ENFERMEDAD ACTUAL (R59-R72):
              </label>
              <textarea
                value={datos.enfermedad_actual}
                onChange={(e) => handleChange('enfermedad_actual', e.target.value)}
                className={`${textareaClass} h-24`}
                placeholder="Descripción cronológica y detallada de la enfermedad o episodio actual..."
                required
              />
            </div>

            {/* 11. Sección X: Examen Físico (R73-R75) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 block mb-1">
                EXAMEN FÍSICO (R73-R75):
              </label>
              <textarea
                value={datos.examen_fisico}
                onChange={(e) => handleChange('examen_fisico', e.target.value)}
                className={`${textareaClass} h-20`}
                placeholder="Hallazgos físicos relevantes al examen segmentario..."
              />
            </div>

            {/* 12. Sección XI: Diagnóstico de Ingreso (R76-R78) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 block mb-1">
                DIAGNÓSTICO DE INGRESO (R76-R78):
              </label>
              <textarea
                value={datos.diagnostico_ingreso}
                onChange={(e) => handleChange('diagnostico_ingreso', e.target.value)}
                className={`${textareaClass} h-16 font-bold text-rose-900`}
                placeholder="Impresión diagnóstica inicial de emergencia..."
                required
              />
            </div>

            {/* 13. Sección XII: Tratamiento (R79-R82) */}
            <div className="border-2 border-slate-900 p-2.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-1.5">
                <span className="font-black text-[10px] uppercase text-slate-800">
                  TRATAMIENTO APLICADO (R79):
                </span>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datos.tratamiento_medico}
                      onChange={() => handleToggle('tratamiento_medico')}
                      disabled={esInmutable}
                    /> MÉDICO
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datos.tratamiento_quirurgico}
                      onChange={() => handleToggle('tratamiento_quirurgico')}
                      disabled={esInmutable}
                    /> QUIRÚRGICO
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={datos.tratamiento_cirugia_menor}
                      onChange={() => handleToggle('tratamiento_cirugia_menor')}
                      disabled={esInmutable}
                    /> CIRUGÍA MENOR
                  </label>
                </div>
              </div>

              <textarea
                value={datos.tratamiento_descripcion}
                onChange={(e) => handleChange('tratamiento_descripcion', e.target.value)}
                className={`${textareaClass} h-20`}
                placeholder="Fármacos, vías, dosis aplicadas, hidratación y procedimientos..."
              />
            </div>

            {/* 14. Sección XIII: Evolución (R83-R94) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 block mb-1">
                EVOLUCIÓN EN OBSERVACIÓN / SHOCK (R83-R94):
              </label>
              <textarea
                value={datos.evolucion}
                onChange={(e) => handleChange('evolucion', e.target.value)}
                className={`${textareaClass} h-24`}
                placeholder="Notas de evolución y respuesta al tratamiento durante la estancia en emergencia..."
              />
            </div>

            {/* 15. Sección XIV: Diagnóstico Final (R95-R98) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 block mb-1">
                DIAGNÓSTICO FINAL (R95-R98):
              </label>
              <textarea
                value={datos.diagnostico_final}
                onChange={(e) => handleChange('diagnostico_final', e.target.value)}
                className={`${textareaClass} h-16 font-bold text-blue-900`}
                placeholder="Diagnóstico clínico definitivo de egreso o traslado..."
              />
            </div>

            {/* 16. Sección XV: Egreso y Firmas Oficiales (R99-R108) */}
            <div className="border-2 border-slate-900 divide-y-2 divide-slate-800">
              
              {/* R99-R101: Enfermera & Egreso */}
              <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                <div className="col-span-6 p-2 space-y-1">
                  <span className="block font-black text-[9px] uppercase text-slate-600">NOMBRE DE LA ENFERMERA (A99):</span>
                  <input
                    type="text"
                    value={datos.nombre_enfermera}
                    onChange={(e) => handleChange('nombre_enfermera', e.target.value)}
                    className={inputCellClass}
                  />
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-500">FIRMA:</span>
                    <input
                      type="text"
                      value={datos.firma_enfermera}
                      onChange={(e) => handleChange('firma_enfermera', e.target.value)}
                      className="font-serif italic text-xs w-full bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-6 p-2 space-y-1 bg-slate-50/50">
                  <span className="block font-black text-[9px] uppercase text-slate-600">EGRESO (H99):</span>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <span>HORA:</span>
                      <input
                        type="text"
                        value={datos.egreso_hora}
                        onChange={(e) => handleChange('egreso_hora', e.target.value)}
                        className="w-16 border-b border-slate-400 bg-transparent text-center font-mono focus:outline-none"
                      />
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="egreso_horario"
                        value="AM"
                        checked={datos.egreso_horario === 'AM'}
                        onChange={() => handleChange('egreso_horario', 'AM')}
                        disabled={esInmutable}
                      /> AM
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="egreso_horario"
                        value="PM"
                        checked={datos.egreso_horario === 'PM'}
                        onChange={() => handleChange('egreso_horario', 'PM')}
                        disabled={esInmutable}
                      /> PM
                    </label>
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center gap-2 font-black text-rose-800 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={datos.egreso_contra_opinion_medica}
                        onChange={() => handleToggle('egreso_contra_opinion_medica')}
                        disabled={esInmutable}
                      />
                      <span>EGRESO CONTRA OPINIÓN MÉDICA (H101)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* R103-R106: Médico Tratante & Médico Jefe de Guardia */}
              <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                
                {/* Médico Tratante (A103-A106) */}
                <div className="col-span-6 p-2 space-y-1">
                  <span className="block font-black text-[9px] uppercase text-slate-600">NOMBRE DEL MÉDICO TRATANTE:</span>
                  <input
                    type="text"
                    value={datos.nombre_medico_tratante}
                    onChange={(e) => handleChange('nombre_medico_tratante', e.target.value)}
                    className={inputCellClass}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] font-bold text-slate-500">FIRMA:</span>
                    <input
                      type="text"
                      value={datos.firma_medico_tratante}
                      onChange={(e) => handleChange('firma_medico_tratante', e.target.value)}
                      className="font-serif italic text-xs w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[9px] font-bold text-slate-500">N° REGISTRO S.A.S:</span>
                    <input
                      type="text"
                      value={datos.registro_sas_medico}
                      onChange={(e) => handleChange('registro_sas_medico', e.target.value)}
                      className="font-mono text-xs w-full bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Médico Jefe de Guardia (H103-H106) */}
                <div className="col-span-6 p-2 space-y-1">
                  <span className="block font-black text-[9px] uppercase text-slate-600">NOMBRE: MÉDICO JEFE DE GUARDIA:</span>
                  <input
                    type="text"
                    value={datos.nombre_medico_jefe_guardia}
                    onChange={(e) => handleChange('nombre_medico_jefe_guardia', e.target.value)}
                    className={inputCellClass}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] font-bold text-slate-500">FIRMA:</span>
                    <input
                      type="text"
                      value={datos.firma_medico_jefe_guardia}
                      onChange={(e) => handleChange('firma_medico_jefe_guardia', e.target.value)}
                      className="font-serif italic text-xs w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[9px] font-bold text-slate-500">N° REGISTRO S.A.S:</span>
                    <input
                      type="text"
                      value={datos.registro_sas_jefe_guardia}
                      onChange={(e) => handleChange('registro_sas_jefe_guardia', e.target.value)}
                      className="font-mono text-xs w-full bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* R108: Pie de Formato Oficial */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
              <span>Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</span>
              <span className="font-mono font-black text-slate-900 text-xs">FORM. 051</span>
            </div>

            </fieldset>
          </form>
        </div>

        {/* ── FOOTER DE ACCIONES DEL MODAL ── */}
        <footer className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${esInmutable ? 'bg-amber-500' : 'bg-rose-500'}`} />
            <span className="text-xs font-semibold text-slate-600">
              {esInmutable
                ? 'Documento cerrado e inmutable. Foliado en el expediente oficial del paciente.'
                : 'Formulario activo con los 108 campos oficiales de Formato 051. Al guardar se foliará de forma inmutable.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={cerrar}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={imprimir}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir Planilla F-051</span>
            </button>

            {!esInmutable && (
              <button
                type="submit"
                form="form-051-completo"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar F-051</span>
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  )
}
