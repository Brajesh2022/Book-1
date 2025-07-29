/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kindle: {
          // Kindle's signature warm colors
          cream: '#faf7f0',
          paper: '#f5f2e8',
          sepia: '#f4f1e8',
          charcoal: '#232f3e',
          blue: '#007eb9',
          orange: '#ff9900',
          lightgray: '#e6e6e6',
          darkgray: '#565959',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'kindle': ['Amazon Ember', 'system-ui', '-apple-system', 'sans-serif'],
        'reading': ['Bookerly', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'book-hover': 'bookHover 0.2s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bookHover: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'book': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'book-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'kindle': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'kindle': '8px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}