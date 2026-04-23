const bookingRepo = require("../repositories/bookingRepository");

exports.getTicket = async (pnr) => {
  if (!pnr) throw new Error("PNR missing");

  return await bookingRepo.getTicket(pnr);
};

exports.getHistory = async (email) => {
  if (!email) throw new Error("Email missing");

  return await bookingRepo.getHistory(email);
};