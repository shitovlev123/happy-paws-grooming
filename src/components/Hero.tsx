import { ArrowDown, CalendarDays, Sparkles } from 'lucide-react'
import heroPets from '../assets/hero-pets.png'

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={17} />
          Бережный груминг без суеты
        </span>
        <h1>Салон красоты и заботы для счастливых питомцев</h1>
        <p>
          Happy Paws Grooming помогает собакам и котам выглядеть ухоженно, а владельцам
          спокойно планировать визит через понятную онлайн-запись.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#booking">
            <CalendarDays size={19} />
            Записать питомца
          </a>
          <a className="button secondary" href="#services">
            <ArrowDown size={19} />
            Посмотреть услуги
          </a>
        </div>
      </div>

      <div className="hero-media" aria-label="Счастливая собака и спокойный кот после груминга">
        <img src={heroPets} alt="Счастливые собака и кот в светлом grooming-салоне" />
        <div className="hero-note">
          <strong>97%</strong>
          <span>клиентов возвращаются на повторный уход</span>
        </div>
      </div>
    </section>
  )
}
