/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5f4',
          100: '#fde8e6',
          200: '#fbd5d1',
          300: '#f7b5ad',
          400: '#f2907f',
          500: '#E98074',
          600: '#e85a4f',
          700: '#d4422e',
          800: '#b13625',
          900: '#932f22',
        },
        background: {
          50: '#F9FAFB',
          100: '#d8c3a5',
          200: '#8d8e8a',
        },
        text: {
          main: '#061826',
          sub: '#4A4D4F',
          muted: '#8D9194',
          cancel: '#e1e3e5',
          invert: '#ffffff',
        },
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        dark: '#1e293b',
        light: '#f8fafc',
      },
    },
  },
  plugins: [],
};