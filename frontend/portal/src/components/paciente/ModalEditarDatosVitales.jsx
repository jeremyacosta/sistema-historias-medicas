// ============================================================
//  src/components/paciente/ModalEditarDatosVitales.jsx
//  Auto-gestión de Datos Clínicos del Paciente (Grupo Sanguíneo & Alergias)
//  DISEÑO: "Cosmos Medical" — White Clinical Standard
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'

const TIPOS_SANGRE = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

export default function ModalEditarDatosVitales({ abierto, alCerrar, datosActuales, alGuardarExitoso }) {
  if (!abierto) return null

  const [tipoSangre, setTipoSangre] = useState(datosActuales?.tipo_sangre || 'O+')
  const [alergias, setAlergias] = useState(datosActuales?.alergias_conocidas || '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await alGuardarExitoso({
        tipo_sangre: tipoSangre,
        alergias_conocidas: alergias.trim() || 'Ninguna conocida'
      })
      alCerrar()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al actualizar los datos vitales.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera Cosmos Medical */}
        <div className="relative px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Actualizar Datos Vitales
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Soberanía del Dato · Carnet Clínico de Emergencia
              </p>
            </div>
          </div>

          <button
            onClick={alCerrar}
            disabled={guardando}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 font-medium">
              <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Selector de Tipo de Sangre */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Grupo Sanguíneo y Factor Rh
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIPOS_SANGRE.map((ts) => {
                const seleccionado = tipoSangre === ts
                return (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setTipoSangre(ts)}
                    className={`py-2.5 px-3 rounded-xl font-mono text-sm font-black transition-all cursor-pointer border ${
                      seleccionado
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {ts}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Este dato es vital en caso de requerir transfusión o intervención quirúrgica de urgencia.
            </p>
          </div>

          {/* Campo Alergias Conocidas */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Alergias Conocidas (Fármacos, Alimentos, Sustancias)
            </label>
            <textarea
              rows={3}
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
              placeholder="Ej: Alergia severa a la Penicilina (PNC), Dipirona, AINES..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none font-medium"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Especifique con claridad los medicamentos que le hayan causado reacciones adversas previas.
            </p>
          </div>

          {/* Mensaje de auditoría */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Toda modificación se registra en la auditoría clínica inmutable del Instituto.</span>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={alCerrar}
              disabled={guardando}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {guardando ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando en Expediente...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar en Expediente
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
