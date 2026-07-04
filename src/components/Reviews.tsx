import { reviews } from '../data/content'

export const Reviews = () => {
  return (
    <section className="section reviews-section" id="reviews">
      <h2 className="plain-heading">Отзывы людей</h2>

      <div className="review-grid">
        {reviews.slice(0, 3).map((review) => (
          <article className="review-card" key={`${review.author}-${review.pet}`}>
            <span className="review-avatar" aria-hidden="true">
              🐶
            </span>
            <p>{review.text}</p>
            <strong>
              {review.author} / {review.pet}
            </strong>
            <small>★★★★★</small>
          </article>
        ))}
      </div>
    </section>
  )
}
