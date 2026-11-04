// ============================================================
//  src/modules/medico/RecetasPage.jsx
//  M5 — Récipes Médicos Oficiales MPPS (Formato 001)
//  Foliados, Inmutables y Listos para Imprimir en Físico
//  Cosmos Clinical Command · Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getStoredPacientes, anexarDocumentoPaciente } from '../../api/pacientes'
import Formato001Modal from '../../components/formatos/Formato001Modal'

// ── SVG Íconos Médicos ────────────────────────────────────────
const IconRecipe = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const IconPrinter = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
)

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function RecetasPage() {
  const { usuario } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  
  // Estado para emisión / visualización de récipe
  const [modalFormatoAbierto, setModalFormatoAbierto] = useState(false)
  const [modoModal, setModoModal] = useState('nuevo') // 'nuevo' | 'ver'
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [documentoActivo, setDocumentoActivo] = useState(null)
  
  // Modal de selección de paciente previo a emitir récipe
  const [modalSeleccionarPaciente, setModalSeleccionarPaciente] = useState(false)
  const [busquedaSelector, setBusquedaSelector] = useState('')

  // Cargar lista de pacientes y extraer recetas
  const cargarDatos = () => {
    const list = getStoredPacientes()
    setPacientes(list)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  // Aplanar todos los documentos tipo F001 con referencia a su paciente
  const todasLasRecetas = useMemo(() => {
    const recetas = []
    pacientes.forEach((p) => {
      if (Array.isArray(p.documentos)) {
        p.documentos.forEach((d) => {
          if (d.tipo === 'F001') {
            recetas.push({
              ...d,
              pacienteRef: p,
              pacienteNombre: p.nombre_completo || `${p.nombre || ''} ${p.apellido || ''}`.trim(),
              pacienteCedula: p.cedula,
              pacienteHistoria: p.numero_historia,
              servicio: p.servicio_actual || 'Emergencia Adultos',
            })
          }
        })
      }
    })
    // Ordenar de más reciente a más antiguo
    return recetas.sort((a, b) => (b.folio || 0) - (a.folio || 0))
  }, [pacientes])

  // Filtrado de recetas
  const recetasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return todasLasRecetas
    return todasLasRecetas.filter((r) => {
      const matchNom = (r.pacienteNombre || '').toLowerCase().includes(q)
      const matchCed = (r.pacienteCedula || '').toLowerCase().includes(q)
      const matchFolio = String(r.folio || '').includes(q)
      const matchHist = (r.pacienteHistoria || '').toLowerCase().includes(q)
      const matchMed = (r.medico || '').toLowerCase().includes(q)
      const matchRp = (r.datos?.prescripcion_rp || r.resumen || '').toLowerCase().includes(q)
      return matchNom || matchCed || matchFolio || matchHist || matchMed || matchRp
    })
  }, [todasLasRecetas, busqueda])

  // Abrir modal para crear nuevo récipe con paciente elegido
  const iniciarNuevoRecipe = (paciente) => {
    setPacienteSeleccionado(paciente)
    setDocumentoActivo(null)
    setModoModal('nuevo')
    setModalSeleccionarPaciente(false)
    setModalFormatoAbierto(true)
  }

  // Abrir modal para ver e imprimir récipe existente
  const verRecipe = (receta) => {
    setPacienteSeleccionado(receta.pacienteRef)
    setDocumentoActivo(receta)
    setModoModal('ver')
    setModalFormatoAbierto(true)
  }

  // Guardar nuevo récipe oficial
  const handleGuardarRecipe = async (nuevoDocPayload) => {
    if (!pacienteSeleccionado) return
    try {
      await anexarDocumentoPaciente(pacienteSeleccionado.id, nuevoDocPayload)
      setModalFormatoAbierto(false)
      cargarDatos()
    } catch (err) {
      console.error('Error al anexar récipe:', err)
      alert('Error al guardar el récipe médico: ' + err.message)
    }
  }

  // Pacientes filtrados para el selector
  const pacientesSelector = useMemo(() => {
    const q = busquedaSelector.toLowerCase().trim()
    if (!q) return pacientes
    return pacientes.filter((p) => {
      const nom = (p.nombre_completo || `${p.nombre || ''} ${p.apellido || ''}`).toLowerCase()
      const ced = (p.cedula || '').toLowerCase()
      const hist = (p.numero_historia || '').toLowerCase()
      return nom.includes(q) || ced.includes(q) || hist.includes(q)
    })
  }, [pacientes, busquedaSelector])

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════════════
          HEADER CLÍNICO DE COMANDO — M5 RÉCIPES MÉDICOS
      ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-lg backdrop-blur-sm flex-shrink-0">
              <IconRecipe />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-black bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  M5 · FORM. 001 MPPS
                </span>
                <span className="text-blue-200 text-xs">· Distrito Sanitario N° 7</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight">
                Récipes Médicos Oficiales Foliados
              </h1>
              <p className="text-blue-100 text-xs font-medium mt-0.5">
                Prescripciones en formato legal MPPS de dos columnas (Rp. & Indicaciones) · Listos para Impresión Física
              </p>
            </div>
          </div>

          {/* Botón de Emisión Rápida */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBusquedaSelector('')
                setModalSeleccionarPaciente(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black shadow-lg shadow-black/10 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <IconPlus />
              <span>+ Emitir Nuevo Récipe</span>
            </button>
          </div>
        </div>

        {/* KPIs en fila */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Total Récipes Emitidos</span>
            <p className="text-2xl font-black tabular-nums">{todasLasRecetas.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Pacientes Prescritos</span>
            <p className="text-2xl font-black tabular-nums">
              {new Set(todasLasRecetas.map((r) => r.pacienteCedula)).size}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Formato Reglamentario</span>
            <p className="text-base font-black uppercase text-emerald-300">FORM. 001 MPPS</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-white/70 uppercase tracking-wider">Estado de Prescripción</span>
            <p className="text-base font-black text-blue-200">Foliado & Imprimible</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BARRA DE BÚSQUEDA Y CONTROL
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch />
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por paciente, cédula, N° folio o medicamento..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Mostrando <strong>{recetasFiltradas.length}</strong> de {todasLasRecetas.length} récipes</span>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="text-blue-600 hover:text-blue-800 font-bold ml-2 cursor-pointer"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          TABLA OFICIAL DE RÉCIPES EMITIDOS (FORM. 001)
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {recetasFiltradas.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <IconRecipe />
            </div>
            <h3 className="text-sm font-black text-slate-800">No se encontraron récipes médicos</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {busqueda
                ? 'No hay registros que coincidan con el término de búsqueda ingresado.'
                : 'Aún no se han emitido récipes oficiales. Presione el botón "+ Emitir Nuevo Récipe" para iniciar una prescripción.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Folio / Código</th>
                  <th className="py-3 px-4">Paciente & C.I.</th>
                  <th className="py-3 px-4">Historia</th>
                  <th className="py-3 px-4">Prescripción Oficial (Rp.)</th>
                  <th className="py-3 px-4">Médico Prescriptor</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4 text-right">Acción Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recetasFiltradas.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Folio */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                        FOLIO #{r.folio || idx + 1}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.codigo_formato || 'FORM. 001'}</p>
                    </td>

                    {/* Paciente */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-black text-slate-900">{r.pacienteNombre}</p>
                      <p className="text-[11px] text-slate-500 font-mono">C.I: {r.pacienteCedula}</p>
                    </td>

                    {/* Historia */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-slate-700">
                        {r.pacienteHistoria}
                      </span>
                    </td>

                    {/* Prescripción Rp. Resumen */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                        {r.datos?.prescripcion_rp || r.resumen || 'Sin detalle de medicamentos'}
                      </p>
                    </td>

                    {/* Médico */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800">{r.medico || r.datos?.medico || 'Dr. Médico de Guardia'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{r.datos?.mpps || 'MPPS Oficial'}</p>
                    </td>

                    {/* Fecha */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-slate-600 font-medium">
                        {r.datos?.fecha || r.fecha || '—'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => verRecipe(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs border border-blue-200 transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        <IconPrinter />
                        <span>Ver e Imprimir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL: SELECCIONAR PACIENTE PARA NUEVO RÉCIPE
      ══════════════════════════════════════════════════════ */}
      {modalSeleccionarPaciente && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalSeleccionarPaciente(false)
          }}
        >
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden my-auto animate-in fade-in duration-150">
            {/* Header */}
            <div className="bg-[#091528] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center">
                  <IconRecipe />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Seleccionar Paciente para Prescripción</h3>
                  <p className="text-[11px] text-slate-400">Emisión de Récipe Oficial Formato 001 MPPS</p>
                </div>
              </div>
              <button
                onClick={() => setModalSeleccionarPaciente(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            {/* Buscador */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  value={busquedaSelector}
                  onChange={(e) => setBusquedaSelector(e.target.value)}
                  placeholder="Buscar por nombre, cédula o N° de historia..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de pacientes */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-2">
              {pacientesSelector.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">No se encontraron pacientes registrados.</p>
              ) : (
                pacientesSelector.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => iniciarNuevoRecipe(p)}
                    className="w-full text-left p-3 rounded-xl hover:bg-blue-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                        {p.nombre_completo || `${p.nombre || ''} ${p.apellido || ''}`}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        C.I: {p.cedula} · Historia: {p.numero_historia}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-white group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1 rounded-lg border border-blue-200 transition-all">
                      Seleccionar →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL: FORMATO 001 OFICIAL MPPS (NUEVO O VER/IMPRIMIR)
      ══════════════════════════════════════════════════════ */}
      {modalFormatoAbierto && createPortal(
        <Formato001Modal
          abierto={modalFormatoAbierto}
          cerrar={() => setModalFormatoAbierto(false)}
          paciente={pacienteSeleccionado}
          documento={documentoActivo}
          modo={modoModal}
          alGuardar={handleGuardarRecipe}
        />,
        document.body
      )}

    </div>
  )
}
