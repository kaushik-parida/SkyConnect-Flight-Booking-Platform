const express = require("express");
const router = express.Router();

const flightController = require("../controllers/flightController");


router.post("/", flightController.createFlight);
router.get("/", flightController.getAllFlights);
router.get("/:id", flightController.getFlightById);
router.put("/:id", flightController.updateFlight);

module.exports = router;