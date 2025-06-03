module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-4px)' },
          '75%': { transform: 'translateY(4px)' },
        },
        shakePause: {
          '0%, 100%': { transform: 'translateY(0)' },
          '5%': { transform: 'translateX(-4px)' },
          '10%': { transform: 'translateX(4px)' },
          '15%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        shake: 'shake 1.5s ease-in-out infinite',
        shakePause: 'shakePause 4s ease-in-out infinite', // shake quickly, rest longer
      },
    },
  },
  plugins: [],
}
