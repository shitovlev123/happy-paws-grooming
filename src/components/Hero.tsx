import { useEffect, useRef, useState } from 'react'
import { InstagramLogo, MapPin, TelegramLogo, WhatsappLogo } from '@phosphor-icons/react'
import heroPoster from '../assets/hero-pets-calm.png'

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isSoftLooping, setIsSoftLooping] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    let softLooping = false
    const updateSoftLooping = (nextValue: boolean) => {
      if (softLooping === nextValue) {
        return
      }

      softLooping = nextValue
      setIsSoftLooping(nextValue)
    }

    const tuneVideo = () => {
      video.defaultPlaybackRate = 0.68
      video.playbackRate = 0.68
    }

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return
      }

      const remaining = video.duration - video.currentTime
      updateSoftLooping(remaining < 0.9 || video.currentTime < 0.35)
    }

    tuneVideo()
    video.addEventListener('loadedmetadata', tuneVideo)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('loadedmetadata', tuneVideo)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  return (
    <section className="hero" aria-labelledby="hero-title">
      <video
        className={`hero-video ${isSoftLooping ? 'is-soft-looping' : ''}`}
        poster={heroPoster}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
      >
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
            <a className="button secondary" href="#services">
              Смотреть услуги
            </a>
          </div>
        </div>

        <aside className="hero-card reveal" aria-label="Данные салона">
          <p className="hero-card-label">Сегодня в студии</p>
          <div>
            <span>Часы</span>
            <strong>10:00-21:00</strong>
          </div>
          <div>
            <span>Адрес</span>
            <strong>ул. Плющиха, 27</strong>
          </div>
          <div>
            <span>Отзывы</span>
            <strong>4,8 по 317 оценкам</strong>
          </div>
          <a className="hero-location" href="#contacts">
            <MapPin size={18} weight="duotone" />
            Москва, Хамовники
          </a>
          <div className="hero-socials" aria-label="Социальные сети">
            <a href="#contacts" aria-label="Instagram">
              <InstagramLogo size={20} weight="duotone" />
            </a>
            <a href="#contacts" aria-label="Telegram">
              <TelegramLogo size={20} weight="duotone" />
            </a>
            <a href="#contacts" aria-label="WhatsApp">
              <WhatsappLogo size={20} weight="duotone" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
