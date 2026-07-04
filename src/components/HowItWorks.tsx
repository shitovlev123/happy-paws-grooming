const steps = [
  'Клиент выбирает услугу',
  'Заполняет короткую форму',
  'Мы уточняем детали ухода',
  'Подтверждаем удобное время',
  'Питомец приезжает на спокойный уход',
]

export const HowItWorks = () => {
  return (
    <section className="section process-section">
      <div className="section-heading">
        <span className="section-kicker">Как это работает</span>
        <h2>Записаться просто: несколько шагов, и визит уже согласован</h2>
      </div>

      <div className="process-line">
        {steps.map((step, index) => (
          <article className="process-step" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
