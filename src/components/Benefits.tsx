import { CalendarCheck, Drop, Heart, ShieldCheck } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const benefits = [
  {
    title: 'Тихий подход',
    text: 'Без спешки, резких движений и лишнего стресса для питомца.',
    icon: Heart,
  },
  {
    title: 'Чистая студия',
    text: 'Инструменты проходят обработку, рабочие зоны готовятся перед каждым визитом.',
    icon: ShieldCheck,
  },
  {
    title: 'Мягкая косметика',
    text: 'Средства подбираются под шерсть, кожу и чувствительность животного.',
    icon: Drop,
  },
  {
    title: 'Простая запись',
    text: 'Оставьте заявку на сайте, а мы согласуем удобное время.',
    icon: CalendarCheck,
  },
]

export const Benefits = () => {
  return (
    <section className="section benefits-section" aria-label="Преимущества Happy Paws">
      <div className="benefit-grid">
        {benefits.map(({ title, text, icon: Icon }, index) => (
          <article className="benefit-card reveal" style={{ '--reveal-index': index } as CSSProperties} key={title}>
            <Icon size={28} weight="duotone" />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
