import { useMemo, useState } from 'react'
import { CalendarCheck, Send } from 'lucide-react'
import { petTypeLabels, services } from '../data/content'
import { bookingStorage } from '../lib/storage'
import { formatTelegramMessage, notifyTelegram } from '../lib/telegram'
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
  const [telegramPreview, setTelegramPreview] = useState('')

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) ?? services[0],
    [form.serviceId],
  )

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const booking = bookingStorage.create({
      ...form,
      serviceName: selectedService.title,
    })

    setTelegramPreview(formatTelegramMessage(booking))
    setSuccessMessage('Заявка сохранена. Администратор увидит ее в CRM-админке.')
    setForm(initialForm)

    try {
      await notifyTelegram(booking)
    } catch {
      setSuccessMessage(
        'Заявка сохранена. Telegram endpoint пока не отвечает, но сообщение сформировано.',
      )
    }
  }

  return (
    <section className="section booking-section" id="booking">
      <div className="booking-copy">
        <span className="section-kicker">Онлайн-запись</span>
        <h2>Оставьте заявку, а администратор подтвердит удобное время</h2>
        <p>
          Форма сохраняет заявку в localStorage, показывает ее в `/admin` и готовит сообщение для
          Telegram-бота. Это демонстрирует полный путь малого бизнеса: сайт, CRM и уведомления.
        </p>
        <div className="booking-note">
          <CalendarCheck size={22} />
          <span>CRM-статус заявки начинается с “новая”.</span>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
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
              placeholder="Шпиц, мейн-кун..."
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
            Желаемая дата
            <input
              id="preferredDate"
              required
              value={form.preferredDate}
              onChange={(event) => updateField('preferredDate', event.target.value)}
              placeholder="10.07.2026"
            />
          </label>
          <label className="full-field" htmlFor="comment">
            Комментарий
            <textarea
              id="comment"
              value={form.comment}
              onChange={(event) => updateField('comment', event.target.value)}
              placeholder="Расскажите о характере питомца, состоянии шерсти или пожеланиях"
            />
          </label>
        </div>

        <button className="button primary submit-button" type="submit">
          <Send size={18} />
          Отправить заявку
        </button>

        {successMessage && <p className="form-success">{successMessage}</p>}
        {telegramPreview && (
          <pre className="telegram-preview" aria-label="Telegram сообщение">
            {telegramPreview}
          </pre>
        )}
      </form>
    </section>
  )
}
