const bookingService = require("../services/bookingService");

exports.createBooking = async (request, response) => {
  try {
    const { flightId } = request.params;
    const data = await bookingService.createBooking(flightId, request.body, request.user);
    response.status(201).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to create booking";
    response.status(status).json({ message });
  }
};

exports.getTicket = async (request, response) => {
  try {
    const { pnr } = request.params;
    const data = await bookingService.getTicket(pnr, request.user);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to get ticket";
    response.status(status).json({ message });
  }
};

exports.getHistory = async (request, response) => {
  try {
    const { userId } = request.params;
    const { page, size } = request.query;
    const data = await bookingService.getHistory(userId, request.user, page, size);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to get booking history";
    response.status(status).json({ message });
  }
};

exports.cancelBooking = async (request, response) => {
  try {
    const { pnr } = request.params;
    const { userId } = request.query;
    const data = await bookingService.cancelBooking(pnr, userId, request.user);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to cancel booking";
    response.status(status).json({ message });
  }
};

exports.getAllBookings = async (request, response) => {
  try {
    const { page, size } = request.query;
    const data = await bookingService.getAllBookings(request.user, page, size);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to get bookings";
    response.status(status).json({ message });
  }
};