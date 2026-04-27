const STATUS_CLASS = {
  CONFIRMED: 'status-confirmed',
  PENDING:   'status-pending',
  CANCELLED: 'status-cancelled',
  FAILED:    'status-failed',
}

export default function BookingCard({ booking, onCancel }) {
  const { ref, status, flight, date, booked, passengers, total, payment } = booking
  const isCancelled = status === 'CANCELLED'

  return (
    <div className={`card-hover overflow-hidden animate-fade-up ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="card-header">
        <div className="flex items-center gap-3">
          <p className="font-mono font-semibold text-sm text-ink-800">{ref}</p>
          <span className="text-ink-300">·</span>
          <p className="text-xs text-ink-400">Booked {booked}</p>
        </div>
        <span className={STATUS_CLASS[status]}>{status}</span>
      </div>

      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="airline-chip">{flight.code}</div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xl font-bold text-ink-900">{flight.dep}</p>
              <p className="text-xs text-ink-400">{flight.fromCode} · {date}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-ink-400 mb-1">{flight.duration}</p>
              <div className="w-20 h-px bg-ink-200" />
              <p className="text-xs text-green-600 mt-1 font-medium">Direct</p>
            </div>
            <div>
              <p className="text-xl font-bold text-ink-900">{flight.arr}</p>
              <p className="text-xs text-ink-400">{flight.toCode} · {flight.airline}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-sky-700">₹{total.toLocaleString()}</p>
            <p className="text-xs text-ink-400">{passengers} passenger · {payment}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 text-sm font-medium bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors">
              Details
            </button>
            {!isCancelled && (
              <button onClick={() => onCancel?.(booking)} className="btn-danger">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}