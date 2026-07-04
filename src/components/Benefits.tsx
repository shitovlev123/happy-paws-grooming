import { BellRing, CalendarClock, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

const benefits = [
  {
    title: 'Бережный уход',
    text: 'Care with love',
    icon: HeartHandshake,
    tone: 'pink',
  },
  {
    title: 'Опытные грумеры',
    text: 'Certified staff',
    icon: Sparkles,
    tone: 'yellow',
  },
  {
    title: 'Безопасная косметика',
    text: 'Natural products',
    icon: ShieldCheck,
    tone: 'green',
  },
  {
    title: 'Онлайн-запись',
    text: 'Удобное время',
    icon: CalendarClock,
    tone: 'blue',
  },
  {
    title: 'Напоминания',
    text: 'Быстрая связь',
    icon: BellRing,
    tone: 'peach',
  },
]

export const Benefits = () => {
  return (
    <section className="section compact" id="benefits">
      <h2 className="plain-heading">Преимущества</h2>
      <div className="benefit-grid">
        {benefits.map(({ title, text, icon: Icon, tone }) => (
          <article className="benefit-card" key={title}>
            <span className={`icon-bubble ${tone}`}>
              <Icon size={25} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
