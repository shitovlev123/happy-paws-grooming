import { PawPrint } from '@phosphor-icons/react'

export const Header = () => {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Счастливые лапки">
        <span className="brand-mark">
          <PawPrint size={24} weight="duotone" />
        </span>
        <span>
          <strong>Счастливые лапки</strong>
          <small>груминг-салон</small>
        </span>
      </a>

      <nav className="nav-links" aria-label="Основная навигация">
        <a href="#services">Услуги</a>
        <a href="#groomers">Мастера</a>
        <a href="#reviews">Отзывы</a>
        <a href="#contacts">Контакты</a>
      </nav>

      <a className="header-action" href="#booking">
        Записаться
      </a>
    </header>
  )
}
