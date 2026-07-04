import { CalendarPlus } from 'lucide-react'
import { services } from '../data/content'
import type { CSSProperties } from 'react'

export const Services = () => {
  return (
    <section className="section" id="services">
      <div className="section-heading row-heading">
        <div>
          <span className="section-kicker">Меню ухода</span>
          <h2>Услуги для чистой шерсти, аккуратной формы и спокойного визита</h2>
        </div>
        <p>
          Каждая карточка ведет к форме записи, где услуга уже понятна администратору.
        </p>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article
            className="service-card"
            key={service.id}
            style={{ '--accent': service.accent } as CSSProperties}
          >
            <div>
              <span className="service-duration">{service.duration}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div className="service-footer">
              <strong>{service.price}</strong>
              <a className="icon-link" href="#booking">
                <CalendarPlus size={18} />
                Записаться
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
