/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds (dark blue-black to harmonize with photo)
        void: '#0a0c14',
        subtle: '#0e101a',
        elevated: '#131520',

        // Text
        primary: '#f5f5f5',
        secondary: '#999999',
        muted: '#555555',

        // Accents
        indigo: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        purple: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Unbounded', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Effect-related utilities
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      // Shadow tokens
      boxShadow: {
        'glow-sm': '0 0 10px var(--glow-color)',
        glow: '0 0 20px var(--glow-color)',
        'glow-lg': '0 0 40px var(--glow-color)',
        elevated: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'elevated-lg': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      },
    },
  },
  plugins: [],
};
