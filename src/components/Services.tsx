import {
  Bathtub,
  Broom,
  Cat,
  Dog,
  Heart,
  Scissors,
  Sparkle,
  SprayBottle,
  WaveSawtooth,
} from '@phosphor-icons/react'
import { services } from '../data/content'
import { emitServiceSelection } from '../lib/serviceSelection'
import type { ComponentType, CSSProperties } from 'react'

const serviceIcons: Record<string, ComponentType<{ size?: number; weight?: 'regular' | 'duotone' }>> = {
  'full-grooming': Sparkle,
  haircut: Scissors,
  bath: Bathtub,
  deshedding: Broom,
  nails: WaveSawtooth,
  'express-care': SprayBottle,
}

export const Services = () => {
  return (
    <section className="section services-section" id="services">
      <div className="section-intro reveal">
        <span>Услуги</span>
        <h2>Уход под шерсть, характер и настроение питомца</h2>
      </div>

      <div className="service-grid">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.id] ?? Sparkle

          return (
            <a
              className={`service-card reveal ${index === 0 ? 'featured-service' : ''}`}
              href="#booking"
              onClick={() => emitServiceSelection(service.id)}
              style={{ '--reveal-index': index } as CSSProperties}
              aria-label={`Выбрать услугу ${service.title}`}
              key={service.id}
            >
              <div className="service-card-top">
                <span className="service-icon">
                  <Icon size={28} weight="duotone" />
                </span>
                <span className="service-duration">{service.duration}</span>
              </div>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <div className="service-footer">
                <strong>{service.price}</strong>
                <span className="service-card-hint">Выбрать услугу</span>
              </div>
            </a>
          )
        })}
        <article
          className="service-pet-card reveal"
          style={{ '--reveal-index': services.length } as CSSProperties}
          aria-hidden="true"
        >
          <div className="service-pet-sketch">
            <Dog size={184} weight="thin" />
            <Heart size={56} weight="fill" />
            <Cat size={126} weight="thin" />
          </div>
        </article>
      </div>
    </section>
  )
}
