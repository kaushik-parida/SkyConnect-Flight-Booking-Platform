export const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
  'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
]

export const MOCK_FLIGHTS = [
  { id: 1, airline: 'IndiGo',   code: '6E', flightNo: '6E-2341', from: 'Mumbai', fromCode: 'BOM', to: 'Delhi',     toCode: 'DEL', dep: '06:00', arr: '08:10', duration: '2h 10m', price: 4500, seats: 42,  direct: true,  meal: true  },
  { id: 2, airline: 'Air India', code: 'AI', flightNo: 'AI-505',  from: 'Mumbai', fromCode: 'BOM', to: 'Delhi',     toCode: 'DEL', dep: '09:30', arr: '12:00', duration: '2h 30m', price: 5200, seats: 3,   direct: true,  meal: true  },
  { id: 3, airline: 'SpiceJet',  code: 'SG', flightNo: 'SG-101',  from: 'Mumbai', fromCode: 'BOM', to: 'Delhi',     toCode: 'DEL', dep: '14:00', arr: '15:15', duration: '1h 15m', price: 2800, seats: 110, direct: true,  meal: false },
  { id: 4, airline: 'Vistara',   code: 'UK', flightNo: 'UK-820',  from: 'Mumbai', fromCode: 'BOM', to: 'Delhi',     toCode: 'DEL', dep: '18:30', arr: '20:45', duration: '2h 15m', price: 6100, seats: 28,  direct: false, meal: true  },
]

export const MOCK_BOOKINGS = [
  { id: 1, ref: 'FLY6A7433C', status: 'CONFIRMED', flight: MOCK_FLIGHTS[0], date: '01 May 2026', booked: '23 Apr 2026', passengers: 1, total: 4500, payment: 'UPI'  },
  { id: 2, ref: 'FLY9B2K11A', status: 'PENDING',   flight: MOCK_FLIGHTS[1], date: '02 May 2026', booked: '15 Apr 2026', passengers: 1, total: 5200, payment: 'CARD' },
  { id: 3, ref: 'FLY3X7K2A',  status: 'CANCELLED', flight: MOCK_FLIGHTS[2], date: '03 May 2026', booked: '01 Apr 2026', passengers: 1, total: 2800, payment: 'UPI'  },
]

export const POPULAR_ROUTES = [
  { from: 'Mumbai',    to: 'Delhi',     price: '₹4,500', dur: '2h 10m', airline: 'IndiGo'   },
  { from: 'Mumbai',    to: 'Bangalore', price: '₹3,200', dur: '1h 45m', airline: 'Air India' },
  { from: 'Delhi',     to: 'Hyderabad', price: '₹2,800', dur: '2h 00m', airline: 'SpiceJet'  },
  { from: 'Bangalore', to: 'Chennai',   price: '₹1,900', dur: '1h 10m', airline: 'IndiGo'   },
]