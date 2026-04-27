const CheckIcon = () => (
  <svg className="flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export default function TrustItems() {
  const items = [
    '256-bit SSL encryption',
    'Free cancellation within 24h',
    'Instant email confirmation',
  ]
  return (
    <div className="flex flex-col gap-2 mt-4">
      {items.map(t => (
        <div key={t} className="trust-item">
          <CheckIcon />
          {t}
        </div>
      ))}
    </div>
  )
}