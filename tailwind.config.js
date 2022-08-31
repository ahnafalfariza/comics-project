const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BBDB',
        comic: {
          gray: {
            primary: '#9B9B9B',
            secondary: '#F4F4F5',
            tertiary: '#919191',
          },
        },
        background: '#FFFFFF',
        blueGray: colors.slate,
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
      },
    },
    fontFamily: {
      title: ['Montserrat'],
      body: ['Montserrat'],
    },
  },
  variants: {
    margin: ['responsive', 'hover'],
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
