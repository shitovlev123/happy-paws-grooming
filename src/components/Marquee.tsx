const items = [
  'запись за минуту',
  'стоимость обсуждаем заранее',
  'фото после визита',
  'связь в Telegram и WhatsApp',
  'косметика под тип шерсти',
  'мастер учитывает характер питомца',
  'чистая светлая студия',
]

export const Marquee = () => {
  const content = [...items, ...items, ...items]

  return (
    <section className="marquee-section" aria-label="Коротко о салоне">
      <div className="marquee-track">
        {content.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  )
}
