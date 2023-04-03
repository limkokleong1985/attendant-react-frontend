/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit', // enable just-in-time compiler for faster build times
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // enable dark mode
  theme: {
    extend:{
      colors:{
        primary:{
          900:'#F27405',
          800:'#F58130',
          700:'#F5914D',
          600:'#F59D6B'
        },
        secondary:{
          900:'#731702',
          800:'#752513',
          700:'#752D1F',
          600:'#753D33'
        },
        third :{
          900:'#03A678',
          800:'#1EA87D',
          700:'#3BA885',
          600:'#63A88A'
        },
        fourth :{
          900:'#02735E',
          800:'#1C7561',
          700:'#2E7569',
          600:'#447571'
        },
        fifth : {
          900:'#014040',
          800:'#124242',
          700:'#224042',
          600:'#283A42'
        },
        gray:{
          900:'#202225',
          800:'#2f3136',
          700:'#36393f',
          600:'#4f545c',
          400:'#d4d7dc',
          300:'#e3e5e8',
          200:'#ebedef',
          100:'#f2f3f5'

        }
      }
    }
  },
  variants: {
    
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ]
}
