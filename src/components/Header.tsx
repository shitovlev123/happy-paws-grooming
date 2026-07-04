import { CalendarCheck, PawPrint } from 'lucide-react'

export const Header = () => {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Happy Paws Grooming">
        <span className="brand-mark">
          <PawPrint size={22} />
        </span>
        <span>
          <strong>Happy Paws</strong>
          <small>Grooming studio</small>
        </span>
      </a>

      <nav className="nav-links" aria-label="Основная навигация">
        <a href="#services">Услуги</a>
        <a href="#benefits">Преимущества</a>
        <a href="#booking">Запись</a>
      </nav>

      <a className="header-action" href="#booking">
        <CalendarCheck size={18} />
        Записать
      </a>
    </header>
  )
}
