const axios = require("axios");
const { airlineServiceUrl } = require("../config/services");

exports.addAirline = async (data) => {
    try {
        console.log("Calling JSON Server for airline");

        const response = await axios.post(
            `${airlineServiceUrl}/airlines`,
            data
        );

        return response.data;

    } catch (error) {
        console.error(
            "FULL ERROR:",
            error.response?.data || error.code || error.message
        );
        throw error;
    }
};