// ============================================================
//  src/layouts/MedicoLayout.jsx
//  Espacio de Trabajo — Estación Médica Clínica
//  Acento: Azul Clínico #2563EB
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import BaseHospitalShell from './BaseHospitalShell'

const COLOR_ACENTO = '#2563EB'

const NAV_MEDICO = [
  {
    titulo: 'Guardia Clínica',
    items: [
      {
        label: 'Estación de Guardia',
        to: '/medico/dashboard',
        badge: 'LIVE',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
          </svg>
        ),
      },
    ],
  },
  {
    titulo: 'Registros Clínicos',
    items: [
      {
        label: 'Historias Médicas',
        to: '/medico/historias',
        badge: 'M2',
        badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: 'Notas de Evolución',
        to: '/medico/notas',
        badge: 'M2',
        badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
    ],
  },
  {
    titulo: 'Prescripciones',
    items: [
      {
        label: 'Récipes Digitales & QR',
        to: '/medico/recetas',
        badge: 'M5',
        badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
  },
]

export default function MedicoLayout() {
  return (
    <BaseHospitalShell
      navGroups={NAV_MEDICO}
      colorAccento={COLOR_ACENTO}
      rolDisplay="Médico de Guardia"
      servicioActivo="Guardia Médica 24H"
    />
  )
}
