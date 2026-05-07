import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { formatTime, formatDate } from "../../utils/dateUtils";
import { AIRPORTS } from "../../constants/airports";

const getCityCode = (cityName) => {
  if (!cityName) return "---";
  const airport = AIRPORTS.find(a => a.city.toLowerCase() === cityName.toLowerCase());
  return airport ? airport.code : cityName.substring(0, 3).toUpperCase();
};

const getAirlineInfo = (flightNumber) => {
  if (!flightNumber) return { name: "SkyConnect Air", logo: "✈", color: "#3D5AFE" };
  const prefix = flightNumber.substring(0, 2).toUpperCase();
  switch (prefix) {
    case "6E": return { name: "IndiGo", logo: "https://images.kiwi.com/airlines/64/6E.png", color: "#001B94" };
    case "AI": return { name: "Air India", logo: "https://images.kiwi.com/airlines/64/AI.png", color: "#ED1B24" };
    case "UK": return { name: "Vistara", logo: "https://images.kiwi.com/airlines/64/UK.png", color: "#3B1449" };
    case "SG": return { name: "SpiceJet", logo: "https://images.kiwi.com/airlines/64/SG.png", color: "#F60000" };
    case "QP": return { name: "Akasa Air", logo: "https://images.kiwi.com/airlines/64/QP.png", color: "#FF6A00" };
    case "I5": return { name: "AirAsia India", logo: "https://images.kiwi.com/airlines/64/I5.png", color: "#FF0000" };
    default: return { name: "SkyConnect Air", logo: "✈", color: "#3D5AFE" };
  }
};

const seededRandom = (seed) => {
  let s = seed;
  s = (s * 1664525 + 1013904223) & 0xffffffff;
  return Math.abs(s) / 0xffffffff;
};

const deriveSeat = (bookingId, passengerIndex, seatClass) => {
  const seed = [...String(bookingId)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const r = seededRandom(seed);
  
  if (seatClass === "BUSINESS") {
    const baseRow = Math.floor(r * 20) + 1;
    const cols = ["A", "B", "C", "D"];
    const baseColIdx = Math.floor(seededRandom(seed + 1) * cols.length);
    const rowOffset = Math.floor((baseColIdx + passengerIndex) / cols.length);
    const actualColIdx = (baseColIdx + passengerIndex) % cols.length;
    return `B${baseRow + rowOffset}${cols[actualColIdx]}`;
  }
  
  const baseRow = Math.floor(r * 40) + 10;
  const cols = ["A", "B", "C", "D", "E", "F"];
  const baseColIdx = Math.floor(seededRandom(seed + 1) * cols.length);
  const rowOffset = Math.floor((baseColIdx + passengerIndex) / cols.length);
  const actualColIdx = (baseColIdx + passengerIndex) % cols.length;
  return `${baseRow + rowOffset}${cols[actualColIdx]}`;
};

const deriveGate = (bookingId, flightNumber) => {
  const seed = [...String(bookingId + flightNumber)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `G${(Math.floor(seededRandom(seed) * 30) + 1)}`;
};

function SingleBoardingPass({ passenger, index, bookingId, flight, seatClass, perPassengerAmount }) {
  const airline = getAirlineInfo(flight.flightNumber);

  const seatNumber = useMemo(() => deriveSeat(bookingId, index, seatClass), [bookingId, index, seatClass]);
  const gate = useMemo(() => deriveGate(bookingId, flight.flightNumber || ""), [bookingId, flight.flightNumber]);

  const boardingTime = useMemo(() => {
    const d = new Date(flight.departureTime);
    if (isNaN(d.getTime())) return "--:--";
    d.setMinutes(d.getMinutes() - 45);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [flight.departureTime]);

  const passengerName = passenger?.firstName ? `${passenger.firstName} ${passenger.lastName}` : "Passenger";
  const qrData = `SkyConnect Boarding Pass\nPNR: ${bookingId}\nFlight: ${flight.flightNumber}\nSeat: ${seatNumber}\nPassenger: ${passengerName}`;

  return (
    <div className="boarding-pass" id={`bp-${index}`}>
      <div className="boarding-pass-main">
        <div className="boarding-pass-header">
          <div className="bp-header-top">
            <div className="bp-airline-info">
              {airline.logo.startsWith("http") ? (
                <img src={airline.logo} alt="logo" className="bp-airline-logo" />
              ) : (
                <div className="bp-airline-logo-placeholder" style={{ background: airline.color }}>
                  {airline.logo}
                </div>
              )}
              <div>
                <div className="bp-airline-name">{airline.name}</div>
                <div className="bp-boarding-pass-label">BOARDING PASS</div>
              </div>
            </div>
            <div className="text-right">
              <div className="bp-pnr-label">PNR / Booking Ref</div>
              <div className="bp-pnr-value">{bookingId}</div>
              {index > 0 && <div className="bp-passenger-index">Passenger {index + 1}</div>}
            </div>
          </div>

          <div className="bp-route-row">
            <div>
              <div className="bp-city-code">{getCityCode(flight.fromPlace)}</div>
              <div className="bp-city-name">{flight.fromPlace}</div>
            </div>
            <div className="bp-route-middle">
              <div className="bp-flight-num">{flight.flightNumber}</div>
              <div className="bp-route-line">
                <div className="bp-route-dot" />
                <div className="bp-route-bar" />
                <span className="bp-route-plane">✈</span>
                <div className="bp-route-bar" />
                <div className="bp-route-dot" />
              </div>
              <div className="bp-nonstop">NON-STOP</div>
            </div>
            <div className="text-right">
              <div className="bp-city-code">{getCityCode(flight.toPlace)}</div>
              <div className="bp-city-name">{flight.toPlace}</div>
            </div>
          </div>
        </div>

        <div className="boarding-pass-body">
          <div className="bp-body-grid">
            <div>
              <div className="bp-field-label">Passenger Name</div>
              <div className="bp-field-value bp-name-value">{passengerName}</div>
            </div>
            <div>
              <div className="bp-field-label">Departure</div>
              <div className="bp-field-value bp-name-value">{formatTime(flight.departureTime)}</div>
              <div className="bp-date-sub">{formatDate(flight.departureTime)}</div>
            </div>
            <div>
              <div className="bp-field-label">Cabin Class</div>
              <div className="bp-field-value bp-name-value">{seatClass}</div>
            </div>
          </div>
        </div>

        <div className="boarding-pass-footer">
          <div className="bp-footer-row">
            <div className="bp-footer-items">
              <div>
                <div className="bp-field-label">Arrival Time</div>
                <div className="bp-footer-value">{formatTime(flight.arrivalTime)}</div>
              </div>
              <div>
                <div className="bp-field-label">Flight</div>
                <div className="bp-footer-value">{flight.flightNumber}</div>
              </div>
            </div>
            <div>
              <span className="bp-confirmed-badge">Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="boarding-pass-divider">
        <div className="boarding-pass-divider-circle top" />
        <div className="boarding-pass-divider-line" />
        <div className="boarding-pass-divider-circle bottom" />
      </div>

      <div className="boarding-pass-stub">
        <div>
          <div className="bp-stub-top">
            <div>
              <div className="bp-field-label">Boarding Time</div>
              <div className="bp-field-value bp-boarding-time">{boardingTime}</div>
            </div>
            <div className="text-right">
              <div className="bp-field-label">Gate</div>
              <div className="bp-field-value bp-gate">{gate}</div>
            </div>
          </div>

          <div>
            <div className="bp-field-label">Seat Assignment</div>
            <div className="bp-field-value bp-seat">{seatNumber}</div>
          </div>

          {perPassengerAmount && (
            <div className="bp-amount-section">
              <div className="bp-field-label">Amount Paid</div>
              <div className="bp-amount-value">₹{Number(perPassengerAmount).toLocaleString("en-IN")}</div>
            </div>
          )}
        </div>

        <div className="bp-qr-section">
          <div className="bp-qr">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&ecc=H&data=${encodeURIComponent(qrData || "SkyConnect")}`}
              alt="Boarding Pass QR"
              className="bp-qr-img"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div className="bp-scan-label">Scan at Gate</div>
        </div>
      </div>
    </div>
  );
}

export default function BoardingPassPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, bookingReference, flight, seatClass, totalAmount, passengers } = state || {};

  const displayPnr = bookingReference || bookingId;

  if (!displayPnr || !flight) {
    navigate("/");
    return null;
  }

  const passengerList = passengers && passengers.length > 0 ? passengers : [null];
  const perPassengerAmount = totalAmount ? Number(totalAmount) / passengerList.length : null;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    const styles = Array.from(document.styleSheets)
      .flatMap(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText); }
        catch { return []; }
      })
      .join("\n");
    const content = document.getElementById("boarding-passes-container").innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boarding Pass - ${displayPnr}</title>
          <style>${styles}</style>
          <style>
            body { margin: 0; padding: 24px; background: #fff; }
            .boarding-pass { page-break-after: always; margin-bottom: 24px; }
            nav, .btn { display: none !important; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area boarding-scroll">
        <div className="container animate-slide-up boarding-container">

          <div className="boarding-page-header">
            <div>
              <button className="btn btn-ghost btn-back" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <h1 className="page-title">Boarding Pass{passengerList.length > 1 ? "es" : ""}</h1>
              <p className="page-subtitle">Your official SkyConnect boarding pass{passengerList.length > 1 ? "es are" : " is"} ready.</p>
            </div>
            <div className="boarding-header-actions">
              <button className="btn btn-ghost" onClick={handlePrint}>
                🖨 Print
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                ⬇ Download PDF
              </button>
            </div>
          </div>

          <div className="boarding-passes-list" id="boarding-passes-container">
            {passengerList.map((passenger, index) => (
              <SingleBoardingPass
                key={index}
                index={index}
                passenger={passenger}
                bookingId={displayPnr}
                flight={flight}
                seatClass={seatClass}
                totalAmount={totalAmount}
                perPassengerAmount={perPassengerAmount}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
