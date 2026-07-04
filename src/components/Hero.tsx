import { ShieldCheck, Star } from 'lucide-react'
import heroPets from '../assets/hero-pets.png'

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Бережный груминг для счастливых питомцев</h1>
        <p>
          Профессиональный уход и забота для ваших пушистых друзей. Полный цикл груминга для собак и кошек
          в уютной, теплой обстановке.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#booking">
            Записать питомца
          </a>
          <a className="button secondary" href="#services">
            Посмотреть услуги
          </a>
        </div>
      </div>

      <div className="hero-media" aria-label="Счастливые питомцы после груминга">
        <img src={heroPets} alt="Счастливые собака и кот в светлом grooming-салоне" />
        <div className="floating-badge rating-badge">
          <strong>4.9/5 Рейтинг</strong>
          <span>
            <Star size={13} fill="currentColor" />
            <Star size={13} fill="currentColor" />
            <Star size={13} fill="currentColor" />
            <Star size={13} fill="currentColor" />
            <Star size={13} fill="currentColor" />
          </span>
          <small>250+ отзывов</small>
        </div>
        <div className="floating-badge safe-badge">
          <ShieldCheck size={22} />
          <span>
            <strong>Safe продукты</strong>
            <small>Нежные и мягкие</small>
          </span>
        </div>
      </div>
    </section>
  )
}
