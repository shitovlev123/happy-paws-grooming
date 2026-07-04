import type { BookingRequest } from '../types/booking'

export const sendBookingRequest = async (booking: BookingRequest) => {
  if (import.meta.env.VITE_BOOKING_API_ENABLED !== 'true') {
    return { ok: true, demo: true }
  }

  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ booking }),
  })

  if (!response.ok) {
    throw new Error('Booking request failed')
  }

  return response.json() as Promise<{ ok: boolean; bookingId?: string }>
}
