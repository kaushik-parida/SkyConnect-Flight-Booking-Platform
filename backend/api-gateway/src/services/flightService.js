const axios = require("axios");
const { flightServiceUrl } = require("../config/services");

exports.searchFlights = async (data) => {
  try {
    console.log("Calling JSON Server for flights");

    const response = await axios.get(`${flightServiceUrl}/flights`);

    if (data && data.from && data.to) {
      return response.data.filter(
        (flight) =>
          flight.from === data.from && flight.to === data.to
      );
    }

    return response.data;

  } catch (error) {
    console.error("Service error (flight):", error.code || error.message);
    throw error;
  }
};