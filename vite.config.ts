import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { createAuthHandler } from './server/auth.ts'
import { readConfig } from './server/config.ts'

export default defineConfig(({ mode }) => {
  const config = readConfig({ ...loadEnv(mode, process.cwd(), ''), ...process.env })
  const handler = createAuthHandler(config)
  const auth: Plugin = {
    name: 'jalsakshi-supabase-auth',
    configureServer(server) { server.middlewares.use(handler) },
    configurePreviewServer(server) { server.middlewares.use(handler) },
  }
  // JALSAKSHI_* values remain server-only; never expose the database URL to the client.
  return { plugins: [react(), auth], server: { fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/*.local'] } } }
})
