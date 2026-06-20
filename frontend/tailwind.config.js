/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-hover': '#1d4ed8',
        secondary: '#0f172a',
        surface: '#ffffff',
        'surface-soft': '#f8fafc',
        border: '#dbe4f0',
        text: '#0f172a',
        muted: '#64748b',
      },
      shadows: {
        sm: '0 1px 2px rgb(15 23 42 / 0.08)',
        md: '0 10px 30px rgb(15 23 42 / 0.12)',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
      },
      fontFamily: {
        main: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      },
    },
  },
  plugins: [],
}
