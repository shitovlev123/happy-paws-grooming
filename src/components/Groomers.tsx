import { groomers } from '../data/content'

export const Groomers = () => {
  return (
    <section className="section groomers-section" id="groomers">
      <h2 className="plain-heading">Наши мастера</h2>

      <div className="groomer-grid">
        {groomers.map((groomer) => (
          <article className="groomer-card" key={groomer.name}>
            <div className="groomer-photo" style={{ background: groomer.tone }}>
              <span>{groomer.initials}</span>
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
