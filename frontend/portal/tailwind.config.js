/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── PALETA INSTITUCIONAL "HP" ──────────────────────────────
        // Referencia: Epic Systems EMR, Meditech Expanse, NHS Digital
        // Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
        hp: {
          950: '#05101f',   // Sidebar oscuro máximo (header del nav)
          900: '#0a1a35',   // Sidebar base — fondo principal del nav
          850: '#0d2040',   // Hover oscuro del sidebar
          800: '#112a52',   // Sección activa del nav
          700: '#1a3f78',   // Acento secundario
          600: '#1e54b7',   // Botones primarios (CTA principal)
          500: '#2d6ccf',   // Hover de botón primario
          400: '#5b8de0',   // Iconos activos en sidebar
          300: '#93b5ea',   // Texto secundario del sidebar
          200: '#c3d5f4',   // Separadores del sidebar
          100: '#dce8fb',   // Badge activo en sidebar
          50:  '#f0f6ff',   // Fondos de sección marcada en content
        },

        // ── SEMÁFORO CLÍNICO ───────────────────────────────────────
        // Sistema Manchester de Triaje → representación digital
        cl: {
          ok:       '#0d6e41',   // Verde profundo — estable, verificado
          'ok-bg':  '#d1fae5',   // Fondo verde suave
          warn:     '#b25a00',   // Ámbar — triaje III, espera
          'warn-bg':'#fef3c7',   // Fondo ámbar suave
          urgent:   '#991b1b',   // Rojo — emergencia, triaje I-II
          'urg-bg': '#fee2e2',   // Fondo rojo suave
          info:     '#0c4a6e',   // Azul — información general
          'inf-bg': '#e0f2fe',   // Fondo azul suave
          pac:      '#064e3b',   // Verde portal ciudadano (paciente)
          'pac-bg': '#ecfdf5',   // Fondo verde paciente
        },

        // ── NEUTROS CLÍNICOS (Escala cálida, no gris frío) ────────
        // Base de toda la interfaz médica: legible y no fatigante
        n: {
          950: '#09090b',   // Texto máximo contraste
          800: '#1c1917',   // Texto principal
          600: '#44403c',   // Texto secundario
          500: '#78716c',   // Texto muted / metadatos
          400: '#a8a29e',   // Placeholder de inputs
          300: '#d6d3d1',   // Bordes suaves
          200: '#e7e5e4',   // Bordes estándar
          100: '#f5f5f4',   // Fondo de filas / hover tabla
          50:  '#fafaf9',   // Fondo de página principal
          0:   '#ffffff',   // Fondo de tarjetas / blanco puro
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },

      boxShadow: {
        // Solo 3 niveles de profundidad — sin ruido visual
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'raised': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'modal':  '0 20px 40px -8px rgb(0 0 0 / 0.12), 0 8px 16px -4px rgb(0 0 0 / 0.06)',
        'inner-sm': 'inset 0 1px 2px rgb(0 0 0 / 0.05)',
        'none':   'none',
      },
    },
  },
  plugins: [],
}
