import { CaretLeft, CaretRight, Quotes, Star } from '@phosphor-icons/react'
import { useState } from 'react'
import { reviews } from '../data/content'

export const Reviews = () => {
  const loopedReviews = [...reviews, ...reviews]
  const [activeReview, setActiveReview] = useState(0)
  const review = reviews[activeReview]

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
              <div className="review-stars" aria-label="Оценка 5 из 5">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star size={18} weight="fill" key={starIndex} />
                ))}
              </div>
              <Quotes className="review-quote" size={30} weight="duotone" />
              <p>{review.text}</p>
              <strong>{review.author}</strong>
              <span>{review.pet}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="review-mobile-picker">
        <article className="review-card">
          <div className="review-stars" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }, (_, starIndex) => (
              <Star size={18} weight="fill" key={starIndex} />
            ))}
          </div>
          <Quotes className="review-quote" size={30} weight="duotone" />
          <p>{review.text}</p>
          <strong>{review.author}</strong>
          <span>{review.pet}</span>
        </article>
        <div className="mobile-picker-controls">
          <span>{activeReview + 1} / {reviews.length}</span>
          <div>
            <button type="button" aria-label="Previous review" onClick={() => setActiveReview((activeReview - 1 + reviews.length) % reviews.length)}>
              <CaretLeft size={18} weight="bold" />
            </button>
            <button type="button" aria-label="Next review" onClick={() => setActiveReview((activeReview + 1) % reviews.length)}>
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
