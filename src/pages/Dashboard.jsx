import { Plane, Users, Ticket, Wallet, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Hero from '../components/dashboard/Hero'
import StatCard from '../components/dashboard/StatCard'
import BookingChart from '../components/dashboard/BookingChart'

import './Dashboard.css'

const popularDestinations = [
  {
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=85'
  },
  {
    name: 'Santorini',
    country: 'Greece',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=700&q=85'
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    image:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=700&q=85'
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=700&q=85'
  }
]

function Dashboard () {
  return (
    <div className='dashboard-page'>

      <Hero />

      <section className='dashboard-stats'>
        <StatCard
          title='Total Trips'
          value='24'
          change='+12.5%'
          icon={Plane}
          trend={[20, 30, 25, 38, 34, 48, 43]}
        />

        <StatCard
          title='Total Customers'
          value='1,248'
          change='+8.2%'
          icon={Users}
          trend={[22, 35, 28, 42, 36, 50, 46]}
        />

        <StatCard
          title='Total Bookings'
          value='856'
          change='+15.4%'
          icon={Ticket}
          trend={[18, 27, 24, 40, 35, 52, 48]}
        />

        <StatCard
          title='Total Revenue'
          value='₹12.4L'
          change='+18.7%'
          icon={Wallet}
          trend={[20, 25, 32, 29, 42, 48, 56]}
        />
      </section>

      <section className='dashboard-main-grid'>

        <BookingChart />

        <div className='popular-destinations-card'>
          <div className='section-heading'>
            <div>
              <span>DESTINATIONS</span>
              <h2>Popular Destinations</h2>
            </div>

            <Link to='/destinations'>
              View All
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className='destination-mini-grid'>
            {popularDestinations.map((destination) => (
              <Link
                to='/destinations'
                className='destination-mini-card'
                key={destination.name}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                />

                <div className='destination-mini-overlay'>
                  <strong>{destination.name}</strong>
                  <span>{destination.country}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      <section className='dashboard-bottom-banner'>
        <div>
          <span>TRAVEL WITHOUT LIMITS</span>
          <h2>Every journey starts with a destination.</h2>
          <p>
            Discover new places and create memorable travel
            experiences with TravelGo.
          </p>
        </div>

        <Link to='/trips'>
          Explore Trips
          <ArrowUpRight size={17} />
        </Link>
      </section>

    </div>
  )
}

export default Dashboard