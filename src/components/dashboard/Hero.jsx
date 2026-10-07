import { Sparkles } from 'lucide-react'
import travelVideo from '../../assets/videos/travel-hero.mp4'

import './Hero.css'

function Hero () {
  return (
    <section className='travel-hero'>

      <video
        className='hero-video'
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
      >
        <source src={travelVideo} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      <div className='hero-overlay'></div>

      <div className='hero-content'>

        <div className='hero-copy'>

          <div className='hero-eyebrow'>
            <Sparkles size={14} />
            <span>WELCOME TO TRAVELGO</span>
          </div>

          <h1>
            Your journey,
            <span> beautifully managed.</span>
          </h1>

          <p>
            Manage trips, bookings and customers from one
            elegant travel management platform.
          </p>

        </div>

        <div className='hero-floating-card'>

          <span className='hero-floating-label'>
            YOUR NEXT ADVENTURE
          </span>

          <strong>
            Explore the world
          </strong>

          <span className='hero-floating-text'>
            Curated journeys. Unforgettable memories.
          </span>

        </div>

      </div>

    </section>
  )
}

export default Hero