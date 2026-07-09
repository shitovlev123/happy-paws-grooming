import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, MapPin, PaperPlaneTilt, Phone } from '@phosphor-icons/react'
import { petTypeLabels, services } from '../data/content'
import { sendBookingRequest } from '../lib/bookingApi'
import { serviceSelectionEventName } from '../lib/serviceSelection'
import type { FormEvent, KeyboardEvent } from 'react'
import type { ServiceSelectionDetail } from '../lib/serviceSelection'
import type { PetType } from '../types/booking'

const timeSlots = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:30',
  '13:00',
  '14:00',
  '14:30',
  '15:00',
  '16:00',
  '16:30',
  '17:30',
  '18:00',
  '19:00',
]
const busySlots = new Set(['11:30', '15:00', '18:00'])
const phoneControlKeys = new Set(['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits.startsWith('7') ? digits : `7${digits}`
  const phone = normalized.slice(0, 11)
  const code = phone.slice(1, 4)
  const first = phone.slice(4, 7)
  const second = phone.slice(7, 9)
  const third = phone.slice(9, 11)
  const parts = ['+7']

  if (code) {
    parts.push(code)
  }

  if (first) {
    parts.push(first)
  }

  let formatted = parts.join(' ')

  if (second) {
    formatted += `-${second}`
  }

  if (third) {
    formatted += `-${third}`
  }

  return formatted
}

type FormState = {
  ownerName: string
  phone: string
  petName: string
  petType: PetType
  breed: string
  serviceId: string
  preferredDate: string
  preferredTime: string
  comment: string
}

const initialForm: FormState = {
  ownerName: '',
  phone: '',
  petName: '',
  petType: 'dog',
  breed: '',
  serviceId: services[0].id,
  preferredDate: '',
  preferredTime: '',
  comment: '',
}

const createIdempotencyKey = () => {
  if (crypto.randomUUID) {
    return `booking_${crypto.randomUUID()}`
  }

  return `booking_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

export const BookingForm = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [celebrationKey, setCelebrationKey] = useState(0)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const idempotencyKeyRef = useRef('')

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) ?? services[0],
    [form.serviceId],
  )

  const resetIdempotencyKey = () => {
    idempotencyKeyRef.current = ''
  }

  const updateField = (field: keyof FormState, value: string) => {
    resetIdempotencyKey()
    setForm((current) => ({ ...current, [field]: value }))
  }

  useEffect(() => {
    const handleServiceSelection = (event: Event) => {
      const serviceId = (event as CustomEvent<ServiceSelectionDetail>).detail?.serviceId

      if (!serviceId || !services.some((service) => service.id === serviceId)) {
        return
      }

      resetIdempotencyKey()
      setForm((current) => ({ ...current, serviceId }))
      setSuccessMessage('')
    }

    window.addEventListener(serviceSelectionEventName, handleServiceSelection)

    return () => {
      window.removeEventListener(serviceSelectionEventName, handleServiceSelection)
    }
  }, [])

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || phoneControlKeys.has(event.key) || /^\d$/.test(event.key)) {
      return
    }

    event.preventDefault()
  }

  const handlePhoneChange = (value: string) => {
    updateField('phone', formatPhone(value))
  }

  const handleDateChange = (value: string) => {
    resetIdempotencyKey()
    setForm((current) => ({ ...current, preferredDate: value, preferredTime: '' }))
    setIsTimePickerOpen(Boolean(value))
    setSuccessMessage('')
  }

  const selectTimeSlot = (slot: string) => {
    resetIdempotencyKey()
    setForm((current) => ({ ...current, preferredTime: slot }))
    setIsTimePickerOpen(false)
    setSuccessMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.phone.replace(/\D/g, '').length !== 11) {
      setSuccessMessage('Введите номер телефона полностью.')
      return
    }

    if (!form.preferredTime) {
      setSuccessMessage('Выберите свободное время записи.')
      setIsTimePickerOpen(Boolean(form.preferredDate))
      return
    }

    setIsSubmitting(true)
    idempotencyKeyRef.current ||= createIdempotencyKey()

    try {
      await sendBookingRequest({
        ...form,
        idempotencyKey: idempotencyKeyRef.current,
        serviceName: selectedService.title,
      })
      setSuccessMessage('Запись зарегистрирована. Спасибо!')
      setCelebrationKey((current) => current + 1)
      setIsTimePickerOpen(false)
      resetIdempotencyKey()
      setForm(initialForm)
    } catch {
      setSuccessMessage('Не удалось отправить заявку. Проверьте связь и попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section booking-section" id="booking">
      <div className="booking-copy reveal">
        <span>Онлайн-запись</span>
        <h2>Расскажите о питомце, мы бережно подберем уход</h2>
        <p>
          Выберите услугу, дату и время. Заявка сразу уйдет в салон, а администратор
          увидит все детали записи.
        </p>
        <div className="booking-details" aria-label="Контакты салона">
          <a href="tel:+79253184211">
            <Phone size={20} weight="duotone" />
            +7 925 318-42-11
          </a>
          <a href="#contacts">
            <MapPin size={20} weight="duotone" />
            Москва, ул. Плющиха, 27
          </a>
          <span>
            <Clock size={20} weight="duotone" />
            Ежедневно 10:00-21:00
          </span>
        </div>
        <div className="booking-map" aria-label="Карта салона">
          <iframe
            title="Счастливые лапки на карте"
            src="https://yandex.ru/map-widget/v1/?ll=37.585400%2C55.737600&z=16&pt=37.585400%2C55.737600%2Cpm2rdm"
            loading="lazy"
          />
          <a href="https://yandex.ru/maps/?ll=37.585400%2C55.737600&z=16&pt=37.585400%2C55.737600%2Cpm2rdm">
            Открыть карту
          </a>
        </div>
      </div>

      <form className="booking-form reveal" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="ownerName">
            Имя владельца
            <input
              id="ownerName"
              required
              value={form.ownerName}
              onChange={(event) => updateField('ownerName', event.target.value)}
              placeholder="Анна"
            />
          </label>
          <label htmlFor="phone">
            Телефон
            <input
              id="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onKeyDown={handlePhoneKeyDown}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="+7 999 123-45-67"
            />
          </label>
          <label htmlFor="petName">
            Имя питомца
            <input
              id="petName"
              required
              value={form.petName}
              onChange={(event) => updateField('petName', event.target.value)}
              placeholder="Молли"
            />
          </label>
          <label htmlFor="petType">
            Тип питомца
            <select
              id="petType"
              value={form.petType}
              onChange={(event) => updateField('petType', event.target.value as PetType)}
            >
              {Object.entries(petTypeLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="breed">
            Порода
            <input
              id="breed"
              value={form.breed}
              onChange={(event) => updateField('breed', event.target.value)}
              placeholder="Шпиц, мейн-кун"
            />
          </label>
          <label htmlFor="serviceId">
            Услуга
            <select
              id="serviceId"
              value={form.serviceId}
              onChange={(event) => updateField('serviceId', event.target.value)}
            >
              {services.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="preferredDate">
            Дата
            <input
              id="preferredDate"
              required
              type="date"
              value={form.preferredDate}
              onChange={(event) => handleDateChange(event.target.value)}
            />
          </label>
          <div className="time-slot-field">
            Время
            <button
              className="time-slot-trigger"
              type="button"
              disabled={!form.preferredDate}
              aria-expanded={isTimePickerOpen}
              onClick={() => setIsTimePickerOpen((current) => !current)}
            >
              {form.preferredTime || (form.preferredDate ? 'Выбрать время' : 'Сначала выберите дату')}
            </button>
            {isTimePickerOpen && (
              <div className="time-slot-popover" role="listbox" aria-label="Свободное время">
                {timeSlots.map((slot) => {
                  const isBusy = busySlots.has(slot)

                  return (
                    <button
                      className={form.preferredTime === slot ? 'is-selected' : ''}
                      type="button"
                      disabled={isBusy}
                      role="option"
                      aria-selected={form.preferredTime === slot}
                      onClick={() => selectTimeSlot(slot)}
                      key={slot}
                    >
                      <span>{slot}</span>
                      {isBusy && <small>занято</small>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <label className="full-field" htmlFor="comment">
            Комментарий
            <textarea
              id="comment"
              value={form.comment}
              onChange={(event) => updateField('comment', event.target.value)}
              placeholder="Характер питомца, состояние шерсти или пожелания"
            />
          </label>
        </div>

        <div className="submit-wrap">
          <button className="button primary submit-button" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Отправляем' : 'Записать питомца'}</span>
            <PaperPlaneTilt size={20} weight="duotone" />
          </button>
          {celebrationKey > 0 && (
            <span className="success-burst" aria-hidden="true" key={celebrationKey}>
              {Array.from({ length: 10 }, (_, index) => (
                <span key={index} />
              ))}
            </span>
          )}
        </div>

        {successMessage && <p className="form-success">{successMessage}</p>}
      </form>
    </section>
  )
}
