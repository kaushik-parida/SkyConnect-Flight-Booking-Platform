export default function FlightSummaryBar({ searchParams, onEdit }) {
  const from = searchParams?.from || 'Mumbai'
  const to   = searchParams?.to   || 'Delhi'
  const date = searchParams?.date || '01 May 2026'

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-ink-900">{from}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-ink-900">{to}</span>
        <span className="text-ink-300">·</span>
        <span className="text-ink-600">{date}</span>
        <span className="text-ink-300">·</span>
        <span className="text-ink-600">1 adult · Economy</span>
      </div>
      <button onClick={onEdit} className="text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors">
        Modify search
      </button>
    </div>
  )
}