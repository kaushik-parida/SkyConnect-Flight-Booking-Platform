import { useState } from 'react'

export default function Login({ setPage, setUser }) {
  const [tab, setTab]   = useState('login')
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = () => {
    const e = {}
    if (!form.email)    e.email    = 'Required'
    if (!form.password) e.password = 'Required'
    if (tab === 'register' && !form.firstName) e.firstName = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return
    setUser({
      name:  tab === 'register' ? `${form.firstName} ${form.lastName}` : 'Rahul Sharma',
      email: form.email,
    })
    setPage('home')
  }

  const features = [
    'Real-time seat availability across all airlines',
    'Instant confirmation with unique booking reference',
    'Manage and cancel bookings anytime',
    'Secure payments — UPI, card, netbanking, wallet',
  ]

  return (
    <div className="grid grid-cols-2 animate-fade-in" style={{ height: 'calc(100vh - 0px)' }}>

      {/* Left panel */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-ink-900 p-12 flex flex-col justify-center">
        <div className="max-w-sm">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-3">SkyConnect</p>
          <h2 className="font-display text-3xl font-bold text-white mb-4 leading-tight">
            Book flights smarter, faster, better.
          </h2>
          <p className="text-sky-200/70 text-sm mb-8 leading-relaxed">
            Join thousands of travellers who trust SkyConnect for instant bookings, real-time availability, and zero hidden fees.
          </p>
          <div className="flex flex-col gap-4">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-400/30 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm text-sky-100/80">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="bg-ink-50 flex items-center justify-center p-12">
        <div className="w-full max-w-sm">

          {/* Tab toggle */}
          <div className="flex gap-1 bg-ink-200/50 rounded-xl p-1 mb-6">
            {[['login', 'Sign in'], ['register', 'Create account']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === v ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold text-ink-900 mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p className="text-sm text-ink-400 mb-5">
            {tab === 'login' ? 'Sign in to access your bookings' : 'Start booking flights in seconds'}
          </p>

          {/* Register extra fields */}
          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="form-label">First name</label>
                <input
                  value={form.firstName} onChange={e => set('firstName', e.target.value)}
                  className={errors.firstName ? 'form-input-error' : 'form-input'}
                  placeholder="Rahul"
                />
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  value={form.lastName} onChange={e => set('lastName', e.target.value)}
                  className="form-input" placeholder="Sharma"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              value={form.email} onChange={e => set('email', e.target.value)}
              className={errors.email ? 'form-input-error' : 'form-input'}
              placeholder="you@example.com" type="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-5">
            <div className="flex justify-between mb-1.5">
              <label className="form-label">Password</label>
              {tab === 'login' && (
                <button className="text-xs text-sky-600 font-medium hover:text-sky-800">Forgot?</button>
              )}
            </div>
            <input
              value={form.password} onChange={e => set('password', e.target.value)}
              className={errors.password ? 'form-input-error' : 'form-input'}
              placeholder={tab === 'login' ? 'Your password' : 'Min. 8 characters'}
              type="password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button onClick={submit} className="btn-primary w-full py-3 text-sm mb-4">
            {tab === 'login' ? 'Sign in' : 'Create account'}
          </button>

          {/* Divider */}
          <div className="divider-text mb-4">
            <span className="text-xs text-ink-400">or</span>
          </div>

          {/* OAuth */}
          <button className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-ink-400 text-center mt-4 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-sky-600 cursor-pointer">Terms</span>{' '}
            and{' '}
            <span className="text-sky-600 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}