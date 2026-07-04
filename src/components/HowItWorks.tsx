const steps = [
  'Клиент выбирает услугу',
  'Оставляет заявку',
  'Заявка сохраняется в базе',
  'Администратор получает Telegram-сообщение',
  'Запись подтверждается в CRM',
]

export const HowItWorks = () => {
  return (
    <section className="section process-section">
      <div className="section-heading">
        <span className="section-kicker">Как это работает</span>
        <h2>Мини-система закрывает путь от лендинга до подтвержденной записи</h2>
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
