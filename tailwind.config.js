/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Static palette ── */
        navy: {
          950: '#060F20',
          900: '#0C1C35',
          800: '#122040',
          700: '#1A2D54',
          600: '#243566',
          500: '#2E4080',
          400: '#3D5499',
        },
        gold: {
          DEFAULT: '#9B7D3A',
          200: '#D4B870',
          300: '#C4A455',
          500: '#9B7D3A',
          600: '#7A6030',
          700: '#5C4820',
        },
        burgundy: {
          DEFAULT: '#7B1C2B',
          400: '#A0293C',
          500: '#7B1C2B',
          600: '#5E1520',
          700: '#430F17',
        },
        ivory:     '#FAF9F6',
        parchment: '#F0EBE1',
        cream:     '#E8E0D0',
        /* ── Semantic theme tokens (CSS variables) ── */
        muted:       'rgb(var(--t-muted) / <alpha-value>)',
        't-bg':      'rgb(var(--t-bg) / <alpha-value>)',
        't-surface': 'rgb(var(--t-surface) / <alpha-value>)',
        't-surface2':'rgb(var(--t-surface-2) / <alpha-value>)',
        't-text':    'rgb(var(--t-text) / <alpha-value>)',
        't-muted':   'rgb(var(--t-muted) / <alpha-value>)',
        't-gold':    'rgb(var(--t-gold) / <alpha-value>)',
        't-burgundy':'rgb(var(--t-burgundy) / <alpha-value>)',
        't-border':  'rgb(var(--t-border) / <alpha-value>)',
      },
      fontFamily: {
        serif:   ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'ultra':   '0.3em',
        'extreme': '0.45em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold':   'linear-gradient(135deg, #C4A455 0%, #D4B870 50%, #9B7D3A 100%)',
      },
      boxShadow: {
        'gold-sm': '0 2px 16px rgba(155,125,58,0.10)',
        'gold':    '0 4px 32px rgba(155,125,58,0.16)',
        'gold-lg': '0 8px 56px rgba(155,125,58,0.20)',
        'card':    '0 1px 4px rgba(12,28,53,0.06), 0 4px 24px rgba(12,28,53,0.08)',
        'card-hover': '0 4px 12px rgba(12,28,53,0.08), 0 12px 40px rgba(12,28,53,0.12)',
        'nav':     '0 1px 0 rgba(12,28,53,0.08), 0 4px 24px rgba(12,28,53,0.06)',
      },
    },
  },
  plugins: [],
}
