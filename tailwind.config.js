/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite/**/*.js", "./src/**/*.{js,ts,jsx,tsx}", "./*.html"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}

