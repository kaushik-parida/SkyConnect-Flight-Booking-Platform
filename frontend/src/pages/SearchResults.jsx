import { useState } from 'react'
import { MOCK_FLIGHTS } from '../data/mockData'
import FlightCard from '../components/FlightCard'
import FlightSummaryBar from '../components/FlightSummaryBar'

export default function SearchResults({ searchParams, setPage, setSelectedFlight }) {
  const [sort, setSort]           = useState('cheapest')
  const [maxPrice, setMaxPrice]   = useState(10000)
  const [directOnly, setDirectOnly] = useState(false)

  const sorted = [...MOCK_FLIGHTS]
    .filter(f => f.price <= maxPrice && (!directOnly || f.direct))
    .sort((a, b) =>
      sort === 'cheapest'  ? a.price - b.price :
      sort === 'fastest'   ? a.duration.localeCompare(b.duration) :
      a.dep.localeCompare(b.dep)
    )

  const select = (f) => { setSelectedFlight(f); setPage('booking') }

  return (
    <div className="page-container animate-fade-in">
      <FlightSummaryBar searchParams={searchParams} onEdit={() => setPage('home')} />

      <div className="grid grid-cols-12 gap-5 mt-5">

        {/* Filters */}
        <aside className="col-span-3">
          <div className="card p-4 sticky-sidebar">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-ink-900 text-sm">Filters</p>
              <button className="text-xs text-sky-600 font-medium hover:text-sky-800">Reset</button>
            </div>

            {/* Sort */}
            <div className="mb-5 pb-5 border-b border-ink-100">
              <p className="form-label">Sort by</p>
              {[['cheapest','Cheapest first'],['fastest','Fastest first'],['departure','Earliest departure']].map(([v, l]) => (
                <button key={v} onClick={() => setSort(v)} className={sort === v ? 'filter-opt-active' : 'filter-opt'}>
                  {l}
                </button>
              ))}
            </div>

            {/* Price */}
            <div className="mb-5 pb-5 border-b border-ink-100">
              <p className="form-label">Max price</p>
              <input
                type="range" min="1000" max="10000" step="500"
                value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between text-xs text-ink-400 mt-1">
                <span>₹1,000</span>
                <span className="font-semibold text-sky-700">₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Stops */}
            <div className="mb-5 pb-5 border-b border-ink-100">
              <p className="form-label">Stops</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={directOnly} onChange={e => setDirectOnly(e.target.checked)} className="accent-sky-600 w-4 h-4 rounded" />
                <span className="text-sm text-ink-700">Direct flights only</span>
              </label>
            </div>

            {/* Airlines */}
            <div>
              <p className="form-label">Airlines</p>
              {['IndiGo', 'Air India', 'SpiceJet', 'Vistara'].map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" defaultChecked className="accent-sky-600 w-4 h-4 rounded" />
                  <span className="text-sm text-ink-700">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Flight list */}
        <main className="col-span-9 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500">
              <span className="font-semibold text-ink-900">{sorted.length} flights</span> found
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" />
              </svg>
              Prices updated just now
            </div>
          </div>

          {sorted.map((f, i) => (
            <FlightCard
              key={f.id}
              flight={f}
              onSelect={select}
              isBest={i === 0}
            />
          ))}
        </main>
      </div>
    </div>
  )
}