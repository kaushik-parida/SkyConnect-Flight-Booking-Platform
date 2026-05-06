const http = require('http');

const FLIGHT_SERVICE_URL = "http://localhost:8082"; 

const fetchJSON = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
};

const airlines = [
  { name: "IndiGo", contactNumber: "+91-9910383838", officeAddress: "Gurgaon, Haryana" },
  { name: "Air India", contactNumber: "+91-1124622220", officeAddress: "New Delhi" },
  { name: "Vistara", contactNumber: "+91-9289228888", officeAddress: "Gurgaon, Haryana" },
  { name: "SpiceJet", contactNumber: "+91-9871803333", officeAddress: "Gurgaon, Haryana" },
  { name: "Akasa Air", contactNumber: "+91-9606112131", officeAddress: "Mumbai, Maharashtra" }
];

const generateFlights = (airlineId, airlineName) => {
  const prefix = airlineName === "IndiGo" ? "6E" : airlineName === "Air India" ? "AI" : airlineName === "Vistara" ? "UK" : airlineName === "SpiceJet" ? "SG" : "QP";
  const now = Date.now();
  
  return [
    {
      flightNumber: `${prefix}-${Math.floor(Math.random() * 900) + 100}`,
      airlineId, fromPlace: "Mumbai", toPlace: "Delhi",
      departureTime: new Date(now + 25 * 3600 * 1000).toISOString().split('.')[0],
      arrivalTime: new Date(now + 27 * 3600 * 1000).toISOString().split('.')[0],
      scheduledDays: "Daily", ticketCost: 4200 + Math.floor(Math.random() * 1000), 
      economySeats: 150, businessSeats: 20, mealType: "NONE"
    },
    {
      flightNumber: `${prefix}-${Math.floor(Math.random() * 900) + 100}`,
      airlineId, fromPlace: "Delhi", toPlace: "Bangalore",
      departureTime: new Date(now + 47 * 3600 * 1000).toISOString().split('.')[0],
      arrivalTime: new Date(now + 50 * 3600 * 1000).toISOString().split('.')[0],
      scheduledDays: "Weekdays", ticketCost: 5100 + Math.floor(Math.random() * 1500), 
      economySeats: 120, businessSeats: 12, mealType: "NON_VEG"
    },
    {
      flightNumber: `${prefix}-${Math.floor(Math.random() * 900) + 100}`,
      airlineId, fromPlace: "Bangalore", toPlace: "Mumbai",
      departureTime: new Date(now + 71 * 3600 * 1000).toISOString().split('.')[0],
      arrivalTime: new Date(now + 73 * 3600 * 1000).toISOString().split('.')[0],
      scheduledDays: "Weekends", ticketCost: 3100 + Math.floor(Math.random() * 800), 
      economySeats: 180, businessSeats: 24, mealType: "VEG"
    },
    {
      flightNumber: `${prefix}-${Math.floor(Math.random() * 900) + 100}`,
      airlineId, fromPlace: "Mumbai", toPlace: "Delhi",
      departureTime: new Date(now + 28 * 3600 * 1000).toISOString().split('.')[0],
      arrivalTime: new Date(now + 30 * 3600 * 1000).toISOString().split('.')[0],
      scheduledDays: "Daily", ticketCost: 3800 + Math.floor(Math.random() * 500), 
      economySeats: 160, businessSeats: 10, mealType: "NONE"
    }
  ];
};

async function seed() {
  console.log("✈ Starting SkyConnect Database Seeding...");
  
  try {
    for (const airline of airlines) {
      console.log(`\nRegistering Airline: ${airline.name}...`);
      try {
        const result = await fetchJSON(`${FLIGHT_SERVICE_URL}/api/v1.0/flights/airline/register`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-User-Role": "ADMIN"
          },
          body: JSON.stringify(airline)
        });
        console.log(`Success: ${airline.name} (ID: ${result})`);
        
        const flights = generateFlights(result, airline.name);
        for (const flight of flights) {
          console.log(`  Scheduling Flight: ${flight.flightNumber} (${flight.fromPlace} -> ${flight.toPlace})...`);
          await fetchJSON(`${FLIGHT_SERVICE_URL}/api/v1.0/flights`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "X-User-Role": "ADMIN"
            },
            body: JSON.stringify(flight)
          });
          console.log(` Flight added successfully.`);
        }
      } catch (err) {
        console.error(`Failed to process ${airline.name}:`, err.message);
      }
    }
    console.log("\nDatabase fully seeded! You can now search for flights.");
  } catch (err) {
    console.error("Critical Failure:", err.message);
  }
}

seed();
