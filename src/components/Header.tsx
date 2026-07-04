import { CalendarCheck, LayoutDashboard, PawPrint } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Happy Paws Grooming">
        <span className="brand-mark">
          <PawPrint size={22} />
        </span>
        <span>
          <strong>Happy Paws</strong>
          <small>Grooming studio</small>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Основная навигация">
        <a href="/#services">Услуги</a>
        <a href="/#booking">Запись</a>
        <NavLink to="/admin">
          <LayoutDashboard size={18} />
          Админка
        </NavLink>
      </nav>

      <a className="header-action" href="/#booking">
        <CalendarCheck size={18} />
        Записать
      </a>
    </header>
  )
}
