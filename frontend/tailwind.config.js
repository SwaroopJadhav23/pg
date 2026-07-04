import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif']
      },
      fontSize: {
        display: ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        h1: ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        h3: ['1.375rem', { lineHeight: '1.25', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '600' }]
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        lnd: {
          primary: '#0F766E',
          secondary: '#14B8A6',
          accent: '#34D399',
          dark: '#0F172A',
          'dark-teal': '#134E4A',
          bg: '#F8FAFC',
          mint: '#F0FDFA',
          'mint-soft': '#ECFDF5',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B'
        },
        success: { DEFAULT: '#22C55E', light: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        brand: {
          primary: '#0F766E',
          accent: '#14B8A6',
          dark: '#0F172A',
          navy: '#0F172A',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          secondary: '#F0FDFA',
          success: '#22C55E',
          warning: '#F59E0B'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: '24px',
        pill: '999px'
      },
      boxShadow: {
        card: '0 15px 40px rgba(15, 118, 110, 0.12)',
        'card-hover': '0 20px 50px rgba(15, 118, 110, 0.18)',
        float: '0 25px 60px rgba(15, 23, 42, 0.12)',
        glass: '0 8px 32px rgba(15, 23, 42, 0.08)',
        glow: '0 0 40px rgba(20, 184, 166, 0.35)'
      },
      backgroundImage: {
        'lnd-gradient': 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
        'lnd-gradient-soft': 'linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 50%, #FFFFFF 100%)',
        'lnd-hero': 'radial-gradient(ellipse 80% 60% at 50% 0%, #ECFDF5 0%, #F8FAFC 55%, #FFFFFF 100%)',
        'lnd-cta': 'linear-gradient(135deg, #134E4A 0%, #0F172A 100%)',
        'lnd-price': 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
      }
    }
  },
  plugins: [animate]
};
