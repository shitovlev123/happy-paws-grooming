import { PawPrint } from 'lucide-react'

export const Header = () => {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Happy Paws Grooming">
        <span className="brand-mark">
          <PawPrint size={24} />
        </span>
        <strong>Счастливые Лапки</strong>
      </a>

      <nav className="nav-links" aria-label="Основная навигация">
        <a href="#services">Услуги</a>
        <a href="#services">Цены</a>
        <a href="#groomers">О нас</a>
        <a href="#booking">Контакты</a>
        <a href="#reviews">Отзывы</a>
      </nav>

      <a className="header-action" href="#booking">
        Записаться
      </a>
    </header>
  )
}
