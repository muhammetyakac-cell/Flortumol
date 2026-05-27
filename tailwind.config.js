/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Rose 500 equivalent
          600: '#e11d48', // Rose 600
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        accent: {
          500: '#f97316', // Orange 500
          600: '#ea580c', // Orange 600
        }
      }
    },
  },
  plugins: [],
}