/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        echonav: {
          bg: '#F3F8F2',
          card: '#FFFFFF',
          forest: '#0B3821',
          'forest-light': '#14532D',
          emerald: '#16A34A',
          'emerald-light': '#E8F5E9',
          mint: '#D8EED8',
          'mint-subtle': '#EEF7EE',
          muted: '#6B8777',
          border: '#E3EDE4',
          'danger-bg': '#FDE8E8',
          'danger-text': '#B91C1C',
          'warning-bg': '#FEF3C7',
          'warning-text': '#D97706',
          'safe-bg': '#DCFCE7',
          'safe-text': '#15803D',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(11, 56, 33, 0.05), 0 1px 3px -1px rgba(11, 56, 33, 0.03)',
        'nav': '0 -4px 16px rgba(11, 56, 33, 0.04)',
      }
    },
  },
  plugins: [],
};
