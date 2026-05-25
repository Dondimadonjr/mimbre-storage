import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F0',
        coffee: '#8B5E3C',
        'coffee-dark': '#6F472C',
        'text-dark': '#1F2A24',
        'text-secondary': '#5B655F',
        border: 'rgba(0,0,0,.12)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '88': '22rem',
        '100': '25rem',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.1)',
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        hover: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
