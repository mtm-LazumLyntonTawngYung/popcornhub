/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'popcorn-red': {
          50: '#fff5f5',
          100: '#fee2e2',
          300: '#fca5a5',
          500: '#ef4444',
          700: '#b91c1c',
        },
        'popcorn-ink': '#111827',
        'neutral-bg': '#0f172a',
      },
    },
  },
  plugins: [],
}