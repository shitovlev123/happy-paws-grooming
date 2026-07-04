import {
  Bathtub,
  Broom,
  Scissors,
  Sparkle,
  SprayBottle,
  WaveSawtooth,
} from '@phosphor-icons/react'
import { services } from '../data/content'
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
        <h2>Уход под характер, шерсть и настроение питомца</h2>
        <p>
          Можно выбрать быстрый визит или полный ритуал ухода. В каждой услуге важны спокойствие,
          чистота и понятный результат.
        </p>
      </div>

      <div className="service-grid">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.id] ?? Sparkle

          return (
            <article
              className={`service-card reveal ${index === 0 ? 'featured-service' : ''}`}
              style={{ '--reveal-index': index } as CSSProperties}
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
                <a href="#booking">Записаться</a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
