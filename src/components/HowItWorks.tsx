const steps = [
  {
    icon: '📅',
    title: 'Выберите услугу',
    text: 'Просто и быстро',
  },
  {
    icon: '✍️',
    title: 'Заполните детали',
    text: 'О питомце',
  },
  {
    icon: '✅',
    title: 'Получите подтверждение',
    text: 'Мы свяжемся с вами',
  },
  {
    icon: '📍',
    title: 'Посетите салон',
    text: 'В назначенное время',
  },
]

export const HowItWorks = () => {
  return (
    <section className="section process-section">
      <h2 className="plain-heading">Как это работает</h2>

      <div className="process-line">
        {steps.map((step, index) => (
          <article className="process-step" key={step.title}>
            <span className="step-icon">{step.icon}</span>
            <strong>{index + 1}</strong>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
