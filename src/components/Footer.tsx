import { PawPrint } from '@phosphor-icons/react'

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div>
        <a className="footer-brand" href="/" aria-label="Happy Paws Grooming">
          <PawPrint size={24} weight="duotone" />
          <span>Happy Paws</span>
        </a>
        <p>Светлый grooming-салон для спокойного ухода за питомцами.</p>
      </div>
      <nav aria-label="Навигация в подвале">
        <a href="#services">Услуги</a>
        <a href="#process">Как проходит визит</a>
        <a href="#booking">Записаться</a>
      </nav>
    </footer>
  )
}
