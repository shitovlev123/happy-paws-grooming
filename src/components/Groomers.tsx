import { groomers } from '../data/content'

export const Groomers = () => {
  return (
    <section className="section">
      <div className="section-heading row-heading">
        <div>
          <span className="section-kicker">Команда</span>
          <h2>Мастера, которым спокойно доверить питомца</h2>
        </div>
        <p>Фото-заглушки оформлены как аккуратные карточки команды для MVP-кейса.</p>
      </div>

      <div className="groomer-grid">
        {groomers.map((groomer) => (
          <article className="groomer-card" key={groomer.name}>
            <div className="groomer-photo" style={{ background: groomer.tone }}>
              {groomer.initials}
            </div>
            <h3>{groomer.name}</h3>
            <strong>{groomer.role}</strong>
            <span>{groomer.experience}</span>
            <p>{groomer.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
