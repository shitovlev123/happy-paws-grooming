import { bookingKeyboard, formatBookingMessage } from '../bot/messages.js'
import { saveBooking } from '../bot/state.js'
import { sendTelegramMessage } from '../bot/telegram-api.js'

const requiredFields = ['ownerName', 'phone', 'petName', 'petType', 'serviceName', 'preferredDate']

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const booking = request.body?.booking

  if (!booking || requiredFields.some((field) => !booking[field])) {
    response.status(400).json({ ok: false, error: 'Booking payload is incomplete' })
    return
  }

  const { booking: savedBooking, state } = await saveBooking(booking)
  const admins = state.admins || []

  await Promise.all(
    admins.map((adminId) =>
      sendTelegramMessage(adminId, formatBookingMessage(savedBooking), {
        reply_markup: bookingKeyboard(savedBooking.id),
      }),
    ),
  )

  response.status(200).json({
    ok: true,
    bookingId: savedBooking.id,
    notifiedAdmins: admins.length,
  })
}
