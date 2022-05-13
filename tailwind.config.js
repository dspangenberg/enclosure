const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './src/**/*.vue',
    './src/**/*.js'
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Clear Sans', ...defaultTheme.fontFamily.sans]
      },
      fontWeight: {
        hairline: 100,
        'extra-light': 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 500,
        bold: 700,
        extrabold: 800,
        'extra-bold': 800,
        black: 900
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        16: 'repeat(16, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26'
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24'
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'ping-slow': 'ping 5s cubic-bezier(1, 1, 0.2, 1) infinite'
      },
      zIndex: {
        100: '1000'
      },
      fontSize: {
        xxs: ['0.67rem', '0.6rem'],
        xs: ['0.74rem', '0.9rem'],
        sm: ['0.8rem', '1.0rem'],
        base: ['0.9rem', '1.10rem'],
        lg: ['1.0rem', '1.30rem'],
        xl: ['1.1rem', '1.40rem']
      },
      fill: (theme) => theme('colors')
    },
    strokeWidth: {
      1.5: '1.2'
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      fill: ['focus', 'group-hover'],
      display: ['group-hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addVariant, e }) {
      addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-first${separator}${className}`)}:not(:first-child)`
        })
      })
    }),
    plugin(function ({ addVariant, e }) {
      addVariant('not-last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-last${separator}${className}`)}:not(:last-child)`
        })
      })
    })
  ]
}
