/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBgSideBar: '#3399d7',
        customBgHeader:'#eff0f2'
      },
    },
  },
  plugins: [],
}