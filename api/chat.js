import { handleChatRequest } from '../server/chat.js'

const windows = new Map()

const rateLimit = {
  maxRequests: 8,
  windowMs: 120000,
}

const getClientId = (request) =>
  String(
    request.headers?.['x-forwarded-for'] ||
      request.headers?.['x-real-ip'] ||
      request.headers?.['cf-connecting-ip'] ||
      'local',
  )
    .split(',')[0]
    .trim()

const isRateLimited = (clientId) => {
  const now = Date.now()
  const current = windows.get(clientId)

  if (!current || current.resetAt < now) {
    windows.set(clientId, { count: 1, resetAt: now + rateLimit.windowMs })
    return false
  }

  current.count += 1
  return current.count > rateLimit.maxRequests
}

const getRequestBody = (request) => {
  if (!request.body || typeof request.body !== 'string') {
    return request.body
  }

  try {
    return JSON.parse(request.body)
  } catch {
    return null
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  if (isRateLimited(getClientId(request))) {
    response.status(429).json({ ok: false, error: 'Too many chat requests' })
    return
  }

  const result = await handleChatRequest(getRequestBody(request) || {})
  response.status(result.status).json(result.body)
}
