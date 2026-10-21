// ============================================================
//  src/layouts/AdmisionLayout.jsx
//  Espacio de Trabajo — Portal de Admisión & Triaje
//  Acento: Ámbar Institucional #D97706
//  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import BaseHospitalShell from './BaseHospitalShell'

const COLOR_ACENTO = '#D97706'

const NAV_ADMISION = [
  {
    titulo: 'Estación de Admisión',
    items: [
      {
        label: 'Panel de Admisión',
        to: '/admision/dashboard',
        badge: 'LIVE',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
          </svg>
        ),
      },
      {
        label: 'Admisión · Formato 052',
        to: '/admision/pacientes',
        badge: 'M1',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        ),
      },
    ],
  },
  {
    titulo: 'Epidemiología',
    items: [
      {
        label: 'Morbilidad MPPS',
        to: '/admision/morbilidad',
        badge: 'M6',
        badgeClass: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
]

export default function AdmisionLayout() {
  return (
    <BaseHospitalShell
      navGroups={NAV_ADMISION}
      colorAccento={COLOR_ACENTO}
      rolDisplay="Admisión & Triaje"
      servicioActivo="Ventanilla de Admisión"
    />
  )
}
