require('dotenv').config();
const express = require("express");

const logger = require("./middleware/logger");
const jwtMiddleware = require("./middleware/jwtMiddleware");

const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const airlineRoutes = require("./routes/airlineRoutes");

const app = express();

app.use(express.json());
app.use(logger);

// ✅ Health check
app.get("/", (req, res) => {
    res.send("API Gateway running");
});

// ✅ Test JWT
app.get("/test-jwt", jwtMiddleware, (req, res) => {
    res.json({
        message: "JWT working",
        user: req.user
    });
});

// 🔥 IMPORTANT FIX → add jwtMiddleware here
app.use("/api/v1.0/flight/search", jwtMiddleware, flightRoutes);

// 🔒 Admin routes (already correct)
app.use("/api/v1.0/flight/admin", jwtMiddleware, authRoutes);

// (Optional: you can also secure booking later)
app.use("/api/v1.0/flight", bookingRoutes);

// (Optional: airline can also be secured later)
app.use("/api/v1.0/flight/airline", airlineRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Gateway running on port", PORT);
});