import { Routes, Route } from 'react-router-dom'

import Layout from '../components/layout/Layout'

import Dashboard from '../pages/Dashboard'
import Destinations from '../pages/Destinations'
import Trips from '../pages/Trips'
import Customers from '../pages/Customers'
import Bookings from '../pages/Bookings'
import Calendar from '../pages/Calendar'
import Analytics from '../pages/Analytics'

import CreateTrip from '../pages/CreateTrip'
import EditTrip from '../pages/EditTrip'
import TripDetails from '../pages/TripDetails'

import DestinationForm from '../components/destinations/DestinationForm'
import DestinationDetails from '../components/destinations/DestinationDetails'

import CustomerForm from '../components/customers/CustomerForm'
import CustomerDetails from '../components/customers/CustomerDetails'

import BookingForm from '../components/bookings/BookingForm'
import BookingDetails from '../components/bookings/BookingDetails'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'
function AppRoutes () {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />

        <Route path='/destinations' element={<Destinations />} />
        <Route path='/destinations/create' element={<DestinationForm />} />
        <Route path='/destinations/:id/edit' element={<DestinationForm />} />
        <Route path='/destinations/:id' element={<DestinationDetails />} />

        <Route path='/trips' element={<Trips />} />
        <Route path='/trips/create' element={<CreateTrip />} />
        <Route path='/trips/:id/edit' element={<EditTrip />} />
        <Route path='/trips/:id' element={<TripDetails />} />

        <Route path='/customers' element={<Customers />} />
        <Route path='/customers/create' element={<CustomerForm />} />
        <Route path='/customers/:id/edit' element={<CustomerForm />} />
        <Route path='/customers/:id' element={<CustomerDetails />} />

        <Route path='/bookings' element={<Bookings />} />
        <Route path='/bookings/create' element={<BookingForm />} />
        <Route path='/bookings/:id/edit' element={<BookingForm />} />
        <Route path='/bookings/:id' element={<BookingDetails />} />

        <Route path='/calendar' element={<Calendar />} />

        <Route path='/analytics' element={<Analytics />} />
        <Route path='/settings' element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
