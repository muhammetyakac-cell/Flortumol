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
        // Yumuşak, organik Şeftali ve Mercan tonları
        brand: {
          50: '#fffbf7',  // En açık şeftali / kırık beyaz arka planlar için
          100: '#ffeedd',
          200: '#ffd4b3',
          300: '#ffb988',
          400: '#ff985c',
          500: '#ff7e40',  // Ana Şeftali / Turuncu
          600: '#e6652e',
          700: '#bf4e1e',
          800: '#993a15',
          900: '#7d3013',
        },
        accent: {
          400: '#ff6b81',  // Açık Mercan / Pembe
          500: '#ff4757',  // Ana Mercan / Kırmızı
          600: '#e03a49',
        },
        surface: {
          50: '#faf9f8',  // Sıcak, organik kırık beyaz (bg-white yerine)
          100: '#f5f4f2',
          200: '#e8e6e1',
          800: '#44403c',  // Sıcak koyu gri
          900: '#292524',  // Neredeyse siyah, ama sıcak (text-slate-900 yerine)
        }
      }
    },
  },
  plugins: [],
}