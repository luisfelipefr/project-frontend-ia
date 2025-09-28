import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    backgroundImage: {
      'login-texture': "url('/src/assets/images/background-login.png')"
    }
  } },
  plugins: [],
} satisfies Config
