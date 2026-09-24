// Standalone server (Render: `npm start`). Serves the built frontend from dist/ plus the same
// Supabase-backed API as the Vite dev server and Vercel function, on one origin.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { createAuthHandler } from './auth.ts'
import { readConfig } from './config.ts'

const api = createAuthHandler(readConfig(process.env))
const port = Number(process.env.PORT) || 3000
const dist = join(import.meta.dirname, '..', 'dist')
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json' }

async function serveFile(pathname: string, res: import('node:http').ServerResponse) {
  // normalize() + leading '/' strip keeps the path inside dist/.
  try {
    const file = join(dist, normalize(decodeURIComponent(pathname)).replace(/^([/\\]|\.\.)+/, ''))
    const body = await readFile(file)
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream')
    if (pathname.startsWith('/assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.end(body)
  } catch {
    // Unknown paths fall back to the SPA shell.
    res.setHeader('Content-Type', types['.html'])
    res.end(await readFile(join(dist, 'index.html')).catch(() => 'Frontend not built. Run npm run build.'))
  }
}

createServer((req, res) => {
  if (req.url === '/health') return res.end('ok')
  api(req, res, () => {
    if (req.url?.startsWith('/api/')) {
      res.statusCode = 404; res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'Not found.' }))
    }
    const pathname = (req.url || '/').split('?')[0]
    void serveFile(pathname === '/' ? '/index.html' : pathname, res)
  })
}).listen(port, () => console.log(`JalSakshi supervisor on :${port}`))
