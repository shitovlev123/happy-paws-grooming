import { ChatCircleText, CheckCircle, Clock, PawPrint } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const steps = [
  {
    title: 'Вы выбираете уход',
    text: 'Один сервис или комплексный визит.',
    icon: PawPrint,
  },
  {
    title: 'Мы уточняем детали',
    text: 'Порода, шерсть, характер и пожелания.',
    icon: ChatCircleText,
  },
  {
    title: 'Подтверждаем время',
    text: 'Администратор согласует запись.',
    icon: Clock,
  },
  {
    title: 'Питомец приезжает спокойно',
    text: 'Мастер ведет уход мягко и внимательно.',
    icon: CheckCircle,
  },
]

export const HowItWorks = () => {
  return (
    <section className="section process-section" id="process">
      <div className="section-intro narrow reveal">
        <span>Как проходит визит</span>
        <h2>Понятный маршрут без суеты</h2>
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
