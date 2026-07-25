import { ArrowUpRight, MapPin, Star } from '@phosphor-icons/react'

export const Hero = () => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-copy">
        <p className="hero-note">Салон для собак и кошек в Хамовниках</p>
        <h1 id="hero-title">
          <span>Счастливые</span>{' '}
          <span>лапки</span>
        </h1>
      </div>
    </div>

    <div className="hero-pet-stage">
      <div className="hero-pet-column hero-pet-left">
        <div className="hero-pet-crop">
          <img src="/cozypaws/pet-left.png" alt="" />
        </div>
        <div className="hero-panel hero-panel-rating">
          <div className="hero-panel-content">
            <Star size={25} weight="fill" />
            <span className="hero-panel-copy">
              <strong>4,9</strong>
              <span>средняя оценка гостей</span>
            </span>
          </div>
        </div>
      </div>

      <div className="hero-pet-column hero-pet-center">
        <div className="hero-pet-crop">
          <img src="/cozypaws/pet-center.png" alt="" />
        </div>
        <div className="hero-panel hero-panel-action">
          <div className="hero-booking-wrap">
            <a className="button hero-booking-button" href="#booking">
              <span className="hero-booking-label-full">Записать питомца</span>
              <span className="hero-booking-label-short">Записаться</span>
              <ArrowUpRight size={21} weight="bold" />
            </a>
          </div>
        </div>
      </div>

      <div className="hero-pet-column hero-pet-right">
        <div className="hero-pet-crop">
          <img src="/cozypaws/pet-right.png" alt="" />
        </div>
        <div className="hero-panel hero-panel-location">
          <div className="hero-panel-content">
            <MapPin size={27} weight="fill" />
            <span className="hero-panel-copy">
              <strong>Хамовники</strong>
              <span>Москва, ул. Плющиха, 27</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
)
