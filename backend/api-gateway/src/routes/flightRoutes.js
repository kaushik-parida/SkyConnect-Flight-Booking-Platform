const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");


router.post("/", flightController.searchFlights);
router.get("/:id", flightController.getFlightById);

module.exports = router;