import { MOCK_FLIGHTS } from '../data/mockData'

export default function Confirmation({ booking, setPage }) {
  const b = booking || { ref: 'FLY6A7433C', flight: MOCK_FLIGHTS[0], total: 4500, payment: 'UPI' }

  return (
    <div className="page-container-xs text-center animate-fade-up">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">Booking confirmed!</h1>
      <p className="text-ink-500 mb-6">Your booking reference is</p>

      <div className="bg-sky-50 border border-sky-200 rounded-xl py-4 px-8 inline-block mb-6">
        <p className="font-mono text-2xl font-bold text-sky-700 tracking-widest">{b.ref}</p>
      </div>

      <div className="card p-5 text-left mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="airline-chip">{b.flight.code}</div>
            <div>
              <p className="font-semibold text-ink-900">{b.flight.airline} · {b.flight.flightNo}</p>
              <p className="text-sm text-ink-400">{b.flight.from} → {b.flight.to} · 01 May 2026</p>
            </div>
          </div>
          <p className="text-xl font-bold text-sky-700">₹{b.total?.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setPage('bookings')} className="btn-primary flex-1 py-3">
          View my bookings
        </button>
        <button onClick={() => setPage('home')} className="btn-secondary flex-1 py-3">
          Book another flight
        </button>
      </div>
    </div>
  )
}