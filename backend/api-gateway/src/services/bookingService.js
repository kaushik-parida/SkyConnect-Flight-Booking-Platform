const axios = require("axios");
const { bookingServiceUrl } = require("../config/services");

exports.getTicket = async (pnr) => {
  try {
    if (!pnr) {
      throw new Error("PNR is required");
    }

    console.log("Calling JSON Server for ticket");

    const response = await axios.get(
      `${bookingServiceUrl}/tickets/${pnr}`
    );

    return response.data;

  } catch (error) {
    console.error("Service error (ticket):", error.code || error.message);
    throw error;
  }
};

exports.getHistory = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    console.log("Calling JSON Server for history");

    const response = await axios.get(
      `${bookingServiceUrl}/history?email=${email}`
    );

    return response.data;

  } catch (error) {
    console.error("Service error (history):", error.code || error.message);
    throw error;
  }
};