import React from 'react'
import HeroSection from './HeroSection'
import SocialProof from './SocialProof'
import About from './About'
import Features from './Features'
import ContactUs from './ContactUs'

const Home = () => {
  return (
    <div className="bg-base-100 text-base-content">
      <HeroSection />
      <SocialProof />
      <Features />
      <About />
      <ContactUs />
    </div>
  )
}

export default Home