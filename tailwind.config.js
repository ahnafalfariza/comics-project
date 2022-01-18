const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#00A8C5',
        background: '#ffffff',
        blueGray: colors.blueGray,
        electricLime: {
          DEFAULT: '#C6FF00',
          50: '#F9FFE5',
          100: '#F4FFCC',
          200: '#E8FF99',
          300: '#DDFF66',
          400: '#D1FF33',
          500: '#C6FF00',
          600: '#9ECC00',
          700: '#779900',
          800: '#4F6600',
          900: '#283300',
        },
      },
    },
    fontFamily: {
      title: ['Poppins'],
      body: ['Poppins'],
    },
  },
  variants: {
    margin: ['responsive', 'hover'],
    extend: {},
  },
  plugins: [],
}
