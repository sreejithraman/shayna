/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0a',
        subtle: '#0f0f0f',
        elevated: '#161616',
        primary: '#f5f5f5',
        secondary: '#999999',
        muted: '#555555',
        violet: '#8b5cf6',
        blue: '#3b82f6',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
      },
    },
  },
  plugins: [],
};
