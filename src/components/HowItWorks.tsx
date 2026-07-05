import { ChatCircleText, CheckCircle, Clock, PawPrint } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const steps = [
  {
    title: 'Вы выбираете уход',
    text: 'Один сервис, экспресс-уход или полный груминг.',
    icon: PawPrint,
  },
  {
    title: 'Мы уточняем детали',
    text: 'Порода, шерсть, характер питомца и пожелания по образу.',
    icon: ChatCircleText,
  },
  {
    title: 'Подбираем время',
    text: 'Согласуем удобный слот и заранее называем ориентир по цене.',
    icon: Clock,
  },
  {
    title: 'Питомец приезжает',
    text: 'Мастер ведет уход мягко, внимательно и в спокойной обстановке.',
    icon: CheckCircle,
  },
]

export const HowItWorks = () => {
  return (
    <section className="section process-section" id="process">
      <div className="section-intro narrow reveal">
        <span>Как проходит визит</span>
        <h2>Понятный маршрут от записи до чистых лапок</h2>
      </div>

      <div className="process-line">
        {steps.map(({ title, text, icon: Icon }, index) => (
          <article className="process-step reveal" style={{ '--reveal-index': index } as CSSProperties} key={title}>
            <span className="process-index">{String(index + 1).padStart(2, '0')}</span>
            <Icon size={30} weight="duotone" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
