import { Benefits } from '../components/Benefits'
import { BookingForm } from '../components/BookingForm'
import { Footer } from '../components/Footer'
import { Groomers } from '../components/Groomers'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Reviews } from '../components/Reviews'
import { Services } from '../components/Services'

export const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
