// ============================================================
//  src/components/formatos/Formato052Modal.jsx
//  RÉPLICA DIGITAL EXACTA E INTERACTIVA: Formato Oficial MPPS 052 P-1
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  Basado en: 052_FORMATO HISTORIA CLINICA P1.xlsx
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'

const SERVICIOS_HOSPITAL = [
  'Admisión Central / Emergencia',
  'Emergencia Adultos',
  'Emergencia Pediátrica',
  'Traumatología / Rayos X',
  'Cirugía General',
  'Medicina Interna (Medicina I)',
  'Ginecología y Obstetricia',
  'Fisioterapia y Rehabilitación',
  'Consulta Externa',
]

export default function Formato052Modal({
  abierto,
  cerrar,
  paciente,
  documento = null,
  modo = 'ver', // 'ver' | 'nuevo'
  cedulaInicial = '',
  alGuardar,
  onAbrirAnexar,
}) {
  if (!abierto) return null

  const esInmutable = modo === 'ver' || Boolean(documento?.inmutable) || Boolean(paciente?.id && modo !== 'nuevo')
  const [caraActiva, setCaraActiva] = useState('anverso') // 'anverso' | 'dorso'
  const [guardadoExitoso, setGuardadoExitoso] = useState(false)

  // Estado del formulario editable celda por celda según el Excel oficial
  const [datos, setDatos] = useState({
    // Cabecera superior derecha (R2-R4)
    numero_historia: '',
    cedula: '',
    tipo_cedula: 'V',
    fecha_admision: '',
    hora_admision: '',
    
    // Identificación y datos personales (R5-R8)
    apellidos: '',
    nombres: '',
    edad: '',
    genero: 'M',
    lugar_nacimiento: 'Caracas, Dtto. Capital',
    fecha_nacimiento: '',
    servicio: 'Admisión Central / Emergencia',
    procedencia_estado: 'Miranda',
    nacionalidad: 'Venezolana',
    nombre_medico: 'Dr. Héctor Morales',
    direccion_actual: '',
    telefono: '',
    
    // Contacto de emergencia (R9-R10)
    avisar_emergencia_a: '',
    telefono_emergencia: '',
    direccion_emergencia: '',
    fecha_admision_anterior: 'NINGUNA',
    
    // Dolencias clínicas (R12-R28)
    motivos_admision: '',
    enfermedad_actual: '',
    diagnostico_admision: '',
    medico_admision_firma: 'Dr. Héctor Morales (MPPS 45.892)',
    medico_departamento_firma: 'Dr. Hildren Morales (Jefe de Guardia)',
    
    // Sección de Egreso (R34-R48)
    tipo_salida: 'CURACION', // CURACION, MEJORIA, MUERTE, AUTOPSIA, OTRAS
    diagnostico_clinico_final: '',
    prevencion_tratamiento: '',
    fecha_salida: '',
    hora_salida: '',
    firma_jefe_departamento: 'Dr. Héctor Morales',
    diagnostico_biopsia: '',
    diagnostico_autopsia: '',
    
    // Dorso: Autorización (R52-R65)
    autorizacion_fecha: new Date().toLocaleDateString('es-VE'),
    autorizacion_firma_paciente: '',
    autorizacion_testigo: 'Lic. María González (Enfermería)',
    autorizacion_familiar: '',
    autorizacion_parentesco: 'Familiar',
    
    // Dorso: Exoneración por egreso contra opinión médica (R68-R81)
    exoneracion_fecha: '',
    exoneracion_firma_paciente: '',
    exoneracion_testigo: '',
    exoneracion_familiar: '',
    exoneracion_parentesco: '',
  })

  // Sincronizar datos cuando cambia el paciente o se abre el modal
  useEffect(() => {
    const src = (documento && documento.datos) ? documento.datos : paciente
    if (src) {
      setDatos({
        numero_historia: src.numero_historia || paciente?.numero_historia || 'HPL-2024-00004',
        cedula: src.cedula ? String(src.cedula).replace(/\D/g, '') : '',
        tipo_cedula: src.tipo_cedula || 'V',
        fecha_admision: src.fecha_admision ? (String(src.fecha_admision).includes(' ') ? src.fecha_admision.split(' ')[0] : src.fecha_admision) : new Date().toISOString().split('T')[0],
        hora_admision: String(src.fecha_admision || '').includes(' ') ? src.fecha_admision.split(' ')[1] : (src.hora_admision || new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })),
        apellidos: src.apellidos || src.apellido || '',
        nombres: src.nombres || src.nombre || '',
        edad: src.edad || '',
        genero: src.genero || src.sexo || 'M',
        lugar_nacimiento: src.lugar_nacimiento || 'Caracas, Dtto. Capital',
        fecha_nacimiento: src.fecha_nacimiento || '',
        servicio: src.servicio || src.servicio_actual || 'Admisión Central / Emergencia',
        procedencia_estado: src.procedencia_estado || src.estado_residencia || 'Miranda',
        nacionalidad: src.nacionalidad || 'Venezolana',
        nombre_medico: src.nombre_medico || src.medico_tratante || 'Dr. Héctor Morales',
        direccion_actual: src.direccion_actual || src.direccion || '',
        telefono: src.telefono || src.telefono_principal || '',
        avisar_emergencia_a: src.avisar_emergencia_a || src.nombre_contacto_emergencia || '',
        telefono_emergencia: src.telefono_emergencia || '',
        direccion_emergencia: src.direccion_emergencia || src.direccion || '',
        fecha_admision_anterior: src.fecha_admision_anterior || 'NINGUNA',
        motivos_admision: src.motivos_admision || src.motivo_admision || '',
        enfermedad_actual: src.enfermedad_actual || src.motivo_admision || '',
        diagnostico_admision: src.diagnostico_admision || '',
        medico_admision_firma: src.medico_admision_firma || src.medico_tratante || 'Dr. Héctor Morales (MPPS 45.892)',
        medico_departamento_firma: src.medico_departamento_firma || 'Dr. Hildren Morales (Jefe de Guardia)',
        tipo_salida: src.tipo_salida || 'CURACION',
        diagnostico_clinico_final: src.diagnostico_clinico_final || src.diagnostico_admision || '',
        prevencion_tratamiento: src.prevencion_tratamiento || '',
        fecha_salida: src.fecha_salida || '',
        hora_salida: src.hora_salida || '',
        firma_jefe_departamento: src.firma_jefe_departamento || 'Dr. Héctor Morales',
        diagnostico_biopsia: src.diagnostico_biopsia || '',
        diagnostico_autopsia: src.diagnostico_autopsia || '',
        autorizacion_fecha: src.autorizacion_fecha || new Date().toLocaleDateString('es-VE'),
        autorizacion_firma_paciente: src.autorizacion_firma_paciente || src.nombre_completo || `${src.nombre || ''} ${src.apellido || ''}`.trim(),
        autorizacion_testigo: src.autorizacion_testigo || 'Lic. María González (Enfermería)',
        autorizacion_familiar: src.autorizacion_familiar || src.nombre_contacto_emergencia || '',
        autorizacion_parentesco: src.autorizacion_parentesco || src.parentesco_contacto || 'Familiar',
        exoneracion_fecha: src.exoneracion_fecha || '',
        exoneracion_firma_paciente: src.exoneracion_firma_paciente || '',
        exoneracion_testigo: src.exoneracion_testigo || '',
        exoneracion_familiar: src.exoneracion_familiar || '',
        exoneracion_parentesco: src.exoneracion_parentesco || '',
      })
    } else {
      // Plantilla en blanco para nuevo ingreso
      setDatos({
        numero_historia: `HPL-2024-${String(Date.now()).slice(-5)}`,
        cedula: cedulaInicial || '',
        tipo_cedula: 'V',
        fecha_admision: new Date().toISOString().split('T')[0],
        hora_admision: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
        apellidos: '',
        nombres: '',
        edad: '',
        genero: 'M',
        lugar_nacimiento: 'Petare, Miranda',
        fecha_nacimiento: '',
        servicio: 'Admisión Central / Emergencia',
        procedencia_estado: 'Miranda',
        nacionalidad: 'Venezolana',
        nombre_medico: 'Dr. Héctor Morales',
        direccion_actual: 'Petare, Municipio Sucre, Edo. Miranda',
        telefono: '0412-',
        avisar_emergencia_a: '',
        telefono_emergencia: '0414-',
        direccion_emergencia: '',
        fecha_admision_anterior: 'NINGUNA',
        motivos_admision: '',
        enfermedad_actual: '',
        diagnostico_admision: '',
        medico_admision_firma: 'Dr. Héctor Morales (MPPS 45.892)',
        medico_departamento_firma: 'Dr. Hildren Morales (Jefe de Guardia)',
        tipo_salida: 'CURACION',
        diagnostico_clinico_final: '',
        prevencion_tratamiento: '',
        fecha_salida: '',
        hora_salida: '',
        firma_jefe_departamento: 'Dr. Héctor Morales',
        diagnostico_biopsia: '',
        diagnostico_autopsia: '',
        autorizacion_fecha: new Date().toLocaleDateString('es-VE'),
        autorizacion_firma_paciente: '',
        autorizacion_testigo: 'Lic. María González (Enfermería)',
        autorizacion_familiar: '',
        autorizacion_parentesco: 'Familiar',
        exoneracion_fecha: '',
        exoneracion_firma_paciente: '',
        exoneracion_testigo: '',
        exoneracion_familiar: '',
        exoneracion_parentesco: '',
      })
    }
  }, [paciente, abierto])

  const handleChange = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (esInmutable) {
      alert('Por normativa legal MPPS, este documento ya fue emitido y es inmutable. Para registrar cambios o evoluciones, debe anexar un nuevo documento al perfil del paciente.')
      return
    }
    if (!datos.cedula || !datos.nombres || !datos.apellidos) {
      alert('Por favor complete los campos obligatorios: Cédula, Nombres y Apellidos.')
      return
    }
    if (alGuardar) {
      alGuardar(datos)
      setGuardadoExitoso(true)
      setTimeout(() => setGuardadoExitoso(false), 3000)
    }
  }

  const imprimir = () => {
    window.print()
  }

  // Estilos reutilizables: Si es inmutable, se muestra como papel impreso protegido. Si es nuevo, es interactivo.
  const inputCellClass = esInmutable
    ? "w-full bg-transparent border-b border-dotted border-slate-300 font-bold text-slate-900 px-1 py-0.5 text-xs select-text cursor-default"
    : "w-full bg-blue-50/20 hover:bg-blue-50/40 focus:bg-white border-b border-transparent focus:border-blue-600 focus:outline-none font-bold text-slate-900 transition-colors px-1 py-0.5 text-xs placeholder-slate-400"

  const textareaClass = esInmutable
    ? "w-full bg-slate-50/40 border border-slate-200 rounded p-2 font-medium text-slate-900 text-xs resize-none select-text cursor-default"
    : "w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-600 rounded p-2 focus:outline-none font-medium text-slate-900 transition-colors text-xs resize-y"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-5xl xl:max-w-6xl max-h-[96vh] flex flex-col overflow-hidden">

        {/* ── BARRA SUPERIOR INSTITUCIONAL (COSMOS COMMAND HEADER) ── */}
        <header className="bg-[#091528] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md">
              <img
                src="/IMSAFPL.jpg"
                alt="Logo Hospital Periférico de Petare"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {esInmutable ? 'FORM. 052 · EXPEDIENTE FOLIADO' : 'FORM. 052 MPPS'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Distrito Sanitario N° 7 · Red Pública
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white truncate mt-0.5">
                Historia Clínica P-1 (Admisión Central)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {esInmutable ? (
              onAbrirAnexar && (
                <button
                  type="button"
                  onClick={() => {
                    cerrar()
                    onAbrirAnexar(paciente)
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                  title="Anexar un nuevo documento o evolución al perfil de este paciente"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Anexar Documento</span>
                </button>
              )
            ) : (
              <button
                type="submit"
                form="form-052-interactivo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                title="Foliar y guardar la apertura del expediente"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar F-052</span>
              </button>
            )}

            <button
              type="button"
              onClick={imprimir}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Imprimir Planilla Oficial 052"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={cerrar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── SUB-BARRA CLÍNICA: SELECTOR DE CARAS & ESTADO DEL EXPEDIENTE ── */}
        <div className="bg-[#0f1d33] border-b border-slate-800 px-5 sm:px-7 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-shrink-0">
          {/* Selector de Caras de la Planilla */}
          <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80">
            <button
              type="button"
              onClick={() => setCaraActiva('anverso')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                caraActiva === 'anverso'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Cara 1: Anverso (Datos Clínicos)</span>
            </button>
            <button
              type="button"
              onClick={() => setCaraActiva('dorso')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                caraActiva === 'dorso'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span>Cara 2: Dorso (Autorización & Legal)</span>
            </button>
          </div>

          {/* Telemetría y Estado de Custodia */}
          <div className="flex items-center gap-3 text-xs">
            {esInmutable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {documento?.folio ? `FOLIO #${String(documento.folio).padStart(3, '0')}` : 'FOLIO #001'} · INMUTABLE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                APERTURA DE EXPEDIENTE
              </span>
            )}
            <span className="font-mono text-slate-300 font-medium text-[11px] hidden md:inline">
              HISTORIA N°: <strong className="text-white font-black">{datos.numero_historia || 'POR ASIGNAR'}</strong>
            </span>
          </div>
        </div>

        {/* Notificación de guardado exitoso */}
        {guardadoExitoso && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-6 text-center flex items-center justify-center gap-2 animate-in fade-in flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>¡Expediente Formato 052 registrado y foliado exitosamente como Folio #001 inmutable!</span>
          </div>
        )}

        {/* ── CUERPO CON LA ESTRUCTURA EXACTA DEL DOCUMENTO F-052 ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          
          <form id="form-052-interactivo" onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white border-2 border-slate-800 shadow-md p-6 sm:p-8 text-slate-900 font-sans text-xs space-y-4 printable-sheet">
            <fieldset disabled={esInmutable} className={esInmutable ? "inmutable-sheet contents" : "contents"}>

            {caraActiva === 'anverso' ? (
              <>
                {/* ── ENCABEZADO INSTITUCIONAL OFICIAL (R1-R4) ── */}
                <div className="border-b-2 border-slate-800 pb-3">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    {/* Membrete Oficial del Ministerio y Hospital */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 border border-slate-300 p-0.5 bg-white flex items-center justify-center flex-shrink-0">
                        <img src="/IMSAFPL.jpg" alt="IMSAFPL" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="leading-tight text-[11px]">
                        <p className="font-bold tracking-tight">REPÚBLICA BOLIVARIANA DE VENEZUELA</p>
                        <p className="font-bold">MINISTERIO DEL PODER POPULAR PARA LA SALUD</p>
                        <p className="font-bold text-slate-800">Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</p>
                        <p className="text-[10px] text-slate-600">DISTRITO SANITARIO N° 7 · PETARE, CARACAS</p>
                        <p className="font-mono font-black text-xs text-blue-900 mt-0.5">HISTORIA CLÍNICA P-1 (ADMISIÓN)</p>
                      </div>
                    </div>

                    {/* Bloque Cuadrícula Superior Derecha (N° Historia, Cédula, Fecha) */}
                    <div className="border-2 border-slate-900 text-left divide-y divide-slate-800 min-w-[260px] text-[11px] bg-white">
                      <div className="px-3 py-1 bg-slate-100 flex items-center justify-between gap-2">
                        <span className="font-black text-slate-700 whitespace-nowrap">N°. HISTORIA:</span>
                        <input
                          type="text"
                          required
                          value={datos.numero_historia}
                          onChange={(e) => handleChange('numero_historia', e.target.value)}
                          className="font-mono font-black text-blue-800 text-xs w-full text-right bg-transparent focus:bg-white focus:outline-none"
                          placeholder="HPL-2024-XXXXX"
                        />
                      </div>
                      <div className="px-3 py-1 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-700 whitespace-nowrap">N°. DE CÉDULA:</span>
                        <div className="flex items-center gap-1 justify-end w-full">
                          <select
                            value={datos.tipo_cedula}
                            onChange={(e) => handleChange('tipo_cedula', e.target.value)}
                            className="bg-transparent font-bold text-xs focus:outline-none"
                          >
                            <option value="V">V-</option>
                            <option value="E">E-</option>
                            <option value="P">P-</option>
                          </select>
                          <input
                            type="text"
                            required
                            value={datos.cedula}
                            onChange={(e) => handleChange('cedula', e.target.value)}
                            className="font-mono font-bold text-slate-900 w-28 text-right bg-transparent focus:bg-white focus:outline-none"
                            placeholder="30047210"
                          />
                        </div>
                      </div>
                      <div className="px-3 py-1 flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-700 whitespace-nowrap">FECHA ADMISIÓN:</span>
                        <input
                          type="text"
                          value={datos.fecha_admision}
                          onChange={(e) => handleChange('fecha_admision', e.target.value)}
                          className="font-mono font-medium text-right bg-transparent focus:bg-white focus:outline-none w-32"
                          placeholder="DD/MM/AAAA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CUADRÍCULA DE IDENTIFICACIÓN DEL PACIENTE (R5-R10) ── */}
                <div className="border-2 border-slate-800 divide-y-2 divide-slate-800">
                  {/* R5: Apellidos | Nombres | Hora */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-5 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">APELLIDOS:</label>
                      <input
                        type="text"
                        required
                        value={datos.apellidos}
                        onChange={(e) => handleChange('apellidos', e.target.value)}
                        placeholder="Ingrese apellidos completos"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-5 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">NOMBRES:</label>
                      <input
                        type="text"
                        required
                        value={datos.nombres}
                        onChange={(e) => handleChange('nombres', e.target.value)}
                        placeholder="Ingrese nombres completos"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-2 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">HORA:</label>
                      <input
                        type="text"
                        value={datos.hora_admision}
                        onChange={(e) => handleChange('hora_admision', e.target.value)}
                        placeholder="08:30"
                        className={`${inputCellClass} font-mono`}
                      />
                    </div>
                  </div>

                  {/* R6: Edad | Género | Lugar y Fecha Nacimiento | Servicio */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-2 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">EDAD:</label>
                      <input
                        type="number"
                        value={datos.edad}
                        onChange={(e) => handleChange('edad', e.target.value)}
                        placeholder="Años"
                        className={`${inputCellClass} font-mono`}
                      />
                    </div>
                    <div className="col-span-2 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">GÉNERO:</label>
                      <select
                        value={datos.genero}
                        onChange={(e) => handleChange('genero', e.target.value)}
                        className="w-full font-bold text-xs bg-transparent focus:bg-white focus:outline-none"
                      >
                        <option value="M">MASCULINO (M)</option>
                        <option value="F">FEMENINO (F)</option>
                      </select>
                    </div>
                    <div className="col-span-4 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">LUGAR Y FECHA DE NACIMIENTO:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={datos.lugar_nacimiento}
                          onChange={(e) => handleChange('lugar_nacimiento', e.target.value)}
                          placeholder="Lugar de nacimiento"
                          className={inputCellClass}
                        />
                        <input
                          type="text"
                          value={datos.fecha_nacimiento}
                          onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                          placeholder="AAAA-MM-DD"
                          className={`${inputCellClass} w-24`}
                        />
                      </div>
                    </div>
                    <div className="col-span-4 p-2 bg-blue-50/40">
                      <label className="block text-[10px] font-black uppercase text-blue-900 mb-0.5">SERVICIO DE DESTINO:</label>
                      <select
                        value={datos.servicio}
                        onChange={(e) => handleChange('servicio', e.target.value)}
                        className="w-full font-bold text-xs text-blue-900 bg-transparent focus:bg-white focus:outline-none uppercase"
                      >
                        {SERVICIOS_HOSPITAL.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* R7: Procedencia por Estado | Nacionalidad | Nombre del Médico */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-4 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">PROCEDENCIA POR ESTADO:</label>
                      <input
                        type="text"
                        value={datos.procedencia_estado}
                        onChange={(e) => handleChange('procedencia_estado', e.target.value)}
                        placeholder="Ej. Miranda / Dtto. Capital"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">NACIONALIDAD:</label>
                      <input
                        type="text"
                        value={datos.nacionalidad}
                        onChange={(e) => handleChange('nacionalidad', e.target.value)}
                        placeholder="Venezolana"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-5 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">NOMBRE DEL MÉDICO:</label>
                      <input
                        type="text"
                        value={datos.nombre_medico}
                        onChange={(e) => handleChange('nombre_medico', e.target.value)}
                        placeholder="Dr..."
                        className={inputCellClass}
                      />
                    </div>
                  </div>

                  {/* R8: Dirección Actual Completa | Teléfono */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-9 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">DIRECCIÓN ACTUAL COMPLETA:</label>
                      <input
                        type="text"
                        value={datos.direccion_actual}
                        onChange={(e) => handleChange('direccion_actual', e.target.value)}
                        placeholder="Barrio, calle, casa o apartamento..."
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">TELÉFONO:</label>
                      <input
                        type="text"
                        value={datos.telefono}
                        onChange={(e) => handleChange('telefono', e.target.value)}
                        placeholder="0412-1234567"
                        className={`${inputCellClass} font-mono`}
                      />
                    </div>
                  </div>

                  {/* R9-R10: Caso de Emergencia */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-9 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">AVISAR EN CASO DE EMERGENCIA A:</label>
                      <input
                        type="text"
                        value={datos.avisar_emergencia_a}
                        onChange={(e) => handleChange('avisar_emergencia_a', e.target.value)}
                        placeholder="Nombre completo y parentesco"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">TELÉFONO EMERGENCIA:</label>
                      <input
                        type="text"
                        value={datos.telefono_emergencia}
                        onChange={(e) => handleChange('telefono_emergencia', e.target.value)}
                        placeholder="0414-7654321"
                        className={`${inputCellClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800">
                    <div className="col-span-9 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">DIRECCIÓN COMPLETA (CASO DE EMERGENCIA):</label>
                      <input
                        type="text"
                        value={datos.direccion_emergencia}
                        onChange={(e) => handleChange('direccion_emergencia', e.target.value)}
                        placeholder="Dirección del contacto de emergencia"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3 p-2">
                      <label className="block text-[10px] font-black uppercase text-slate-600 mb-0.5">FECHA ADMISIÓN ANTERIOR:</label>
                      <input
                        type="text"
                        value={datos.fecha_admision_anterior}
                        onChange={(e) => handleChange('fecha_admision_anterior', e.target.value)}
                        placeholder="NINGUNA"
                        className={inputCellClass}
                      />
                    </div>
                  </div>
                </div>

                {/* NOTA OBLIGATORIA DEL FORMATO OFICIAL (R11) */}
                <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900 font-bold text-[10px] text-center tracking-wide">
                  NOTA: AL SER ADMITIDO EL PACIENTE DEBE FIRMAR LA AUTORIZACIÓN QUE APARECE AL DORSO DE ESTA HOJA.
                </div>

                {/* ── SECCIÓN CLÍNICA (R12-R28) ── */}
                <div className="border-2 border-slate-800 divide-y-2 divide-slate-800">
                  {/* R12: Motivo(s) de Admisión */}
                  <div className="p-3">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                      MOTIVO(S) DE ADMISIÓN:
                    </label>
                    <textarea
                      rows={2}
                      value={datos.motivos_admision}
                      onChange={(e) => handleChange('motivos_admision', e.target.value)}
                      placeholder="Describa los motivos de ingreso o síntomas por los que acude el paciente..."
                      className={textareaClass}
                    />
                  </div>

                  {/* R16: Enfermedad Actual con texto oficial */}
                  <div className="p-3">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1 leading-snug">
                      ENFERMEDAD ACTUAL: <span className="font-normal text-slate-500">(HACER RELATO CONCISO Y COMPLETO DE LAS DOLENCIAS, INDICANDO FECHA DE COMIENZO, DURACIÓN Y TRATAMIENTO DE CADA UNA DE ELLAS):</span>
                    </label>
                    <textarea
                      rows={4}
                      value={datos.enfermedad_actual}
                      onChange={(e) => handleChange('enfermedad_actual', e.target.value)}
                      placeholder="Relato de la enfermedad actual..."
                      className={textareaClass}
                    />
                  </div>

                  {/* R28: Diagnóstico de Admisión */}
                  <div className="p-3 bg-blue-50/30">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-blue-900 mb-1">
                      DIAGNÓSTICO DE ADMISIÓN:
                    </label>
                    <textarea
                      rows={2}
                      value={datos.diagnostico_admision}
                      onChange={(e) => handleChange('diagnostico_admision', e.target.value)}
                      placeholder="Diagnóstico clínico presuntivo (Código CIE-10)..."
                      className={`${textareaClass} font-bold text-blue-950 font-mono`}
                    />
                  </div>

                  {/* R33: Firmas de Admisión */}
                  <div className="grid grid-cols-2 divide-x-2 divide-slate-800 pt-4 pb-2 text-center text-[10px]">
                    <div className="px-4">
                      <input
                        type="text"
                        value={datos.medico_admision_firma}
                        onChange={(e) => handleChange('medico_admision_firma', e.target.value)}
                        className="text-center font-mono font-semibold w-full border-b border-slate-400 mb-1 focus:outline-none"
                      />
                      <span className="font-bold uppercase text-slate-600">FIRMA DEL MÉDICO DE ADMISIÓN</span>
                    </div>
                    <div className="px-4">
                      <input
                        type="text"
                        value={datos.medico_departamento_firma}
                        onChange={(e) => handleChange('medico_departamento_firma', e.target.value)}
                        className="text-center font-mono font-semibold w-full border-b border-slate-400 mb-1 focus:outline-none"
                      />
                      <span className="font-bold uppercase text-slate-600">FIRMA DEL MÉDICO DEL DEPARTAMENTO</span>
                    </div>
                  </div>
                </div>

                {/* ── SECCIÓN DE EGRESO Y DIAGNÓSTICO FINAL (R34-R48) ── */}
                <div className="border-2 border-slate-800 divide-y-2 divide-slate-800">
                  {/* R34: Checkboxes oficiales de salida */}
                  <div className="p-2.5 bg-slate-100 flex items-center justify-between flex-wrap gap-2 text-[10px] font-bold">
                    <span className="text-slate-700">SALIDA POR:</span>
                    {['CURACION', 'MEJORIA', 'MUERTE', 'AUTOPSIA', 'OTRAS'].map((opcion) => (
                      <label key={opcion} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="tipo_salida"
                          value={opcion}
                          checked={datos.tipo_salida === opcion}
                          onChange={(e) => handleChange('tipo_salida', e.target.value)}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span>{opcion === 'AUTOPSIA' ? 'AUTOPSIA PEDIDA' : opcion === 'OTRAS' ? 'OTRAS CAUSAS' : opcion}</span>
                      </label>
                    ))}
                  </div>

                  <div className="p-2 text-[10px] text-slate-500 italic">
                    * SI ES CONTRA OPINIÓN MÉDICA, LLENAR EL DORSO DE LA HOJA.
                  </div>

                  {/* R37: Diagnóstico Clínico Final */}
                  <div className="p-3">
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      DIAGNÓSTICO CLÍNICO FINAL:
                    </label>
                    <textarea
                      rows={2}
                      value={datos.diagnostico_clinico_final}
                      onChange={(e) => handleChange('diagnostico_clinico_final', e.target.value)}
                      placeholder="Diagnóstico definitivo al momento del alta..."
                      className={textareaClass}
                    />
                  </div>

                  {/* R42: Prevención o Tratamiento */}
                  <div className="p-3">
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      PREVENCIÓN O TRATAMIENTO:
                    </label>
                    <textarea
                      rows={2}
                      value={datos.prevencion_tratamiento}
                      onChange={(e) => handleChange('prevencion_tratamiento', e.target.value)}
                      placeholder="Plan terapéutico, recomendaciones y medicamentos indicados..."
                      className={textareaClass}
                    />
                  </div>

                  {/* R46-R48: Fecha Salida, Firma Jefe y Biopsia/Autopsia */}
                  <div className="grid grid-cols-12 divide-x-2 divide-slate-800 text-[10px]">
                    <div className="col-span-4 p-2">
                      <span className="font-bold text-slate-600 block mb-0.5">FECHA DE SALIDA:</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={datos.fecha_salida}
                          onChange={(e) => handleChange('fecha_salida', e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className={`${inputCellClass} font-mono`}
                        />
                        <input
                          type="text"
                          value={datos.hora_salida}
                          onChange={(e) => handleChange('hora_salida', e.target.value)}
                          placeholder="Hora"
                          className={`${inputCellClass} w-16 font-mono`}
                        />
                      </div>
                    </div>
                    <div className="col-span-4 p-2 text-center">
                      <input
                        type="text"
                        value={datos.firma_jefe_departamento}
                        onChange={(e) => handleChange('firma_jefe_departamento', e.target.value)}
                        className="text-center font-mono w-full border-b border-slate-400 mb-1 focus:outline-none"
                      />
                      <span className="font-bold uppercase text-slate-600">FIRMA DEL JEFE DEL DEPARTAMENTO</span>
                    </div>
                    <div className="col-span-4 p-2">
                      <span className="font-bold text-slate-600 block mb-0.5">ANATOMO-PATOLÓGICO:</span>
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={datos.diagnostico_biopsia}
                          onChange={(e) => handleChange('diagnostico_biopsia', e.target.value)}
                          placeholder="BIOPSIA: N°..."
                          className={inputCellClass}
                        />
                        <input
                          type="text"
                          value={datos.diagnostico_autopsia}
                          onChange={(e) => handleChange('diagnostico_autopsia', e.target.value)}
                          placeholder="AUTOPSIA: N°..."
                          className={inputCellClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie oficial de la hoja */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                  <span>HOSPITAL PERIFÉRICO DE PETARE · REGISTROS CLÍNICOS</span>
                  <span className="font-mono font-black text-slate-900 text-xs">FORM. 052</span>
                </div>
              </>
            ) : (
              /* ══════════════════════════════════════════════════════
                 DORSO OFICIAL DE LA HOJA (R52-R81 DEL EXCEL)
              ══════════════════════════════════════════════════════ */
              <div className="space-y-6 py-2">
                
                {/* 1. SECCIÓN DE AUTORIZACIÓN (R52-R65) */}
                <div className="border-2 border-slate-800 p-5 space-y-4">
                  <div className="text-center border-b border-slate-800 pb-2">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                      AUTORIZACIÓN MÉDICO-QUIRÚRGICA
                    </h3>
                    <p className="text-[10px] text-slate-500">Formato Oficial 052 (Reverso) · Ley de Infogobierno y Deontología Médica</p>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed text-justify px-2">
                    "El Suscrito autoriza al médico o los médicos encargados del cuidado del paciente, cuyo nombre aparece en el anverso de esta hoja, a efectuar todo examen, terapéutica, intervención quirúrgica, entre otros, que se considere necesarios o aconsejables para el diagnóstico y tratamiento del caso."
                  </p>

                  <div className="grid grid-cols-12 gap-4 pt-4 border-t border-slate-200 text-xs">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">FECHA:</label>
                      <input
                        type="text"
                        value={datos.autorizacion_fecha}
                        onChange={(e) => handleChange('autorizacion_fecha', e.target.value)}
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-8 text-right">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">FIRMA DEL PACIENTE:</label>
                      <input
                        type="text"
                        value={datos.autorizacion_firma_paciente}
                        onChange={(e) => handleChange('autorizacion_firma_paciente', e.target.value)}
                        placeholder="Nombre o firma del paciente titular"
                        className={`${inputCellClass} text-right font-serif italic text-blue-900 font-bold`}
                      />
                      <span className="block text-[9px] text-slate-400 font-mono mt-0.5">PACIENTE TITULAR</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 pt-2 text-xs">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">TESTIGO:</label>
                      <input
                        type="text"
                        value={datos.autorizacion_testigo}
                        onChange={(e) => handleChange('autorizacion_testigo', e.target.value)}
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">O FAMILIAR RESPONSABLE:</label>
                      <input
                        type="text"
                        value={datos.autorizacion_familiar}
                        onChange={(e) => handleChange('autorizacion_familiar', e.target.value)}
                        placeholder="Familiar responsable"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">PARENTESCO:</label>
                      <input
                        type="text"
                        value={datos.autorizacion_parentesco}
                        onChange={(e) => handleChange('autorizacion_parentesco', e.target.value)}
                        placeholder="Parentesco"
                        className={inputCellClass}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SECCIÓN DE EXONERACIÓN POR EGRESO (R68-R81) */}
                <div className="border-2 border-slate-800 p-5 space-y-4 bg-slate-50/50">
                  <div className="text-center border-b border-slate-800 pb-2">
                    <h3 className="font-black text-sm uppercase tracking-wider text-rose-900">
                      EXONERACIÓN DE RESPONSABILIDAD POR EGRESO CONTRA OPINIÓN MÉDICA
                    </h3>
                    <p className="text-[10px] text-slate-500">A ser completado únicamente si el paciente o familiar decide el alta voluntaria</p>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed text-justify px-2">
                    "El Suscrito certifica que la persona cuyo nombre aparece en el anverso de esta hoja, paciente del Hospital Periférico de Petare &quot;Dr. Ana Francisca Pérez de León&quot;, sale del Hospital contra la opinión de los médicos. Hago constar que habiendo sido advertido de los riesgos que esto implica, exonero de toda responsabilidad a los tratantes y al Hospital por las consecuencias que de ello puedan resultar."
                  </p>

                  <div className="grid grid-cols-12 gap-4 pt-4 border-t border-slate-200 text-xs">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">FECHA:</label>
                      <input
                        type="text"
                        value={datos.exoneracion_fecha}
                        onChange={(e) => handleChange('exoneracion_fecha', e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-8 text-right">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">FIRMA DEL PACIENTE O REPRESENTANTE:</label>
                      <input
                        type="text"
                        value={datos.exoneracion_firma_paciente}
                        onChange={(e) => handleChange('exoneracion_firma_paciente', e.target.value)}
                        placeholder="Nombre o firma para alta voluntaria"
                        className={`${inputCellClass} text-right italic`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 pt-2 text-xs">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">TESTIGO:</label>
                      <input
                        type="text"
                        value={datos.exoneracion_testigo}
                        onChange={(e) => handleChange('exoneracion_testigo', e.target.value)}
                        placeholder="Testigo"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">FAMILIAR:</label>
                      <input
                        type="text"
                        value={datos.exoneracion_familiar}
                        onChange={(e) => handleChange('exoneracion_familiar', e.target.value)}
                        placeholder="Familiar"
                        className={inputCellClass}
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-slate-600 mb-1">PARENTESCO:</label>
                      <input
                        type="text"
                        value={datos.exoneracion_parentesco}
                        onChange={(e) => handleChange('exoneracion_parentesco', e.target.value)}
                        placeholder="Parentesco"
                        className={inputCellClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                  <span>DORSO OFICIAL · Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"</span>
                  <span className="font-mono font-black text-slate-900 text-xs">FORM. 052 (REVERSO)</span>
                </div>

              </div>
            )}
            </fieldset>
          </form>

        </div>

        {/* ── FOOTER DE ACCIONES DEL MODAL ── */}
        <footer className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${esInmutable ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-xs font-semibold text-slate-600">
              {esInmutable
                ? 'Documento cerrado e inmutable. Por normativa MPPS, las nuevas atenciones se suman como folios adicionales.'
                : 'Celdas activas para apertura de historia. Al guardar, el expediente se foliará de forma inmutable.'}
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
              <span>Imprimir Planilla</span>
            </button>

            {esInmutable ? (
              onAbrirAnexar && (
                <button
                  type="button"
                  onClick={() => {
                    cerrar()
                    onAbrirAnexar(paciente)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Anexar Nuevo Documento</span>
                </button>
              )
            ) : (
              <button
                type="submit"
                form="form-052-interactivo"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Foliar y Guardar F-052</span>
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  )
}
