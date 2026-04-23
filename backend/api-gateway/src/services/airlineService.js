const airlineRepo = require("../repositories/airlineRepository");

exports.addAirline = async (data) => {
    return await airlineRepo.addAirline(data);
};