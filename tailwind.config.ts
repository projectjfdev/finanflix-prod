import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        groteskSharpBold10: ['var(--font-grotesksharpboldten)'],
        groteskLight: ['var(--font-grotesklight)'],
        grotesk20: ['var(--font-grotesktwenty)'],
        groteskMedium20: ['var(--font-groteskmediumtwenty)'],
        groteskBook20: ['var(--font-groteskBooktwenty)'],
        grotesk25: ['var(--font-grotesktwentyfive)'],
        groteskBold15: ['var(--font-groteskBold15)'],
        groteskBold10: ['var(--font-groteskBold10)'],
        poppins: ['var(--font-poppins)'],
        custom: ['"Euclid Circular A"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        backgroundW: 'hsl(var(--backgroundW))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        cardW: {
          DEFAULT: 'hsl(var(--cardW))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#F03300',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#702DFF',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      screens: {
        xs: '350px',
        xs2: '380px',
        xsm: '400px',
        sm: '500px',
        sm2: '550px',
        mmd: '950px',
        xxl: '1670px',
        xxxl: '1700px',
        mxxl: '1910px', // Aquí agregas tu breakpoint
        'max-sm': { max: '499px' },
      },
      keyframes: {
        countdown: {
          '0%': { strokeDashoffset: '439.8' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
