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

app.get("/", (req, res) => {
    res.send("API Gateway running");
});


app.get("/test-jwt", jwtMiddleware, (req, res) => {
    res.json({
        message: "JWT working",
        user: req.user
    });
});


app.use("/api/v1.0/flight/search", flightRoutes);


app.use("/api/v1.0/flight/admin", jwtMiddleware, authRoutes);

app.use("/api/v1.0/flight", bookingRoutes);
app.use("/api/v1.0/flight/airline", airlineRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Gateway running on port", PORT);
});