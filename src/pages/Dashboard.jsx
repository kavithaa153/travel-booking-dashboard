import { useEffect, useMemo, useState } from 'react'
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
  const [trips, setTrips] = useState([])
  const [customers, setCustomers] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    try {
      const savedTrips = JSON.parse(
        localStorage.getItem('travelgo_trips') || '[]'
      )

      const savedCustomers = JSON.parse(
        localStorage.getItem('travelgo_customers') || '[]'
      )

      const savedBookings = JSON.parse(
        localStorage.getItem('travelgo_bookings') || '[]'
      )

      setTrips(Array.isArray(savedTrips) ? savedTrips : [])
      setCustomers(
        Array.isArray(savedCustomers) ? savedCustomers : []
      )
      setBookings(
        Array.isArray(savedBookings) ? savedBookings : []
      )
    } catch {
      setTrips([])
      setCustomers([])
      setBookings([])
    }
  }, [])

  const totalRevenue = useMemo(() => {
    return bookings.reduce(
      (total, booking) =>
        total + Number(booking.totalAmount || 0),
      0
    )
  }, [bookings])

  const revenueDisplay = useMemo(() => {
    if (totalRevenue >= 10000000) {
      return `₹${(totalRevenue / 10000000).toFixed(1)}Cr`
    }

    if (totalRevenue >= 100000) {
      return `₹${(totalRevenue / 100000).toFixed(1)}L`
    }

    if (totalRevenue >= 1000) {
      return `₹${(totalRevenue / 1000).toFixed(1)}K`
    }

    return `₹${totalRevenue.toLocaleString('en-IN')}`
  }, [totalRevenue])

  const tripTrend = useMemo(() => {
    return [
      Math.max(trips.length - 6, 1),
      Math.max(trips.length - 4, 2),
      Math.max(trips.length - 5, 1),
      Math.max(trips.length - 2, 3),
      Math.max(trips.length - 3, 2),
      trips.length,
      trips.length
    ]
  }, [trips.length])

  const customerTrend = useMemo(() => {
    return [
      Math.max(customers.length - 6, 1),
      Math.max(customers.length - 4, 2),
      Math.max(customers.length - 5, 1),
      Math.max(customers.length - 2, 3),
      Math.max(customers.length - 3, 2),
      customers.length,
      customers.length
    ]
  }, [customers.length])

  const bookingTrend = useMemo(() => {
    return [
      Math.max(bookings.length - 6, 1),
      Math.max(bookings.length - 4, 2),
      Math.max(bookings.length - 5, 1),
      Math.max(bookings.length - 2, 3),
      Math.max(bookings.length - 3, 2),
      bookings.length,
      bookings.length
    ]
  }, [bookings.length])

  const revenueTrend = useMemo(() => {
    if (totalRevenue === 0) {
      return [1, 2, 1, 3, 2, 4, 3]
    }

    return [
      Math.round(totalRevenue * 0.45),
      Math.round(totalRevenue * 0.58),
      Math.round(totalRevenue * 0.52),
      Math.round(totalRevenue * 0.68),
      Math.round(totalRevenue * 0.63),
      Math.round(totalRevenue * 0.82),
      totalRevenue
    ]
  }, [totalRevenue])

  return (
    <div className='dashboard-page'>

      <Hero />

      <section className='dashboard-stats'>
        <StatCard
          title='Total Trips'
          value={trips.length.toLocaleString('en-IN')}
          change='+12.5%'
          icon={Plane}
          trend={tripTrend}
        />

        <StatCard
          title='Total Customers'
          value={customers.length.toLocaleString('en-IN')}
          change='+8.2%'
          icon={Users}
          trend={customerTrend}
        />

        <StatCard
          title='Total Bookings'
          value={bookings.length.toLocaleString('en-IN')}
          change='+15.4%'
          icon={Ticket}
          trend={bookingTrend}
        />

        <StatCard
          title='Total Revenue'
          value={revenueDisplay}
          change='+18.7%'
          icon={Wallet}
          trend={revenueTrend}
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