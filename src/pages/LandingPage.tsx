import { useEffect } from 'react'
import { Benefits } from '../components/Benefits'
import { BookingForm } from '../components/BookingForm'
import { Footer } from '../components/Footer'
import { Groomers } from '../components/Groomers'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Marquee } from '../components/Marquee'
import { Reviews } from '../components/Reviews'
import { Services } from '../components/Services'

export const LandingPage = () => {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1)

      if (!id) {
        return
      }

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return (
    <>
      <a className="skip-link" href="#content">
        К содержанию
      </a>
      <Header />
      <main id="content">
        <Hero />
        <Marquee />
        <Benefits />
        <Services />
        <HowItWorks />
        <Groomers />
        <Reviews />
        <BookingForm />
      </main>
      <Footer />
    </>
  )
}
