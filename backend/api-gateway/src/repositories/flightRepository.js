const axios = require("axios");
const { flightServiceUrl } = require("../config/services");

exports.searchFlights = async (data) => {
    try {
        const response = await axios.post(
            `${flightServiceUrl}/api/v1.0/flight/search`,
            data
        );

        return response.data;
    } catch (err) {
        console.log("Flight repo error:", err.code || err.message);
        throw err;
    }
};