const items = [
  'без клеток ожидания',
  'цена понятна заранее',
  'фото после визита',
  'связь в Telegram и WhatsApp',
  'мягкая косметика',
  'мастер под характер питомца',
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
