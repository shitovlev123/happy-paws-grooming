import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const emptyState = {
  ownerId: null,
  admins: [],
  pendingAdminGrants: {},
  bookings: [],
}

const statuses = new Set(['new', 'confirmed', 'completed', 'cancelled'])

let database

const dbFile = () => process.env.SQLITE_DB_FILE || join(process.cwd(), 'bot', 'data', 'happy-paws.sqlite')

const createDatabase = () => {
  if (!database) {
    const file = dbFile()
    mkdirSync(dirname(file), { recursive: true })
    database = new DatabaseSync(file)
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      PRAGMA foreign_keys = ON;
    `)
  }

  return database
}

const normalizeId = (id) => String(id)

const normalizeIdempotencyKey = (key) => {
  const value = String(key || '').trim()
  return value ? value.slice(0, 160) : null
}

const now = () => new Date().toISOString()

const toBooking = (row) => ({
  id: row.id,
  idempotencyKey: row.idempotency_key || undefined,
  status: row.status,
  ownerName: row.owner_name,
  phone: row.phone,
  petName: row.pet_name,
  petType: row.pet_type,
  breed: row.breed || '',
  serviceId: row.service_id || '',
  serviceName: row.service_name,
  preferredDate: row.preferred_date,
  preferredTime: row.preferred_time,
  comment: row.comment || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at || null,
})

const bookingValues = (booking) => [
  booking.id,
  normalizeIdempotencyKey(booking.idempotencyKey),
  booking.status || 'new',
  booking.ownerName,
  booking.phone,
  booking.petName,
  booking.petType,
  booking.breed || '',
  booking.serviceId || '',
  booking.serviceName,
  booking.preferredDate,
  booking.preferredTime || '',
  booking.comment || '',
  booking.createdAt || now(),
  booking.updatedAt || null,
]

const ensureSchema = () => {
  createDatabase().exec(`
    CREATE TABLE IF NOT EXISTS bot_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bot_admins (
      user_id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pending_admin_grants (
      user_id TEXT PRIMARY KEY,
      message_id INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      idempotency_key TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
      owner_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      pet_name TEXT NOT NULL,
      pet_type TEXT NOT NULL,
      breed TEXT,
      service_id TEXT,
      service_name TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);
    CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
  `)
}

const runTransaction = (callback) => {
  const db = createDatabase()

  db.exec('BEGIN IMMEDIATE')

  try {
    const result = callback(db)
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export const createSqliteStateStore = () => {
  const readState = async () => {
    ensureSchema()
    const db = createDatabase()
    const owner = db.prepare("SELECT value FROM bot_settings WHERE key = 'owner_id'").get()
    const admins = db.prepare('SELECT user_id FROM bot_admins ORDER BY created_at ASC').all()
    const pending = db.prepare('SELECT user_id, message_id FROM pending_admin_grants').all()
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200').all()

    return {
      ...emptyState,
      ownerId: owner?.value || null,
      admins: admins.map((row) => row.user_id),
      pendingAdminGrants: Object.fromEntries(pending.map((row) => [row.user_id, row.message_id])),
      bookings: bookings.map(toBooking),
    }
  }

  const ensureEnvAdmins = async (adminIds) => {
    if (adminIds.length === 0) {
      return
    }

    ensureSchema()
    runTransaction((db) => {
      const owner = db.prepare("SELECT value FROM bot_settings WHERE key = 'owner_id'").get()

      if (!owner?.value) {
        db.prepare(
          `
            INSERT INTO bot_settings (key, value, updated_at)
            VALUES ('owner_id', ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
          `,
        ).run(adminIds[0], now())
      }

      const insertAdmin = db.prepare('INSERT OR IGNORE INTO bot_admins (user_id, role, created_at) VALUES (?, ?, ?)')

      for (const adminId of adminIds) {
        insertAdmin.run(adminId, 'admin', now())
      }
    })
  }

  const writeState = async (state) => {
    ensureSchema()
    runTransaction((db) => {
      db.exec(`
        DELETE FROM pending_admin_grants;
        DELETE FROM bot_admins;
        DELETE FROM bookings;
        DELETE FROM bot_settings WHERE key = 'owner_id';
      `)

      if (state.ownerId) {
        db.prepare("INSERT INTO bot_settings (key, value, updated_at) VALUES ('owner_id', ?, ?)").run(
          state.ownerId,
          now(),
        )
      }

      const insertAdmin = db.prepare('INSERT OR IGNORE INTO bot_admins (user_id, role, created_at) VALUES (?, ?, ?)')

      for (const adminId of state.admins || []) {
        insertAdmin.run(normalizeId(adminId), 'admin', now())
      }

      const insertPending = db.prepare(
        `
          INSERT INTO pending_admin_grants (user_id, message_id, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET message_id = excluded.message_id, updated_at = excluded.updated_at
        `,
      )

      for (const [userId, messageId] of Object.entries(state.pendingAdminGrants || {})) {
        insertPending.run(normalizeId(userId), Number(messageId), now())
      }

      const insertBooking = db.prepare(
        `
          INSERT INTO bookings (
            id, idempotency_key, status, owner_name, phone, pet_name, pet_type, breed, service_id,
            service_name, preferred_date, preferred_time, comment, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )

      for (const booking of state.bookings || []) {
        insertBooking.run(...bookingValues(booking))
      }
    })
  }

  const bootstrapAdmin = async (userId) => {
    ensureSchema()
    const id = normalizeId(userId)
    let created = false

    runTransaction((db) => {
      const owner = db.prepare("SELECT value FROM bot_settings WHERE key = 'owner_id'").get()

      if (!owner?.value) {
        db.prepare("INSERT INTO bot_settings (key, value, updated_at) VALUES ('owner_id', ?, ?)").run(id, now())
        db.prepare('INSERT OR IGNORE INTO bot_admins (user_id, role, created_at) VALUES (?, ?, ?)').run(
          id,
          'owner',
          now(),
        )
        created = true
      }
    })

    return { state: await readState(), created }
  }

  const grantAdmin = async (requesterId, targetId) => {
    const state = await readState()

    if (!state.admins.includes(normalizeId(requesterId))) {
      return { ok: false, reason: 'not_admin', state }
    }

    createDatabase()
      .prepare('INSERT OR IGNORE INTO bot_admins (user_id, role, created_at) VALUES (?, ?, ?)')
      .run(normalizeId(targetId), 'admin', now())

    return { ok: true, state: await readState() }
  }

  const setPendingAdminGrant = async (userId, messageId) => {
    ensureSchema()
    createDatabase()
      .prepare(
        `
          INSERT INTO pending_admin_grants (user_id, message_id, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET message_id = excluded.message_id, updated_at = excluded.updated_at
        `,
      )
      .run(normalizeId(userId), Number(messageId), now())
  }

  const clearPendingAdminGrant = async (userId) => {
    ensureSchema()
    createDatabase().prepare('DELETE FROM pending_admin_grants WHERE user_id = ?').run(normalizeId(userId))
  }

  const saveBooking = async (booking) => {
    ensureSchema()
    const record = {
      ...booking,
      id: `HP-${Date.now().toString(36).toUpperCase()}`,
      idempotencyKey: normalizeIdempotencyKey(booking.idempotencyKey),
      status: 'new',
      createdAt: now(),
    }

    const saved = runTransaction((db) => {
      if (record.idempotencyKey) {
        const existing = db.prepare('SELECT * FROM bookings WHERE idempotency_key = ?').get(record.idempotencyKey)

        if (existing) {
          return { booking: toBooking(existing), duplicate: true }
        }
      }

      db.prepare(
        `
          INSERT INTO bookings (
            id, idempotency_key, status, owner_name, phone, pet_name, pet_type, breed, service_id,
            service_name, preferred_date, preferred_time, comment, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).run(...bookingValues(record))

      return { booking: record, duplicate: false }
    })

    return { ...saved, state: await readState() }
  }

  const updateBookingStatus = async (bookingId, status) => {
    if (!statuses.has(status)) {
      return { booking: null, state: await readState() }
    }

    ensureSchema()
    const updatedAt = now()
    createDatabase()
      .prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?')
      .run(status, updatedAt, bookingId)

    const row = createDatabase().prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId)

    return {
      booking: row ? toBooking(row) : null,
      state: await readState(),
    }
  }

  return {
    bootstrapAdmin,
    clearPendingAdminGrant,
    ensureEnvAdmins,
    grantAdmin,
    readState,
    saveBooking,
    setPendingAdminGrant,
    updateBookingStatus,
    writeState,
  }
}
