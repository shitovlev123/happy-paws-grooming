import { petTypeLabels } from '../data/content'
import type { Booking } from '../types/booking'

export const formatTelegramMessage = (booking: Booking) => {
  const lines = [
    'Новая заявка Happy Paws Grooming',
    `Клиент: ${booking.ownerName}`,
    `Телефон: ${booking.phone}`,
    `Питомец: ${booking.petName} (${petTypeLabels[booking.petType]})`,
    `Порода: ${booking.breed || 'не указана'}`,
    `Услуга: ${booking.serviceName}`,
    `Дата: ${booking.preferredDate}`,
    `Комментарий: ${booking.comment || 'без комментария'}`,
  ]

  return lines.join('\n')
}

export const notifyTelegram = async (booking: Booking) => {
  if (import.meta.env.VITE_TELEGRAM_ENABLED !== 'true') {
    return { skipped: true, message: formatTelegramMessage(booking) }
  }

  const response = await fetch('/api/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ booking }),
  })

  if (!response.ok) {
    throw new Error('Telegram notification failed')
  }

  return response.json() as Promise<{ ok: boolean }>
}
