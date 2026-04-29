const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.get("/ticket/:pnr", bookingController.getTicket);

router.get("/booking/history/:email", bookingController.getHistory);

module.exports = router;