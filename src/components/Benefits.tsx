import { Cat, Dog, Heart, ShieldCheck } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

const benefits = [
  {
    title: 'Спокойная посадка',
    text: 'Даем питомцу освоиться, работаем без рывков и не торопим тревожных гостей.',
    icon: Dog,
  },
  {
    title: 'Честная цена',
    text: 'До визита называем диапазон стоимости и объясняем, что входит в уход.',
    icon: ShieldCheck,
  },
  {
    title: 'Забота после визита',
    text: 'Отправляем фото, рекомендации по шерсти и напоминаем о следующем уходе.',
    icon: Cat,
  },
]

export const Benefits = () => {
  return (
    <section className="promise-section" aria-label="Обещание салона">
      <div className="promise-line">
        <span>без суеты</span>
        <span>без скрытых доплат</span>
        <span>без грубого обращения</span>
      </div>

      <div className="promise-inner">
        <div className="promise-copy reveal">
          <span>Наш подход</span>
          <h2>Питомец сначала чувствует руки мастера, потом видит инструменты</h2>
          <p>
            В салоне тихо, светло и достаточно воздуха. Мастер знакомится с характером
            питомца, подбирает косметику и держит владельца в курсе результата.
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
