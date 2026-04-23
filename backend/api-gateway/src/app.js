const express = require("express");

const logger = require("./middleware/logger");

const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const airlineRoutes = require("./routes/airlineRoutes");

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (request, response) => {
    response.send("API Gateway running");
});

app.use("/api/v1.0/flight/search", flightRoutes);
app.use("/api/v1.0/flight", bookingRoutes);
app.use("/api/v1.0/flight/admin", authRoutes);
app.use("/api/v1.0/flight/airline", airlineRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Gateway running on port", PORT);
});