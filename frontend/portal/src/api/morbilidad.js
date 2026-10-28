// ============================================================
//  src/api/morbilidad.js — Servicios API: Morbilidad y Control Médico (M3)
//  Instituto Municipal de Salud "Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import apiClient, { getData } from './client'

/**
 * Registrar una atención clínica en el libro de morbilidad
 */
export const registrarActividadMorbilidad = async (datos) => {
  const res = await apiClient.post('/morbilidad/', datos)
  return getData(res)
}

/**
 * Chequeo por Día: Obtiene todas las atenciones y estadísticas agregadas para una fecha
 */
export const consultarMorbilidadPorDia = async (params = {}) => {
  const res = await apiClient.get('/morbilidad/dia', { params })
  return getData(res)
}

/**
 * Chequeo por Cédula: Consulta el historial de atenciones de un paciente
 */
export const consultarMorbilidadPorPaciente = async (cedula) => {
  const cedulaLimpia = String(cedula).replace(/\D/g, '')
  const res = await apiClient.get(`/morbilidad/paciente/${cedulaLimpia}`)
  return getData(res)
}

/**
 * Control de Actividad del Doctor: Resumen de productividad médica en una fecha
 */
export const consultarResumenDoctor = async (params = {}) => {
  const res = await apiClient.get('/morbilidad/doctor/resumen', { params })
  return getData(res)
}
