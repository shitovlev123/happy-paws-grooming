import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const vercelStateNamespace = (
  process.env.BOT_STATE_NAMESPACE ||
  process.env.VERCEL_PROJECT_ID ||
  'vercel'
)
  .replace(/[^a-zA-Z0-9_-]/g, '_')
  .slice(0, 80)

const DEFAULT_STATE_FILE =
  process.env.VERCEL === '1'
    ? `/tmp/happy-paws-bot-state-${vercelStateNamespace}.json`
    : join(process.cwd(), 'bot', 'data', 'state.json')

const STATE_FILE = process.env.BOT_STATE_FILE || DEFAULT_STATE_FILE
const STATE_PREFIX = 'happy-paws-bot-state-'

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

const mergeState = (current, incoming) => {
  if (!incoming) {
    return current
  }

  return {
    ...current,
    ownerId: current.ownerId || incoming.ownerId || null,
    admins: Array.from(new Set([...(current.admins || []), ...(incoming.admins || [])])),
    pendingAdminGrants: {
      ...(incoming.pendingAdminGrants || {}),
      ...(current.pendingAdminGrants || {}),
    },
    bookings: [...(current.bookings || []), ...(incoming.bookings || [])]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 200),
  }
}

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

const readStateFile = async (file) => {
  try {
    return { ...emptyState, ...JSON.parse(await readFile(file, 'utf8')) }
  } catch {
    return null
  }
}

const readLegacyVercelState = async () => {
  if (process.env.VERCEL !== '1' || !STATE_FILE.startsWith('/tmp/')) {
    return null
  }

  try {
    const files = await readdir('/tmp')
    const stateFiles = files
      .filter((file) => file.startsWith(STATE_PREFIX) && join('/tmp', file) !== STATE_FILE)
      .map((file) => join('/tmp', file))

    const states = await Promise.all(stateFiles.map((file) => readStateFile(file)))
    return states.reduce((state, incoming) => mergeState(state, incoming), { ...emptyState })
  } catch {
    return null
  }
}

export const readState = async () => {
  const state = await readStateFile(STATE_FILE)

  if (state) {
    return mergeEnvAdmins(state)
  }

  return mergeEnvAdmins((await readLegacyVercelState()) || { ...emptyState })
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
