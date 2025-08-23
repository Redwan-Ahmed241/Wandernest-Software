const themeConfig = require('./tailwind.theme.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: themeConfig.theme,
  plugins: [],
}
