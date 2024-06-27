/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e94f2b',
        secondary: '#C2EDFF',
        neutral: '#EDEDED',
        transparent: 'transparent',
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
