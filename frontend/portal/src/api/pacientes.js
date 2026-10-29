// ============================================================
//  src/api/pacientes.js — Servicios del Módulo M1 & Expedientes Clínicos
//  Normativa MPPS: Inmutabilidad de Documentos y Folios Aditivos
//  Instituto Municipal de Salud Ana Francisca Pérez de León (Periférico de Petare)
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import apiClient, { getData, getMsg } from './client'

// Pacientes pre-cargados con cadena de custodia documental foliada
const MOCK_PACIENTES = [
  {
    id: 'pac-001',
    numero_historia: 'HPL-2024-00001',
    cedula: '30047210',
    tipo_cedula: 'V',
    nombre: 'Jeremy',
    apellido: 'Acosta',
    nombre_completo: 'Jeremy Acosta',
    fecha_nacimiento: '2000-05-15',
    edad: 24,
    sexo: 'M',
    estado_civil: 'soltero',
    direccion: 'Barrio 24 de Marzo, Calle 5, Casa 12',
    municipio: 'Sucre',
    estado_residencia: 'Miranda',
    telefono_principal: '0412-3334455',
    telefono_emergencia: '0412-9998877',
    nombre_contacto_emergencia: 'Laura Acosta',
    parentesco_contacto: 'Madre',
    tipo_sangre: 'O+',
    alergias_conocidas: 'Alergia severa a Penicilina (PNC)',
    servicio_actual: 'Emergencia Adultos',
    triaje_actual: 'III',
    fecha_admision: '19/10/2026 08:30',
    motivo_admision: 'Cefalea pulsátil persistente y síndrome febril agudo de 48 horas de evolución',
    diagnostico_admision: 'Cefalea tensional / Síndrome febril en estudio (CIE-10: R51)',
    medico_tratante: 'Dr. Héctor Morales (MPPS 45.892)',
    estado_admision: 'En Espera de Triaje',
    consentimiento_firmado: true,
    documentos: [
      {
        id: 'doc-001-01',
        folio: 1,
        tipo: 'F052',
        codigo_formato: 'FORM. 052 P-1',
        nombre_formato: 'Historia Clínica P-1 (Admisión Inicial)',
        fecha: '19/10/2026 08:30',
        medico: 'Dr. Héctor Morales (MPPS 45.892)',
        servicio: 'Emergencia Adultos',
        inmutable: true,
        resumen: 'Apertura formal de expediente clínico por cuadro febril y cefalea pulsátil.',
        datos: {
          numero_historia: 'HPL-2024-00001',
          cedula: '30047210',
          tipo_cedula: 'V',
          fecha_admision: '2026-10-19',
          hora_admision: '08:30',
          apellidos: 'Acosta',
          nombres: 'Jeremy',
          edad: 24,
          genero: 'M',
          lugar_nacimiento: 'Caracas, Dtto. Capital',
          fecha_nacimiento: '2000-05-15',
          servicio: 'Emergencia Adultos',
          procedencia_estado: 'Miranda',
          nacionalidad: 'Venezolana',
          nombre_medico: 'Dr. Héctor Morales',
          direccion_actual: 'Barrio 24 de Marzo, Calle 5, Casa 12',
          telefono: '0412-3334455',
          avisar_emergencia_a: 'Laura Acosta',
          telefono_emergencia: '0412-9998877',
          direccion_emergencia: 'Barrio 24 de Marzo, Calle 5',
          fecha_admision_anterior: 'NINGUNA',
          motivos_admision: 'Cefalea pulsátil persistente y síndrome febril agudo de 48 horas de evolución',
          enfermedad_actual: 'Paciente masculino de 24 años de edad sin antecedentes clínicos de relevancia que acude por cefalea frontal moderada acompañada de fiebre de 38.5°C.',
          diagnostico_admision: 'Cefalea tensional / Síndrome febril en estudio (CIE-10: R51)',
          medico_admision_firma: 'Dr. Héctor Morales (MPPS 45.892)',
          medico_departamento_firma: 'Dr. Hildren Morales (Jefe de Guardia)',
          tipo_salida: 'CURACION',
          diagnostico_clinico_final: 'Cefalea resuelta',
          prevencion_tratamiento: 'Hidratación oral y analgésicos',
          autorizacion_fecha: '19/10/2026',
          autorizacion_firma_paciente: 'Jeremy Acosta',
          autorizacion_testigo: 'Lic. María González (Enfermería)',
          autorizacion_familiar: 'Laura Acosta',
          autorizacion_parentesco: 'Madre',
        }
      },
      {
        id: 'doc-001-02',
        folio: 2,
        tipo: 'F001',
        codigo_formato: 'FORM. 001',
        nombre_formato: 'Récipe Médico Oficial (Rp. & Indicaciones)',
        fecha: '19/10/2026 11:20',
        medico: 'Dr. Héctor Morales (MPPS 45.892)',
        servicio: 'Emergencia Adultos',
        inmutable: true,
        resumen: 'Paracetamol 500mg tabletas + Suero de Rehidratación Oral.',
        datos: {
          fecha: '19/10/2026',
          nombre_paciente: 'Jeremy Acosta',
          cedula: '30.047.210',
          prescripcion_rp: '1. Paracetamol 500 mg. (Caja x 20 tabletas)\n2. Sales de Rehidratación Oral (3 sobres)\n3. Vitamina C 500 mg (1 frasco x 30)',
          indicaciones: '1. Tomar 1 tableta de Paracetamol 500mg cada 8 horas por 3 días solo en caso de fiebre >38°C o dolor.\n2. Disolver 1 sobre de suero en 1 litro de agua hervida y consumir a libre demanda durante el día.\n3. Reposo por 48 horas. Reconsultar si hay signos de alarma.',
          medico: 'Dr. Héctor Morales',
          mpps: 'MPPS 45.892 · C.M. 18.234'
        }
      }
    ]
  },
  {
    id: 'pac-002',
    numero_historia: 'HPL-2024-00002',
    cedula: '29921654',
    tipo_cedula: 'V',
    nombre: 'Eli',
    apellido: 'Araujo',
    nombre_completo: 'Eli Araujo',
    fecha_nacimiento: '2001-03-22',
    edad: 23,
    sexo: 'F',
    estado_civil: 'soltera',
    direccion: 'Urb. La Dolorita, Bloque 8, Apto 4-B',
    municipio: 'Sucre',
    estado_residencia: 'Miranda',
    telefono_principal: '0414-6667788',
    telefono_emergencia: '0414-1112233',
    nombre_contacto_emergencia: 'Rosa Araujo',
    parentesco_contacto: 'Madre',
    tipo_sangre: 'A+',
    alergias_conocidas: 'Ninguna conocida',
    servicio_actual: 'Consulta Externa / Neumonología',
    triaje_actual: 'IV',
    fecha_admision: '19/10/2026 09:15',
    motivo_admision: 'Control post-tratamiento bronquial y solicitud de récipe oficial firmado',
    diagnostico_admision: 'Bronquitis aguda en resolución (CIE-10: J20.9)',
    medico_tratante: 'Dr. Héctor Morales (MPPS 45.892)',
    estado_admision: 'Llamada a Consulta',
    consentimiento_firmado: true,
    documentos: [
      {
        id: 'doc-002-01',
        folio: 1,
        tipo: 'F052',
        codigo_formato: 'FORM. 052 P-1',
        nombre_formato: 'Historia Clínica P-1 (Admisión Inicial)',
        fecha: '19/10/2026 09:15',
        medico: 'Dr. Héctor Morales (MPPS 45.892)',
        servicio: 'Consulta Externa / Neumonología',
        inmutable: true,
        resumen: 'Apertura de historia para seguimiento de cuadro bronquial.',
        datos: {
          numero_historia: 'HPL-2024-00002',
          cedula: '29921654',
          tipo_cedula: 'V',
          fecha_admision: '2026-10-19',
          hora_admision: '09:15',
          apellidos: 'Araujo',
          nombres: 'Eli',
          edad: 23,
          genero: 'F',
          lugar_nacimiento: 'Caracas, Dtto. Capital',
          fecha_nacimiento: '2001-03-22',
          servicio: 'Consulta Externa / Neumonología',
          procedencia_estado: 'Miranda',
          nacionalidad: 'Venezolana',
          nombre_medico: 'Dr. Héctor Morales',
          direccion_actual: 'Urb. La Dolorita, Bloque 8, Apto 4-B',
          telefono: '0414-6667788',
          avisar_emergencia_a: 'Rosa Araujo',
          telefono_emergencia: '0414-1112233',
          direccion_emergencia: 'Urb. La Dolorita, Bloque 8',
          fecha_admision_anterior: 'NINGUNA',
          motivos_admision: 'Control post-tratamiento bronquial y solicitud de récipe oficial firmado',
          enfermedad_actual: 'Paciente femenina de 23 años quien refiere mejoría significativa tras esquema antibiótico.',
          diagnostico_admision: 'Bronquitis aguda en resolución (CIE-10: J20.9)',
          medico_admision_firma: 'Dr. Héctor Morales (MPPS 45.892)',
          medico_departamento_firma: 'Dr. Hildren Morales (Jefe de Guardia)',
          tipo_salida: 'MEJORIA',
          diagnostico_clinico_final: 'Bronquitis resuelta satisfactoriamente',
          prevencion_tratamiento: 'Ejercicios respiratorios y evitar alérgenos',
          autorizacion_fecha: '19/10/2026',
          autorizacion_firma_paciente: 'Eli Araujo',
          autorizacion_testigo: 'Lic. María González (Enfermería)',
          autorizacion_familiar: 'Rosa Araujo',
          autorizacion_parentesco: 'Madre',
        }
      }
    ]
  },
  {
    id: 'pac-003',
    numero_historia: 'HPL-2024-00003',
    cedula: '5100200',
    tipo_cedula: 'V',
    nombre: 'Roberto',
    apellido: 'Pérez',
    nombre_completo: 'Roberto Pérez',
    fecha_nacimiento: '1955-11-08',
    edad: 69,
    sexo: 'M',
    estado_civil: 'casado',
    direccion: 'Petare Norte, Calle Real, Casa 88',
    municipio: 'Sucre',
    estado_residencia: 'Miranda',
    telefono_principal: '0416-4445566',
    telefono_emergencia: '0416-7778899',
    nombre_contacto_emergencia: 'Carmen Pérez',
    parentesco_contacto: 'Esposa',
    tipo_sangre: 'O+',
    alergias_conocidas: 'Aspirina, AINEs',
    servicio_actual: 'Trauma Shock / Emergencia',
    triaje_actual: 'II',
    fecha_admision: '19/10/2026 10:45',
    motivo_admision: 'Dolor precordial opresivo con irradiación a brazo izquierdo y crisis hipertensiva',
    diagnostico_admision: 'Síndrome coronario agudo sin elevación del ST / Crisis hipertensiva (CIE-10: I20.0)',
    medico_tratante: 'Dr. Héctor Morales (MPPS 45.892)',
    estado_admision: 'En Box de Atención',
    consentimiento_firmado: true,
    documentos: [
      {
        id: 'doc-003-01',
        folio: 1,
        tipo: 'F052',
        codigo_formato: 'FORM. 052 P-1',
        nombre_formato: 'Historia Clínica P-1 (Admisión Inicial)',
        fecha: '19/10/2026 10:45',
        medico: 'Dr. Héctor Morales (MPPS 45.892)',
        servicio: 'Trauma Shock / Emergencia',
        inmutable: true,
        resumen: 'Ingreso urgente a sala de shock por dolor precordial y cifras tensionales 190/110 mmHg.',
        datos: {
          numero_historia: 'HPL-2024-00003',
          cedula: '5100200',
          tipo_cedula: 'V',
          fecha_admision: '2026-10-19',
          hora_admision: '10:45',
          apellidos: 'Pérez',
          nombres: 'Roberto',
          edad: 69,
          genero: 'M',
          lugar_nacimiento: 'Petare, Edo. Miranda',
          fecha_nacimiento: '1955-11-08',
          servicio: 'Trauma Shock / Emergencia',
          procedencia_estado: 'Miranda',
          nacionalidad: 'Venezolana',
          nombre_medico: 'Dr. Héctor Morales',
          direccion_actual: 'Petare Norte, Calle Real, Casa 88',
          telefono: '0416-4445566',
          avisar_emergencia_a: 'Carmen Pérez',
          telefono_emergencia: '0416-7778899',
          direccion_emergencia: 'Petare Norte, Calle Real',
          fecha_admision_anterior: '12/03/2022',
          motivos_admision: 'Dolor precordial opresivo con irradiación a brazo izquierdo y crisis hipertensiva',
          enfermedad_actual: 'Paciente masculino de 69 años con antecedentes de HTA de 15 años de evolución que inicia con dolor retroesternal opresivo de 1 hora de duración.',
          diagnostico_admision: 'Síndrome coronario agudo sin elevación del ST / Crisis hipertensiva (CIE-10: I20.0)',
          medico_admision_firma: 'Dr. Héctor Morales (MPPS 45.892)',
          medico_departamento_firma: 'Dr. Hildren Morales (Jefe de Guardia)',
          tipo_salida: 'MEJORIA',
          diagnostico_clinico_final: 'Crisis hipertensiva controlada',
          prevencion_tratamiento: 'Captopril sublingual, monitoreo ECG continuo',
          autorizacion_fecha: '19/10/2026',
          autorizacion_firma_paciente: 'Roberto Pérez',
          autorizacion_testigo: 'Lic. María González (Enfermería)',
          autorizacion_familiar: 'Carmen Pérez',
          autorizacion_parentesco: 'Esposa',
        }
      },
      {
        id: 'doc-003-02',
        folio: 2,
        tipo: 'F051',
        codigo_formato: 'FORM. 051',
        nombre_formato: 'Historia de Emergencia / Trauma Shock',
        fecha: '19/10/2026 11:15',
        medico: 'Dr. Héctor Morales (MPPS 45.892)',
        servicio: 'Trauma Shock / Emergencia',
        inmutable: true,
        resumen: 'Evaluación y estabilización en shock. T.A: 160/95 mmHg, Pulso: 84 lpm. Diagnóstico: Angina inestable / Cardiopatía hipertensiva.',
        datos: {
          historia_numero: 'HPL-2024-00003',
          nombre_paciente: 'Roberto Pérez',
          direccion_paciente: 'Petare Norte, Calle Real, Casa 88',
          cedula_pasaporte: 'V-5100200',
          edad: 69,
          genero: 'M',
          fecha: '19/10/2026',
          hora: '11:15',
          fecha_nacimiento: '1955-11-08',
          lugar_nacimiento: 'Petare, Miranda',
          familiar_acompanante: 'Carmen Pérez',
          parentesco: 'Esposa',
          cedula_familiar: 'V-5899120',
          telefono_familiar: '0416-7778899',
          procedencia: 'SU CASA',
          procedencia_otros_texto: '',
          responsable_asistencia_medica: 'Dr. Héctor Morales (MPPS 45.892)',
          estado_conciencia: 'CONCIENTE',
          temperatura: '36.8 °C',
          respiracion: '20 rpm',
          pulso: '84 lpm',
          presion_arterial: '160/95 mmHg',
          ingestion_alcohol: 'NO',
          primeros_auxilios_ninguna: true,
          primeros_auxilios_masaje_cardiaco: false,
          primeros_auxilios_inmovilizacion: false,
          primeros_auxilios_respiracion_art: false,
          primeros_auxilios_control_hemorragia: false,
          primeros_auxilios_otros: false,
          ingreso_muerto: false,
          muere_de_emergencia: false,
          motivo_consulta: 'Dolor precordial opresivo con irradiación a miembro superior izquierdo y diaforesis profusa',
          severidad_caso: 'SEVERO',
          sintoma_fiebre: false,
          sintoma_tos: false,
          sintoma_ronquera: false,
          sintoma_dificultad_respirar: true,
          sintoma_dolor: true,
          sintoma_palpitaciones: true,
          sintoma_opresion: true,
          sintoma_hipo: false,
          sintoma_nauseas: true,
          sintoma_vomito: false,
          sintoma_acidez: false,
          sintoma_diarrea: false,
          sintoma_estrenimiento: false,
          sintoma_confusion: false,
          sintoma_agitacion: true,
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
          sintoma_mareo: true,
          sintoma_otros: false,
          es_accidente: false,
          accidente_tipo: 'No aplica',
          accidente_lesion: 'No presenta trauma',
          accidente_localizacion: 'Precordial',
          antecedentes_diabetes: 'Niega diabetes mellitus',
          antecedentes_alergia: 'Alergia severa a Aspirina y AINEs',
          antecedentes_otros: 'Hipertensión arterial estadio 2 de 15 años de evolución bajo tratamiento irregular',
          enfermedad_actual: 'Paciente masculino de 69 años con antecedentes de HTA de larga data que inicia enfermedad actual 1 hora antes de su ingreso, caracterizada por dolor retroesternal opresivo de intensidad 8/10, irradiado a hombro y brazo izquierdo, acompañado de disnea y diaforesis.',
          examen_fisico: 'Paciente consciente, orientado, quejumbroso por dolor. Ruidos cardíacos rítmicos sin soplos ni galope. Campos pulmonares con discreta hipoventilación basal bilateral sin estertores. Abdomen blando, depresible, no doloroso.',
          diagnostico_ingreso: 'Síndrome coronario agudo sin elevación del ST / Angina inestable de alto riesgo / Crisis hipertensiva',
          tratamiento_medico: true,
          tratamiento_quirurgico: false,
          tratamiento_cirugia_menor: false,
          tratamiento_descripcion: '1. Reposo absoluto en posición semifowler con monitoreo ECG y saturación continua.\n2. Oxigenoterapia por cánula nasal a 3 L/min.\n3. Dinitrato de isosorbide 5mg SL dosis única.\n4. Enalaprilat 1.25mg IV lento en infusión.\n5. Clopidogrel 300mg VO dosis de carga.\n6. Enoxaparina 60mg SC c/12h.',
          evolucion: 'A los 45 minutos post-administración de vasodilatador y Enalaprilat se evidencia remisión completa del dolor precordial (0/10). T.A desciende a 140/85 mmHg, frecuencia cardíaca en 76 lpm. Sin signos de insuficiencia cardíaca aguda.',
          diagnostico_final: 'Angina inestable estabilizada / Cardiopatía hipertensiva compensada',
          nombre_enfermera: 'Lic. María González (Enfermería)',
          firma_enfermera: 'Lic. M. González',
          egreso_hora: '14:30',
          egreso_horario: 'PM',
          egreso_contra_opinion_medica: false,
          nombre_medico_tratante: 'Dr. Héctor Morales',
          firma_medico_tratante: 'Dr. Héctor Morales',
          registro_sas_medico: 'MPPS 45.892 · CM 18.234',
          nombre_medico_jefe_guardia: 'Dr. Hildren Morales',
          firma_medico_jefe_guardia: 'Dr. Hildren Morales',
          registro_sas_jefe_guardia: 'MPPS 38.109 · CM 15.901',
        }
      }
    ]
  },
]

// Normalizar y obtener la lista persistida en localStorage
export const getStoredPacientes = () => {
  const local = localStorage.getItem('hospital_pacientes_db_v2')
  if (local) {
    try {
      const parsed = JSON.parse(local)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (_) {}
  }
  localStorage.setItem('hospital_pacientes_db_v2', JSON.stringify(MOCK_PACIENTES))
  return MOCK_PACIENTES
}

export const saveStoredPacientes = (list) => {
  localStorage.setItem('hospital_pacientes_db_v2', JSON.stringify(list))
}

/**
 * Buscar paciente por cédula en el servidor o fallback local
 */
/**
 * Normalizar objeto paciente combinando datos de backend y folios locales
 */
const enriquecerConFolios = (paciente) => {
  if (!paciente) return null
  const list = getStoredPacientes()
  const localMatch = list.find((p) => String(p.cedula).replace(/\D/g, '') === String(paciente.cedula).replace(/\D/g, ''))
  const nombreCompleto = paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim()
  
  return {
    ...paciente,
    nombre_completo: nombreCompleto,
    tipo_cedula: paciente.tipo_cedula || 'V',
    servicio_actual: paciente.servicio_actual || localMatch?.servicio_actual || 'Admisión Central',
    triaje_actual: paciente.triaje_actual || localMatch?.triaje_actual || 'III',
    documentos: (paciente.documentos && paciente.documentos.length > 0) ? paciente.documentos : (localMatch?.documentos || []),
    edad: paciente.edad || (paciente.fecha_nacimiento ? Math.max(1, new Date().getFullYear() - new Date(paciente.fecha_nacimiento).getFullYear()) : (localMatch?.edad || 25))
  }
}

/**
 * Buscar paciente por cédula en el servidor o fallback local
 */
export const buscarPacientePorCedula = async (cedula) => {
  const cedulaLimpia = String(cedula).replace(/\D/g, '')
  try {
    const res = await apiClient.get(`/pacientes/buscar?q=${cedulaLimpia}`)
    const data = getData(res)
    if (data?.pacientes && data.pacientes.length > 0) {
      const match = data.pacientes.find((p) => p.cedula === cedulaLimpia)
      if (match) return enriquecerConFolios(match)
    }
  } catch (err) {
    console.warn('[buscarPacientePorCedula] Backend fallback a local:', err.message)
  }
  const list = getStoredPacientes()
  const match = list.find((p) => String(p.cedula).replace(/\D/g, '') === cedulaLimpia)
  if (match) return enriquecerConFolios(match)
  return null
}

/**
 * Obtener la ficha propia del paciente autenticado (Billetera Digital)
 */
export const obtenerMiPerfilClinico = async () => {
  try {
    const res = await apiClient.get('/pacientes/me')
    return getData(res)
  } catch (err) {
    console.warn('[obtenerMiPerfilClinico] Error cargando perfil:', err.message)
    return null
  }
}

/**
 * Actualizar autónomamente tipo de sangre y alergias desde la Billetera Digital
 */
export const actualizarMiPerfilClinico = async ({ tipo_sangre, alergias_conocidas }) => {
  const res = await apiClient.patch('/pacientes/me/clinico', {
    tipo_sangre,
    alergias_conocidas,
  })
  return getData(res)
}

/**
 * Actualizar autónomamente datos de contacto y domicilio desde la Billetera Digital
 */
export const actualizarMisDatosContacto = async ({
  telefono_principal,
  telefono_emergencia,
  nombre_contacto_emergencia,
  direccion,
  municipio,
}) => {
  const res = await apiClient.patch('/pacientes/me/contacto', {
    telefono_principal,
    telefono_emergencia,
    nombre_contacto_emergencia,
    direccion,
    municipio,
  })
  return getData(res)
}

/**
 * Registrar Historia Clínica de Emergencia F-051 (48 horas) en backend
 */
export const registrarHistoria051Backend = async (datos) => {
  const res = await apiClient.post('/historias/emergencia-051', datos)
  return getData(res)
}

/**
 * Consultar expediente histórico unificado del paciente (para médico)
 */
export const obtenerHistorialPacienteBackend = async (cedula) => {
  const cedulaLimpia = String(cedula).replace(/\D/g, '')
  const res = await apiClient.get(`/historias/paciente/${cedulaLimpia}`)
  return getData(res)
}

/**
 * Listar pacientes con filtros de búsqueda y paginación
 */
export const listarPacientes = async (params = {}) => {
  try {
    const res = await apiClient.get('/pacientes/', { params: { q: params.q } })
    const items = getData(res)
    if (Array.isArray(items) && items.length > 0) {
      let enriquecidos = items.map(enriquecerConFolios)
      if (params.servicio && params.servicio !== 'TODOS') {
        enriquecidos = enriquecidos.filter((p) => (p.servicio_actual || '').toLowerCase().includes(params.servicio.toLowerCase()))
      }
      if (params.triaje && params.triaje !== 'TODOS') {
        enriquecidos = enriquecidos.filter((p) => p.triaje_actual === params.triaje)
      }
      return enriquecidos
    }
  } catch (err) {
    console.warn('[listarPacientes] Fallback a local:', err.message)
  }
  const list = getStoredPacientes()
  let filtrados = list.map(enriquecerConFolios)
  if (params.servicio && params.servicio !== 'TODOS') {
    filtrados = filtrados.filter((p) => (p.servicio_actual || '').toLowerCase().includes(params.servicio.toLowerCase()))
  }
  if (params.triaje && params.triaje !== 'TODOS') {
    filtrados = filtrados.filter((p) => p.triaje_actual === params.triaje)
  }
  if (params.q) {
    const q = params.q.toLowerCase()
    filtrados = filtrados.filter((p) =>
      (p.nombre_completo || '').toLowerCase().includes(q) ||
      String(p.cedula).includes(q) ||
      (p.numero_historia || '').toLowerCase().includes(q)
    )
  }
  return filtrados
}

/**
 * Crear nuevo paciente y abrir expediente F-052 como Folio #1 (Inmutable)
 */
export const registrarPacienteF052 = async (datos) => {
  let backendData = null
  try {
    const payloadBackend = {
      cedula: String(datos.cedula).replace(/\D/g, ''),
      nombre: datos.nombres || datos.nombre,
      apellido: datos.apellidos || datos.apellido,
      fecha_nacimiento: datos.fecha_nacimiento,
      sexo: datos.sexo || datos.genero || 'M',
      estado_civil: datos.estado_civil || 'soltero',
      direccion: datos.direccion || datos.direccion_actual || 'Petare, Edo. Miranda',
      municipio: datos.municipio || 'Sucre',
      estado_residencia: datos.estado_residencia || datos.procedencia_estado || 'Miranda',
      telefono_principal: datos.telefono_principal || datos.telefono,
      telefono_emergencia: datos.telefono_emergencia,
      nombre_contacto_emergencia: datos.nombre_contacto_emergencia || datos.avisar_emergencia_a,
      tipo_sangre: datos.tipo_sangre,
      alergias_conocidas: datos.alergias_conocidas,
    }
    const res = await apiClient.post('/pacientes/', payloadBackend)
    backendData = getData(res)
  } catch (err) {
    console.warn('[registrarPacienteF052] Error o fallback en backend:', err.response?.data?.detail || err.message)
  }
    const list = getStoredPacientes()
    const correlativo = String(list.length + 1).padStart(5, '0')
    const fechaHoraActual = new Date().toLocaleDateString('es-VE') + ' ' + new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
    const numHistoria = backendData?.numero_historia || datos.numero_historia || `HPL-2026-${correlativo}`

    const folio1F052 = {
      id: `doc-${Date.now()}-01`,
      folio: 1,
      tipo: 'F052',
      codigo_formato: 'FORM. 052 P-1',
      nombre_formato: 'Historia Clínica P-1 (Admisión Inicial)',
      fecha: fechaHoraActual,
      medico: datos.medico_tratante || datos.nombre_medico || 'Dr. Héctor Morales (MPPS 45.892)',
      servicio: datos.servicio_actual || datos.servicio || 'Admisión Central',
      inmutable: true,
      resumen: datos.motivo_admision || datos.motivos_admision || 'Apertura de historia clínica.',
      datos: {
        ...datos,
        numero_historia: numHistoria,
        fecha_admision: datos.fecha_admision || new Date().toISOString().split('T')[0],
      }
    }

    const nuevo = {
      id: `pac-${Date.now()}`,
      numero_historia: numHistoria,
      cedula: String(datos.cedula).replace(/\D/g, ''),
      tipo_cedula: datos.tipo_cedula || 'V',
      nombre: datos.nombres || datos.nombre,
      apellido: datos.apellidos || datos.apellido,
      nombre_completo: `${datos.nombres || datos.nombre} ${datos.apellidos || datos.apellido}`.trim(),
      fecha_nacimiento: datos.fecha_nacimiento,
      edad: datos.edad || 25,
      sexo: datos.sexo || datos.genero || 'M',
      estado_civil: datos.estado_civil || 'soltero',
      direccion: datos.direccion || datos.direccion_actual || 'Petare, Edo. Miranda',
      municipio: datos.municipio || 'Sucre',
      estado_residencia: datos.estado_residencia || datos.procedencia_estado || 'Miranda',
      telefono_principal: datos.telefono_principal || datos.telefono,
      telefono_emergencia: datos.telefono_emergencia,
      nombre_contacto_emergencia: datos.nombre_contacto_emergencia || datos.avisar_emergencia_a,
      parentesco_contacto: datos.parentesco_contacto || datos.autorizacion_parentesco || 'Familiar',
      tipo_sangre: datos.tipo_sangre || 'O+',
      alergias_conocidas: datos.alergias_conocidas || 'Negadas',
      servicio_actual: datos.servicio_actual || datos.servicio || 'Admisión Central',
      triaje_actual: datos.triaje_actual || 'III',
      fecha_admision: fechaHoraActual,
      motivo_admision: datos.motivo_admision || datos.motivos_admision,
      enfermedad_actual: datos.enfermedad_actual,
      diagnostico_admision: datos.diagnostico_admision || 'En evaluación clínica inicial',
      diagnostico_clinico_final: datos.diagnostico_clinico_final,
      prevencion_tratamiento: datos.prevencion_tratamiento,
      tipo_salida: datos.tipo_salida || 'CURACION',
      medico_tratante: datos.medico_tratante || datos.nombre_medico || 'Dr. Héctor Morales (MPPS 45.892)',
      estado_admision: 'Admitido / En Censo Activo',
      consentimiento_firmado: true,
      documentos: [folio1F052]
    }

    list.unshift(nuevo)
    saveStoredPacientes(list)
    return nuevo
}

/**
 * Anexar un nuevo documento foliado (F-051, F-001, Nota de Evolución) al perfil del paciente.
 * Cumple con la regla médico-legal de registro append-only (sin sobrescribir folios anteriores).
 */
export const anexarDocumentoPaciente = async (pacienteId, nuevoDoc) => {
  const list = getStoredPacientes()
  let index = list.findIndex((p) => p.id === pacienteId || String(p.cedula).replace(/\D/g, '') === String(nuevoDoc.cedula || '').replace(/\D/g, ''))

  if (index === -1) {
    const nuevoLocal = {
      id: pacienteId || `pac-${Date.now()}`,
      numero_historia: nuevoDoc.numero_historia || `HPL-2026-${String(list.length + 1).padStart(5, '0')}`,
      cedula: String(nuevoDoc.cedula || pacienteId).replace(/\D/g, ''),
      tipo_cedula: 'V',
      nombre: nuevoDoc.nombre || 'Paciente',
      apellido: nuevoDoc.apellido || '',
      nombre_completo: nuevoDoc.nombre_completo || `${nuevoDoc.nombre || 'Paciente'} ${nuevoDoc.apellido || ''}`.trim(),
      servicio_actual: nuevoDoc.servicio || 'Admisión Central',
      triaje_actual: nuevoDoc.triaje || 'III',
      documentos: []
    }
    list.unshift(nuevoLocal)
    index = 0
  }

  let paciente = list[index]
  const docs = paciente.documentos || []
  const siguienteFolio = docs.length + 1
  const fechaHoraActual = new Date().toLocaleDateString('es-VE') + ' ' + new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })

  const documentoFoliado = {
    id: `doc-${paciente.id}-${String(siguienteFolio).padStart(2, '0')}-${Date.now()}`,
    folio: siguienteFolio,
    tipo: nuevoDoc.tipo || 'EVOLUCION', // F051 | F001 | EVOLUCION
    codigo_formato: nuevoDoc.codigo_formato || 'DOC. OFICIAL',
    nombre_formato: nuevoDoc.nombre_formato || 'Nuevo Documento Clínico',
    fecha: fechaHoraActual,
    medico: nuevoDoc.medico || paciente.medico_tratante || 'Dr. Héctor Morales (MPPS 45.892)',
    servicio: nuevoDoc.servicio || paciente.servicio_actual,
    inmutable: true, // Queda sellado e inmutable inmediatamente
    resumen: nuevoDoc.resumen || nuevoDoc.diagnostico || 'Registro clínico oficial anexado al expediente.',
    datos: nuevoDoc.datos || {}
  }

  // Anexar el nuevo folio al historial del paciente
  docs.push(documentoFoliado)
  paciente.documentos = docs

  // Si el nuevo documento contiene un nuevo diagnóstico o servicio, actualizar el estado activo del paciente
  if (nuevoDoc.diagnostico) {
    paciente.diagnostico_admision = nuevoDoc.diagnostico
  }
  if (nuevoDoc.servicio) {
    paciente.servicio_actual = nuevoDoc.servicio
  }
  if (nuevoDoc.triaje) {
    paciente.triaje_actual = nuevoDoc.triaje
  }

  list[index] = paciente
  saveStoredPacientes(list)
  return { paciente, documento: documentoFoliado }
}

/**
 * Obtener expediente completo y documentos de un paciente
 */
export const obtenerExpedientePaciente = async (pacienteId) => {
  const list = getStoredPacientes()
  const p = list.find((item) => item.id === pacienteId || String(item.cedula).replace(/\D/g, '') === String(pacienteId).replace(/\D/g, ''))
  return p || null
}
