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
        // Muted botanical olive for restrained brand accents
        'brand-forest': {
          DEFAULT: '#46513D',
          deep: '#171814',
          dark: '#23251E',
          light: '#5D6248',
          muted: '#74785B',
          accent: '#8E9069',
        },
        // Warm Organic Sand / Alabaster Plaster
        'brand-sand': {
          DEFAULT: '#F4EFE6',
          light: '#FAF7F2',
          card: '#EFE8DC',
          dark: '#DFD7C4',
          shadow: '#D5CBB8',
        },
        // Brushed Champagne Gold & Warm Brass Accents
        'brand-brass': {
          DEFAULT: '#D4AF37',
          light: '#F5E6B8',
          champagne: '#C8A97E',
          dark: '#B38B2B',
        },
        'bhumivera-green': '#344034',
        'bhumivera-gold': '#D4AF37',
        'bhumivera-silver': '#E2E8F0',
        'bhumivera-black': '#11120F',
        'two-tone-dark': '#11120F',
        'two-tone-slate': '#1B1C18',
        'two-tone-navy': '#151612',
        'two-tone-card': '#22231E',
        'two-tone-card-light': '#2B2C24',
        'two-tone-white': '#FFFFFF',
        'two-tone-silver': '#E2E8F0',
        gold: {
          50: '#FEFDF5',
          100: '#FBF5B7',
          200: '#FAEEC7',
          300: '#F5DF97',
          400: '#E5C058',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#996515',
        },
        silver: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        },
        alabaster: '#FAF7F2',
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
