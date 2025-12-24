import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: `http://dev-server:${env.BACKEND_PORT}`,
          changeOrigin: true,
          secure: false,
        },
      },
    }
  }
})
