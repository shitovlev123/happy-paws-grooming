import { useMemo, useState } from 'react'
import { Clock, MapPin, PaperPlaneTilt, Phone } from '@phosphor-icons/react'
import { petTypeLabels, services } from '../data/content'
import { sendBookingRequest } from '../lib/bookingApi'
import type { FormEvent } from 'react'
import type { PetType } from '../types/booking'

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

export const BookingForm = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [celebrationKey, setCelebrationKey] = useState(0)

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) ?? services[0],
    [form.serviceId],
  )

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await sendBookingRequest({
        ...form,
        serviceName: selectedService.title,
      })
      setSuccessMessage('Запись отправлена на выбранные дату и время.')
      setCelebrationKey((current) => current + 1)
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
            src="https://www.openstreetmap.org/export/embed.html?bbox=37.5748%2C55.7323%2C37.5960%2C55.7429&layer=mapnik&marker=55.7376%2C37.5854"
            loading="lazy"
          />
          <a href="https://www.openstreetmap.org/?mlat=55.7376&mlon=37.5854#map=16/55.7376/37.5854">
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
              inputMode="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
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
              onChange={(event) => updateField('preferredDate', event.target.value)}
            />
          </label>
          <label htmlFor="preferredTime">
            Время
            <input
              id="preferredTime"
              required
              type="time"
              min="10:00"
              max="21:00"
              step="1800"
              value={form.preferredTime}
              onChange={(event) => updateField('preferredTime', event.target.value)}
            />
          </label>
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
