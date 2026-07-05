import { Quotes } from '@phosphor-icons/react'
import { reviews } from '../data/content'

export const Reviews = () => {
  const loopedReviews = [...reviews, ...reviews]

  return (
    <section className="section reviews-section" id="reviews">
      <div className="review-lead reveal">
        <span>Отзывы</span>
        <h2>Отзывы владельцев</h2>
        <div className="review-score">
          <strong>4,8</strong>
          <p>средняя оценка по 317 отзывам владельцев</p>
        </div>
      </div>

      <div className="review-stream" aria-label="Отзывы клиентов">
        <div className="review-track">
          {loopedReviews.map((review, index) => (
            <article
              className="review-card"
              aria-hidden={index >= reviews.length}
              key={`${review.author}-${review.pet}-${index}`}
            >
              <Quotes size={30} weight="duotone" />
              <p>{review.text}</p>
              <strong>{review.author}</strong>
              <span>{review.pet}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
