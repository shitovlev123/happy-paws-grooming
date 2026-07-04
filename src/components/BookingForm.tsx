import { useMemo, useState } from 'react'
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
  comment: '',
}

export const BookingForm = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setSuccessMessage('Спасибо! Мы получили заявку и скоро свяжемся для подтверждения.')
      setForm(initialForm)
    } catch {
      setSuccessMessage('Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="booking-section" id="booking">
      <h2>Готовы к счастливому дню груминга?</h2>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="ownerName">
            <span>Ваше имя</span>
            <input
              id="ownerName"
              required
              value={form.ownerName}
              onChange={(event) => updateField('ownerName', event.target.value)}
              placeholder="Анна"
            />
          </label>
          <label htmlFor="phone">
            <span>Телефон</span>
            <input
              id="phone"
              required
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+7 999 123-45-67"
            />
          </label>
          <label htmlFor="petName" className="full-field">
            <span>Имя питомца</span>
            <input
              id="petName"
              required
              value={form.petName}
              onChange={(event) => updateField('petName', event.target.value)}
              placeholder="Молли"
            />
          </label>
          <label htmlFor="petType" className="full-field">
            <span>Тип питомца</span>
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
          <label htmlFor="breed" className="full-field">
            <span>Порода</span>
            <input
              id="breed"
              value={form.breed}
              onChange={(event) => updateField('breed', event.target.value)}
              placeholder="Шпиц, мейн-кун..."
            />
          </label>
          <label htmlFor="serviceId" className="full-field">
            <span>Услуга</span>
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
          <label htmlFor="preferredDate" className="full-field">
            <span>Предпочтительная дата</span>
            <input
              id="preferredDate"
              required
              value={form.preferredDate}
              onChange={(event) => updateField('preferredDate', event.target.value)}
              placeholder="10.07.2026"
            />
          </label>
          <label className="full-field" htmlFor="comment">
            <span>Комментарий</span>
            <textarea
              id="comment"
              value={form.comment}
              onChange={(event) => updateField('comment', event.target.value)}
              placeholder="Особенности характера, шерсти или пожелания"
            />
          </label>
        </div>

        <button className="button primary submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
        </button>

        {successMessage && <p className="form-success">{successMessage}</p>}
      </form>
    </section>
  )
}
