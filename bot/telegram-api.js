const botToken = () => process.env.TELEGRAM_BOT_TOKEN

export const telegramRequest = async (method, payload) => {
  const token = botToken()

  if (!token) {
    return { ok: false, skipped: true, error: 'TELEGRAM_BOT_TOKEN is not configured' }
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json().catch(() => ({
      ok: false,
      description: 'Telegram returned a non-JSON response',
    }))

    if (!response.ok || !body.ok) {
      return {
        ok: false,
        status: response.status,
        error: body.description || `Telegram ${method} request failed`,
      }
    }

    return body
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : `Telegram ${method} request failed`,
    }
  }
}

export const sendTelegramMessage = (chatId, text, extra = {}) =>
  telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    ...extra,
  })

export const editTelegramMessage = (chatId, messageId, text, extra = {}) =>
  telegramRequest('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...extra,
  })

export const answerCallbackQuery = (callbackQueryId, text) =>
  telegramRequest('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  })

export const getUpdates = (offset) =>
  telegramRequest('getUpdates', {
    offset,
    timeout: 25,
    allowed_updates: ['message', 'callback_query'],
  })

export const setWebhook = (url) =>
  telegramRequest('setWebhook', {
    url,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false,
  })
