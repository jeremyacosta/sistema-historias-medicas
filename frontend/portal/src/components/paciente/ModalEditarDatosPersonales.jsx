// ============================================================
//  src/components/paciente/ModalEditarDatosPersonales.jsx
//  Auto-gestión de Datos Personales y de Contacto del Paciente
//  DISEÑO: "Cosmos Medical" — White Clinical Standard
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'

export default function ModalEditarDatosPersonales({ abierto, alCerrar, datosActuales, alGuardarExitoso }) {
  if (!abierto) return null

  const [telefonoPrincipal, setTelefonoPrincipal] = useState(datosActuales?.telefono_principal || '')
  const [telefonoEmergencia, setTelefonoEmergencia] = useState(datosActuales?.telefono_emergencia || '')
  const [nombreContactoEmergencia, setNombreContactoEmergencia] = useState(datosActuales?.nombre_contacto_emergencia || '')
  const [direccion, setDireccion] = useState(datosActuales?.direccion || '')
  const [municipio, setMunicipio] = useState(datosActuales?.municipio || 'Sucre')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await alGuardarExitoso({
        telefono_principal: telefonoPrincipal.trim(),
        telefono_emergencia: telefonoEmergencia.trim(),
        nombre_contacto_emergencia: nombreContactoEmergencia.trim(),
        direccion: direccion.trim(),
        municipio: municipio.trim(),
      })
      alCerrar()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al actualizar los datos de contacto.')
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Datos Personales & Contacto
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Actualización de Números Telefónicos y Domicilio
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
        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 font-medium">
              <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Teléfono Principal */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Teléfono Principal (Móvil / WhatsApp)
            </label>
            <div className="relative">
              <input
                type="text"
                value={telefonoPrincipal}
                onChange={(e) => setTelefonoPrincipal(e.target.value)}
                placeholder="Ej: 0412-3334455"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nombre Contacto Emergencia
              </label>
              <input
                type="text"
                value={nombreContactoEmergencia}
                onChange={(e) => setNombreContactoEmergencia(e.target.value)}
                placeholder="Ej: Laura Acosta (Madre)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Teléfono de Emergencia
              </label>
              <input
                type="text"
                value={telefonoEmergencia}
                onChange={(e) => setTelefonoEmergencia(e.target.value)}
                placeholder="Ej: 0412-9998877"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Dirección de Domicilio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dirección de Residencia / Domicilio
            </label>
            <textarea
              rows={2}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Barrio 24 de Marzo, Calle 5, Casa 12, Petare"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none bg-slate-50/50 resize-none"
            />
          </div>

          {/* Municipio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Municipio
            </label>
            <input
              type="text"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              placeholder="Ej: Sucre"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Nota Legal de Auditoría */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5">
            <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              La actualización quedará asentada formalmente en la bitácora inmutable de auditoría institucional del hospital bajo tu firma electrónica.
            </span>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={alCerrar}
              disabled={guardando}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {guardando ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
