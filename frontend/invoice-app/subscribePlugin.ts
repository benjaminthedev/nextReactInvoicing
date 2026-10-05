import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'

type Signup = {
  email: string
  createdAt: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function readSignups(file: string): Signup[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as { signups?: Signup[] }
    return Array.isArray(parsed.signups) ? parsed.signups : []
  } catch {
    return []
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function subscribePlugin(root: string): Plugin {
  const file = path.join(root, 'data', 'signups.json')

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url?.split('?')[0]
    if (url !== '/api/subscribe') {
      next()
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' })
      return
    }

    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw || '{}') as { email?: string; website?: string }
      if (body.website) {
        sendJson(res, 200, { ok: true })
        return
      }

      const email = (body.email ?? '').trim().toLowerCase()
      if (!emailPattern.test(email)) {
        sendJson(res, 400, { error: 'Enter a valid email address.' })
        return
      }

      const signups = readSignups(file)
      if (!signups.some((signup) => signup.email === email)) {
        signups.push({ email, createdAt: new Date().toISOString() })
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, JSON.stringify({ signups }, null, 2))
      }

      sendJson(res, 200, { ok: true })
    } catch {
      sendJson(res, 400, { error: 'Could not save that address.' })
    }
  }

  return {
    name: 'subscribe-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}
