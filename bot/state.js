import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const DEFAULT_STATE_FILE =
  process.env.VERCEL === '1'
    ? '/tmp/happy-paws-bot-state.json'
    : join(process.cwd(), 'bot', 'data', 'state.json')

const STATE_FILE = process.env.BOT_STATE_FILE || DEFAULT_STATE_FILE

const emptyState = {
  ownerId: null,
  admins: [],
  bookings: [],
}

const normalizeId = (id) => String(id)

export const readState = async () => {
  try {
    const raw = await readFile(STATE_FILE, 'utf8')
    return { ...emptyState, ...JSON.parse(raw) }
  } catch {
    return { ...emptyState }
  }
}

export const writeState = async (state) => {
  await mkdir(dirname(STATE_FILE), { recursive: true })
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2))
}

export const bootstrapAdmin = async (userId) => {
  const state = await readState()
  const id = normalizeId(userId)

  if (!state.ownerId) {
    state.ownerId = id
    state.admins = [id]
    await writeState(state)
    return { state, created: true }
  }

  return { state, created: false }
}

export const isAdmin = async (userId) => {
  const state = await readState()
  return state.admins.includes(normalizeId(userId))
}

export const grantAdmin = async (requesterId, targetId) => {
  const state = await readState()

  if (!state.admins.includes(normalizeId(requesterId))) {
    return { ok: false, reason: 'not_admin', state }
  }

  const id = normalizeId(targetId)
  state.admins = Array.from(new Set([...state.admins, id]))
  await writeState(state)
  return { ok: true, state }
}

export const saveBooking = async (booking) => {
  const state = await readState()
  const record = {
    ...booking,
    id: `HP-${Date.now().toString(36).toUpperCase()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  }

  state.bookings = [record, ...state.bookings].slice(0, 200)
  await writeState(state)
  return { booking: record, state }
}

export const updateBookingStatus = async (bookingId, status) => {
  const state = await readState()
  let updated = null

  state.bookings = state.bookings.map((booking) => {
    if (booking.id !== bookingId) {
      return booking
    }

    updated = {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
    }

    return updated
  })

  await writeState(state)
  return { booking: updated, state }
}
