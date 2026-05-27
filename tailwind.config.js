/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {

      animation: {

        float: "float 6s ease-in-out infinite",

        slowspin: "slowspin 25s linear infinite",

        glow: "glow 3s ease-in-out infinite",

        gridmove: "gridmove 18s linear infinite",

        pulsefast: "pulsefast 2s ease-in-out infinite",

        beam: "beam 8s linear infinite",

        flicker: "flicker 3s infinite",

      },

      keyframes: {

        float: {
          "0%, 100%": {
            transform: "translateY(0px)"
          },

          "50%": {
            transform: "translateY(-20px)"
          }
        },

        slowspin: {
          "0%": {
            transform: "rotate(0deg)"
          },

          "100%": {
            transform: "rotate(360deg)"
          }
        },

        glow: {
          "0%, 100%": {
            opacity: "0.4",
            transform: "scale(1)"
          },

          "50%": {
            opacity: "1",
            transform: "scale(1.1)"
          }
        },

        gridmove: {
          "0%": {
            transform: "translateY(0px)"
          },

          "100%": {
            transform: "translateY(70px)"
          }
        },

        pulsefast: {
          "0%, 100%": {
            opacity: "0.3"
          },

          "50%": {
            opacity: "1"
          }
        },

        beam: {
          "0%": {
            transform: "translateX(-120%)"
          },

          "100%": {
            transform: "translateX(120%)"
          }
        },

        flicker: {

          "0%, 18%, 22%, 25%, 53%, 57%, 100%": {
            opacity: "1"
          },

          "20%, 24%, 55%": {
            opacity: "0.4"
          }
        }

      }

    }
  },

  plugins: []
}