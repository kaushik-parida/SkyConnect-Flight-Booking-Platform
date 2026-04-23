const airlineService = require("../services/airlineService");

exports.addAirline = async (request, response) => {
    try {
        const data = await airlineService.addAirline(request.body);

        response.json(data);
    } catch (err) {
        console.log("Airline error:", err.message);

        response.status(500).json({ message: "Failed to add airline" });
    }
};
