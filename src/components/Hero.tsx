import heroPets from '../assets/hero-pets-calm.png'

export const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src={heroPets} alt="Собака и кот отдыхают в светлом груминг-салоне" />
      <div className="hero-overlay" />
      <div className="hero-copy reveal">
        <p className="hero-note">Спокойный груминг для собак и кошек</p>
        <h1 id="hero-title">Забота, после которой питомец сияет</h1>
        <p>
          Бережный уход, чистая студия и мастера, которые умеют работать спокойно. Запишите питомца
          на удобный день, мы подтвердим визит.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#booking">
            Записаться
          </a>
          <a className="button secondary" href="#services">
            Услуги
          </a>
        </div>
      </div>
    </section>
  )
}
