// ============================================================
//  src/components/seguridad/ModalSeguridadOnboarding.jsx
//  DISEÑO: "Cosmos Medical" — Onboarding Obligatorio de Seguridad
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { completarOnboarding } from '../../api/auth'

const PREGUNTAS_SUGERIDAS = [
  '¿Cuál es el nombre de su primer colegio o liceo?',
  '¿En qué hospital o maternidad nació?',
  '¿Cuál es el segundo nombre de su abuela materna?',
  '¿Cuál fue el nombre de su primera mascota de la infancia?',
  '¿Cuál es la calle o sector donde creció de niño/a?',
]

export default function ModalSeguridadOnboarding({ isOpen, onCompletado }) {
  const { usuario } = useAuth()
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [telefono, setTelefono] = useState(usuario?.telefono || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [pregunta, setPregunta] = useState(PREGUNTAS_SUGERIDAS[0])
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
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

    if (!respuesta.trim() || respuesta.trim().length < 3) {
      setError('Por favor proporcione una respuesta secreta válida (mínimo 3 caracteres).')
      return
    }

    setCargando(true)
    try {
      await completarOnboarding({
        password_nuevo: passwordNuevo,
        telefono,
        email,
        pregunta_seguridad: pregunta,
        respuesta_seguridad: respuesta,
      })
      onCompletado()
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al completar el registro de seguridad.'
      setError(msg)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera de Seguridad */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
                Activación Obligatoria · Primer Acceso
              </span>
              <h3 className="text-lg font-black mt-1 leading-tight">Configura tu Seguridad Digital</h3>
              <p className="text-xs text-emerald-100/80">
                Hospital Periférico de Petare · Billetera del Paciente
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            Bienvenido/a, <strong className="text-slate-900">{usuario?.nombre_completo}</strong> (C.I: {usuario?.cedula}). 
            Has ingresado con tu <strong>clave provisional de admisión</strong>. Para proteger tus datos médicos y permitirte recuperar el acceso si olvidas tu clave, vincula tu información a continuación:
          </p>

          {/* Bloque 1: Nueva Contraseña */}
          <div className="space-y-3 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              1. Nueva Contraseña Definitiva
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="password"
                  required
                  placeholder="Nueva contraseña"
                  value={passwordNuevo}
                  onChange={(e) => setPasswordNuevo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  placeholder="Confirmar contraseña"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Mínimo 8 caracteres, con al menos 1 mayúscula y 1 número.</p>
          </div>

          {/* Bloque 2: Contacto Obligatorio */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              2. Vinculación de Contacto para Notificaciones & Recuperación
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Teléfono Celular *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 0412-1234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="paciente@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Bloque 3: Pregunta de Seguridad */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              3. Pregunta Secreta para Recuperación Autónoma
            </label>
            <div>
              <select
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {PREGUNTAS_SUGERIDAS.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                required
                placeholder="Escribe tu respuesta secreta aquí..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Recuerda bien esta respuesta. Te permitirá cambiar tu clave si la olvidas sin tener que venir al hospital.
              </p>
            </div>
          </div>

          {/* Botón de Activación */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {cargando ? (
                <span>Guardando y verificando...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Activar Mi Billetera de Salud</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
