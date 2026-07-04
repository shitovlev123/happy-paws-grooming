import { BellRing, CalendarClock, HeartHandshake, ShieldCheck, Sparkle } from 'lucide-react'

const benefits = [
  {
    title: 'Бережный уход',
    text: 'Работаем спокойно, без резких движений и лишнего стресса.',
    icon: HeartHandshake,
  },
  {
    title: 'Опытные грумеры',
    text: 'Подбираем подход под породу, шерсть и темперамент питомца.',
    icon: Sparkle,
  },
  {
    title: 'Безопасная косметика',
    text: 'Используем профессиональные средства для чувствительной кожи.',
    icon: ShieldCheck,
  },
  {
    title: 'Онлайн-запись',
    text: 'Выберите услугу и оставьте контакты в удобной короткой форме.',
    icon: CalendarClock,
  },
  {
    title: 'Быстрые уведомления',
    text: 'Мы оперативно связываемся, чтобы подтвердить визит и детали ухода.',
    icon: BellRing,
  },
]

export const Benefits = () => {
  return (
    <section className="section compact" id="benefits">
      <div className="section-heading">
        <span className="section-kicker">Почему выбирают нас</span>
        <h2>Уютный сервис, который чувствуется с первой записи</h2>
      </div>
      <div className="benefit-grid">
        {benefits.map(({ title, text, icon: Icon }) => (
          <article className="benefit-card" key={title}>
            <span className="icon-bubble">
              <Icon size={22} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
