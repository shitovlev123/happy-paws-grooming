import type { Booking, BookingDraft, BookingStatus } from '../types/booking'

const STORAGE_KEY = 'happy-paws-bookings'

const readBookings = (): Booking[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as Booking[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeBookings = (bookings: Booking[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  window.dispatchEvent(new Event('happy-paws-bookings-updated'))
}

export const bookingStorage = {
  all(): Booking[] {
    return readBookings().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  create(draft: BookingDraft): Booking {
    const now = new Date().toISOString()
    const booking: Booking = {
      ...draft,
      id: crypto.randomUUID(),
      status: 'new',
      serviceName: draft.serviceName ?? draft.serviceId,
      createdAt: now,
      updatedAt: now,
    }

    writeBookings([booking, ...readBookings()])
    return booking
  },

  updateStatus(id: string, status: BookingStatus): Booking | undefined {
    let updated: Booking | undefined
    const bookings = readBookings().map((booking) => {
      if (booking.id !== id) {
        return booking
      }

      updated = {
        ...booking,
        status,
        updatedAt: new Date().toISOString(),
      }

      return updated
    })

    writeBookings(bookings)
    return updated
  },
}
