const bookingService = require("../services/bookingService");

exports.getTicket = async (request, response) => {
  try {
    const pnr = request.params.pnr;

    console.log("Getting ticket:", pnr);

    const data = await bookingService.getTicket(pnr);

    response.json(data);
  } catch (err) {
    console.log("Booking error:", err.message);

    response.status(500).json({ message: "Failed to get ticket" });
  }
};

exports.getHistory = async (request, response) => {
  try {
    const email = request.params.email;

    console.log("Getting history:", email);

    const data = await bookingService.getHistory(email);

    response.json(data);
  } catch (err) {
    console.log("History error:", err.message);

    response.status(500).json({ message: "Failed to get history" });
  }
};