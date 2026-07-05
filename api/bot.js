import { bookingKeyboard, formatBookingMessage } from '../bot/messages.js'
import { getAdmins, saveBooking } from '../bot/state.js'
import { sendTelegramMessage } from '../bot/telegram-api.js'
import { handleTelegramUpdate } from '../bot/controller.js'

const requiredFields = ['ownerName', 'phone', 'petName', 'petType', 'serviceName', 'preferredDate', 'preferredTime']

const handleBooking = async (booking) => {
  if (!booking || requiredFields.some((field) => !booking[field])) {
    return {
      status: 400,
      body: { ok: false, error: 'Booking payload is incomplete' },
    }
  }

  const { booking: savedBooking } = await saveBooking(booking)
  const admins = await getAdmins()

  await Promise.all(
    admins.map((adminId) =>
      sendTelegramMessage(adminId, formatBookingMessage(savedBooking), {
        reply_markup: bookingKeyboard(savedBooking.id),
      }),
    ),
  )

  return {
    status: 200,
    body: {
      ok: true,
      bookingId: savedBooking.id,
      notifiedAdmins: admins.length,
    },
  }
}

export default async function handler(request, response) {
  if (request.method === 'GET') {
    response.status(200).json({ ok: true, service: 'happy-paws-bot' })
    return
  }

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  if (request.body?.booking) {
    const result = await handleBooking(request.body.booking)
    response.status(result.status).json(result.body)
    return
  }

  await handleTelegramUpdate(request.body)
  response.status(200).json({ ok: true })
}
