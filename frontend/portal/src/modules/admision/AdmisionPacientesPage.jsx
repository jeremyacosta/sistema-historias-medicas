// ============================================================
//  src/modules/admision/AdmisionPacientesPage.jsx
//  MÓDULO M1 — Admisión Central y Apertura de Expediente F-052
//  DISEÑO: "Cosmos Medical" — Clinical Command Center
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  buscarPacientePorCedula,
  listarPacientes,
  registrarPacienteF052,
  anexarDocumentoPaciente,
  obtenerExpedientePaciente,
} from '../../api/pacientes'

import Formato052Modal from '../../components/formatos/Formato052Modal'
import Formato051Modal from '../../components/formatos/Formato051Modal'
import Formato001Modal from '../../components/formatos/Formato001Modal'
import NotaEvolucionModal from '../../components/formatos/NotaEvolucionModal'
import PerfilPacienteModal from '../../components/formatos/PerfilPacienteModal'
import SelectorNuevoDocumentoModal from '../../components/formatos/SelectorNuevoDocumentoModal'

// ── ÍCONOS SVG VECTORIALES CLÍNICOS (CERO EMOJIS) ─────────────
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const IconUserPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
)

const IconClipboardDocument = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconFolder = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const IconPlusCircle = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

// ── NIVELES DE TRIAJE MANCHESTER ──────────────────────────────
const CONFIG_TRIAJE = {
  'I':   { label: 'Reanimación / Paro', color: 'bg-red-600', text: 'text-red-700', border: 'border-red-300', bg: 'bg-red-50' },
  'II':  { label: 'Emergencia Calificada', color: 'bg-orange-600', text: 'text-orange-700', border: 'border-orange-300', bg: 'bg-orange-50' },
  'III': { label: 'Urgencia Menor', color: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-300', bg: 'bg-amber-50' },
  'IV':  { label: 'Consulta General', color: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-300', bg: 'bg-emerald-50' },
  'V':   { label: 'No Urgente', color: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-300', bg: 'bg-blue-50' },
}

const SERVICIOS_HOSPITAL = [
  'Emergencia Adultos',
  'Emergencia Pediátrica',
  'Traumatología / Rayos X',
  'Cirugía General',
  'Medicina Interna (Medicina I)',
  'Ginecología y Obstetricia',
  'Fisioterapia y Rehabilitación',
  'Consulta Externa',
]

export default function AdmisionPacientesPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [filtroServicio, setFiltroServicio] = useState('TODOS')
  const [filtroTriaje, setFiltroTriaje] = useState('TODOS')

  // Estado del Paciente Seleccionado para modales
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)

  // Estado para alerta cuando una búsqueda de cédula no existe
  const [alertaNoEncontrado, setAlertaNoEncontrado] = useState(null)
  const [cedulaNuevoIngreso, setCedulaNuevoIngreso] = useState('')

  // 1. Modal Formato 052 (Admisión Inicial)
  const [modal052Abierto, setModal052Abierto] = useState(false)
  const [doc052Activo, setDoc052Activo] = useState(null)
  const [modo052, setModo052] = useState('ver') // 'ver' | 'nuevo'

  // 2. Modal Perfil del Paciente (Expediente y Carpeta de Documentos Foliados)
  const [perfilAbierto, setPerfilAbierto] = useState(false)

  // 3. Modal Selector de Tipo de Documento a Anexar
  const [selectorDocAbierto, setSelectorDocAbierto] = useState(false)

  // 4. Modal Formato 051 (Emergencia)
  const [modal051Abierto, setModal051Abierto] = useState(false)
  const [doc051Activo, setDoc051Activo] = useState(null)
  const [modo051, setModo051] = useState('nuevo')

  // 5. Modal Formato 001 (Récipe)
  const [modal001Abierto, setModal001Abierto] = useState(false)
  const [doc001Activo, setDoc001Activo] = useState(null)
  const [modo001, setModo001] = useState('nuevo')

  // 6. Modal Nota de Evolución
  const [modalEvolucionAbierto, setModalEvolucionAbierto] = useState(false)
  const [docEvolucionActivo, setDocEvolucionActivo] = useState(null)
  const [modoEvolucion, setModoEvolucion] = useState('nuevo')

  // Cargar lista inicial de pacientes
  const cargarLista = async () => {
    setCargando(true)
    try {
      const data = await listarPacientes({
        servicio: filtroServicio,
        triaje: filtroTriaje,
        q: terminoBusqueda,
      })
      setPacientes(data)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarLista()
  }, [filtroServicio, filtroTriaje])

  // Detección automática de búsqueda por parámetro URL (?cedula=...)
  useEffect(() => {
    const cedulaParam = searchParams.get('cedula')
    if (cedulaParam) {
      const limpia = cedulaParam.replace(/\D/g, '')
      setTerminoBusqueda(limpia)
      buscarPacientePorCedula(limpia).then((encontrado) => {
        if (encontrado) {
          setAlertaNoEncontrado(null)
          abrirPerfil(encontrado)
        } else {
          // No abrir modal automáticamente; alertar amistosamente
          setAlertaNoEncontrado(limpia)
        }
      })
    }
  }, [searchParams])

  const handleBuscar = (e) => {
    e.preventDefault()
    cargarLista()
  }

  // ── MÉTODOS DE APERTURA DE MODALES ──────────────────────────

  // Abrir Formato 052 en modo lectura inmutable
  const abrirF052 = (paciente) => {
    const doc052 = paciente.documentos?.find((d) => d.tipo === 'F052') || null
    setPacienteSeleccionado(paciente)
    setDoc052Activo(doc052)
    setModo052('ver')
    setModal052Abierto(true)
  }

  // Abrir Perfil y Carpeta de Folios del Paciente
  const abrirPerfil = (paciente) => {
    setPacienteSeleccionado(paciente)
    setPerfilAbierto(true)
  }

  // Iniciar Apertura de Nuevo Expediente (F-052)
  const iniciarNuevoIngreso = (cedulaPrevia = '') => {
    setPacienteSeleccionado(null)
    setDoc052Activo(null)
    setCedulaNuevoIngreso(cedulaPrevia)
    setModo052('nuevo')
    setModal052Abierto(true)
  }

  // Abrir selector para sumar un nuevo documento oficial al perfil
  const abrirSelectorNuevoDocumento = (paciente) => {
    setPacienteSeleccionado(paciente)
    setSelectorDocAbierto(true)
  }

  // Manejar selección de tipo de documento
  const handleSeleccionarTipoDocumento = (tipo) => {
    setSelectorDocAbierto(false)
    if (tipo === 'F051') {
      setDoc051Activo(null)
      setModo051('nuevo')
      setModal051Abierto(true)
    } else if (tipo === 'F001') {
      setDoc001Activo(null)
      setModo001('nuevo')
      setModal001Abierto(true)
    } else if (tipo === 'EVOLUCION') {
      setDocEvolucionActivo(null)
      setModoEvolucion('nuevo')
      setModalEvolucionAbierto(true)
    }
  }

  // Ver cualquier documento original foliado desde el perfil
  const handleVerDocumentoGenerico = (doc, paciente) => {
    setPerfilAbierto(false)
    setPacienteSeleccionado(paciente)

    if (doc.tipo === 'F052') {
      setDoc052Activo(doc)
      setModo052('ver')
      setModal052Abierto(true)
    } else if (doc.tipo === 'F051') {
      setDoc051Activo(doc)
      setModo051('ver')
      setModal051Abierto(true)
    } else if (doc.tipo === 'F001') {
      setDoc001Activo(doc)
      setModo001('ver')
      setModal001Abierto(true)
    } else if (doc.tipo === 'EVOLUCION') {
      setDocEvolucionActivo(doc)
      setModoEvolucion('ver')
      setModalEvolucionAbierto(true)
    }
  }

  // Guardar Nuevo Expediente Inicial F-052
  const handleGuardarNuevoF052 = async (datosNuevos) => {
    if (!datosNuevos.cedula || (!datosNuevos.nombre && !datosNuevos.nombres) || (!datosNuevos.apellido && !datosNuevos.apellidos)) {
      alert('Por favor complete los campos obligatorios de identificación: Cédula, Nombres y Apellidos.')
      return
    }

    const creado = await registrarPacienteF052({
      ...datosNuevos,
      nombre: datosNuevos.nombres || datosNuevos.nombre,
      apellido: datosNuevos.apellidos || datosNuevos.apellido,
      motivo_admision: datosNuevos.motivos_admision || datosNuevos.motivo_admision,
      diagnostico_admision: datosNuevos.diagnostico_admision,
    })

    setModal052Abierto(false)
    await cargarLista()
    abrirPerfil(creado)
  }

  // Anexar un Nuevo Documento al Expediente (Append-Only)
  const handleGuardarAnexo = async (nuevoDocPayload) => {
    if (!pacienteSeleccionado) return

    const res = await anexarDocumentoPaciente(pacienteSeleccionado.id, nuevoDocPayload)
    setModal051Abierto(false)
    setModal001Abierto(false)
    setModalEvolucionAbierto(false)

    await cargarLista()
    setPacienteSeleccionado(res.paciente)
    setPerfilAbierto(true)
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">

      {/* ══════════════════════════════════════════════════════════
          1. HEADER CLINICO ENTERPRISE — COMMAND CENTER HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/[0.03] via-indigo-900/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MÓDULO M1 · ADMISIÓN CENTRAL & TRIAJE
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-slate-600">
                Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Normativa MPPS: Historial Inmutable
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Recepción & Expedientes Foliados
              </h1>
              <span className="text-sm font-semibold text-slate-500">
                Cadena de Custodia Documental Oficial
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Operador: <strong className="text-slate-800 font-mono">{usuario?.nombre_completo || 'Personal de Admisión'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cadena Documental: <strong className="text-slate-800 font-mono">Folios Inmutables Activos</strong></span>
              </div>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <button
              onClick={() => iniciarNuevoIngreso()}
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-90 duration-300">
                <IconUserPlus />
              </div>
              <div className="text-left">
                <p className="leading-tight">Apertura F-052</p>
                <p className="text-[10px] text-blue-200 font-normal">Nuevo Paciente / Folio #1</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. HUD DE TELEMETRÍA CLÍNICA DE ADMISIÓN
      ══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Expedientes</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Hoy</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tabular-nums">{pacientes.length}</span>
            <span className="text-xs text-slate-500">en censo activo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Correlativo: HPL-2024-00003</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Triaje Manchester</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">Protocolo</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600 tabular-nums">01</span>
            <span className="text-xs text-slate-500">Nivel II (Emergencia)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Atención inmediata en trauma shock</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Documentos Foliados</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Inmutables</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 tabular-nums">
              {pacientes.reduce((acc, p) => acc + (p.documentos?.length || 1), 0)}
            </span>
            <span className="text-xs text-slate-500">folios registrados</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Cadena legal protegida MPPS</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regla Médico-Legal</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Append-Only</span>
          </div>
          <p className="text-xs font-bold text-slate-800 leading-snug">
            Documentos emitidos no se modifican. Los cambios se anexan como folios nuevos.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. BARRA DE HERRAMIENTAS: BÚSQUEDA Y FILTROS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <form onSubmit={handleBuscar} className="relative flex-1 w-full">
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar por cédula (ej: 30047210), nombre completo o N° de historia HPL..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-800 transition-colors shadow-inner"
          />
          <div className="absolute left-3.5 top-3 text-slate-400">
            <IconSearch />
          </div>
        </form>

        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          <select
            value={filtroServicio}
            onChange={(e) => setFiltroServicio(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="TODOS">Todos los Servicios</option>
            {SERVICIOS_HOSPITAL.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filtroTriaje}
            onChange={(e) => setFiltroTriaje(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="TODOS">Todos los Triajes</option>
            <option value="I">Nivel I · Rojo (Reanimación)</option>
            <option value="II">Nivel II · Naranja (Emergencia)</option>
            <option value="III">Nivel III · Amarillo (Urgente)</option>
            <option value="IV">Nivel IV · Verde (Estándar)</option>
            <option value="V">Nivel V · Azul (No Urgente)</option>
          </select>
        </div>
      </section>

      {/* Alerta si la búsqueda por cédula no arrojó resultados */}
      {alertaNoEncontrado && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0 font-black text-sm shadow-xs">
              <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <span>Expediente No Encontrado en Censo Hospitalario</span>
                <span className="font-mono bg-amber-200/80 px-2 py-0.5 rounded text-[11px] text-amber-900 font-bold">
                  C.I: V-{alertaNoEncontrado}
                </span>
              </p>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                No existe ninguna historia clínica previa vinculada a esta cédula en el censo activo del hospital.
                Si se trata de un paciente de nuevo ingreso o una emergencia, puede iniciar formalmente la apertura de su expediente oficial.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                const ced = alertaNoEncontrado
                setAlertaNoEncontrado(null)
                iniciarNuevoIngreso(ced)
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <IconPlusCircle />
              <span>Apertura Historia (Formato 052)</span>
            </button>
            <button
              type="button"
              onClick={() => setAlertaNoEncontrado(null)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          4. TABLA CLÍNICA DE CENSO Y EXPEDIENTES FOLIADOS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#091528] text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">Historia N°</th>
                <th className="py-3.5 px-4">Cédula</th>
                <th className="py-3.5 px-4">Paciente</th>
                <th className="py-3.5 px-4">Folios Oficiales</th>
                <th className="py-3.5 px-4">Edad / Sexo</th>
                <th className="py-3.5 px-4">Servicio</th>
                <th className="py-3.5 px-4">Triaje</th>
                <th className="py-3.5 px-4 text-right">Acciones Oficiales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {cargando ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Cargando expedientes de pacientes...
                  </td>
                </tr>
              ) : pacientes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No se encontraron pacientes con los criterios indicados.
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => {
                  const triajeCfg = CONFIG_TRIAJE[p.triaje_actual] || CONFIG_TRIAJE['III']
                  const docs = p.documentos || []
                  return (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                        {p.numero_historia}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {p.tipo_cedula}-{p.cedula}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => abrirPerfil(p)}
                          className="font-black text-slate-900 hover:text-blue-700 hover:underline text-left cursor-pointer"
                        >
                          {p.nombre_completo}
                        </button>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{p.direccion}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {docs.length || 1} {docs.length === 1 ? 'Folio' : 'Folios'}
                          </span>
                          {docs.map((d, i) => (
                            <span
                              key={d.id || i}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                              title={`${d.nombre_formato} - ${d.fecha}`}
                            >
                              F{d.folio || i + 1}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {p.edad} años · {p.sexo === 'M' ? 'Masc' : 'Fem'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {p.servicio_actual}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${triajeCfg.bg} ${triajeCfg.text} ${triajeCfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${triajeCfg.color} animate-pulse`} />
                          Triaje {p.triaje_actual}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          
                          {/* Botón 1: Ver Expediente & Folios (Abre PerfilPacienteModal) */}
                          <button
                            onClick={() => abrirPerfil(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#091528] text-white hover:bg-blue-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                            title="Ver expediente completo, carpeta de folios y documentos del paciente"
                          >
                            <IconFolder />
                            <span>Expediente</span>
                          </button>

                          {/* Botón 2: Ver Formato 052 Oficial (Inmutable) */}
                          <button
                            onClick={() => abrirF052(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 font-bold text-xs transition-colors cursor-pointer"
                            title="Ver Planilla Oficial Formato 052 (Folio #1 - Inmutable)"
                          >
                            <IconClipboardDocument />
                            <span>F-052</span>
                          </button>

                          {/* Botón 3: + Anexar Nuevo Documento */}
                          <button
                            onClick={() => abrirSelectorNuevoDocumento(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer"
                            title="Anexar nuevo documento oficial (F-051, Récipe o Evolución) al paciente"
                          >
                            <IconPlusCircle />
                            <span>Anexar</span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. MODALES DEL SISTEMA DOCUMENTAL CLINICO
      ══════════════════════════════════════════════════════════ */}

      {/* Modal 1: Formato 052 (Admisión P-1) — Inmutable al consultar, editable en nuevo ingreso */}
      <Formato052Modal
        abierto={modal052Abierto}
        cerrar={() => setModal052Abierto(false)}
        paciente={pacienteSeleccionado}
        documento={doc052Activo}
        modo={modo052}
        alGuardar={handleGuardarNuevoF052}
        onAbrirAnexar={abrirSelectorNuevoDocumento}
      />

      {/* Modal 2: Perfil y Carpeta de Folios del Paciente (Append-Only) */}
      <PerfilPacienteModal
        abierto={perfilAbierto}
        cerrar={() => setPerfilAbierto(false)}
        paciente={pacienteSeleccionado}
        onVerDocumento={handleVerDocumentoGenerico}
        onAnexarDocumento={abrirSelectorNuevoDocumento}
      />

      {/* Modal 3: Selector de Tipo de Documento a Anexar */}
      <SelectorNuevoDocumentoModal
        abierto={selectorDocAbierto}
        cerrar={() => setSelectorDocAbierto(false)}
        paciente={pacienteSeleccionado}
        onSeleccionarTipo={handleSeleccionarTipoDocumento}
      />

      {/* Modal 4: Formato 051 (Historia de Emergencia / Trauma Shock) */}
      <Formato051Modal
        abierto={modal051Abierto}
        cerrar={() => setModal051Abierto(false)}
        paciente={pacienteSeleccionado}
        documento={doc051Activo}
        modo={modo051}
        alGuardar={handleGuardarAnexo}
      />

      {/* Modal 5: Formato 001 (Récipe Médico Oficial) */}
      <Formato001Modal
        abierto={modal001Abierto}
        cerrar={() => setModal001Abierto(false)}
        paciente={pacienteSeleccionado}
        documento={doc001Activo}
        modo={modo001}
        alGuardar={handleGuardarAnexo}
      />

      {/* Modal 6: Nota Oficial de Evolución / Modificación Clínica */}
      <NotaEvolucionModal
        abierto={modalEvolucionAbierto}
        cerrar={() => setModalEvolucionAbierto(false)}
        paciente={pacienteSeleccionado}
        documento={docEvolucionActivo}
        modo={modoEvolucion}
        alGuardar={handleGuardarAnexo}
      />

    </div>
  )
}
