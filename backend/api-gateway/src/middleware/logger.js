module.exports = (request, response, next) => {
  console.log(`${request.method} ${request.originalUrl}`);
  next();
};