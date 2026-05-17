import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import analyzeTextHandler from './api/analyze-text.js'
import analyzeHandler from './api/analyze.js'

// Manually load .env so API handlers can read process.env
const envPath = resolve(process.cwd(), '.env')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=][^=]*)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  })
}

console.log('[local-api] ANTHROPIC_API_KEY loaded:', !!process.env.ANTHROPIC_API_KEY)

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url.startsWith('/api/')) return next()

          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try { req.body = JSON.parse(body) } catch { req.body = {} }
            res.status = code => { res.statusCode = code; return res }
            res.json = data => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }

            if (req.url.startsWith('/api/analyze-text')) {
              await analyzeTextHandler(req, res)
            } else if (req.url.startsWith('/api/analyze')) {
              await analyzeHandler(req, res)
            } else {
              next()
            }
          })
        })
      }
    }
  ]
})
