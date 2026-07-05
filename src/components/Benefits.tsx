import { Cat, Dog, Heart, ShieldCheck } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const benefits = [
  {
    title: 'Питомцу дают привыкнуть',
    text: 'Перед уходом мастер знакомится с животным, смотрит шерсть и выбирает комфортный темп.',
    icon: Dog,
  },
  {
    title: 'Цена понятна заранее',
    text: 'До визита обсуждаем услугу, примерное время и итоговый диапазон стоимости.',
    icon: ShieldCheck,
  },
  {
    title: 'После визита есть связь',
    text: 'Отправляем фото, рекомендации по уходу дома и отвечаем на вопросы владельца.',
    icon: Cat,
  },
]

export const Benefits = () => {
  return (
    <section className="promise-section" aria-label="Обещание салона">
      <div className="promise-line">
        <span>понятная стоимость</span>
        <span>спокойное знакомство</span>
        <span>результат с фото</span>
      </div>

      <div className="promise-inner">
        <div className="promise-copy reveal">
          <span>Наш подход</span>
          <h2>Сначала внимание к питомцу, потом ножницы и фен</h2>
          <p>
            Владелец заранее понимает, что будет происходить на визите. Мастер смотрит
            шерсть, уточняет привычки питомца и подбирает уход под конкретную задачу.
          </p>
        </div>

        <div className="promise-sketch" aria-hidden="true">
          <Dog size={170} weight="thin" />
          <Heart size={54} weight="fill" />
          <Cat size={118} weight="thin" />
        </div>

        <div className="promise-grid">
          {benefits.map(({ title, text, icon: Icon }, index) => (
            <article className="sketch-card reveal" style={{ '--reveal-index': index } as CSSProperties} key={title}>
              <Icon size={42} weight="duotone" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
