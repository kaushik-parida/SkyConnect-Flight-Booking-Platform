import { useState } from 'react'
import BookingCard from '../components/BookingCard'

const FILTERS = [
  ['ALL', 'All'],
  ['CONFIRMED', 'Confirmed'],
  ['PENDING', 'Pending'],
  ['CANCELLED', 'Cancelled'],
]

export default function MyBookings({ bookings }) {
  const [filter, setFilter] = useState('ALL')

  const counts = {
    ALL:       bookings.length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    PENDING:   bookings.filter(b => b.status === 'PENDING').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + b.total, 0)

  return (
    <div className="page-container-sm animate-fade-in">

      {/* Header */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">My bookings</h1>
          <p className="section-sub">All your flights in one place</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Upcoming',    '1'],
            ['Total spent', `₹${totalSpent.toLocaleString()}`],
            ['Bookings',    bookings.length],
          ].map(([l, v]) => (
            <div key={l} className="text-center card px-4 py-2.5">
              <p className="text-xs text-ink-400">{l}</p>
              <p className="font-bold text-ink-900 text-lg">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={filter === v ? 'tab-btn-active' : 'tab-btn border border-ink-200 bg-white'}
          >
            {l} <span className="ml-1 opacity-70">({counts[v]})</span>
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-ink-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40">
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <path d="M8 8V6a4 4 0 018 0v2" />
            </svg>
            <p>No bookings found</p>
          </div>
        ) : (
          filtered.map(b => <BookingCard key={b.id} booking={b} />)
        )}
      </div>
    </div>
  )
}