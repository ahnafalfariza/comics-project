const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#1300ba',
        background: '#18162b',
        blueGray: colors.blueGray,
      },
    },
    fontFamily: {
      title: ['Poppins'],
      body: ['Poppins'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
