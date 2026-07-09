import pg from 'pg'

const { Pool } = pg

const emptyState = {
  ownerId: null,
  admins: [],
  pendingAdminGrants: {},
  bookings: [],
}

const statuses = new Set(['new', 'confirmed', 'completed', 'cancelled'])

let pool
let schemaReady

const createPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  }

  return pool
}

const normalizeId = (id) => String(id)

const toIso = (value) => {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value)
}

const toBooking = (row) => ({
  id: row.id,
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
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
})

const bookingValues = (booking) => [
  booking.id,
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
  booking.createdAt ? new Date(booking.createdAt) : new Date(),
  booking.updatedAt ? new Date(booking.updatedAt) : null,
]

const ensureSchema = async () => {
  if (!schemaReady) {
    schemaReady = createPool().query(`
      CREATE TABLE IF NOT EXISTS bot_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bot_admins (
        user_id TEXT PRIMARY KEY,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS pending_admin_grants (
        user_id TEXT PRIMARY KEY,
        message_id INTEGER NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
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
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );

      CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);
      CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
    `)
  }

  await schemaReady
}

export const createSqlStateStore = () => {
  const readState = async () => {
    await ensureSchema()
    const database = createPool()
    const [ownerResult, adminsResult, pendingResult, bookingsResult] = await Promise.all([
      database.query("SELECT value FROM bot_settings WHERE key = 'owner_id'"),
      database.query('SELECT user_id FROM bot_admins ORDER BY created_at ASC'),
      database.query('SELECT user_id, message_id FROM pending_admin_grants'),
      database.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200'),
    ])

    return {
      ...emptyState,
      ownerId: ownerResult.rows[0]?.value || null,
      admins: adminsResult.rows.map((row) => row.user_id),
      pendingAdminGrants: Object.fromEntries(
        pendingResult.rows.map((row) => [row.user_id, row.message_id]),
      ),
      bookings: bookingsResult.rows.map(toBooking),
    }
  }

  const ensureEnvAdmins = async (adminIds) => {
    if (adminIds.length === 0) {
      return
    }

    await ensureSchema()
    const database = createPool()
    const client = await database.connect()

    try {
      await client.query('BEGIN')
      const owner = await client.query("SELECT value FROM bot_settings WHERE key = 'owner_id'")

      if (!owner.rows[0]?.value) {
        await client.query(
          `
            INSERT INTO bot_settings (key, value, updated_at)
            VALUES ('owner_id', $1, NOW())
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
          `,
          [adminIds[0]],
        )
      }

      for (const adminId of adminIds) {
        await client.query(
          `
            INSERT INTO bot_admins (user_id, role)
            VALUES ($1, 'admin')
            ON CONFLICT (user_id) DO NOTHING
          `,
          [adminId],
        )
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  const writeState = async (state) => {
    await ensureSchema()
    const database = createPool()
    const client = await database.connect()

    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM pending_admin_grants')
      await client.query('DELETE FROM bot_admins')
      await client.query('DELETE FROM bookings')
      await client.query("DELETE FROM bot_settings WHERE key = 'owner_id'")

      if (state.ownerId) {
        await client.query(
          "INSERT INTO bot_settings (key, value, updated_at) VALUES ('owner_id', $1, NOW())",
          [state.ownerId],
        )
      }

      for (const adminId of state.admins || []) {
        await client.query(
          'INSERT INTO bot_admins (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
          [normalizeId(adminId), 'admin'],
        )
      }

      for (const [userId, messageId] of Object.entries(state.pendingAdminGrants || {})) {
        await client.query(
          `
            INSERT INTO pending_admin_grants (user_id, message_id, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id) DO UPDATE SET message_id = EXCLUDED.message_id, updated_at = NOW()
          `,
          [normalizeId(userId), Number(messageId)],
        )
      }

      for (const booking of state.bookings || []) {
        await client.query(
          `
            INSERT INTO bookings (
              id, status, owner_name, phone, pet_name, pet_type, breed, service_id,
              service_name, preferred_date, preferred_time, comment, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          `,
          bookingValues(booking),
        )
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  const bootstrapAdmin = async (userId) => {
    await ensureSchema()
    const id = normalizeId(userId)
    const database = createPool()
    const client = await database.connect()
    let created = false

    try {
      await client.query('BEGIN')
      const owner = await client.query("SELECT value FROM bot_settings WHERE key = 'owner_id'")

      if (!owner.rows[0]?.value) {
        await client.query(
          "INSERT INTO bot_settings (key, value, updated_at) VALUES ('owner_id', $1, NOW())",
          [id],
        )
        await client.query(
          'INSERT INTO bot_admins (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
          [id, 'owner'],
        )
        created = true
      }

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

    return { state: await readState(), created }
  }

  const grantAdmin = async (requesterId, targetId) => {
    const state = await readState()

    if (!state.admins.includes(normalizeId(requesterId))) {
      return { ok: false, reason: 'not_admin', state }
    }

    await createPool().query(
      'INSERT INTO bot_admins (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
      [normalizeId(targetId), 'admin'],
    )

    return { ok: true, state: await readState() }
  }

  const setPendingAdminGrant = async (userId, messageId) => {
    await ensureSchema()
    await createPool().query(
      `
        INSERT INTO pending_admin_grants (user_id, message_id, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id) DO UPDATE SET message_id = EXCLUDED.message_id, updated_at = NOW()
      `,
      [normalizeId(userId), Number(messageId)],
    )
  }

  const clearPendingAdminGrant = async (userId) => {
    await ensureSchema()
    await createPool().query('DELETE FROM pending_admin_grants WHERE user_id = $1', [normalizeId(userId)])
  }

  const saveBooking = async (booking) => {
    await ensureSchema()
    const record = {
      ...booking,
      id: `HP-${Date.now().toString(36).toUpperCase()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    }

    await createPool().query(
      `
        INSERT INTO bookings (
          id, status, owner_name, phone, pet_name, pet_type, breed, service_id,
          service_name, preferred_date, preferred_time, comment, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `,
      bookingValues(record),
    )

    return { booking: record, state: await readState() }
  }

  const updateBookingStatus = async (bookingId, status) => {
    if (!statuses.has(status)) {
      return { booking: null, state: await readState() }
    }

    await ensureSchema()
    const result = await createPool().query(
      `
        UPDATE bookings
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [bookingId, status],
    )

    return {
      booking: result.rows[0] ? toBooking(result.rows[0]) : null,
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
