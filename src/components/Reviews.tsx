import { Quotes } from '@phosphor-icons/react'
import { reviews } from '../data/content'
import type { CSSProperties } from 'react'

export const Reviews = () => {
  return (
    <section className="section reviews-section" id="reviews">
      <div className="review-lead reveal">
        <span>Отзывы</span>
        <h2>Когда питомцу спокойно, это видно сразу</h2>
      </div>

      <div className="review-grid">
        {reviews.slice(0, 3).map((review, index) => (
          <article className="review-card reveal" style={{ '--reveal-index': index } as CSSProperties} key={`${review.author}-${review.pet}`}>
            <Quotes size={30} weight="duotone" />
            <p>{review.text}</p>
            <strong>{review.author}</strong>
            <span>{review.pet}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
