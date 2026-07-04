const buildTelegramMessage = (booking) => {
  const petTypeLabels = {
    dog: 'Собака',
    cat: 'Кот',
    other: 'Другое',
  }

  return [
    'Новая заявка Happy Paws Grooming',
    `Клиент: ${booking.ownerName}`,
    `Телефон: ${booking.phone}`,
    `Питомец: ${booking.petName} (${petTypeLabels[booking.petType] ?? 'Другое'})`,
    `Порода: ${booking.breed || 'не указана'}`,
    `Услуга: ${booking.serviceName}`,
    `Дата: ${booking.preferredDate}`,
    `Комментарий: ${booking.comment || 'без комментария'}`,
  ].join('\n')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    response.status(500).json({ ok: false, error: 'Telegram env variables are not configured' })
    return
  }

  const { booking } = request.body

  if (!booking) {
    response.status(400).json({ ok: false, error: 'Booking payload is required' })
    return
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(booking),
    }),
  })

  if (!telegramResponse.ok) {
    response.status(502).json({ ok: false, error: 'Telegram API request failed' })
    return
  }

  response.status(200).json({ ok: true })
}
