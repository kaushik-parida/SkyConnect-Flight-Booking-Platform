const axios = require("axios");
const { bookingServiceUrl } = require("../config/services");

exports.getTicket = async (pnr) => {
  try {
    const response = await axios.get(
      `${bookingServiceUrl}/api/v1.0/flight/ticket/${pnr}`
    );

    return response.data;
  } catch (err) {
    console.log("Repo ticket error:", err.code || err.message);
    throw err;
  }
};

exports.getHistory = async (email) => {
  try {
    const response = await axios.get(
      `${bookingServiceUrl}/api/v1.0/flight/booking/history/${email}`
    );

    return response.data;
  } catch (err) {
    console.log("Repo history error:", err.code || err.message);
    throw err;
  }
};