import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, ClipboardList, Search } from 'lucide-react'
import { petTypeLabels, services, statusLabels } from '../data/content'
import { bookingStorage } from '../lib/storage'
import type { Booking, BookingStatus } from '../types/booking'
import { StatusBadge } from './StatusBadge'

const statusOptions: Array<BookingStatus | 'all'> = [
  'all',
  'new',
  'confirmed',
  'completed',
  'cancelled',
]

const crmStatuses: BookingStatus[] = ['new', 'confirmed', 'completed', 'cancelled']

const demoBookings = (): Booking[] => [
  {
    id: 'demo-1',
    ownerName: 'Мария',
    phone: '+7 900 111-22-33',
    petName: 'Ричи',
    petType: 'dog',
    breed: 'Пудель',
    serviceId: services[0].id,
    serviceName: services[0].title,
    preferredDate: new Date().toISOString().slice(0, 10),
    comment: 'Нужна аккуратная стрижка мордочки.',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    const loadBookings = () => {
      const stored = bookingStorage.all()
      setBookings(stored.length > 0 ? stored : demoBookings())
    }

    loadBookings()
    window.addEventListener('happy-paws-bookings-updated', loadBookings)

    return () => window.removeEventListener('happy-paws-bookings-updated', loadBookings)
  }, [])

  const stats = useMemo(
    () => ({
      total: bookings.length,
      new: bookings.filter((booking) => booking.status === 'new').length,
      confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
      completed: bookings.filter((booking) => booking.status === 'completed').length,
    }),
    [bookings],
  )

  const filteredBookings = useMemo(() => {
    if (filter === 'all') {
      return bookings
    }

    return bookings.filter((booking) => booking.status === filter)
  }, [bookings, filter])

  const updateStatus = (id: string, status: BookingStatus) => {
    bookingStorage.updateStatus(id, status)
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status, updatedAt: new Date().toISOString() } : booking,
      ),
    )
  }

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <span className="section-kicker">CRM-панель</span>
          <h1>Заявки Happy Paws Grooming</h1>
          <p>
            Администратор видит новые записи, меняет статус и отслеживает путь заявки:
            новая → подтверждена → выполнена / отменена.
          </p>
        </div>
        <a className="button secondary" href="/">
          Вернуться на сайт
        </a>
      </section>

      <section className="stats-grid">
        <article>
          <ClipboardList size={22} />
          <span>Всего</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <Clock3 size={22} />
          <span>Новые</span>
          <strong>{stats.new}</strong>
        </article>
        <article>
          <CalendarDays size={22} />
          <span>Подтвержденные</span>
          <strong>{stats.confirmed}</strong>
        </article>
        <article>
          <CheckCircle2 size={22} />
          <span>Выполненные</span>
          <strong>{stats.completed}</strong>
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div>
            <h2>Список заявок</h2>
            <p>Фильтр и смена статуса работают поверх localStorage-базы.</p>
          </div>
          <label className="filter-select">
            <Search size={18} />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as BookingStatus | 'all')}
            >
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {status === 'all' ? 'Все статусы' : statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="booking-list">
          {filteredBookings.map((booking) => (
            <article className="admin-booking-card" key={booking.id}>
              <div className="booking-card-top">
                <div>
                  <h3>{booking.ownerName}</h3>
                  <p>{booking.phone}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="booking-details">
                <div>
                  <dt>Питомец</dt>
                  <dd>
                    {booking.petName}, {petTypeLabels[booking.petType]}
                  </dd>
                </div>
                <div>
                  <dt>Порода</dt>
                  <dd>{booking.breed || 'не указана'}</dd>
                </div>
                <div>
                  <dt>Услуга</dt>
                  <dd>{booking.serviceName}</dd>
                </div>
                <div>
                  <dt>Дата</dt>
                  <dd>{booking.preferredDate}</dd>
                </div>
              </dl>

              {booking.comment && <p className="booking-comment">{booking.comment}</p>}

              <div className="status-flow" aria-label="CRM статус">
                {crmStatuses.map((status) => (
                  <button
                    className={booking.status === status ? 'active' : ''}
                    type="button"
                    key={status}
                    onClick={() => updateStatus(booking.id, status)}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
