const axios = require("axios");
const { bookingServiceUrl } = require("../config/services");

exports.createBooking = async (flightId, data, user) => {
  try {
    // Inject userId from auth token into the body for Java DTO validation
    const enrichedData = {
      ...data,
      userId: String(user.id)
    };

    const response = await axios.post(
      `${bookingServiceUrl}/api/v1.0/flight/booking/${flightId}`,
      enrichedData,
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
    console.error("Booking service createBooking error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getTicket = async (pnr, user) => {
  try {
    const response = await axios.get(
      `${bookingServiceUrl}/api/v1.0/flight/booking/ticket/${pnr}`,
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
    console.error("Booking service getTicket error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getHistory = async (userId, user, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${bookingServiceUrl}/api/v1.0/flight/booking/history/${userId}`,
      {
        params: { page, size },
        headers: {
          "X-User-Id": user.id,
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Booking service getHistory error:", error.response?.data || error.message);
    throw error;
  }
};

exports.cancelBooking = async (pnr, userId, user) => {
  try {
    const response = await axios.patch(
      `${bookingServiceUrl}/api/v1.0/flight/booking/cancel/${pnr}`,
      null,
      {
        params: { userId },
        headers: {
          "X-User-Id": user.id,
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Booking service cancelBooking error:", error.response?.data || error.message);
    throw error;
  }
};

exports.getAllBookings = async (user, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${bookingServiceUrl}/api/v1.0/flight/booking/admin/all`,
      {
        params: { page, size },
        headers: {
          "X-User-Id": user.id,
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Booking service getAllBookings error:", error.response?.data || error.message);
    throw error;
  }
};