import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { createAuthHandler } from './server/auth.ts'
import { readConfig } from './server/config.ts'

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  // Auth middleware is only needed at runtime (dev/preview server).
  // Defer readConfig so that `vite build` (e.g. on Vercel) does not throw
  // when JALSAKSHI_SUPABASE_URL / JALSAKSHI_SUPABASE_PUBLISHABLE_KEY are absent.
  const auth: Plugin = {
    name: 'jalsakshi-supabase-auth',
    configureServer(server) {
      const config = readConfig(env)
      server.middlewares.use(createAuthHandler(config))
    },
    configurePreviewServer(server) {
      const config = readConfig(env)
      server.middlewares.use(createAuthHandler(config))
    },
  }
  // JALSAKSHI_* values remain server-only; never expose the database URL to the client.
  return { plugins: [react(), auth], server: { fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/*.local'] } } }
})
