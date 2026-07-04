import { groomers } from '../data/content'
import type { CSSProperties } from 'react'

export const Groomers = () => {
  return (
    <section className="section groomers-section" id="groomers">
      <div className="section-intro reveal">
        <span>Мастера</span>
        <h2>Люди, которым спокойно доверить питомца</h2>
        <p>
          Команда работает с разными темпераментами: от тревожных кошек до энергичных щенков.
        </p>
      </div>

      <div className="groomer-grid">
        {groomers.map((groomer, index) => (
          <article className="groomer-card reveal" style={{ '--reveal-index': index } as CSSProperties} key={groomer.name}>
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
    </section>
  )
}
