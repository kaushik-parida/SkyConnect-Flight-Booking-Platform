const airlineService = require("../services/airlineService");

exports.getAirlines = async (request, response) => {
  try {
    const data = await airlineService.getAirlines();
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    response.status(status).json({ message: "Failed to get airlines" });
  }
};

exports.addAirline = async (request, response) => {
  try {
    const data = await airlineService.addAirline(request.body, request.user);
    response.status(201).json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to add airline";
    response.status(status).json({ message });
  }
};

exports.updateAirlineStatus = async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;
    const data = await airlineService.updateAirlineStatus(id, status, request.user);
    response.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to update airline status";
    response.status(status).json({ message });
  }
};