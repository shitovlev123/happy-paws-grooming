import { groomers } from '../data/content'

export const Groomers = () => {
  const tracks = [0, 1]
  const marqueeGroomers = [...groomers, ...groomers]

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
        {tracks.map((trackIndex) => (
          <div className="groomer-track" aria-hidden={trackIndex > 0} key={trackIndex}>
            {marqueeGroomers.map((groomer, groomerIndex) => (
              <article className="groomer-card" key={`${groomer.name}-${trackIndex}-${groomerIndex}`}>
                <div className="groomer-photo" style={{ background: groomer.tone }}>
                  <img className="groomer-avatar" src={groomer.avatar} alt="" decoding="async" />
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
        ))}
      </div>
    </section>
  )
}
