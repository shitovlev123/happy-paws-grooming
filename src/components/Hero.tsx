import heroPoster from '../assets/hero-pets-calm.png'

export const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <video className="hero-video" poster={heroPoster} autoPlay muted playsInline preload="auto">
        <source src="/happy-paws-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div className="hero-copy reveal">
          <p className="hero-note">Салон для собак и кошек в Хамовниках</p>
          <h1 id="hero-title">Счастливые лапки</h1>
          <p>
            Аккуратный груминг в светлой студии: стрижка, купание, SPA-уход
            и внимательный мастер рядом с питомцем на каждом этапе.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#booking">
              Записать питомца
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
