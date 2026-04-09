import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#ff4d4d', // Our signature premium red
        dark: '#09090b', // Deep cinematic black
        surface: '#18181b', // Slightly lighter black for cards
      }
    },
  },
  plugins: [],
}
export default config