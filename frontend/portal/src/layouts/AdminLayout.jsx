// ============================================================
//  src/layouts/AdminLayout.jsx
//  Espacio de Trabajo — Consola Administrativa / Dirección
//  Acento: Violeta Gestión #7C3AED
//  Instituto Municipal de Salud Ana Francisca Pérez de León
//  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
// ============================================================

import BaseHospitalShell from './BaseHospitalShell'

const COLOR_ACENTO = '#7C3AED'

const NAV_ADMIN = [
  {
    titulo: 'Consola Principal',
    items: [
      {
        label: 'Panel Administrativo',
        to: '/admin/dashboard',
        badge: 'LIVE',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        ),
      },
    ],
  },
  {
    titulo: 'Gestión del Sistema',
    items: [
      {
        label: 'Gestión de Usuarios',
        to: '/admin/usuarios',
        badge: 'SYS',
        badgeClass: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        label: 'Auditoría Inmutable',
        to: '/admin/auditoria',
        badge: 'SEC',
        badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
  },
]

export default function AdminLayout() {
  return (
    <BaseHospitalShell
      navGroups={NAV_ADMIN}
      colorAccento={COLOR_ACENTO}
      rolDisplay="Administrador del Sistema"
      servicioActivo="Dirección & Control General"
    />
  )
}
