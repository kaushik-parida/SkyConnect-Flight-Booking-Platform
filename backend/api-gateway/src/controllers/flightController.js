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