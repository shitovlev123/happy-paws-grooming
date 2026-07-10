import { useEffect, useRef } from 'react'

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return undefined
    }

    const startVideo = () => {
      video.defaultMuted = true
      video.muted = true
      video.setAttribute('muted', '')
      void video.play().catch(() => undefined)
    }

    startVideo()
    video.addEventListener('loadeddata', startVideo)

    return () => video.removeEventListener('loadeddata', startVideo)
  }, [])

  return (
    <section className="hero" aria-labelledby="hero-title">
      <video ref={videoRef} className="hero-video" autoPlay muted playsInline preload="auto">
        <source src="/happy-paws-hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div className="hero-copy reveal">
          <p className="hero-note">Салон для собак и кошек в Хамовниках</p>
          <h1 id="hero-title">Счастливые лапки</h1>
          <div className="hero-actions">
            <a className="button primary" href="#booking">
              Записать питомца
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
