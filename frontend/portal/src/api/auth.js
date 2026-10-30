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
      nombre: 'Héctor',
      apellido: 'Morales',
      nombre_completo: 'Dr. Héctor Morales',
      email: 'hmorales@perezdeleon.gob.ve',
      rol: 'medico',
      debe_cambiar_pass: false,
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
      nombre: 'María',
      apellido: 'González',
      nombre_completo: 'Adm. María González',
      email: 'mgonzalez@perezdeleon.gob.ve',
      rol: 'admision',
      debe_cambiar_pass: false,
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
      id: 'usr-sys-001',
      cedula: '12345678',
      nombre: 'Carlos',
      apellido: 'Medina',
      nombre_completo: 'Carlos Medina',
      email: 'admin@perezdeleon.gob.ve',
      rol: 'admin',
      debe_cambiar_pass: false,
    },
    permisos: ['admin:total'],
  },
  '30047210': {
    usuario: {
      id: 'usr-pac-001',
      cedula: '30047210',
      nombre: 'Jeremy',
      apellido: 'Acosta',
      nombre_completo: 'Jeremy Acosta',
      email: 'jacosta@paciente.perezdeleon.gob.ve',
      rol: 'paciente',
      debe_cambiar_pass: false,
      telefono: '0412-3334455',
    },
    permisos: [
      'paciente:perfil:leer',
      'paciente:perfil:actualizar',
      'paciente:recetas:leer',
      'paciente:historial:leer',
      'paciente:qr:mostrar',
      'paciente:privacidad:gestionar',
    ],
  },
  '29921654': {
    usuario: {
      id: 'usr-pac-002',
      cedula: '29921654',
      nombre: 'Eli',
      apellido: 'Araujo',
      nombre_completo: 'Eli Araujo',
      email: 'earaujo@paciente.perezdeleon.gob.ve',
      rol: 'paciente',
      debe_cambiar_pass: false,
      telefono: '0414-9988776',
    },
    permisos: [
      'paciente:perfil:leer',
      'paciente:perfil:actualizar',
      'paciente:recetas:leer',
      'paciente:historial:leer',
      'paciente:qr:mostrar',
      'paciente:privacidad:gestionar',
    ],
  },
}

export const login = async (cedula, password) => {
  const cedulaLimpia = String(cedula).replace(/\D/g, '')
  try {
    const response = await apiClient.post('/auth/login', {
      cedula: cedulaLimpia,
      password,
    })
    const data = getData(response)
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
    }
    return data
  } catch (err) {
    if (USUARIOS_DEMO[cedulaLimpia]) {
      const demoMatch = USUARIOS_DEMO[cedulaLimpia]
      const rol = demoMatch.usuario.rol
      localStorage.setItem('access_token', `demo-token-${rol}`)
      localStorage.setItem('usuario_demo', JSON.stringify(demoMatch))
      return {
        access_token: `demo-token-${rol}`,
        refresh_token: `demo-refresh-${rol}`,
        rol: rol,
        permisos: demoMatch.permisos,
        expires_in: 86400,
        message: 'Sesión de demostración iniciada (Modo Local)',
      }
    }
    throw err
  }
}

export const completarOnboarding = async (datos) => {
  try {
    const res = await apiClient.post('/auth/onboarding', datos)
    return getData(res)
  } catch (err) {
    const rawDemo = localStorage.getItem('usuario_demo')
    if (rawDemo) {
      const parsed = JSON.parse(rawDemo)
      if (parsed.usuario) {
        parsed.usuario.debe_cambiar_pass = false
        parsed.usuario.telefono = datos.telefono
        parsed.usuario.email = datos.email
      }
      localStorage.setItem('usuario_demo', JSON.stringify(parsed))
      return { debe_cambiar_pass: false }
    }
    throw err
  }
}

export const recuperarPasswordPaso1 = async (cedula, fecha_nacimiento) => {
  try {
    const res = await apiClient.post('/auth/recuperar-paso1', { cedula, fecha_nacimiento })
    return getData(res)
  } catch (err) {
    if (cedula === '30047210' || cedula === '29921654') {
      return {
        cedula,
        nombre: cedula === '30047210' ? 'Jeremy Acosta' : 'Eli Araujo',
        pregunta_seguridad: '¿Cuál es el nombre de su primer colegio o liceo?',
      }
    }
    throw err
  }
}

export const recuperarPasswordPaso2 = async (cedula, respuesta_seguridad, password_nuevo) => {
  try {
    const res = await apiClient.post('/auth/recuperar-paso2', { cedula, respuesta_seguridad, password_nuevo })
    return getData(res)
  } catch (err) {
    if (cedula === '30047210' || cedula === '29921654') {
      return { message: 'Contraseña restablecida con éxito (Modo Demo).' }
    }
    throw err
  }
}

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } catch (_) {}
  localStorage.removeItem('access_token')
  localStorage.removeItem('usuario')
  localStorage.removeItem('usuario_demo')
}

export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me')
    return getData(response)
  } catch (err) {
    const rawDemo = localStorage.getItem('usuario_demo')
    if (rawDemo) {
      return JSON.parse(rawDemo)
    }
    const token = localStorage.getItem('access_token')
    if (token?.startsWith('demo-token-')) {
      if (token.includes('paciente')) return USUARIOS_DEMO['30047210']
      if (token.includes('admision')) return USUARIOS_DEMO['25333444']
      if (token.includes('admin'))    return USUARIOS_DEMO['12345678']
      return USUARIOS_DEMO['18765432']
    }
    throw err
  }
}
