/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      colors: {
        brand: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-dark': '#7C3AED',
          teal: '#14B8A6',
          'teal-light': '#2DD4BF',
          'teal-dark': '#0D9488',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)',
        'gradient-brand-hover': 'linear-gradient(135deg, #7C3AED 0%, #0D9488 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'brand': '0 10px 40px -10px rgba(139, 92, 246, 0.4)',
        'brand-lg': '0 20px 60px -15px rgba(139, 92, 246, 0.5)',
        'teal': '0 10px 40px -10px rgba(20, 184, 166, 0.4)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    }
  },
  darkMode: 'class',
  plugins: [],
  safelist: [
    // Backgrounds
    {
      pattern: /^(bg|hover:bg|dark:bg|dark:hover:bg)-(red|green|yellow|fuchsia|orange)-(100|400|500|600|800)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    // Borders
    {
      pattern: /^(border|dark:border)-(red|green|yellow|fuchsia|orange)-(300|700)/,
      variants: ['dark'],
    },
    // Text
    {
      pattern: /^(text|dark:text)-(red|green|yellow|fuchsia|orange)-(100|600)/,
      variants: ['dark'],
    }
    // Sizes
    // {
    //   pattern: /w-(6|8)/,
    // },
    // {
    //   pattern: /h-(6|8)/,
    // }
  ],
}