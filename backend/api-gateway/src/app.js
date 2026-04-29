require('dotenv').config();

const express = require("express");

const logger = require("./middleware/logger");
const jwtMiddleware = require("./middleware/jwtMiddleware");

const flightRoutes = require("./routes/flightRoutes");
const flightAdminRoutes = require("./routes/flightAdminRoutes");
const authRoutes = require("./routes/authRoutes");

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


app.use("/api/auth", authRoutes);


app.use("/api/v1.0/flight/search", jwtMiddleware, flightRoutes);


app.use("/api/v1.0/flights", jwtMiddleware, flightAdminRoutes);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});