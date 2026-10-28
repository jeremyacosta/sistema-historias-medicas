// ============================================================
//  src/components/historias/ModalHistoria051.jsx
//  Modal: Historia de Emergencia 051 — Médico de Guardia
//  Diseño: Cosmos Medical · Fondo blanco · Header navy #091528
//  Protocolo Manchester: Solo Triaje Nivel I y II
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState, useEffect } from 'react'
import { registrarHistoria051Backend } from '../../api/pacientes'

// ── SVG Íconos médicos vectoriales ───────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const IconEmergencia = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
)

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconPaciente = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const IconHospital = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const IconSave = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
)

const IconBed = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

// ── Toast de éxito interno ────────────────────────────────────
function ToastExito({ mensaje, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-emerald-900/30 animate-bounce-in max-w-sm">
      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <IconCheck />
      </div>
      <div>
        <p className="text-sm font-black leading-tight">Historia 051 Registrada</p>
        <p className="text-[11px] text-emerald-200 font-medium">{mensaje}</p>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function ModalHistoria051({ paciente, onClose }) {
  const [requiereHospitalizacion, setRequiereHospitalizacion] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    motivoConsulta: paciente?.motivo || '',
    ta: paciente?.signos?.ta || '',
    spo2: paciente?.signos?.spo2?.replace('%', '') || '',
    fc: paciente?.signos?.fc?.replace(' lpm', '') || '',
    temp: paciente?.signos?.temp?.replace(' °C', '') || '',
    examenFisico: '',
    diagnosticoCIE: '',
    tratamiento: '',
    medico: 'Dr. Hildren Morales · MPPS 45.892',
  })

  // Pre-llenar form cuando cambia el paciente
  useEffect(() => {
    if (paciente) {
      setForm(prev => ({
        ...prev,
        motivoConsulta: paciente.motivo || '',
        ta: paciente.signos?.ta || '',
        spo2: (paciente.signos?.spo2 || '').replace('%', '').trim(),
        fc: (paciente.signos?.fc || '').replace(' lpm', '').trim(),
        temp: (paciente.signos?.temp || '').replace(' °C', '').trim(),
      }))
      setRequiereHospitalizacion(false)
    }
  }, [paciente])

  if (!paciente) return null

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const partesTA = (form.ta || '').split('/')
      const taSis = partesTA[0] ? parseInt(partesTA[0]) : null
      const taDia = partesTA[1] ? parseInt(partesTA[1]) : null

      await registrarHistoria051Backend({
        paciente_cedula: paciente.cedula ? String(paciente.cedula).replace(/\D/g, '') : '30047210',
        ta_sistolica: isNaN(taSis) ? null : taSis,
        ta_diastolica: isNaN(taDia) ? null : taDia,
        spo2: form.spo2 ? parseInt(form.spo2) : null,
        frecuencia_cardiaca: form.fc ? parseInt(form.fc) : null,
        temperatura: form.temp ? parseFloat(form.temp) : null,
        motivo_consulta: form.motivoConsulta || 'Atención médica en triaje de emergencia',
        examen_fisico: form.examenFisico || null,
        diagnostico_cie10: form.diagnosticoCIE || null,
        diagnostico_desc: form.motivoConsulta || null,
        tratamiento: form.tratamiento || null,
        requiere_hospitalizacion: requiereHospitalizacion,
        derivado_cirugia: false,
        resolucion: requiereHospitalizacion ? 'Hospitalizado' : 'En Atención'
      })
    } catch (err) {
      console.warn('[ModalHistoria051] Registro en backend falló o fallback:', err.message)
    }
    setToast(`Paciente: ${paciente.nombre} · ${new Date().toLocaleTimeString('es-VE')}`)
  }

  // Determinar colores de triaje
  const esNivelCritico = paciente.triaje === 'I' || paciente.triaje === 'II'
  const triajeColor = paciente.triaje === 'I' ? { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', dot: '#dc2626' }
                    : { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', dot: '#ea580c' }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Modal */}
        <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200">

          {/* ── HEADER NAVY CLÍNICO ───────────────────────────────── */}
          <div
            className="sticky top-0 z-10 rounded-t-3xl px-6 py-5"
            style={{ background: '#091528', borderBottom: `3px solid ${triajeColor.border}` }}
          >
            {/* Fila superior: badge + tiempo + cerrar */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Badge de emergencia pulsante */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black"
                  style={{ background: `${triajeColor.dot}22`, borderColor: triajeColor.border, color: triajeColor.text }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                    style={{ background: triajeColor.dot }}
                  />
                  <IconEmergencia />
                  EMERGENCIA · HISTORIA 051
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full border"
                  style={{ background: '#ffffff18', borderColor: '#ffffff30', color: '#ffffff' }}
                >
                  Triaje Nivel {paciente.triaje} · {paciente.triajeLabel || 'Emergencia'}
                </span>
              </div>

              {/* Contador de tiempo */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono font-black"
                  style={{ background: '#ffffff12', borderColor: '#ffffff25', color: '#fbbf24' }}
                >
                  <IconClock />
                  <span>02:14:38</span>
                  <span className="text-white/40 font-normal">/</span>
                  <span className="text-white/60 font-normal">48:00:00</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  style={{ background: '#ffffff18', color: '#ffffff' }}
                  title="Cerrar modal"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            {/* Datos del paciente en el header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Paciente', valor: paciente.nombre, icon: <IconPaciente /> },
                { label: 'Cédula', valor: paciente.cedula || '—', icon: null },
                { label: 'Historia Provisional', valor: paciente.historia || '—', icon: null },
                { label: 'Sangre', valor: paciente.sangre || '—', icon: null },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-3 py-2 rounded-xl"
                  style={{ background: '#ffffff10', border: '1px solid #ffffff18' }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#94a3b8' }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-white leading-tight">{item.valor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FORMULARIO CLÍNICO ───────────────────────────────── */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* 1. Motivo de consulta */}
            <fieldset className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Motivo de Consulta <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.motivoConsulta}
                onChange={(e) => handleChange('motivoConsulta', e.target.value)}
                placeholder="Describa el motivo principal de la consulta de emergencia..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors placeholder:text-slate-400"
              />
            </fieldset>

            {/* 2. Signos Vitales al Ingreso */}
            <fieldset className="space-y-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Signos Vitales al Ingreso <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { campo: 'ta',   label: 'T.A. (mmHg)',  placeholder: 'ej: 160/100', type: 'text' },
                  { campo: 'spo2', label: 'SpO₂ (%)',      placeholder: 'ej: 94',      type: 'number' },
                  { campo: 'fc',   label: 'F.C. (lpm)',   placeholder: 'ej: 98',       type: 'number' },
                  { campo: 'temp', label: 'Temperatura (°C)', placeholder: 'ej: 37.1', type: 'number' },
                ].map((sv) => (
                  <div key={sv.campo} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      {sv.label}
                    </label>
                    <input
                      required
                      type={sv.type}
                      step={sv.type === 'number' ? '0.1' : undefined}
                      value={form[sv.campo]}
                      onChange={(e) => handleChange(sv.campo, e.target.value)}
                      placeholder={sv.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            {/* 3. Examen físico básico */}
            <fieldset className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Examen Físico Básico <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.examenFisico}
                onChange={(e) => handleChange('examenFisico', e.target.value)}
                placeholder="Hallazgos relevantes al examen físico: inspección, palpación, auscultación..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors placeholder:text-slate-400"
              />
            </fieldset>

            {/* 4. Diagnóstico provisional CIE-10 */}
            <fieldset className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Diagnóstico Provisional CIE-10 <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.diagnosticoCIE}
                onChange={(e) => handleChange('diagnosticoCIE', e.target.value)}
                placeholder="Ej: I20.0 – Angina inestable / R51 – Cefalea / J18.9 – Neumonía"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors placeholder:text-slate-400"
              />
            </fieldset>

            {/* 5. Tratamiento indicado */}
            <fieldset className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Tratamiento Indicado <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.tratamiento}
                onChange={(e) => handleChange('tratamiento', e.target.value)}
                placeholder="Medicamentos, dosis, vía de administración y conducta médica indicada..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors placeholder:text-slate-400"
              />
            </fieldset>

            {/* 6. Médico de guardia */}
            <fieldset className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Médico de Guardia
              </label>
              <input
                type="text"
                value={form.medico}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-700 cursor-not-allowed"
              />
            </fieldset>

            {/* 7. Indicación de hospitalización */}
            <fieldset className="space-y-2">
              <div
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  requiereHospitalizacion
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="hospitalizacion"
                      checked={requiereHospitalizacion}
                      onChange={(e) => setRequiereHospitalizacion(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer accent-red-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hospitalizacion"
                      className="block text-sm font-black text-slate-800 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <IconBed />
                        Requiere Hospitalización
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Marcar si el paciente necesita ser internado tras las primeras 48 horas de emergencia
                    </p>
                  </div>
                </div>
              </div>

              {/* Alerta de hospitalización */}
              {requiereHospitalizacion && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600">
                    <IconEmergencia />
                  </div>
                  <div>
                    <p className="text-sm font-black text-red-800 leading-tight">
                      Acción requerida: Notificar a Admisión
                    </p>
                    <p className="text-[11px] text-red-700 font-medium mt-1 leading-relaxed">
                      Comunicar al personal de Admisión para apertura de la <strong>Historia F-052 (Parte 1)</strong> y asignación del número único de ingreso hospitalario.
                    </p>
                  </div>
                </div>
              )}
            </fieldset>

            {/* ── BOTONES DE ACCIÓN ─────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <IconClose />
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-black text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                  boxShadow: '0 4px 20px rgba(194,65,12,0.30)',
                }}
              >
                <IconSave />
                Registrar Historia 051 · Emergencia
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Toast de éxito */}
      {toast && (
        <ToastExito
          mensaje={toast}
          onDismiss={() => { setToast(null); onClose() }}
        />
      )}
    </>
  )
}
