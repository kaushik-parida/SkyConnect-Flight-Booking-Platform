import { useState } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import { MOCK_BOOKINGS } from './data/mockData'

export default function App() {
  const [page, setPage]                   = useState('home')
  const [searchParams, setSearchParams]   = useState(null)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [user, setUser]                   = useState(null)
  const [bookings, setBookings]           = useState(MOCK_BOOKINGS)
  const [lastBooking, setLastBooking]     = useState(null)

  const addBooking = (booking) => {
    setBookings(prev => [booking, ...prev])
    setLastBooking(booking)
    setPage('confirmation')
  }

  const cancelBooking = (booking) => {
    setBookings(prev =>
      prev.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b)
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink-50)' }}>
      {page !== 'login' && (
        <Nav page={page} setPage={setPage} user={user} setUser={setUser} />
      )}
      {page === 'home'         && <Home         setPage={setPage} setSearchParams={setSearchParams} />}
      {page === 'results'      && <SearchResults searchParams={searchParams} setPage={setPage} setSelectedFlight={setSelectedFlight} />}
      {page === 'booking'      && <Booking       flight={selectedFlight} setPage={setPage} addBooking={addBooking} />}
      {page === 'confirmation' && <Confirmation  booking={lastBooking}   setPage={setPage} />}
      {page === 'bookings'     && <MyBookings    bookings={bookings}     setPage={setPage} onCancel={cancelBooking} />}
      {page === 'login'        && <Login         setPage={setPage}       setUser={setUser} />}
    </div>
  )
}