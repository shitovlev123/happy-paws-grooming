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
  pendingAdminGrants: {},
  bookings: [],
}

const normalizeId = (id) => String(id)

const envAdmins = () =>
  (process.env.TELEGRAM_ADMIN_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

const mergeEnvAdmins = (state) => {
  const admins = envAdmins()

  if (admins.length === 0) {
    return state
  }

  return {
    ...state,
    ownerId: state.ownerId || admins[0],
    admins: Array.from(new Set([...admins, ...(state.admins || [])])),
  }
}

export const readState = async () => {
  try {
    const raw = await readFile(STATE_FILE, 'utf8')
    return mergeEnvAdmins({ ...emptyState, ...JSON.parse(raw) })
  } catch {
    return mergeEnvAdmins({ ...emptyState })
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

export const requireAdmin = async (userId) => {
  const state = await readState()
  return {
    ok: state.admins.includes(normalizeId(userId)),
    state,
  }
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

export const setPendingAdminGrant = async (userId, messageId) => {
  const state = await readState()
  state.pendingAdminGrants = {
    ...(state.pendingAdminGrants || {}),
    [normalizeId(userId)]: messageId,
  }
  await writeState(state)
}

export const clearPendingAdminGrant = async (userId) => {
  const state = await readState()
  delete state.pendingAdminGrants?.[normalizeId(userId)]
  await writeState(state)
}

export const hasPendingAdminGrant = async (userId, replyToMessageId) => {
  const state = await readState()
  const pendingMessageId = state.pendingAdminGrants?.[normalizeId(userId)]
  return Boolean(pendingMessageId && pendingMessageId === replyToMessageId)
}

export const getAdmins = async () => {
  const state = await readState()
  return state.admins
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
