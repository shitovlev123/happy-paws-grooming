import { bookingKeyboard, formatBookingMessage } from '../bot/messages.js'
import { getAdmins, saveBooking } from '../bot/state.js'
import { sendTelegramMessage } from '../bot/telegram-api.js'
import { handleTelegramUpdate } from '../bot/controller.js'

const requiredFields = ['ownerName', 'phone', 'petName', 'petType', 'serviceName', 'preferredDate', 'preferredTime']

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

const getHealth = async () => ({
  ok: true,
  service: 'happy-paws-bot',
  telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  adminCount: (await getAdmins()).length,
})

const handleBooking = async (booking) => {
  if (!booking || requiredFields.some((field) => !booking[field])) {
    return {
      status: 400,
      body: { ok: false, error: 'Booking payload is incomplete' },
    }
  }

  const { booking: savedBooking } = await saveBooking(booking)
  const admins = await getAdmins()

  if (admins.length === 0) {
    console.error('Booking notification failed: no Telegram admins configured')

    return {
      status: 500,
      body: {
        ok: false,
        error: 'No Telegram admins configured',
        bookingId: savedBooking.id,
        notifiedAdmins: 0,
      },
    }
  }

  const results = await Promise.allSettled(
    admins.map(async (adminId) => {
      const result = await sendTelegramMessage(adminId, formatBookingMessage(savedBooking), {
        reply_markup: bookingKeyboard(savedBooking.id),
      })

      return { adminId, result }
    }),
  )
  const delivered = results.filter((entry) => entry.status === 'fulfilled' && entry.value.result?.ok)
  const failed = results.length - delivered.length

  if (delivered.length === 0) {
    console.error('Booking notification failed: Telegram delivered 0 messages', {
      bookingId: savedBooking.id,
      admins: admins.length,
      failed,
    })

    return {
      status: 502,
      body: {
        ok: false,
        error: 'Telegram notification failed',
        bookingId: savedBooking.id,
        notifiedAdmins: 0,
      },
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      bookingId: savedBooking.id,
      notifiedAdmins: delivered.length,
      failedNotifications: failed,
    },
  }
}

export default async function handler(request, response) {
  if (request.method === 'GET') {
    response.status(200).json(await getHealth())
    return
  }

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const body = getRequestBody(request)

  if (body?.booking) {
    const result = await handleBooking(body.booking)
    response.status(result.status).json(result.body)
    return
  }

  if (!body?.message && !body?.callback_query) {
    response.status(400).json({ ok: false, error: 'Unsupported payload' })
    return
  }

  await handleTelegramUpdate(body)
  response.status(200).json({ ok: true })
}
