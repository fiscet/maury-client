/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf9f2',
          100: '#f5f0e1',
          200: '#ece1c3',
          300: '#e0cca0',
          400: '#c6b477', // Main Gold
          500: '#b09b5f',
          600: '#9b8650',
          700: '#7d6c41',
          800: '#645636',
          900: '#52472e',
          DEFAULT: '#c6b477',
          hover: '#b09b5f',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 12px -2px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 20px -6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
