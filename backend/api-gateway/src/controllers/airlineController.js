const airlineService = require("../services/airlineService");

exports.addAirline = async (request, response) => {
    try {
        const airlineData = request.body;

        console.log("Adding airline");

        const data = await airlineService.addAirline(airlineData);

        response.json(data);

    } catch (error) {
        console.error("Airline error:", error.message);

        response.status(500).json({
            message: "Failed to add airline"
        });
    }
};