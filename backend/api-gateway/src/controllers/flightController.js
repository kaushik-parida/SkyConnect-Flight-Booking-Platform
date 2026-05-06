const flightService = require("../services/flightService");

exports.searchFlights = async (request, response) => {
  try {
    const data = await flightService.searchFlights(request.body, request.user);
    response.status(200).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Flight search failed";
    response.status(status).json({ message });
  }
};

exports.createFlight = async (request, response) => {
  try {
    const data = await flightService.createFlight(request.body, request.user);
    response.status(201).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Flight create failed";
    response.status(status).json({ message });
  }
};

exports.getFlightById = async (request, response) => {
  try {
    const data = await flightService.getFlightById(request.params.id, request.user);
    response.status(200).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Flight not found";
    response.status(status).json({ message });
  }
};

exports.getAllFlights = async (request, response) => {
  try {
    const data = await flightService.getAllFlights(request.user);
    response.status(200).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch flights";
    response.status(status).json({ message });
  }
};

exports.updateFlight = async (request, response) => {
  try {
    const data = await flightService.updateFlight(request.params.id, request.body, request.user);
    response.status(200).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Flight update failed";
    response.status(status).json({ message });
  }
};