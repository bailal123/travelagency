/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './mobile-optimized.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        'primary-dark': '#1e40af',
        secondary: '#fbbf24',
        accent: '#10b981',
        dark: '#1f2937',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      }
    }
  },
  plugins: []
};