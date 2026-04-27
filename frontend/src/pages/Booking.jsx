import { useState } from 'react'
import { MOCK_FLIGHTS } from '../data/mockData'
import TrustItems from '../components/TrustItems'

const STEPS = ['Flight', 'Passenger', 'Payment', 'Confirm']

export default function Booking({ flight, setPage, addBooking }) {
  const f = flight || MOCK_FLIGHTS[0]

  const [form, setForm] = useState({
    firstName: '', lastName: '', passport: '',
    dob: '', meal: 'NONE', email: '', phone: '', payment: 'UPI',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim())  e.lastName  = 'Last name is required'
    if (!form.email.trim())     e.email     = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return !Object.keys(e).length
  }

  const confirm = () => {
    if (!validate()) return
    addBooking({
      id:         Date.now(),
      ref:        'FLY' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      status:     'CONFIRMED',
      flight:     f,
      date:       '01 May 2026',
      booked:     new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      passengers: 1,
      total:      f.price,
      payment:    form.payment,
    })
  }

  const summaryRows = [
    ['Route',      `${f.fromCode} → ${f.toCode}`],
    ['Date',       '01 May 2026'],
    ['Airline',    f.airline],
    ['Flight',     f.flightNo],
    ['Class',      'Economy'],
    ['Passengers', '1 adult'],
    ['Baggage',    '7kg cabin'],
  ]

  return (
    <div className="page-container animate-fade-in">

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <>
            <div className={`flex items-center gap-2 ${i === 1 ? 'text-sky-700' : 'text-ink-400'}`} key={s}>
              <div className={i === 0 ? 'step-done' : i === 1 ? 'step-active' : 'step-idle'}>
                {i === 0 ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i === 0 ? 'bg-sky-400' : 'bg-ink-200'}`} />
            )}
          </>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 flex flex-col gap-4">

          {/* Flight summary */}
          <div className="card card-body">
            <p className="form-label mb-3">Selected flight</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="airline-chip">{f.code}</div>
                <div>
                  <p className="font-semibold text-ink-900">{f.airline} · {f.flightNo}</p>
                  <p className="text-xs text-ink-400">{f.direct ? 'Direct' : '1 stop'} · Economy</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xl font-bold text-ink-900">{f.dep}</p>
                  <p className="text-xs text-ink-400">{f.fromCode}</p>
                </div>
                <div className="text-center px-3">
                  <p className="text-xs text-ink-400">{f.duration}</p>
                  <div className="w-16 h-px bg-ink-200 my-1" />
                  <p className="text-xs text-green-600 font-medium">Direct</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-ink-900">{f.arr}</p>
                  <p className="text-xs text-ink-400">{f.toCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-sky-700">₹{f.price.toLocaleString()}</p>
                <p className="text-xs text-ink-400">per person</p>
              </div>
            </div>
          </div>

          {/* Passenger details */}
          <div className="card card-body">
            <p className="form-label mb-4">Passenger details</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="form-label">First name *</label>
                <input
                  value={form.firstName} onChange={e => set('firstName', e.target.value)}
                  className={errors.firstName ? 'form-input-error' : 'form-input'}
                  placeholder="As on ID"
                />
                {errors.firstName && <p className="form-error">{errors.firstName}</p>}
              </div>
              <div>
                <label className="form-label">Last name *</label>
                <input
                  value={form.lastName} onChange={e => set('lastName', e.target.value)}
                  className={errors.lastName ? 'form-input-error' : 'form-input'}
                  placeholder="As on ID"
                />
                {errors.lastName && <p className="form-error">{errors.lastName}</p>}
              </div>
              <div>
                <label className="form-label">Passport number</label>
                <input value={form.passport} onChange={e => set('passport', e.target.value)} className="form-input" placeholder="Optional" />
              </div>
              <div>
                <label className="form-label">Date of birth</label>
                <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label mb-2">Meal preference</label>
              <div className="flex gap-2">
                {['NONE', 'VEGETARIAN', 'NONVEGETARIAN'].map(m => (
                  <button key={m} onClick={() => set('meal', m)} className={form.meal === m ? 'meal-opt-active' : 'meal-opt'}>
                    {m === 'NONE' ? 'No preference' : m === 'VEGETARIAN' ? 'Vegetarian' : 'Non-vegetarian'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & payment */}
          <div className="card card-body">
            <p className="form-label mb-4">Contact details</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="form-label">Email *</label>
                <input
                  value={form.email} onChange={e => set('email', e.target.value)}
                  className={errors.email ? 'form-input-error' : 'form-input'}
                  placeholder="For booking confirmation" type="email"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} className="form-input" placeholder="+91 00000 00000" />
              </div>
            </div>
            <p className="form-label mb-2">Payment method</p>
            <div className="grid grid-cols-4 gap-2">
              {['UPI', 'CARD', 'NETBANKING', 'WALLET'].map(p => (
                <button key={p} onClick={() => set('payment', p)} className={form.payment === p ? 'pay-opt-active' : 'pay-opt'}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="col-span-1">
          <div className="card p-5 sticky-sidebar">
            <p className="font-semibold text-ink-900 mb-4">Booking summary</p>
            {summaryRows.map(([k, v]) => (
              <div key={k} className="summary-row">
                <span className="text-ink-400">{k}</span>
                <span className="text-ink-800 font-medium">{v}</span>
              </div>
            ))}
            <div className="summary-row-total">
              <span className="font-semibold text-ink-900">Total</span>
              <span className="font-bold text-sky-700 text-lg">₹{f.price.toLocaleString()}</span>
            </div>
            <p className="text-xs text-ink-400 mb-4">All taxes included · No hidden fees</p>
            <button onClick={confirm} className="btn-primary w-full py-3 text-sm">
              Confirm booking →
            </button>
            <TrustItems />
          </div>
        </div>
      </div>
    </div>
  )
}