import { PawPrint } from '@phosphor-icons/react'

export const Header = () => {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Happy Paws Grooming">
        <span className="brand-mark">
          <PawPrint size={24} weight="duotone" />
        </span>
        <span>
          <strong>Happy Paws</strong>
          <small>grooming salon</small>
        </span>
      </a>

      <nav className="nav-links" aria-label="Основная навигация">
        <a href="#services">Услуги</a>
        <a href="#process">Как проходит визит</a>
        <a href="#groomers">Мастера</a>
        <a href="#reviews">Отзывы</a>
      </nav>

      <a className="header-action" href="#booking">
        Записаться
      </a>
    </header>
  )
}
