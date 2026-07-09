import { handleChatRequest } from '../server/chat.js'

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

  const result = await handleChatRequest(getRequestBody(request) || {})
  response.status(result.status).json(result.body)
}
