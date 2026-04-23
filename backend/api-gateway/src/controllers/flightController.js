const flightService = require("../services/flightService");

exports.searchFlights = async (request, response) => {
    try {
        console.log("Searching flights");

        const data = await flightService.searchFlights(request.body);

        response.json(data);
    } catch (err) {
        console.log("Flight error:", err.message);

        response.status(500).json({ message: "Flight search failed" });
    }
};