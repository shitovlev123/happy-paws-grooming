import { services } from '../data/content'

const serviceIcons: Record<string, string> = {
  'full-grooming': '🛁',
  haircut: '✂',
  bath: '🧼',
  deshedding: '🪮',
  nails: '💅',
  'express-care': '✨',
}

export const Services = () => {
  return (
    <section className="section" id="services">
      <h2 className="plain-heading">Услуги</h2>

      <div className="service-grid">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <span className="service-icon" aria-hidden="true">
              {serviceIcons[service.id] ?? '🐾'}
            </span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-footer">
              <strong>{service.price}</strong>
              <a href="#booking">Заказать</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
