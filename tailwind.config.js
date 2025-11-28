/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'tablet': '768px',
        'laptop': '1024px',
        'desktop': '1280px',
      },
      colors: {
        'neon-green': '#00FFAA',
        'neon-blue': '#00D4FF',
        'neon-purple': '#B026FF',
        'neon-yellow': '#FFE600',
        'deep-teal': '#012A2D',
        'lab-dark': '#0A0E1A',
        'lab-panel': '#0F1419',
        'lab-border': '#1A2332',
        'glow-green': 'rgba(0, 255, 170, 0.5)',
        'glow-blue': 'rgba(0, 212, 255, 0.5)',
        'glow-purple': 'rgba(176, 38, 255, 0.5)',
        'error-red': '#FF0055',
        'warning-orange': '#FF8C00',
        'success-green': '#00FF88',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 3px rgba(0, 255, 170, 0.4), 0 0 8px rgba(0, 255, 170, 0.2)',
        'neon-lg': '0 0 5px rgba(0, 255, 170, 0.5), 0 0 15px rgba(0, 255, 170, 0.3)',
        'neon-pink': '0 0 3px rgba(255, 0, 170, 0.4), 0 0 8px rgba(255, 0, 170, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-glow 3s ease-in-out infinite',
        'scanline': 'scanline 10s linear infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 10px rgba(0, 255, 170, 0.5), 0 0 20px rgba(0, 255, 170, 0.3)'
          },
          '50%': { 
            opacity: '0.7',
            boxShadow: '0 0 5px rgba(0, 255, 170, 0.3), 0 0 10px rgba(0, 255, 170, 0.2)'
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { 
            transform: 'translateY(10px)',
            opacity: '0'
          },
          'to': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
      },
    },
  },
  plugins: [],
}
