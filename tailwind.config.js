/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          50: '#f0f4ff',
          100: '#e6edff',
          500: '#8884d8',
          600: '#7c7bcc',
          700: '#6366f1',
        }
      }
    },
  },
  plugins: [],
}