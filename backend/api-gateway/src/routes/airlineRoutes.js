const express = require("express");
const router = express.Router();
const airlineController = require("../controllers/airlineController");

router.get("/", airlineController.getAirlines);

router.post("/register", airlineController.addAirline);

router.put("/:id", airlineController.updateAirlineStatus);

module.exports = router;