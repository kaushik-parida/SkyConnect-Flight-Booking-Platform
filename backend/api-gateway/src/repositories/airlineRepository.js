const axios = require("axios");
const { airlineServiceUrl } = require("../config/services");

exports.addAirline = async (data) => {
    try {
        const response = await axios.post(
            `${airlineServiceUrl}/api/v1.0/flight/airline/register`,
            data
        );

        return response.data;
    } catch (err) {
        console.log("Airline repo error:", err.message);
        throw err;
    }
};