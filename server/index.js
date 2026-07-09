import { createServer } from 'node:http'
import { URL } from 'node:url'
import botHandler from '../api/bot.js'
import chatHandler from '../api/chat.js'

const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '127.0.0.1'

const readBody = async (request) => {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks).toString('utf8')
}

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

const createVercelResponse = (response) => ({
  status(statusCode) {
    return {
      json(payload) {
        sendJson(response, statusCode, payload)
      },
    }
  },
})

const routeApi = async (handler, request, response) => {
  const body = await readBody(request)

  await handler(
    {
      method: request.method,
      headers: request.headers,
      body,
    },
    createVercelResponse(response),
  )
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

    if (request.method === 'OPTIONS') {
      sendJson(response, 204, {})
      return
    }

    if (url.pathname === '/api/health') {
      sendJson(response, 200, {
        ok: true,
        service: 'happy-paws-api',
        database: process.env.SQLITE_DB_FILE ? 'sqlite' : 'file-state',
        aiMode: 'mock',
      })
      return
    }

    if (url.pathname === '/api/bot') {
      await routeApi(botHandler, request, response)
      return
    }

    if (url.pathname === '/api/chat') {
      await routeApi(chatHandler, request, response)
      return
    }

    sendJson(response, 404, { ok: false, error: 'Not found' })
  } catch (error) {
    console.error('API request failed', error)
    sendJson(response, 500, { ok: false, error: 'Internal server error' })
  }
})

server.listen(port, host, () => {
  console.log(`Happy Paws API listening on http://${host}:${port}`)
})
