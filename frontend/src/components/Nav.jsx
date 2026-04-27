import { useState } from 'react'

export default function Nav({ page, setPage, user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    ['home',     'Flights'],
    ['results',  'Search'],
    ['bookings', 'My Bookings'],
  ]

  const goto = (p) => { setPage(p); setMobileOpen(false) }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--ink-200)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <button onClick={() => goto('home')} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #0558a6, #0770cf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            ✈
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--sky-700)' }}>
            Sky<span style={{ color: 'var(--ink-800)' }}>Connect</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(([p, label]) => (
            <button key={p} onClick={() => goto(p)} className={page === p ? 'nav-link-active' : 'nav-link'}>
              {label}
            </button>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 'var(--r-md)',
                background: 'var(--ink-50)', fontSize: 13, fontWeight: 500, color: 'var(--ink-700)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--sky-600)', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {user.name.charAt(0)}
                </div>
                {user.name.split(' ')[0]}
              </div>
              <button onClick={() => setUser(null)} className="btn-ghost" style={{ fontSize: 12 }}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => goto('login')} className="btn-ghost">Sign in</button>
              <button onClick={() => goto('login')} className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Get started</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            flexDirection: 'column', gap: 5, padding: 8,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink-600)', borderRadius: 2, transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink-600)', borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink-600)', borderRadius: 2, transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="animate-slide-down" style={{ background: '#fff', borderTop: '1px solid var(--ink-100)', padding: '12px 20px 16px' }}>
          {links.map(([p, label]) => (
            <button key={p} onClick={() => goto(p)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 12px', marginBottom: 4,
              borderRadius: 'var(--r-md)', border: 'none',
              background: page === p ? 'var(--sky-50)' : 'transparent',
              color: page === p ? 'var(--sky-700)' : 'var(--ink-600)',
              fontWeight: page === p ? 600 : 500, fontSize: 14,
              cursor: 'pointer',
            }}>
              {label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--ink-100)', paddingTop: 12, marginTop: 8 }}>
            {user ? (
              <button onClick={() => { setUser(null); setMobileOpen(false) }} className="btn-secondary" style={{ width: '100%' }}>Sign out</button>
            ) : (
              <button onClick={() => goto('login')} className="btn-primary" style={{ width: '100%' }}>Sign in / Register</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}