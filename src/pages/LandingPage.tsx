import { Benefits } from '../components/Benefits'
import { BookingForm } from '../components/BookingForm'
import { Groomers } from '../components/Groomers'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { Reviews } from '../components/Reviews'
import { Services } from '../components/Services'

export const LandingPage = () => {
  return (
    <div className="site-frame">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <HowItWorks />
        <div className="bottom-showcase">
          <div className="bottom-content">
            <Groomers />
            <Reviews />
          </div>
          <BookingForm />
        </div>
      </main>
    </div>
  )
}
