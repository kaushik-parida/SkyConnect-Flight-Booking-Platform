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

exports.getFlightById = async (id, user) => {
  try {
    const response = await axios.get(
      `${flightServiceUrl}/api/v1.0/flights/${id}`,
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
    console.error("Flight service getFlightById error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getAllFlights = async (user) => {
  try {
    const response = await axios.get(
      `${flightServiceUrl}/api/v1.0/flights`,
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
    console.error("Flight service getAllFlights error:", error.response?.data || error.message);
    throw error;
  }
};

exports.updateFlight = async (id, data, user) => {
  try {
    const response = await axios.put(
      `${flightServiceUrl}/api/v1.0/flights/${id}`,
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
    console.error("Flight service updateFlight error:", error.response?.data || error.message);
    throw error;
  }
};