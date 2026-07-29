import { useEffect, useState } from 'react'
import { PawPrint } from '@phosphor-icons/react'

export const Header = () => {
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let previousScrollY = window.scrollY
    let frame = 0

    const handleScroll = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const scrollingDown = currentScrollY > previousScrollY

        if (currentScrollY < 80 || !scrollingDown) {
          setIsHidden(false)
        } else if (scrollingDown) {
          setIsHidden(true)
        }

        previousScrollY = currentScrollY
        frame = 0
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className={`site-header${isHidden ? ' site-header-hidden' : ''}`}>
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
