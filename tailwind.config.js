const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        switzer: ['Switzer', ...defaultTheme.fontFamily.sans],
      },

      colors: {
        brand: {
          blue: '#2f79ea',
        },
        dark: {
          background: {
            primary: '#0c0c0e',
            secondary: '#131313',
            elevation: '#1c1c1c',
          },
        },
      },

      backgroundImage: {
        'playlist-1': "url('/background-7.jpg')",
        'playlist-2': "url('/background-8.jpg')",
        'playlist-3': "url('/background-9.jpg')",
        'playlist-4': "url('/background-10.jpg')",
      },
    },
  },
  plugins: [
    ({ addUtilities, theme }) => {
      addUtilities({
        '.cover-sm': {
          borderRadius: '4px',
          width: '48px',
          height: '48px',
        },
      });
    },
    require('tailwind-scrollbar'),
  ],
};
