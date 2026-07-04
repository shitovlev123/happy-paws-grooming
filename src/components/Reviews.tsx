import { Quote } from 'lucide-react'
import { reviews } from '../data/content'

export const Reviews = () => {
  return (
    <section className="section reviews-section">
      <div className="section-heading">
        <span className="section-kicker">Отзывы</span>
        <h2>Владельцы ценят спокойствие питомца и удобство записи</h2>
      </div>

      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={`${review.author}-${review.pet}`}>
            <Quote size={24} />
            <p>{review.text}</p>
            <strong>{review.author}</strong>
            <span>{review.pet}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
