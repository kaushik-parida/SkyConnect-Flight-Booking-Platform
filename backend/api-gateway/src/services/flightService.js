const axios = require("axios");
const { flightServiceUrl } = require("../config/services");

exports.searchFlights = async (data, user) => {
  try {
    const response = await axios.post(
      `${flightServiceUrl}/api/v1.0/flight/search`,
      data,
      {
        headers: user ? {
          "X-User-Id": user.id,
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error("Flight service searchFlights error:", error.response?.data || error.message);
    throw error;
  }
};

exports.createFlight = async (data, user) => {
  try {
    const response = await axios.post(
      `${flightServiceUrl}/api/v1.0/flights`,
      data,
      {
        headers: {
          "X-User-Id": user.id,
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Flight service createFlight error:", error.response?.data || error.message);
    throw error;
  }
};