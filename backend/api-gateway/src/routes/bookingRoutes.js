const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/:flightId", bookingController.createBooking);

router.get("/ticket/:pnr", bookingController.getTicket);

router.get("/history/:userId", bookingController.getHistory);

router.patch("/cancel/:pnr", bookingController.cancelBooking);

router.get("/admin/all", bookingController.getAllBookings);

module.exports = router;