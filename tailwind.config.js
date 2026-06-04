/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'deep-black': '#050505',
        charcoal: '#111111',
        'dark-grey': '#1C1C1C',
        gold: '#C9982C',
        beige: '#D4B87C',
        'white-warm': '#F5F1E8',
        'grey-muted': '#A8A8A8',
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
