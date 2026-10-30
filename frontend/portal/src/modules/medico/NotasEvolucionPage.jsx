// ============================================================
//  src/modules/medico/NotasEvolucionPage.jsx
//  M2 — Consola de Notas de Evolución Médica
//  Cosmos Clinical Command · Acento: Azul Clínico / Cyan #0EA5E9
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import NotaEvolucionModal from '../../components/formatos/NotaEvolucionModal'

// ── Datos demo de notas de evolución clínica ─────────────────
const NOTAS_INICIALES = [
  {
    id: 1,
    folio: 'EVOL-2026-00104',
    fecha: '30/10/2026',
    hora: '14:30',
    paciente: {
      nombre_completo: 'Roberto Pérez',
      cedula: '5.100.200',
      edad: 69,
      numero_historia: 'HPL-2026-00003',
      servicio_actual: 'Emergencia Adultos',
    },
    servicio: 'Emergencia Adultos',
    motivo_nota: 'Evolución clínica en guardia — Dolor precordial en remisión',
    subjetivo: 'Refiere disminución progresiva de intensidad de dolor torácico (2/10 en escala analógica). Sin disnea ni diaforesis sobreañadida.',
    objetivo_signos: 'T.A: 135/85 mmHg | F.C: 76 lpm | SpO₂: 97% aire ambiente | Temp: 36.7 °C | Glasgow: 15/15',
    diagnostico_actualizado: 'Síndrome Coronario Agudo sin elevación del ST (SCASEST) estabilizado · HTA Grado II',
    conducta_plan: '1. Mantener reposo absoluto en cama 45°.\n2. Monitoreo continuo electrocardiográfico y oximetría.\n3. Segunda curva de enzimas cardíacas (troponina) a las 18:00.\n4. Ajuste de antihipertensivo.',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · Especialista de Guardia',
  },
  {
    id: 2,
    folio: 'EVOL-2026-00103',
    fecha: '30/10/2026',
    hora: '11:15',
    paciente: {
      nombre_completo: 'Jeremy Acosta',
      cedula: '30.047.210',
      edad: 24,
      numero_historia: 'HPL-2026-00001',
      servicio_actual: 'Emergencia Adultos',
    },
    servicio: 'Emergencia Adultos',
    motivo_nota: 'Reevaluación de síndrome febril agudo a 4 horas de ingreso',
    subjetivo: 'Paciente afebril tras antipirético parenteral. Cede cefalea pulsátil. Tolera vía oral adecuadamente.',
    objetivo_signos: 'T.A: 118/78 mmHg | F.C: 72 lpm | SpO₂: 99% | Temp: 36.8 °C | Abdomen blando, no doloroso',
    diagnostico_actualizado: 'Síndrome febril agudo en resolución · Cefalea tensional secundaria',
    conducta_plan: '1. Se indica alta médica con signos de alarma explicados.\n2. Tratamiento ambulatorio con hidratación oral y acetaminofén 500 mg c/8h SOS dolor/fiebre.\n3. Control por consulta externa en 72 horas.',
    medico: 'Dr. Héctor Morales',
    mpps: 'MPPS 45.892 · Especialista de Guardia',
  },
  {
    id: 3,
    folio: 'EVOL-2026-00102',
    fecha: '29/10/2026',
    hora: '18:40',
    paciente: {
      nombre_completo: 'Carmen López',
      cedula: '8.900.100',
      edad: 58,
      numero_historia: 'HPL-2026-00005',
      servicio_actual: 'Medicina Interna',
    },
    servicio: 'Medicina Interna',
    motivo_nota: 'Control de crisis hipertensiva en sala de hospitalización',
    subjetivo: 'Refiere desaparición de acúfenos y fosfenos. Niega dolor torácico o mareos.',
    objetivo_signos: 'T.A: 130/80 mmHg | F.C: 80 lpm | SpO₂: 98% | Temp: 36.5 °C | Diuresis conservada',
    diagnostico_actualizado: 'Crisis hipertensiva de tipo urgencia controlada · Cardiopatía hipertensiva compensada',
    conducta_plan: '1. Mantener esquema de Losartán 50 mg VO c/12h + Amlodipino 5 mg VO OD.\n2. Dieta hiposódica estricta.\n3. Plan de alta en 24 horas si mantiene cifras tensionales estables.',
    medico: 'Dr. Pedro Ramírez',
    mpps: 'MPPS 51.402 · Medicina Interna',
  },
  {
    id: 4,
    folio: 'EVOL-2026-00101',
    fecha: '28/10/2026',
    hora: '16:00',
    paciente: {
      nombre_completo: 'María González',
      cedula: '12.345.678',
      edad: 45,
      numero_historia: 'HPL-2026-00004',
      servicio_actual: 'Ortopedia',
    },
    servicio: 'Ortopedia',
    motivo_nota: 'Evolución de lumbalgia mecánica tras infiltración paravertebral',
    subjetivo: 'Paciente deambula con apoyo mínimo. Disminución de limitación funcional en flexión lumbar.',
    objetivo_signos: 'T.A: 120/75 mmHg | F.C: 78 lpm | Sin déficit neurológico distal | Lasègue negativo bilateral',
    diagnostico_actualizado: 'Lumbago agudo no especificado (CIE-10 M54.5) con mejoría clínica',
    conducta_plan: '1. Reposo relativo 48 horas sin esfuerzo físico de carga.\n2. Continuar terapia analgésica con complejo B + diclofenac sódico.\n3. Interconsulta a Fisiatría.',
    medico: 'Dr. Pedro Ramírez',
    mpps: 'MPPS 51.402 · Ortopedia y Traumatología',
  },
]

// Lista de pacientes para nueva nota
const PACIENTES_DISPONIBLES = [
  { nombre_completo: 'Roberto Pérez', cedula: '5.100.200', numero_historia: 'HPL-2026-00003', servicio_actual: 'Emergencia Adultos', diagnostico_admision: 'Dolor precordial en estudio' },
  { nombre_completo: 'Jeremy Acosta', cedula: '30.047.210', numero_historia: 'HPL-2026-00001', servicio_actual: 'Emergencia Adultos', diagnostico_admision: 'Síndrome febril agudo' },
  { nombre_completo: 'Carmen López', cedula: '8.900.100', numero_historia: 'HPL-2026-00005', servicio_actual: 'Medicina Interna', diagnostico_admision: 'Crisis hipertensiva' },
  { nombre_completo: 'María González', cedula: '12.345.678', numero_historia: 'HPL-2026-00004', servicio_actual: 'Ortopedia', diagnostico_admision: 'Lumbalgia aguda' },
]

const SERVICIOS_LISTA = [
  'Todos los servicios',
  'Emergencia Adultos',
  'Medicina Interna',
  'Ortopedia',
  'Pediatría',
  'Observación de Corta Estancia',
]

// ── SVG Iconos ────────────────────────────────────────────────
const IconNota = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)
const IconBuscar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const IconMas = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)
const IconLimpiar = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IconOjo = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

export default function NotasEvolucionPage() {
  const { usuario } = useAuth()
  const [notas, setNotas]                     = useState(NOTAS_INICIALES)
  const [busqueda, setBusqueda]               = useState('')
  const [filtroServicio, setFiltroServicio]   = useState('Todos los servicios')
  
  // Modales
  const [modalNuevaNota, setModalNuevaNota]       = useState(false)
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [notaParaVer, setNotaParaVer]             = useState(null)

  // Filtrado reactivo
  const notasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return notas.filter(n => {
      const matchBusqueda =
        !q ||
        n.paciente.nombre_completo.toLowerCase().includes(q) ||
        n.paciente.cedula.replace(/\./g, '').includes(q.replace(/\./g, '')) ||
        n.folio.toLowerCase().includes(q) ||
        n.diagnostico_actualizado.toLowerCase().includes(q)
      const matchServicio = filtroServicio === 'Todos los servicios' || n.servicio === filtroServicio
      return matchBusqueda && matchServicio
    })
  }, [notas, busqueda, filtroServicio])

  const stats = useMemo(() => ({
    total:       notas.length,
    hoy:         notas.filter(n => n.fecha === '30/10/2026').length,
    emergencia:  notas.filter(n => n.servicio === 'Emergencia Adultos').length,
    interna:     notas.filter(n => n.servicio === 'Medicina Interna').length,
  }), [notas])

  const handleGuardarNuevaNota = (nuevaNotaData) => {
    const folioNuevo = `EVOL-2026-${String(notas.length + 105).padStart(5, '0')}`
    const nueva = {
      id: Date.now(),
      folio: folioNuevo,
      fecha: nuevaNotaData.datos?.fecha || new Date().toLocaleDateString('es-VE'),
      hora: nuevaNotaData.datos?.hora || new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }),
      paciente: {
        nombre_completo: pacienteSeleccionado.nombre_completo,
        cedula: pacienteSeleccionado.cedula,
        numero_historia: pacienteSeleccionado.numero_historia,
        servicio_actual: nuevaNotaData.datos?.servicio || pacienteSeleccionado.servicio_actual,
      },
      servicio: nuevaNotaData.datos?.servicio || pacienteSeleccionado.servicio_actual,
      motivo_nota: nuevaNotaData.datos?.motivo_nota || 'Evolución médica',
      subjetivo: nuevaNotaData.datos?.subjetivo || '',
      objetivo_signos: nuevaNotaData.datos?.objetivo_signos || '',
      diagnostico_actualizado: nuevaNotaData.datos?.diagnostico_actualizado || '',
      conducta_plan: nuevaNotaData.datos?.conducta_plan || '',
      medico: usuario?.nombre_completo || 'Dr. Médico de Guardia',
      mpps: `MPPS ${usuario?.cedula || '45.892'} · Médico Tratante`,
    }

    setNotas(prev => [nueva, ...prev])
    setModalNuevaNota(false)
    setPacienteSeleccionado(null)
  }

  const inicialesM = `${usuario?.nombre?.[0] || 'M'}${usuario?.apellido?.[0] || 'D'}`

  return (
    <div className="space-y-5">

      {/* ══ HEADER DE COMANDO CLÍNICO ══════════════════════════ */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
          boxShadow: '0 8px 32px rgba(14,165,233,0.25)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-2 border-white/30" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shadow-lg backdrop-blur-sm flex-shrink-0">
              {inicialesM}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  M2 — Notas de Evolución Médica
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-black leading-tight">Seguimiento Clínico de Pacientes</h2>
              <p className="text-sky-100 text-xs font-medium mt-0.5">
                {usuario?.nombre_completo || 'Dr. Médico de Guardia'} · Instituto Municipal de Salud Ana Francisca Pérez de León
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalNuevaNota(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-sky-800 hover:bg-sky-50 text-xs font-bold transition-all duration-150 active:scale-[0.97] shadow-lg cursor-pointer self-start sm:self-auto"
          >
            <IconMas />
            Redactar Nueva Nota
          </button>
        </div>

        {/* KPIs */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          {[
            { label: 'Total Notas Foliadas',  valor: stats.total,      dot: '#e0f2fe' },
            { label: 'Evoluciones de Hoy',    valor: stats.hoy,        dot: '#34d399' },
            { label: 'Emergencia Adultos',    valor: stats.emergencia, dot: '#fbbf24' },
            { label: 'Medicina Interna',      valor: stats.interna,    dot: '#a78bfa' },
          ].map(k => (
            <div key={k.label} className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: k.dot }} />
                <span className="text-[9px] text-white/70 uppercase tracking-wider truncate">{k.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums">{k.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BARRA DE BUSQUEDA Y FILTROS ══════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <IconBuscar />
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por paciente, cédula, diagnóstico o número de folio (EVOL-...)..."
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <IconLimpiar />
              </button>
            )}
          </div>

          {/* Filtro Servicio */}
          <select
            value={filtroServicio}
            onChange={e => setFiltroServicio(e.target.value)}
            className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            {SERVICIOS_LISTA.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <p className="text-[10px] text-slate-400 font-medium mt-3">
          Mostrando <strong className="text-slate-700">{notasFiltradas.length}</strong> de {notas.length} notas de evolución registradas
        </p>
      </div>

      {/* ══ LISTADO DE NOTAS CLÍNICAS EN GRID / TABLA ═══════════ */}
      <div className="space-y-3">
        {notasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <IconNota />
            </div>
            <p className="text-sm font-bold text-slate-700">No se encontraron notas de evolución</p>
            <p className="text-xs text-slate-400 mt-1">Prueba ajustando los filtros de búsqueda o servicio.</p>
          </div>
        ) : (
          notasFiltradas.map(n => (
            <div
              key={n.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 space-y-4"
            >
              {/* Cabecera de la nota */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sky-700 text-xs bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    {n.folio}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{n.paciente.nombre_completo}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      C.I: {n.paciente.cedula} · Hist: {n.paciente.numero_historia} · {n.servicio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <div className="text-xs">
                    <p className="font-mono font-bold text-slate-700">{n.fecha} · {n.hora}</p>
                    <p className="text-[10px] text-slate-500">{n.medico}</p>
                  </div>

                  <button
                    onClick={() => setNotaParaVer(n)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <IconOjo />
                    Ver Oficial
                  </button>
                </div>
              </div>

              {/* Contenido SOAP clínico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Columna Izquierda: Subjetivo & Signos */}
                <div className="space-y-2.5">
                  <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      S · Subjetivo / Evolución de Síntomas
                    </span>
                    <p className="text-slate-700 leading-relaxed">{n.subjetivo}</p>
                  </div>

                  <div className="bg-sky-50/40 rounded-xl p-3 border border-sky-100">
                    <span className="text-[9px] font-black text-sky-700 uppercase tracking-wider block mb-1">
                      O · Objetivo / Signos Vitales y Examen
                    </span>
                    <p className="font-mono font-bold text-slate-800 text-[11px]">{n.objetivo_signos}</p>
                  </div>
                </div>

                {/* Columna Derecha: Diagnóstico & Plan de Conducta */}
                <div className="space-y-2.5">
                  <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-100">
                    <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block mb-1">
                      A · Apreciación / Diagnóstico Actualizado
                    </span>
                    <p className="font-bold text-slate-900">{n.diagnostico_actualizado}</p>
                  </div>

                  <div className="bg-emerald-50/40 rounded-xl p-3 border border-emerald-100">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                      P · Plan de Tratamiento y Conducta
                    </span>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">{n.conducta_plan}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══ MODAL DE SELECCIÓN DE PACIENTE PARA NUEVA NOTA ══════ */}
      {modalNuevaNota && !pacienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest">Evolución Médica</p>
                <h3 className="text-base font-black text-slate-900">Seleccionar Paciente de Guardia</h3>
              </div>
              <button
                onClick={() => setModalNuevaNota(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconLimpiar />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Seleccione el paciente al que desea anexar una nueva nota oficial de evolución foliada:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {PACIENTES_DISPONIBLES.map(p => (
                <button
                  key={p.cedula}
                  onClick={() => setPacienteSeleccionado(p)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-sky-700">{p.nombre_completo}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      C.I: {p.cedula} · {p.numero_historia} · {p.servicio_actual}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                    Elegir →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL DE REDACCIÓN DE NOTA (FORMATO OFICIAL) ═══════ */}
      {modalNuevaNota && pacienteSeleccionado && (
        <NotaEvolucionModal
          abierto={true}
          cerrar={() => {
            setModalNuevaNota(false)
            setPacienteSeleccionado(null)
          }}
          paciente={pacienteSeleccionado}
          modo="nuevo"
          alGuardar={handleGuardarNuevaNota}
        />
      )}

      {/* ══ MODAL DE VISUALIZACIÓN / IMPRESIÓN OFICIAL ═════════ */}
      {notaParaVer && (
        <NotaEvolucionModal
          abierto={true}
          cerrar={() => setNotaParaVer(null)}
          paciente={notaParaVer.paciente}
          documento={{
            folio: notaParaVer.folio,
            inmutable: true,
            datos: {
              fecha: notaParaVer.fecha,
              hora: notaParaVer.hora,
              servicio: notaParaVer.servicio,
              motivo_nota: notaParaVer.motivo_nota,
              subjetivo: notaParaVer.subjetivo,
              objetivo_signos: notaParaVer.objetivo_signos,
              diagnostico_actualizado: notaParaVer.diagnostico_actualizado,
              conducta_plan: notaParaVer.conducta_plan,
              medico: notaParaVer.medico,
              mpps: notaParaVer.mpps,
            },
          }}
          modo="ver"
        />
      )}

    </div>
  )
}
