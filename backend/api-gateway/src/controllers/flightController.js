const flightService = require("../services/flightService");

exports.searchFlights = async (request, response) => {
    try {
        const searchData = request.body;

        console.log("Searching flights");

        const data = await flightService.searchFlights(searchData);

        response.json(data);

    } catch (error) {
        console.error("Error searching flights:", error.message);

        response.status(500).json({
            message: "Flight search failed"
        });
    }
};