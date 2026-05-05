require('dotenv').config();

const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const { eurekaClient } = require("./config/eurekaClient");

const flightRoutes = require("./routes/flightRoutes");
const flightAdminRoutes = require("./routes/flightAdminRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const airlineRoutes = require("./routes/airlineRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(logger);

app.get("/", (request, response) => {
  response.send("SkyConnect API Gateway running");
});

app.get("/test-jwt", jwtMiddleware, (request, response) => {
  response.json({ message: "JWT working", user: request.user });
});

app.use("/api/auth", authRoutes);

app.use("/api/v1.0/flight/search", jwtMiddleware, flightRoutes);

app.use("/api/v1.0/flights", jwtMiddleware, flightAdminRoutes);

app.use("/api/v1.0/flight/booking", jwtMiddleware, bookingRoutes);

app.use("/api/v1.0/flights/airline", jwtMiddleware, airlineRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SkyConnect API Gateway running on port ${PORT}`);
  
  eurekaClient.start((error) => {
    if (error) {
      console.log("Eureka registration failed:", error);
    } else {
      console.log("Successfully registered API Gateway with Eureka");
    }
  });

  console.log(`Auth Service   → Dynamic via Eureka (Fallback: ${process.env.AUTH_SERVICE_URL || "http://localhost:8081"})`);
  console.log(`Flight Service → Dynamic via Eureka (Fallback: ${process.env.FLIGHT_SERVICE_URL || "http://localhost:8082"})`);
  console.log(`Booking Service→ Dynamic via Eureka (Fallback: ${process.env.BOOKING_SERVICE_URL || "http://localhost:8084"})`);
});