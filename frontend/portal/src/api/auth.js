// ============================================================
//  src/api/auth.js — Servicios de Autenticación
//  Conecta con los endpoints de /api/v1/auth/
//  Incluye fallback offline/demo para pruebas locales inmediatas
// ============================================================

import apiClient, { getData, getMsg } from './client'

const USUARIOS_DEMO = {
  '18765432': {
    usuario: {
      id: 'usr-med-001',
      cedula: '18765432',
      nombres: 'Héctor',
      apellidos: 'Morales',
      email: 'hmorales@hospitalpetare.gob.ve',
      rol: 'medico',
      es_personal_salud: true,
      hospital: 'Hospital Periférico de Petare "Dr. Ricardo Baquero González"',
    },
    permisos: [
      'paciente:leer', 'paciente:crear', 'paciente:actualizar',
      'historia:leer', 'historia:crear', 'historia:actualizar',
      'triaje:leer', 'triaje:crear',
      'recipe:leer', 'recipe:crear',
      'receta:emitir', 'receta:leer',
      'morbilidad:generar', 'morbilidad:leer',
      'teleasistencia:leer', 'teleasistencia:atender',
      'reporte:leer',
    ],
  },
  '25333444': {
    usuario: {
      id: 'usr-adm-001',
      cedula: '25333444',
      nombres: 'María',
      apellidos: 'González',
      email: 'mgonzalez@hospitalpetare.gob.ve',
      rol: 'admision',
      es_personal_salud: true,
      hospital: 'Hospital Periférico de Petare "Dr. Ricardo Baquero González"',
    },
    permisos: [
      'paciente:leer', 'paciente:crear', 'paciente:actualizar',
      'historia:leer',
      'triaje:leer', 'triaje:crear',
      'reporte:leer',
    ],
  },
  '12345678': {
    usuario: {
      id: 'usr-adm-000',
      cedula: '12345678',
      nombres: 'Carlos',
      apellidos: 'Medina',
      email: 'admin@hospitalpetare.gob.ve',
      rol: 'admin',
      es_personal_salud: true,
      hospital: 'Hospital Periférico de Petare "Dr. Ricardo Baquero González"',
    },
    permisos: [
      'paciente:leer', 'paciente:crear', 'paciente:actualizar', 'paciente:eliminar',
      'historia:leer', 'historia:crear', 'historia:actualizar',
      'triaje:leer', 'triaje:crear',
      'recipe:leer', 'recipe:crear', 'receta:emitir', 'receta:leer',
      'morbilidad:generar', 'morbilidad:leer',
      'teleasistencia:leer', 'teleasistencia:atender',
      'reporte:leer', 'admin:acceso',
    ],
  },
  '30047210': {
    usuario: {
      id: 'usr-pac-001',
      cedula: '30047210',
      nombres: 'Jeremy',
      apellidos: 'Acosta',
      email: 'jeremy.acosta@correo.com',
      rol: 'paciente',
      es_personal_salud: false,
    },
    permisos: [
      'paciente:ver_propio',
      'historia:ver_propio',
      'recipe:ver_propio',
      'carnet:ver_propio',
    ],
  },
}

/**
 * Iniciar sesión con cédula y contraseña.
 * Si el backend está offline, permite acceso demostrativo con las cuentas de prueba.
 * @returns {{ tokens, rol, permisos, message }}
 */
export const login = async (cedula, password) => {
  const cedulaLimpia = String(cedula).replace(/\D/g, '')

  try {
    const response = await apiClient.post('/auth/login', { cedula: cedulaLimpia, password })
    const data = getData(response)
    localStorage.removeItem('usuario_demo')
    return {
      access_token:  data.access_token,
      refresh_token: data.refresh_token,
      rol:           data.rol,
      permisos:      data.permisos,
      expires_in:    data.expires_in,
      message:       getMsg(response),
    }
  } catch (err) {
    // Si no hay respuesta del servidor (backend offline), usar fallback demo
    if (!err.response) {
      const demoMatch = USUARIOS_DEMO[cedulaLimpia] || USUARIOS_DEMO['18765432']
      const rol = demoMatch.usuario.rol
      localStorage.setItem('usuario_demo', JSON.stringify(demoMatch))
      return {
        access_token:  `demo-token-${rol}`,
        refresh_token: `demo-refresh-${rol}`,
        rol:           rol,
        permisos:      demoMatch.permisos,
        expires_in:    86400,
        message:       'Sesión de demostración iniciada (Modo Local)',
      }
    }
    throw err
  }
}

/**
 * Cerrar sesión — revoca el token JWT en el servidor.
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } catch (_) {}
  localStorage.removeItem('access_token')
  localStorage.removeItem('usuario')
  localStorage.removeItem('usuario_demo')
}

/**
 * Obtener el perfil del usuario autenticado.
 * @returns {{ usuario, permisos }}
 */
export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me')
    return getData(response)
  } catch (err) {
    // Si backend offline o sesión demo
    const rawDemo = localStorage.getItem('usuario_demo')
    if (rawDemo) {
      return JSON.parse(rawDemo)
    }
    const token = localStorage.getItem('access_token')
    if (token?.startsWith('demo-token-')) {
      const isPaciente = token.includes('paciente')
      return isPaciente ? USUARIOS_DEMO['30047210'] : USUARIOS_DEMO['18765432']
    }
    throw err
  }
}

