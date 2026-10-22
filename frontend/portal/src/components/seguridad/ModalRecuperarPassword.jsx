// ============================================================
//  src/components/seguridad/ModalRecuperarPassword.jsx
//  DISEÑO: "Cosmos Medical" — Recuperación Autónoma de Contraseña
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { recuperarPasswordPaso1, recuperarPasswordPaso2 } from '../../api/auth'

export default function ModalRecuperarPassword({ isOpen, onClose }) {
  const [paso, setPaso] = useState(1) // 1: Cédula + Fecha Nac, 2: Pregunta + Nueva Clave, 3: Éxito
  const [cedula, setCedula] = useState('')
  const [fechaNac, setFechaNac] = useState('')
  
  // Datos obtenidos en Paso 1
  const [datosUsuario, setDatosUsuario] = useState(null)
  
  // Paso 2
  const [respuesta, setRespuesta] = useState('')
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handlePaso1 = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const data = await recuperarPasswordPaso1(cedula, fechaNac)
      setDatosUsuario(data)
      setPaso(2)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Datos no coinciden con los registros del hospital.'
      setError(msg)
    } finally {
      setCargando(false)
    }
  }

  const handlePaso2 = async (e) => {
    e.preventDefault()
    setError('')

    if (passwordNuevo !== passwordConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (passwordNuevo.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (!/\d/.test(passwordNuevo) || !/[A-Z]/.test(passwordNuevo)) {
      setError('La contraseña debe incluir al menos un número y una letra mayúscula.')
      return
    }

    setCargando(true)
    try {
      await recuperarPasswordPaso2(cedula, respuesta, passwordNuevo)
      setPaso(3)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al restablecer la contraseña.'
      setError(msg)
    } finally {
      setCargando(false)
    }
  }

  const reiniciarYCerrar = () => {
    setPaso(1)
    setCedula('')
    setFechaNac('')
    setDatosUsuario(null)
    setRespuesta('')
    setPasswordNuevo('')
    setPasswordConfirm('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#091528] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black">Recuperación de Acceso</h3>
              <p className="text-[10px] text-slate-400">Hospital Periférico de Petare</p>
            </div>
          </div>
          <button
            onClick={reiniciarYCerrar}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* PASO 1: Identificación */}
          {paso === 1 && (
            <form onSubmit={handlePaso1} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingresa tu número de cédula y fecha de nacimiento registradas en tu historia clínica para verificar tu identidad:
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Cédula de Identidad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 30047210"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  required
                  value={fechaNac}
                  onChange={(e) => setFechaNac(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {cargando ? 'Validando registros...' : 'Continuar'}
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-snug">
                <strong>¿No recuerdas tus datos?</strong> Acude con tu cédula laminada a la taquilla de Admisión del Hospital para que el personal genere una nueva clave temporal.
              </div>
            </form>
          )}

          {/* PASO 2: Pregunta secreta y nueva clave */}
          {paso === 2 && (
            <form onSubmit={handlePaso2} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paciente Identificado</p>
                <p className="text-xs font-black text-slate-900">{datosUsuario?.nombre}</p>
                <p className="text-[10px] text-slate-500 font-mono">C.I: {datosUsuario?.cedula}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Pregunta Secreta:</label>
                <p className="text-xs font-bold text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  {datosUsuario?.pregunta_seguridad}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Tu Respuesta Secreta *</label>
                <input
                  type="text"
                  required
                  placeholder="Escribe tu respuesta..."
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Nueva Clave *</label>
                  <input
                    type="password"
                    required
                    placeholder="Mín. 8 caracteres"
                    value={passwordNuevo}
                    onChange={(e) => setPasswordNuevo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Confirmar *</label>
                  <input
                    type="password"
                    required
                    placeholder="Repetir clave"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {cargando ? 'Restableciendo...' : 'Restablecer Clave'}
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: Éxito */}
          {paso === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-base font-black text-slate-900">¡Contraseña Restablecida!</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tu clave ha sido actualizada con éxito. Ya puedes iniciar sesión con tu nueva contraseña en la Billetera Digital de Salud.
              </p>
              <button
                type="button"
                onClick={reiniciarYCerrar}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
