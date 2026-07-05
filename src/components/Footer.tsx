import {
  Clock,
  EnvelopeSimple,
  InstagramLogo,
  MapPin,
  PawPrint,
  Phone,
  TelegramLogo,
  WhatsappLogo,
} from '@phosphor-icons/react'

export const Footer = () => {
  return (
    <footer className="site-footer" id="contacts">
      <div className="footer-main">
        <a className="footer-brand" href="/" aria-label="Счастливые лапки">
          <PawPrint size={24} weight="duotone" />
          <span>Счастливые лапки</span>
        </a>
        <p>
          Светлый груминг-салон в Хамовниках: аккуратные стрижки, мягкая косметика
          и спокойная атмосфера для собак и кошек.
        </p>
        <div className="footer-socials" aria-label="Социальные сети">
          <a href="#contacts" aria-label="Instagram">
            <InstagramLogo size={22} weight="duotone" />
          </a>
          <a href="#contacts" aria-label="Telegram">
            <TelegramLogo size={22} weight="duotone" />
          </a>
          <a href="#contacts" aria-label="WhatsApp">
            <WhatsappLogo size={22} weight="duotone" />
          </a>
        </div>
      </div>

      <address className="footer-contacts">
        <a href="tel:+79253184211">
          <Phone size={20} weight="duotone" />
          +7 925 318-42-11
        </a>
        <a href="mailto:hello@lapki.grooming">
          <EnvelopeSimple size={20} weight="duotone" />
          hello@lapki.grooming
        </a>
        <a href="#contacts">
          <MapPin size={20} weight="duotone" />
          Москва, ул. Плющиха, 27
        </a>
        <span>
          <Clock size={20} weight="duotone" />
          Пн-вс 10:00-21:00
        </span>
      </address>

      <nav className="footer-nav" aria-label="Навигация в подвале">
        <a href="#services">Услуги</a>
        <a href="#groomers">Мастера</a>
        <a href="#reviews">Отзывы</a>
        <a href="#booking">Запись</a>
      </nav>
    </footer>
  )
}
