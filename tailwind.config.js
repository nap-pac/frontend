/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './node_modules/flowbite/**/*.js',
    './static/**/*.js',
  ],
  safelist: [
    '-translate-x-64',
    'translate-x-64',
    'ml-64',
    'bg-dest-success',
    'bg-dest-warning',
    'bg-dest-danger',
  ],
  theme: {
    colors: {
      'dest-0': '#0A0A0A',
      'dest-10': '#0F0F0F',
      'dest-20': '#161616',
      'dest-nav-selected': '#061F43',
      'dest-nav-hover': '#002966',
      'dest-danger': '#D03838',
      'dest-warning': '#CE7C00',
      'dest-success': '#38D075',
      'dest-info': '#003ACE',
      'dest-border': '#363636',
      'dest-form': '#161616',
      'dest-form-border': '#232323',
      'transparent': 'transparent',
      'urgent': '#FF0000',
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

