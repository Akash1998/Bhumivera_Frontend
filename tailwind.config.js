export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
        editorial: ['Cormorant Garamond', 'Georgia', 'serif'],
        royal: ['Cinzel', 'serif'],
      },
      colors: {
        'bhumivera-green': '#0c1712',
        'bhumivera-gold': '#d4af37',
        'bhumivera-silver': '#e2e8f0',
        'bhumivera-black': '#050807',
        olive: {
          50: '#f4f5f0',
          100: '#e1e4d1',
          500: '#808000',
          600: '#6b6b00',
          700: '#555500',
          800: '#3d3d00',
        },
        alabaster: '#0c1712',
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
