import type { BookingRequest } from '../types/booking'

export const sendBookingRequest = async (booking: BookingRequest) => {
  const response = await fetch('/api/bot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ booking }),
  })

  if (!response.ok) {
    throw new Error('Booking request failed')
  }

  return response.json() as Promise<{ ok: boolean; bookingId?: string; notifiedAdmins?: number }>
}
