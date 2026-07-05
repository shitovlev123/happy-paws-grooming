import { groomers } from '../data/content'

export const Groomers = () => {
  const loopedGroomers = [...groomers, ...groomers]

  return (
    <section className="section groomers-section" id="groomers">
      <div className="section-intro reveal">
        <span>Мастера</span>
        <h2>Мастера, которым спокойно доверить питомца</h2>
        <p>
          Команда работает с разными породами, типами шерсти и темпераментами.
          Вы заранее понимаете, кто будет заниматься питомцем и какой уход подойдет.
        </p>
      </div>

      <div className="groomer-marquee" aria-label="Мастера салона">
        <div className="groomer-track">
          {loopedGroomers.map((groomer, index) => (
            <article className="groomer-card" aria-hidden={index >= groomers.length} key={`${groomer.name}-${index}`}>
              <div className="groomer-photo" style={{ background: groomer.tone }}>
                <span>{groomer.initials}</span>
              </div>
              <div className="groomer-body">
                <h3>{groomer.name}</h3>
                <strong>{groomer.role}</strong>
                <span>{groomer.experience}</span>
                <p>{groomer.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
