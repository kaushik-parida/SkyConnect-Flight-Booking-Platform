export default function FlightCard({ flight, onSelect, isBest }) {
  return (
    <div className={`card-hover overflow-hidden animate-fade-up ${isBest ? 'border-2 border-sky-400' : ''}`}>
      {isBest && (
        <div className="bg-sky-600 px-4 py-1.5 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-xs font-semibold text-white">Best value — cheapest direct flight</span>
        </div>
      )}

      <div className="p-4 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2 flex items-center gap-2.5">
          <div className="airline-chip">{flight.code}</div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{flight.airline}</p>
            <p className="text-xs text-ink-400">{flight.flightNo}</p>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <p className="text-2xl font-bold text-ink-900">{flight.dep}</p>
          <p className="text-xs text-ink-400">{flight.fromCode}</p>
        </div>

        <div className="col-span-3 flex flex-col items-center gap-1">
          <p className="text-xs text-ink-400">{flight.duration}</p>
          <div className="w-full h-px bg-ink-200 relative">
            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-ink-300" />
            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-ink-300" />
          </div>
          <span className={flight.direct ? 'badge-green' : 'badge-amber'}>
            {flight.direct ? 'Direct' : '1 stop'}
          </span>
        </div>

        <div className="col-span-2 text-center">
          <p className="text-2xl font-bold text-ink-900">{flight.arr}</p>
          <p className="text-xs text-ink-400">{flight.toCode}</p>
        </div>

        <div className="col-span-3 text-right">
          <p className="text-2xl font-bold text-sky-700">₹{flight.price.toLocaleString()}</p>
          <p className="text-xs text-ink-400 mb-2">per person, incl. taxes</p>
          <button onClick={() => onSelect(flight)} className="btn-primary w-full py-2 text-sm">
            Select
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-2.5">
        <span className="badge-gray">{flight.seats} seats left</span>
        {flight.seats <= 5 && <span className="badge-red font-medium">Only {flight.seats} left!</span>}
        {flight.meal     && <span className="badge-gray">Meal available</span>}
        <span className="badge-gray">Cabin baggage 7kg</span>
      </div>
    </div>
  )
}