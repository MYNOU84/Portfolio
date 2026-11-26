/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Every token reads a CSS variable (RGB channels) set in index.css,
           so the ◐ toggle can switch light / dark. Dark values are unchanged. */
        'deep-black': 'rgb(var(--c-deep-black) / <alpha-value>)',
        charcoal:     'rgb(var(--c-charcoal) / <alpha-value>)',
        'dark-grey':  'rgb(var(--c-dark-grey) / <alpha-value>)',
        /* Surface scale — replaces one black plus twenty opacities */
        'ink-800':    'rgb(var(--c-ink-800) / <alpha-value>)',
        'ink-700':    'rgb(var(--c-ink-700) / <alpha-value>)',
        'ink-600':    'rgb(var(--c-ink-600) / <alpha-value>)',
        gold:         'rgb(var(--c-gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--c-gold-light) / <alpha-value>)',
        beige:        'rgb(var(--c-beige) / <alpha-value>)',
        'white-warm': 'rgb(var(--c-white-warm) / <alpha-value>)',
        'grey-muted': 'rgb(var(--c-grey-muted) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
