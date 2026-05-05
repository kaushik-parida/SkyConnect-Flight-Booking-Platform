const axios = require("axios");
const { airlineServiceUrl } = require("../config/services");

exports.getAirlines = async () => {
  try {
    const response = await axios.get(`${airlineServiceUrl}/api/v1.0/flights/airline`);
    return response.data;
  } catch (error) {
    console.error("Airline service getAirlines error:", error.response?.data || error.message);
    throw error;
  }
};

exports.addAirline = async (data, user) => {
  try {
    const response = await axios.post(
      `${airlineServiceUrl}/api/v1.0/flights/airline/register`,
      data,
      {
        headers: {
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Airline service addAirline error:", error.response?.data || error.message);
    throw error;
  }
};

exports.updateAirlineStatus = async (id, status, user) => {
  try {
    const response = await axios.put(
      `${airlineServiceUrl}/api/v1.0/flights/airline/${id}`,
      JSON.stringify(status),
      {
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Airline service updateStatus error:", error.response?.data || error.message);
    throw error;
  }
};