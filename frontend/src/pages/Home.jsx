import { useState } from 'react'
import { CITIES, POPULAR_ROUTES } from '../data/mockData'

const SwapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
)

export default function Home({ setPage, setSearchParams }) {
  const [from,     setFrom]     = useState('Mumbai')
  const [to,       setTo]       = useState('Delhi')
  const [date,     setDate]     = useState('2026-05-01')
  const [tripType, setTripType] = useState('one-way')

  const swap   = () => { const t = from; setFrom(to); setTo(t) }
  const search = () => { setSearchParams({ from, to, date }); setPage('results') }

  const feats = [
    { icon: '✓', title: 'No hidden fees',       sub: 'All-inclusive pricing always' },
    { icon: '◎', title: 'Live availability',    sub: 'Real-time seat tracking' },
    { icon: '⚡', title: 'Instant confirmation', sub: 'Booking ref in seconds' },
  ]

  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="hero-gradient" style={{ paddingTop: 48, paddingBottom: 0, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: 32 }} className="animate-fade-up">
            <p style={{ color: 'var(--sky-300)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              Book flights in seconds
            </p>
            <h1 className="hero-headline" style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>
              Where are you flying?
            </h1>
            <p className="hero-sub" style={{ color: 'rgba(186,224,253,0.75)', fontSize: 15 }}>
              Real-time availability · No hidden fees · Instant confirmation
            </p>
          </div>

          {/* Search card */}
          <div className="search-card animate-fade-up animation-delay-100 animation-fill-both">

            {/* Trip type */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
              {['one-way', 'round-trip', 'multi-city'].map(t => (
                <button key={t} onClick={() => setTripType(t)} className={tripType === t ? 'tab-btn-active' : 'tab-btn'} style={{ textTransform: 'capitalize', fontSize: 13 }}>
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Search fields */}
            <div className="search-grid" style={{ marginBottom: 16 }}>
              {/* From */}
              <div>
                <label className="search-field-label">From</label>
                <div className="search-field">
                  <select value={from} onChange={e => setFrom(e.target.value)} className="search-field-value" style={{ width: '100%', cursor: 'pointer' }}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <p className="search-field-sub">{from === 'Mumbai' ? 'BOM — Chhatrapati Shivaji' : `${from} Airport`}</p>
                </div>
              </div>

              {/* Swap */}
              <div className="swap-btn-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 18 }}>
                <button onClick={swap} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid var(--ink-200)', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--ink-500)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--sky-400)'; e.target.style.color = 'var(--sky-600)' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--ink-200)'; e.target.style.color = 'var(--ink-500)' }}
                >
                  <SwapIcon />
                </button>
              </div>

              {/* To */}
              <div>
                <label className="search-field-label">To</label>
                <div className="search-field">
                  <select value={to} onChange={e => setTo(e.target.value)} className="search-field-value" style={{ width: '100%', cursor: 'pointer' }}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <p className="search-field-sub">{to === 'Delhi' ? 'DEL — Indira Gandhi' : `${to} Airport`}</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="search-field-label">Date</label>
                <div className="search-field">
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)', fontFamily: 'var(--font-body)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="search-field-label">Passengers</label>
                <div className="search-field" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>1</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>adult · Economy</span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
              paddingTop: 16, borderTop: '1px solid var(--ink-100)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>Prices include all taxes and fees</span>
              <button onClick={search} className="btn-primary" style={{ padding: '11px 28px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                Search flights
              </button>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div style={{ maxWidth: 860, margin: '0 auto', paddingTop: 28, paddingBottom: 24 }}>
          <div className="features-strip animate-fade-up animation-delay-200 animation-fill-both">
            {feats.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: 'var(--sky-300)', fontSize: 18, lineHeight: 1 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 1 }}>{f.title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(186,224,253,0.65)' }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Popular Routes ─────────────────────────────── */}
      <div className="page-container-sm">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 className="section-title">Popular routes</h2>
            <p className="section-sub">Trending searches this week</p>
          </div>
          <button style={{ fontSize: 13, color: 'var(--sky-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>

        <div className="routes-grid">
          {POPULAR_ROUTES.map((r, i) => (
            <button key={i} onClick={search} className="route-card animate-fade-up animation-fill-both" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 2 }}>{r.from}</p>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--sky-400)', margin: '2px 0' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{r.to}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--sky-700)' }}>{r.price}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-400)' }}>per person</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge-green">Direct</span>
                <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>{r.dur} · {r.airline}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}