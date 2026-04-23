const flightRepo = require("../repositories/flightRepository");

exports.searchFlights = async (data) => {
  return await flightRepo.searchFlights(data);
};