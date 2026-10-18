export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        royal: ['"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        'bhumivera-green': '#080d14',
        'bhumivera-gold': '#d4af37',
        'bhumivera-silver': '#e2e8f0',
        'bhumivera-black': '#05070a',
        'two-tone-dark': '#070a0e',
        'two-tone-slate': '#0d1520',
        'two-tone-navy': '#0b131e',
        'two-tone-card': '#111b27',
        'two-tone-card-light': '#172433',
        'two-tone-white': '#ffffff',
        'two-tone-silver': '#e2e8f0',
        gold: {
          50: '#fefdf5',
          100: '#fbf5b7',
          200: '#faeec7',
          300: '#f5df97',
          400: '#e5c058',
          500: '#d4af37',
          600: '#b8860b',
          700: '#996515',
        },
        silver: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
        },
        alabaster: '#070a0e',
      },
      animation: {
        'fluid-drift': 'fluid-drift 20s ease-in-out infinite',
      },
      keyframes: {
        'fluid-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        }
      }
    },
  },
  plugins: [],
};
