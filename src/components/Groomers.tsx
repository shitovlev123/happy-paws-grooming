import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Fragment, useState } from 'react'
import { groomers } from '../data/content'

export const Groomers = () => {
  const loopGroups = Array.from({ length: 8 }, (_, index) => index)
  const [activeGroomer, setActiveGroomer] = useState(0)
  const groomer = groomers[activeGroomer]

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
          {loopGroups.map((groupIndex) => (
            <Fragment key={groupIndex}>
              {groomers.map((groomer) => (
                <article
                  className="groomer-card"
                  aria-hidden={groupIndex > 0}
                  key={`${groomer.name}-${groupIndex}`}
                >
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
            </Fragment>
          ))}
        </div>
      </div>
      <div className="groomer-mobile-picker">
        <article className="groomer-card">
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
        <div className="mobile-picker-controls">
          <span>{activeGroomer + 1} / {groomers.length}</span>
          <div>
            <button type="button" aria-label="Previous groomer" onClick={() => setActiveGroomer((activeGroomer - 1 + groomers.length) % groomers.length)}>
              <CaretLeft size={18} weight="bold" />
            </button>
            <button type="button" aria-label="Next groomer" onClick={() => setActiveGroomer((activeGroomer + 1) % groomers.length)}>
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
