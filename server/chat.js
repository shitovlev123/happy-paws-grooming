const systemPrompt = [
  'Ты вежливый консультант груминг-салона "Счастливые лапки" в Хамовниках.',
  'Помогай выбрать услугу, объясняй длительность ухода, мягко веди к онлайн-записи.',
  'Не обещай медицинских диагнозов и не назначай лечение. Для здоровья советуй ветеринара.',
  'Отвечай кратко, тепло и по-русски.',
].join(' ')

const fallbackAnswer = (message) => {
  const text = message.toLowerCase()

  if (text.includes('цена') || text.includes('стоим')) {
    return 'Цены зависят от услуги и шерсти питомца. В блоке услуг есть ориентиры, а точную стоимость администратор подтвердит после заявки.'
  }

  if (text.includes('когт') || text.includes('лап')) {
    return 'Для когтей можно выбрать отдельный уход или добавить его к комплексному грумингу. Если питомец волнуется, мастер делает всё спокойно и без спешки.'
  }

  if (text.includes('кот') || text.includes('кош')) {
    return 'Кошек тоже принимаем. Обычно подбираем более спокойный слот и услугу без лишнего стресса: вычёсывание, купание или аккуратный комплексный уход.'
  }

  if (text.includes('запис') || text.includes('время')) {
    return 'Выберите услугу, дату и время в форме записи. Заявка попадёт администратору в Telegram, после этого запись подтвердят.'
  }

  return 'Я помогу с выбором ухода, временем записи и подготовкой питомца к визиту. Напишите породу, услугу или что беспокоит перед грумингом.'
}

const cleanMessages = (messages, message) => {
  const history = Array.isArray(messages) ? messages : []
  const normalized = history
    .filter((entry) => entry && ['user', 'assistant'].includes(entry.role) && entry.content)
    .slice(-8)
    .map((entry) => ({
      role: entry.role,
      content: String(entry.content).slice(0, 1200),
    }))

  if (message && !normalized.some((entry) => entry.role === 'user' && entry.content === message)) {
    normalized.push({ role: 'user', content: String(message).slice(0, 1200) })
  }

  return normalized
}

const extractResponseText = (body) => {
  if (body.output_text) {
    return body.output_text
  }

  const output = Array.isArray(body.output) ? body.output : []

  for (const item of output) {
    const content = Array.isArray(item.content) ? item.content : []
    const text = content.find((part) => part.type === 'output_text' || part.text)

    if (text?.text) {
      return text.text
    }
  }

  return ''
}

export const handleChatRequest = async (payload = {}) => {
  const message = String(payload.message || payload.messages?.at?.(-1)?.content || '').trim()
  const messages = cleanMessages(payload.messages, message)

  if (!message) {
    return {
      status: 400,
      body: { ok: false, error: 'Message is required' },
    }
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      status: 200,
      body: {
        ok: true,
        fallback: true,
        text: fallbackAnswer(message),
      },
    }
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: systemPrompt,
      input: messages,
      max_output_tokens: 420,
    }),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      status: 502,
      body: {
        ok: false,
        error: body.error?.message || 'AI assistant request failed',
      },
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      text: extractResponseText(body) || fallbackAnswer(message),
    },
  }
}
