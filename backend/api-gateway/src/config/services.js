const { getServiceUrl } = require("./eurekaClient");

module.exports = {
  get authServiceUrl() {
    return getServiceUrl("AUTH-SERVICE") || process.env.AUTH_SERVICE_URL || "http://localhost:8081";
  },
  get flightServiceUrl() {
    return getServiceUrl("FLIGHT-SERVICE") || process.env.FLIGHT_SERVICE_URL || "http://localhost:8082";
  },
  get bookingServiceUrl() {
    return getServiceUrl("BOOKING-SERVICE") || process.env.BOOKING_SERVICE_URL || "http://localhost:8084";
  },
  get airlineServiceUrl() {
    return getServiceUrl("FLIGHT-SERVICE") || process.env.FLIGHT_SERVICE_URL || "http://localhost:8082";
  },
};