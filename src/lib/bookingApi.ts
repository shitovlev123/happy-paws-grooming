import type { BookingRequest } from '../types/booking'

export const sendBookingRequest = async (booking: BookingRequest) => {
  const response = await fetch('/api/bot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ booking }),
  })
  const data = (await response.json().catch(() => ({
    ok: false,
    error: 'Booking request failed',
  }))) as { ok: boolean; bookingId?: string; notifiedAdmins?: number; error?: string }

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Booking request failed')
  }

  return data
}
